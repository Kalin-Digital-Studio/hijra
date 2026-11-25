# Arsitektur Phase 01

- `app/` memuat route Expo Router, lima Expo Tabs, detail kategori, Tentang Aplikasi, dan Lisensi Pihak Ketiga.
- `src/components/` dan `src/theme/` memuat komponen UI bersama dan design tokens. `src/features/` memuat layar fitur.
- `src/database/` memuat migrasi, seed, dan repository. SQLite menyimpan master data dan pilihan pengguna. Startup memuat preferensi ke Zustand setelah migrasi dan seed.
- `src/stores/` memuat snapshot pengaturan untuk UI. Profil menyimpan perubahan ke SQLite sebelum menerapkannya. Pemilihan tema sistem menggunakan skema warna perangkat.
- `src/locales/` dan `src/services/i18n.ts` menyediakan resource Bahasa Indonesia dan English. ID katalog independen dari bahasa.
- `scripts/` memuat pemeriksaan perilaku SQLite dan pengumpulan bukti audit lisensi.

## Runtime Expo SDK 58

- Expo Router tetap memakai Stack dan lima tab JavaScript. Versi Gesture Handler, Reanimated, dan Worklets mengikuti SDK 58 karena dependensi transitif Router membutuhkan peer native tersebut.
- Config aplikasi masih memakai slug `hijrah-apps`, skema URL `hijrah`, dan identifier `app.hijrah.mobile` pada Android dan iOS. Phase 01 memakai `hijrah.db` skema v1.
- Pengujian Expo Go memakai Metro di LAN. Inventaris lisensi memakai source map kedua bundle untuk menemukan modul yang didistribusikan dan asset map Metro untuk mencatat aset serta atribusinya.

## Phase 02

Rute Edit Profil berada di Stack dalam tab Profil agar lima tab utama tetap tersedia selama pengeditan.

Startup menunggu SQLite v2, setting, terjemahan, dan profil sebelum membuka Stack dan melepas splash. Guard Expo Router membuka pengenalan pada instalasi baru, formulir pemulihan saat ada profil yang belum konsisten, dan tab utama untuk profil valid dengan onboarding selesai. Perubahan guard membuang riwayat onboarding. Beberapa profil lama memicu layar konflik dan opsi coba lagi dengan seluruh rekaman tersimpan.

Formulir memanggil service yang menjalankan repository dengan koneksi transaksi eksklusif. Zustand diisi dari hasil SQLite setelah commit. Pengenalan awal memakai Bahasa Indonesia. Replay mengikuti bahasa aktif. Pengguna mengubah bahasa melalui Profil → Bahasa.

ImagePicker membuka pemilih sistem bila pengguna memilih foto. Form menyimpan pilihan sementara hanya di memori, lalu menyalin berkas ke `profiles/avatars/` dalam direktori dokumen sebelum commit. SQLite menyimpan referensi relatif. Pembatalan form tidak menyalin berkas. Kegagalan transaksi membuang salinan baru. Setelah transaksi sukses, aplikasi mencoba menghapus salinan lama yang dimilikinya. Berkas hilang atau gagal dibaca ditampilkan sebagai avatar bawaan.

## Phase 03 · Shalat Wajib
Route `/prayer` dan `/prayer/history` berada di Stack yang dilindungi. Fitur `src/features/prayer` memakai repository, pembentuk slot, serta perhitungan bersama. `localDate.ts` menyimpan tanggal kalender lokal YYYY-MM-DD. Waktu perangkat dibaca ulang saat aplikasi aktif atau kembali dari latar. Riwayat mengambil rentang tanggal pekan sesuai `week_start`.

Service menangkap ID profil, shalat, dan tanggal pada saat interaksi. Antrean per koneksi dan transaksi eksklusif mengurutkan baca–ubah–simpan. Draft kartu menandai simpan tertunda. Kegagalan menampilkan kesalahan dan aksi coba lagi. Setelah commit, sinyal Zustand memuat ulang data yang relevan. Catatan tetap lokal dan SQLite adalah sumber kebenaran.

## Phase 04 · Shalat Sunnah

Route `/sunnah`, `/sunnah/manage`, dan `/sunnah/history` memakai komponen `src/features/sunnah`. Service dan aturan murni berada di `src/services/sunnah.ts` dan `sunnahRules.ts`. Repository Sunnah memvalidasi aktivitas serta kepemilikan profil dan mengantrekan mutasi dalam transaksi eksklusif. Dashboard membaca ringkasan tanpa membuat preferensi baru. Tracker menginisialisasi preferensi saat dibuka pertama kali.
