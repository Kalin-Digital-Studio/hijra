# Skema database

Nama file `hijrah.db`. `PRAGMA user_version` berisi versi skema. Migrasi 0 → 1 dijalankan di dalam transaksi bersama seed. Koneksi utama mengaktifkan foreign keys dan WAL.

| Tabel | Kolom dan relasi |
| --- | --- |
| `user_profiles` | `id TEXT` primary key, `display_name TEXT NOT NULL DEFAULT ''`. |
| `app_settings` | `key TEXT` primary key, `value TEXT NOT NULL`. Kunci yang digunakan adalah `language` dan `theme`. |
| `ibadah_categories` | `id TEXT` primary key, `sort_order INTEGER NOT NULL`. |
| `ibadah_types` | `id TEXT` primary key, `category_id TEXT NOT NULL` merujuk ke `ibadah_categories.id`, `sort_order INTEGER NOT NULL`. |

Kategori memakai kode `prayer`, `sunnah`, `quran`, dan `dzikir`. Ada 23 tipe, masing-masing 5, 9, 1, dan 8. Seed memakai `ON CONFLICT(id) DO NOTHING`. Indeks `ibadah_types_category_order` mendukung pembacaan berdasarkan kategori dan urutan.

Pengaturan kosong memakai `id` dan `system`. Pilihan lain yang didukung adalah `en`, `light`, dan `dark`.

## Phase 02 · versi 2

Migrasi v1 → v2 menambah kolom dengan `ALTER TABLE` dalam transaksi yang sama dengan perubahan versi dan seed. ID serta nama profil lama dipertahankan. Timestamp baru pada profil lama mencatat waktu migrasi karena v1 tidak menyimpan waktu pembuatan.

| Kolom `user_profiles` | Tipe |
| --- | --- |
| `id` | TEXT PRIMARY KEY NOT NULL |
| `display_name` | TEXT NOT NULL DEFAULT '' · 1–60 karakter Unicode setelah trim pada saat simpan |
| `gender` | TEXT nullable · CHECK mengizinkan MALE, FEMALE, atau NULL |
| `avatar_uri` | TEXT nullable · referensi relatif dalam direktori aplikasi |
| `created_at` | TEXT NOT NULL DEFAULT '' · timestamp ISO 8601 |
| `updated_at` | TEXT NOT NULL DEFAULT '' · timestamp ISO 8601 |

Default tambahan `app_settings` adalah `week_start=monday`, `onboarding_completed=false`, `onboarding_completed_at=''`, dan `onboarding_version=1`. Seed mempertahankan nilai lama. Setup menyimpan profil, preferensi, timestamp dan status selesai dalam satu transaksi. Edit biasa hanya memperbarui profil dan timestamp perubahan.

## Versi 3 · default bahasa

Migrasi menetapkan `language=id` satu kali. Profil, avatar, tema, awal pekan, dan status onboarding tetap tersimpan. Setelah migrasi, pilihan bahasa baru dari Profil bertahan saat aplikasi dibuka ulang.

## Versi 4 · prayer_logs

Migrasi v3 → v4 menambah tabel dan indeks dalam transaksi. ID yang sudah dipakai di master `prayer` yaitu `fajr`, `dhuhr`, `asr`, `maghrib`, dan `isha` dipertahankan sebagai TEXT. Implementasi lengkap ada di `src/database/migrations/prayer.ts`.

| Kolom | Tipe dan aturan |
| --- | --- |
| id | TEXT PRIMARY KEY · deterministik dari profil, shalat, tanggal |
| user_id | TEXT NOT NULL · FK user_profiles.id |
| ibadah_type_id | TEXT NOT NULL · FK ibadah_types.id · lima ID Shalat Wajib |
| prayer_date | TEXT NOT NULL · YYYY-MM-DD lokal |
| status | TEXT NOT NULL · NOT_LOGGED, COMPLETED, MISSED, EXEMPT |
| is_on_time, is_congregational | INTEGER nullable · 1 ya, 0 tidak, NULL belum diisi/tidak berlaku |
| notes | TEXT nullable · maks. 500 karakter, spasi luar dipangkas |
| created_at, updated_at | TEXT NOT NULL · timestamp ISO 8601 saat simpan |

UNIQUE berlaku untuk (user_id, ibadah_type_id, prayer_date). Indeks (user_id, prayer_date) melayani query harian dan mingguan. Status selain COMPLETED mewajibkan dua atribut NULL. UPSERT mempertahankan ID serta waktu pembuatan. Membuka halaman tidak membuat transaksi.

Rumus selesai ialah completed ÷ (slot tanggal yang berlaku − exempt). Tepat waktu dan berjamaah masing-masing membagi jumlah ya dengan completed, termasuk slot completed yang atributnya belum diisi. Penyebut nol menghasilkan tidak berlaku. Pembulatan hanya pada tampilan. Tanggal mendatang tidak masuk slot pekanan.

## SQLite v5 · Shalat Sunnah

Migrasi v4 → v5 menambahkan metadata aktivitas kustom dan pemilik pada `ibadah_types`, tabel `user_sunnah_preferences` keyed oleh profil dan aktivitas, serta `sunnah_prayer_logs` dengan satu ID per sesi. Log mengacu pada profil dan aktivitas, menyimpan tanggal lokal `YYYY-MM-DD`, rakaat/jam/catatan yang nullable, serta timestamp. Indeks melayani query profil/tanggal dan profil/aktivitas/tanggal. Delapan entri melengkapi sembilan ID Sunnah lama menjadi 17. Penanda inisialisasi default per profil disimpan di `app_settings` dalam transaksi yang sama dengan preferensi.
