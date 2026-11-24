# Prompt Codex — Hijrah Apps Phase 01

Implementasikan Phase 01 di repositori ini. Deliverable berupa proyek Expo React Native yang dapat diuji, beserta dokumentasi yang mencerminkan implementasi aktual. Baca dan ikuti [kebijakan lisensi](docs/LICENSING_POLICY.md) sebelum menjalankan perintah scaffolding atau instalasi apa pun. Gunakan [inventaris pihak ketiga](docs/THIRD_PARTY_LICENSES.md) untuk mencatat hasil verifikasi.

## Identitas dan arsitektur

- Product name **Hijrah**, project name dan slug **hijrah-apps**, tagline **Every day, a better journey.** Konfigurasikan identitas aplikasi Android dan iOS. Dokumentasikan identifier yang dipilih jika belum ditentukan Product Owner.
- Gunakan Expo, React Native, TypeScript, Expo Router, expo-sqlite, Zustand, i18next, dan react-i18next. Pilih versi stabil yang saling kompatibel dan verifikasi kompatibilitas Expo Go untuk Android dan iOS dari dokumentasi resmi. Siapkan konfigurasi Git dan `.gitignore`. Commit lockfile sebagai bagian dari perubahan proyek.
- Gunakan arsitektur modular dan offline-first. Data pengguna berada di perangkat. Aplikasi tidak membutuhkan backend, registrasi, atau login online. SQLite menjadi sumber kebenaran untuk data persisten. Gunakan Zustand untuk state runtime yang dibaca dari SQLite dan diperbarui setelah perubahan berhasil disimpan.
- Pisahkan route `app/` dari komponen, query, state, dan business logic. Gunakan `src/components/`, `src/constants/`, `src/database/{migrations,repositories,seeds}/`, `src/features/{dashboard,prayer,sunnah,quran,dzikir,goals,reports}/`, `src/hooks/`, `src/services/`, `src/stores/`, `src/theme/`, `src/locales/{id,en}/`, `src/types/`, `src/utils/`, `assets/`, dan `docs/`.

## SQLite dan master data

- Gunakan `hijrah.db` dengan tabel `user_profiles`, `app_settings`, `ibadah_categories`, dan `ibadah_types`. Terapkan migrasi berversi, non-destruktif, dan atomik. Aktifkan foreign keys untuk setiap koneksi, gunakan query terparameterisasi untuk nilai data, dan akses data melalui repository.
- Seed master data secara idempoten. Gunakan ID atau kode unik yang stabil dan independen dari bahasa, serta foreign key dari tipe ibadah ke kategori. Simpan label terjemahan di resource i18n. Pastikan pengulangan seed tidak menduplikasi baris atau menghapus data yang sudah ada.
- **Shalat Wajib** — Subuh, Dzuhur, Ashar, Maghrib, Isya.
- **Shalat Sunnah** — Dhuha, Tahajud, Witir, Rawatib Qobliyah Subuh, Rawatib Qobliyah Dzuhur, Rawatib Ba’diyah Dzuhur, Rawatib Ba’diyah Maghrib, Rawatib Ba’diyah Isya, Tahiyatul Masjid.
- **Al-Qur’an** — Membaca Al-Qur’an.
- **Dzikir** — Dzikir Pagi, Dzikir Petang, Dzikir Setelah Shalat, Istighfar, Tasbih, Tahmid, Takbir, Shalawat.

## UI, navigasi, bahasa, dan tema

