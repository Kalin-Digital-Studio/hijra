# Business rules Phase 01

| ID | Aturan |
| --- | --- |
| BR-F01 | Fitur aplikasi menggunakan data lokal dan dapat berjalan offline setelah aplikasi dimuat. |
| BR-F02 | Backend tidak diperlukan. |
| BR-F03 | Registrasi dan login online tidak diperlukan oleh Hijrah. |
| BR-F04 | Data pengguna berada di SQLite pada perangkat. |
| BR-F05 | Migrasi mempertahankan data yang ada. |
| BR-F06 | Seed berulang tidak menduplikasi master data. |
| BR-F07 | Bahasa Indonesia adalah default dan fallback. |
| BR-F08 | Bahasa dan tema tetap tersimpan setelah aplikasi ditutup. |
| BR-F09 | Semua layar memakai design tokens dan komponen bersama. |
| BR-F10 | Route, repository, dan fitur dapat dikembangkan secara modular. |
| BR-F11 | Transaksi ibadah dan fitur di luar Phase 01 menunggu persetujuan fase berikutnya. |

[Kebijakan lisensi](LICENSING_POLICY.md) berlaku pada semua fase.

## Phase 02

| ID | Aturan |
| --- | --- |
| BR-0201–0203 | Splash saat cold launch. Pengenalan awal dapat dilewati menuju setup. |
| BR-0204–0208 | Nama wajib. Gender dan avatar opsional. Default Indonesia. Satu profil lokal, data di perangkat. |
| BR-0209–0213 | Onboarding yang selesai tidak diulang otomatis. Edit mempertahankan data. Replay tersedia. Fitur lokal dapat digunakan offline. |
| BR-0214–0217 | Aset dan dependensi mengikuti kebijakan lisensi. Branding Hijra. Migrasi aditif. Completion atomik. |
| BR-0218–0220 | Awal pekan Senin sebagai default. Replay mempertahankan profil dan status. Dashboard memakai data aktual. |

## Phase 03
Satu slot berlaku per profil, shalat, dan tanggal. Slot yang belum ada ditampilkan sebagai Belum dicatat tanpa INSERT. Tidak dilaksanakan dan Tidak diwajibkan hanya dipilih pengguna. Atribut hanya berlaku untuk Sudah shalat, independen, dan memiliki keadaan ya, tidak, atau belum diisi. Pergantian status mempertahankan catatan; atribut dibersihkan saat berpindah status. Tanggal mendatang dikecualikan. Catatan tidak memengaruhi statistik.

## Phase 04 · Shalat Sunnah

Aktivitas Sunnah bersifat opsional. Ringkasan menjumlahkan sesi, hari aktif, dan rakaat yang diketahui. Tahajjud, Witir, Dhuha, Qabliyah Subuh, dan Ba’diyah Zuhur aktif saat inisialisasi pertama. Aktivitas nonaktif tetap tampil dalam riwayat dan sesi lama dapat diedit. Pencatatan cepat membuat satu sesi jika belum ada. Rakaat, jam lokal, dan catatan bersifat opsional. Rakaat default hanya mengisi awal form detail. Aktivitas kustom hanya tersedia bagi profil pemilik.
