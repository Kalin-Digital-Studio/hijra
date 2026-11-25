# Status pengembangan Hijra

## Phase 05 Enhancement · Digital Quran Reader & Reading Tracker

Pembaca native menampilkan teks Arab Tanzil Uthmani v1.1 secara offline. Pengguna memilih awal dan akhir dari layar baca, lalu dapat menyimpan penanda bersama sesi. Beranda membuka pembaca pada ayat berikutnya. Tracker manual serta riwayat pekanan tetap tersedia.

Pengujian SQLite v8 mencocokkan seluruh 6.236 baris ayat dengan sumber, menguji ulang database v7 dengan sesi dan penanda, serta memeriksa preferensi ukuran font setelah buka ulang. Skenario Al-Fatihah ayat 1–5 kemudian 6–7 menghasilkan 7 ayat dan dua sesi, dengan lanjutan Al-Baqara ayat 1. Data lokal dan hasil regresi Phase 01–04 lulus.

TypeScript, lint, Expo Doctor 20/20, dan ekspor bundle Android/iOS lulus. Verifikasi manual Android/iOS masih diperlukan untuk glyph Arab, layout di ukuran terbesar, rute di perangkat, dan cold start dalam mode pesawat. Formal Product Owner UAT tetap dijadwalkan pada Phase 12.

## Phase 05 · Tracker bacaan Al-Qur’an

**PHASE 05 DEVELOPMENT COMPLETE — DONE**

| Area | Hasil |
| --- | --- |
| Katalog | Tanzil Quran Metadata v1.0, 114 surah dan 6.236 ayat Hafs/Kufah. Seluruh hitungan per surah cocok dengan referensi King Fahd Quran Complex. Nama Latin dan Arab tersedia offline. Makna Indonesia dan Inggris ditunda hingga Release 2. |
| Penyimpanan | SQLite v7. Instalasi baru dan upgrade dari v5/v6 lulus, termasuk verifikasi foreign key, rollback, transaksi sesi dan penanda, serta preservasi data lama. |
| Skenario | Dua sesi Al-Baqara ayat 1–5 dan 6–10 menghasilkan 10 ayat dan dua sesi. Setelah sesi pertama, bookmark berada di ayat 5 dan saran mulai di ayat 6. Setelah sesi kedua, bookmark di ayat 10. Pembukaan ulang database menghasilkan total yang sama. |
| Toolchain | Expo SDK 58.0.26. TypeScript, lint, pengecekan dependensi Expo, Expo Doctor 20/20, ekspor Android/iOS, pengujian SQLite dan regresi Phase 01–04 lulus. |
| Lisensi | Metadata Tanzil memakai CC BY. Notice sumber, copyright, lisensi dan konversi tampil offline. Tidak ada dependensi npm baru. [Audit dataset](QURAN_DATASET.md). |
| Verifikasi perangkat | Pengujian manual Expo Go Android/iOS serta mode pesawat masih tercatat di checklist. Formal Product Owner UAT dijadwalkan pada Phase 12. |

## Phase 04 · Shalat Sunnah Tracker

**PHASE DEVELOPMENT COMPLETE — DONE**

| Area | Hasil |
| --- | --- |
| Fitur | Tracker harian, sesi detail, katalog yang dapat diatur, aktivitas kustom, riwayat pekanan, dan ringkasan Beranda. |
| Database | SQLite v5. Instalasi baru, migrasi v1/v2/v4, regresi Shalat Wajib dan profil, preferensi, kepemilikan, penyimpanan sesi, serta agregasi lulus. |
| Pemeriksaan teknis | TypeScript, lint, Expo install check, Expo Doctor 20/20, serta ekspor bundle Android dan iOS lulus. |
| Lisensi | Phase 04 memakai dependensi yang sudah diaudit serta ikon orisinal berbasis kode. Inventaris paket dan pengecualian Lightning CSS tetap berlaku. |
| Perangkat | Verifikasi Android dan iOS tercatat di checklist. Formal Product Owner UAT menunggu Phase 12. |

## Phase 03 · Shalat Wajib Tracker

**PHASE 03 DEVELOPMENT COMPLETE — DONE** untuk lingkup pengembangan. UAT formal tetap **PENDING hingga Phase 12**.

| Pemeriksaan | Hasil |
| --- | --- |
| Implementasi | Tracker harian, empat status, atribut tiga nilai independen, catatan opsional, pemilih tanggal, simpan otomatis, ringkasan, matriks dan konsistensi mingguan, serta kartu Beranda. |
| Database | SQLite v4. Tes instalasi baru, upgrade v1/v2/v3, profil dan preferensi lama, master data, lazy creation, constraint, catatan, antrean simpan, rollback, dan persistensi lulus. |
| Kalkulasi | Contoh pekanan 93,3% selesai, 85,7% tepat waktu, 71,4% berjamaah lulus. Hari mendatang dikecualikan, penyebut nol menghasilkan tidak berlaku. |
| Tanggal dan bahasa | Tanggal lokal, batas bulan/tahun, data tahun kabisat, dan uji zona Asia/Jakarta serta America/New_York lulus. Kunci Indonesia dan English cocok serta label tracker diuji. |
| Toolchain | Expo 58.0.26, SQLite SDK 58.0.18. TypeScript dan ESLint lulus. Expo Doctor 20/20. |
| Android/iOS | Kedua bundle Hermes lulus dan source map memuat tracker, riwayat, serta kartu Beranda. |
| Lisensi | Phase 03 memakai dependensi yang sudah disetujui dan ikon kode orisinal. Notice serta pengecualian MPL 2.0 tetap tercatat dalam inventaris. |
| Perangkat fisik | Verifikasi layout, kontrol, peralihan tanggal di tengah malam, dan autosave native/offline masih perlu dijalankan di Android dan iOS. |