- Buat desain modern Islamic yang minimalis, tenang, konsisten, mobile-first, dan mendukung safe area Android serta iOS. Pusatkan token warna, tipografi, spacing, radius, dan styling komponen. Palet awal adalah primary `#174638`, secondary `#769B87`, accent `#C7A76C`, light background `#F7F8F3`, dan light text `#20312A`. Sediakan palet gelap yang sesuai.
- Sediakan komponen reusable `AppHeader`, `ScreenContainer`, `Button`, `Card`, `Input`, `Checkbox`, `ProgressBar`, `EmptyState`, `LoadingState`, dan `SectionTitle`.
- Buat lima tab yang dapat dibuka, yaitu Beranda/Home, Ibadah/Tracker, Target/Goals, Laporan/Reports, dan Profil/Profile. Beranda mempunyai shortcut yang dapat dibuka untuk Shalat Wajib, Shalat Sunnah, Al-Qur’an, dan Dzikir. Sediakan placeholder atau empty state yang jelas untuk fitur yang belum aktif.
- Bahasa Indonesia adalah default dan fallback. Gunakan translation keys untuk seluruh teks antarmuka, termasuk feedback dan label navigasi. Pengaturan di Profil langsung menerapkan Bahasa Indonesia atau English tanpa restart dan menyimpan pilihan di SQLite. Gunakan locale aktif untuk tanggal dan angka. Pergantian bahasa tidak mengubah data aktivitas. Pertahankan teks Arab dalam bentuk aslinya jika ada.
- Pengaturan tema di Profil langsung menerapkan Light, Dark, atau System Default dan menyimpan pilihan di SQLite. Dalam mode System, ikuti perubahan tema sistem.
- Buat **Profil > Tentang Aplikasi > Lisensi Pihak Ketiga** dan padanannya **Profile > About Application > Third-Party Licenses**. Tampilkan daftar komponen dan teks lisensi atau notice yang diwajibkan secara offline. Simpan teks resmi di dalam bundle aplikasi dan cocokkan inventaris dengan versi yang didistribusikan.

## Verifikasi lisensi dan instalasi

- Sebelum instalasi, tentukan kandidat versi, cek dokumentasi resmi Expo dan peer dependencies, periksa syarat resmi untuk versi tersebut, dan resolusikan dependency tree menggunakan metadata atau mode lockfile-only yang tidak menginstal atau menjalankan kode paket. Cakup dependencies development, optional, dan platform yang relevan di lockfile. Audit lisensi setiap pasangan nama dan versi, termasuk transitive dependencies dan aset bawaan scaffold. Metadata SPDX adalah petunjuk awal. Cocokkan dengan teks lisensi atau notice resmi. Ulangi peninjauan jika lockfile berubah.
- Pilih `lucide-react-native` hanya jika lisensi, notice set ikon, kompatibilitas SDK dan Expo Go, serta peer dependency seperti `react-native-svg` sudah diverifikasi. Gunakan alternatif yang memenuhi kebijakan jika verifikasi gagal.
- Ganti komponen yang tidak memenuhi kebijakan. Bila persyaratan stack wajib tidak dapat dipenuhi dengan pilihan yang patuh, laporkan konflik spesifik beserta bukti dan minta keputusan Product Owner. Persetujuan eksplisit diperlukan sebelum menggunakan lisensi terbatas sebagaimana diatur dalam kebijakan. Jangan tandai penerimaan lisensi selesai selama ada konflik atau bukti yang belum lengkap.

## Dokumentasi, UAT, dan batas fase

- Buat `docs/PROJECT_OVERVIEW.md`, `DEVELOPMENT_ROADMAP.md`, `ARCHITECTURE.md`, `BUSINESS_RULES.md`, `DATABASE_SCHEMA.md`, `DEVELOPMENT_PROGRESS.md`, dan `UAT_CHECKLIST.md`. Lengkapi kebijakan serta inventaris lisensi yang sudah tersedia. Berikan instruksi menjalankan Expo Go dan langkah UAT yang dapat diulang.
- Jalankan pemeriksaan TypeScript, pemeriksaan kompatibilitas Expo, dan pemeriksaan bundle Android serta iOS. Verifikasi inisialisasi, migrasi non-destruktif, foreign keys, seed tanpa duplikasi, persistensi setelah aplikasi ditutup, default Bahasa Indonesia, perubahan bahasa langsung, seluruh mode tema, akses lisensi offline, seluruh route, dan layout pada berbagai ukuran layar. Uji Expo Go Android dan iOS bila tersedia. Catat pemeriksaan perangkat yang masih menunggu dan bedakan hasil pemeriksaan bundle dari hasil UAT perangkat.
- Phase 01 hanya fondasi. Tunda onboarding, pengisian profil lengkap, autentikasi, pencatatan transaksi ibadah, planner dan target pribadi, analitik, Al-Qur’an digital, jadwal shalat, kiblat, adzan, notifikasi, Hadits Harian, backup dan sinkronisasi cloud. Tunggu persetujuan Product Owner setelah UAT sebelum memulai fase berikutnya.
- Pada serah terima, rangkum implementasi, perubahan file, skema database, cara menjalankan aplikasi, langkah pengujian, hasil verifikasi lisensi, dan pemeriksaan yang masih tertunda.
