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

## Phase 05 · Tracker bacaan Al-Qur’an

Satu surah dihitung dari akhir dikurangi awal, ditambah satu. Lintas surah menjumlahkan sisa ayat surah awal termasuk ayat mulai, seluruh surah tengah, dan jumlah ayat sampai posisi akhir. Sesi berulang dihitung sebagai volume bacaan. Ringkasan menjumlahkan ayat dan sesi, menghitung tanggal unik, dan menjumlahkan durasi yang terisi. Durasi opsional berupa bilangan bulat 1–1.440 menit. Catatan dibatasi 500 karakter. Tanggal lokal mendukung pencatatan lampau dan menolak tanggal mendatang.

Penanda utama berubah bila disimpan manual atau dipilih saat menyimpan sesi. Default pilihan aktif untuk sesi baru hari ini. Lanjutan bacaan mengisi awal saja. Di akhir An-Nas, aplikasi meminta konfirmasi sebelum menyarankan awal Al-Fatihah. Penghapusan sesi mempertahankan posisi terakhir.

Katalog offline memerlukan nomor urut, nama Latin, dan jumlah ayat untuk semua 114 surah. Nama Arab ditampilkan bila terverifikasi. Makna nama Indonesia dan Inggris ditunda hingga Release 2.

### Pencatatan dari pembaca

Sesi hanya ditulis setelah pengguna memilih ayat akhir dan mengonfirmasi simpan. Lanjutan dalam satu sesi hanya tersedia ke surah berikutnya setelah pengguna mengonfirmasi telah membaca sampai akhir surah. Pengguna dapat memilih awal baru. ID, tanggal, dan rentang dikunci saat konfirmasi. Penanda diperbarui secara atomik bila dipilih. Opsi ini aktif secara default di pembaca. Durasi dan catatan tetap opsional melalui tracker manual. Posisi setelah An-Nas menawarkan mulai ulang melalui konfirmasi.

## Phase 06 · Dzikir & Tasbih

Counter menyimpan hitungan aktual sampai 999.999; target pribadi 33, 99, 100 atau nilai positif lain hanya untuk pengukuran sesi. Target koleksi mengikuti riwayat. Penyelesaian wajib dihitung per bacaan. Sesi parsial hanya dicatat setelah konfirmasi; checklist tidak menambah hitungan repetisi. Total sesi menghitung log individual, sedangkan koleksi dihitung dari ID induk yang berbeda. Aktivitas historis menjaga mode saat dicatat. Draf tidak masuk statistik.

## Enhancement Phase 06 · Koleksi dan navigasi

Draf dan sesi lama mempertahankan daftar bacaan, target dan status dari snapshot. Pagi dan Petang versi 2 berlaku untuk sesi baru. Memilih Sebelumnya, Selanjutnya, atau bacaan dari daftar hanya memindahkan posisi. Tiga kali Al-Ikhlas berarti tiga kali membaca surah utuh. Checklist doa menandai bacaan tuntas di aplikasi.

## Enhancement Phase 06 · Pembaca Dzikir untuk pemula

Pengaturan Latin dan terjemahan hanya mengubah tampilan Dzikir. Teks bawaan ditampilkan berdasarkan sumber dan versi yang telah diverifikasi. Makna pribadi ditampilkan dengan identitas bacaan pengguna. Preferensi bersama berlaku pada reader, penghitung, dan checklist.

## Phase 06B · Hub Ibadah

Countdown memakai zona kota dan waktu Subuh hari berikutnya. Jadwal tidak memperbarui transaksi. Kalender sipil tabular diberi label terpisah dari hasil MyQuran. Favorit menyimpan identitas penyedia dan edisi.

### Rentang bacaan di Reader

Menu ayat mengatur posisi awal dan akhir. Ringkasan memakai hitungan inklusif dari service Quran sebelum simpan, termasuk sesi lintas surah. Hanya aksi simpan eksplisit membuat log dan dapat memperbarui posisi terakhir secara atomik. Scroll dan pilihan Latin atau terjemahan tidak menambah hitungan. Ringkasan hari ini dihitung dari sesi SQLite.


### Target pribadi dan periode aktif

Target baru mencakup aktivitas yang sudah disimpan sejak awal periode berjalan. Edit, jeda, lanjut dan arsip memakai tanggal efektif. Konfigurasi periode tersimpan tidak berubah akibat edit. Koreksi catatan ibadah dapat mengubah actual dan status periode lama. Kapasitas Wajib mengecualikan EXEMPT eksplisit. Ringkasan hanya membagi jumlah target tercapai dengan target aktif yang berlaku. [Aturan per metrik](GOAL_CALCULATION_ENGINE.md).


### Beranda

Ringkasan hari ini memakai tanggal lokal tracker. Wajib menggunakan jumlah selesai dan slot yang berlaku. Grafik mencakup hari ini dan enam tanggal sebelumnya, terlepas dari awal pekan. Target hari ini hanya mencakup versi aktif DAILY yang berlaku. Catatan tanpa jam ibadah menampilkan tanggal. Koleksi Dzikir muncul sekali sebagai parent di aktivitas terakhir. [Aturan rinci](DASHBOARD_INTEGRATION.md).


### Laporan, cakupan dan atribusi

Laporan periode kalender aktif hanya mencakup tanggal hingga hari ini. Status terlewat hanya berasal dari catatan eksplisit. Persentase Wajib menggunakan slot yang berlaku, sedangkan tepat waktu dan berjamaah memakai shalat selesai. Periode Target selesai dihitung menurut hari terakhir, dan periode terbuka tampil tersendiri. [Rumus](REPORT_CALCULATION_RULES.md).


### Muhasabah dan riwayat lintas tracker

Satu jurnal per rentang mingguan tanpa tumpang tindih dalam satu profil. Saat awal pekan berubah, kandidat beririsan membuka jurnal dengan rentang asli. Penyimpanan membutuhkan perasaan atau catatan yang bermakna. Riwayat hanya menampilkan aktivitas tersimpan yang sesuai. Koleksi Dzikir final menjadi satu entri dan anaknya dapat dilihat pada detail.
