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