Lihat [skema database](DATABASE_SCHEMA.md), [panduan UI](UI_UX_GUIDELINES.md), dan [checklist perangkat](UAT_CHECKLIST.md).

## Phase 02 · 25 November 2026

Onboarding, profil lokal, edit profil, avatar, sapaan Dasbor, awal pekan, replay dan splash native sudah diimplementasikan di Expo SDK 58. Logo kiriman Product Owner dipakai saat startup serta dalam konfigurasi splash native dan ikon aplikasi. Verifikasi splash dan ikon pada perangkat memerlukan build native. Atas arahan Product Owner, `image_1.png`, `image_2.png`, dan `image_3.png` ditampilkan sesuai urutan di preview pengembangan. Ilustrasi onboarding produksi masih memakai aset sementara sampai ilustrasi terpisah dan hak penggunaannya tersedia. Preview bisa dibuka dari Profil → Pengenalan Aplikasi tanpa mengubah profil tersimpan.

Mulai Phase 02, tim menerapkan pengembangan Agile dan iteratif. Setiap fase berstatus **PHASE DEVELOPMENT COMPLETE — DONE** setelah implementasi yang disetujui dan verifikasi pengembangan selesai serta masalah kritis ditangani. Tes fungsi dan teknis, regresi berkelanjutan, perbaikan, pengujian ulang, serta pembaruan dokumentasi dilakukan dalam setiap iterasi. Defek terbuka dan verifikasi perangkat dicatat. UAT formal Product Owner berstatus **PENDING hingga Phase 12** dan tidak menjadi syarat memulai fase berikutnya yang sudah disetujui.

| Pemeriksaan | Hasil |
| --- | --- |
| Database | Lulus. SQLite v2 pada instalasi baru dan fixture v1, pengulangan migrasi, foreign keys, 23 aktivitas, validasi profil, persistensi, deteksi konflik, rollback migrasi dan transaksi setup. |
| Bahasa | Lulus. Kunci Indonesia dan English sama, perpindahan bahasa dan interpolasi nama Unicode diuji. |
| Kompatibilitas | Expo `58.0.26`. `expo install --check`, TypeScript, dan lint lulus. Expo Doctor 20/20. |
| Bundle | Android dan iOS diekspor dengan source map dan asset map. |
| Lisensi | 828 versi registry ditinjau. ImagePicker, ImageLoader, SplashScreen, dan FileSystem MIT. 57 notice offline. Pengecualian MPL 2.0 tetap mencakup Lightning CSS tooling. |
| Verifikasi perangkat | Guard dan Back, akses foto, avatar fisik, offline, layout, serta splash pada build native masih perlu diperiksa di perangkat. Laporan Android tentang gagal simpan profil dengan foto ditangani dengan menunggu penyalinan berkas selesai sebelum transaksi SQLite. Simpan dengan foto masih perlu diuji ulang di HP. |

## Riwayat Phase 01

Percobaan UAT Android awal terhenti karena perbedaan versi SDK. Product Owner menyetujui Phase 01 sebelum Phase 02 dimulai.

| Pemeriksaan | Hasil |
| --- | --- |
| Implementasi | Expo Router, lima tab, dasbor dan detail katalog, pengaturan persisten Indonesia/English, tema terang/gelap/sistem, serta halaman notice offline. |
| Upgrade bertahap | 54.0.38 → 55.0.32 → 56.0.24 → 57.0.34 → 58.0.26. Setiap tahap ditinjau sebelum instalasi dan lulus `expo install --fix`, TypeScript, dan pemeriksaan SQLite. |
| Checkpoint | Cadangan sumber dan lockfile SDK 54 tersimpan di `.expo/sdk-upgrade/hijrah-sdk54-checkpoint.zip`. Perbandingan byte memverifikasi konfigurasi aplikasi, route, skema, master data, terjemahan, store, dan tema. |
| SQLite di Node.js 24 | Lulus. Skema v1, foreign keys, empat kategori, 23 tipe, seed idempoten, serta persistensi pengaturan dan profil setelah database dibuka ulang. |
| TypeScript | Lulus, tanpa error. |
| ESLint | Lulus, tanpa error atau warning. |
| Expo Doctor | 20/20 lulus. |
| Pemeriksaan versi Expo | `expo install --check` dan `expo install --fix` melaporkan dependensi sesuai. Seluruh versi yang tercantum dalam peta paket Expo diverifikasi terhadap SDK 58, termasuk peer native transitif Router. |
| Export Android dan iOS | Lulus. Metro menghasilkan kedua bundle Hermes, source map, dan asset map. |
| Expo Go LAN | Metro menyajikan manifest `exposdk:58.0.0` dengan HTTP 200 untuk Android dan iOS. |
| Lisensi | 825 versi paket registry terkunci, 785 terpasang di Windows. Sebanyak 14 keluarga aset dan 53 entri notice aplikasi tercatat. Persetujuan MPL 2.0 tetap terbatas pada tooling Lightning CSS. |
| Uji perangkat | Peluncuran, persistensi native, layout, dan pemeriksaan offline melalui Expo Go pada perangkat fisik masih menunggu UAT. |
| Product Owner UAT | Disetujui sebelum Phase 02. |

Referensi tersedia di [inventaris lisensi](THIRD_PARTY_LICENSES.md), [skema database](DATABASE_SCHEMA.md), dan [langkah UAT](UAT_CHECKLIST.md).

