# Panduan UI dan UX Hijra

## Phase 03 · Shalat Wajib

Gunakan token tema Hijra, Forest Green untuk ringkasan, dan permukaan netral untuk kartu. Padding layar 16, padding kartu 16, radius 14, jarak antarkartu 10, judul layar 24, nama shalat 16, teks sekunder 13, ikon shalat 24 dalam wadah 40, dan kontrol sentuh minimum 48. Persentase menampilkan aktivitas yang dicatat. Biarkan nama dan teks panjang membungkus sesuai ukuran font pengguna.

Kontrol tanggal memiliki label aksesibilitas. Kartu menempatkan ikon serta status di kiri dan checkbox serta menu di kanan. Pilihan status ada di modal. Setelah Completed, ketuk atribut untuk berpindah dari belum diisi ke ya, tidak, lalu kembali ke belum diisi. Catatan memiliki aksi simpan, hapus, dan batal.

Matriks memiliki legenda dan ikon bentuk yang berbeda untuk setiap status. Pada ponsel kecil, geser tabel dan kalender secara horizontal untuk mempertahankan ukuran sentuh. Tanggal mendatang tidak dapat dipilih dan batang konsistensinya kosong. Ikon dibuat sebagai bentuk kode React Native untuk proyek. Pengujian visual di perangkat Android dan iOS masih diperlukan.

## Phase 04 · Shalat Sunnah

Gunakan kontrol tanggal dan gaya kartu Tracker yang sama dengan Shalat Wajib. Pisahkan kontrol centang cepat dari tindakan pengelolaan sesi. Matriks pekanan dapat digulir horizontal, dengan angka untuk sesi yang tercatat. Ringkasan Beranda menampilkan agregat serta pratinjau tanpa catatan pribadi.

## Phase 05 · Tracker bacaan Al-Qur’an

Gunakan kartu ringkasan Forest Green, kontrol tanggal dari tracker shalat, dan daftar sesi yang dapat diedit. Pemilih surah mendukung nomor dan nama Latin atau Arab. Form menampilkan batas ayat dan pratinjau hitungan. Riwayat memakai batang volume bacaan per hari dan menonaktifkan tanggal mendatang. Data catatan hanya tampil pada tracker dan form sesi. Nama Latin tetap menjadi label utama.

### Pembaca Al-Qur’an

Teks setiap ayat rata kanan dan arah tulisan RTL. Tata letak aplikasi mengikuti pengaturan bahasa. Identitas ayat tampil terpisah dari teks. Empat ukuran font tersedia dan tersimpan. Blok ayat dapat digulir, dengan tombol untuk blok sebelumnya/berikutnya dan lompat langsung. Simpan memakai aksi utama bertema hijau, sementara penghapusan bookmark memakai aksi destruktif dengan konfirmasi.

## Phase 06 · Dzikir & Tasbih

Counter memakai target sentuh besar, koreksi satu langkah, konfirmasi reset, dan feedback kesalahan. Bacaan Arab ditampilkan rata kanan menggunakan pola font sistem dari pembaca Quran. Koleksi memilih bacaan sebelumnya/berikutnya, dengan progres per bacaan. Getaran opsional memakai React Native Vibration di Android. Dukungan haptik iOS belum tersedia.

## Enhancement Phase 06 · Pembaca Dzikir untuk pemula

Di pembaca Dzikir, Latin muncul setelah Arab dengan teks miring, lalu arti pada kartu lembut bertema. Ayat surah bernomor. Menu Pengaturan Bacaan mengontrol masing-masing bagian, dan bagian yang disembunyikan tidak mengambil ruang.

## Phase 06B · Hub Ibadah

Hub memakai hero jadwal Forest Green, ringkasan kalender, grid dua kolom tracker, serta grid alat dan pustaka yang menyesuaikan lebar dan skala font. Kompas menampilkan bearing statis saat sensor tidak tersedia.

### Reader Quran

Reader memakai header ringkas dengan kembali dan pengaturan, kartu surah Forest Green, ringkasan baca hari ini, lalu kartu ayat bernomor dan ringkasan sesi. Ayat Arab rata kanan dengan ukuran yang dapat disesuaikan. Terjemahan rata kiri dan tampil di bawah pemisah. Menu ayat memilih awal/akhir. Status konten tambahan muncul sekali per segmen dan pembaca tetap berjalan saat jaringan gagal. Maksimum 20 kartu dirender per halaman.


### Tab Target

Gunakan ringkasan Forest Green dengan pilihan Harian, Mingguan dan Bulanan, angka progres bertulisan, dan bar berlabel aksesibilitas. Bar dibatasi 100% sementara angka aktual dapat lebih besar. Tampilkan perbedaan target efektif, periode transisi, perubahan terjadwal, dan opsi tracker. Riwayat memakai filter dan halaman berisi hingga 20 periode. Edit dan rekomendasi memakai field angka, pemilih periode, dan review sebelum simpan.


### Beranda Phase 08

Urutan Beranda mengikuti prototipe dari sapaan, jadwal Forest Green, grid ringkasan ibadah, kartu Quran hijau, target harian, grafik 7 hari, aktivitas terakhir, hingga footer. Indikator target memakai bar bawaan. Untuk layar sempit atau font aksesibilitas, grid menjadi satu kolom dan grafik data beralih ke daftar tanggal yang dapat dibaca. Aksi avatar membuka Profil.


### Laporan Phase 09

Ringkasan mendahulukan periode dan kartu Wajib Forest Green, diikuti grid 2×2, tren, perbandingan, dan pintasan detail/kalender. Data chart ditampilkan sebagai bar native dengan angka dan tanggal. Grid beralih ke satu kolom pada font besar atau layar sempit. Kalender memadukan warna, simbol, dan label pembaca layar. Pada layar sempit kisi dapat digeser horizontal agar tombol tanggal mempertahankan 48 dp.


### Phase 09A · Penyempurnaan Laporan

Laporan memakai header dengan satu aksi ikon kalender 48 dp, segmented control satu baris pada skala font normal, dan satu kartu navigasi tanggal. Layar yang sangat sempit atau ukuran font aksesibilitas membungkus segmen menjadi dua baris. Tautan periode kini tampil saat membuka periode lain. Hero Forest Green menggunakan cincin native dari View dengan angka di tengah dan label N/A yang dapat dibaca. Kartu KPI mengikuti hierarki ikon, label, angka, dan satuan dari Beranda. Grafik memakai bar horizontal, skala bersatuan, dan N/A terpisah dari nol. Perbandingan memakai sepasang bar dengan skala yang sama per metrik, dan pintasan detail menggunakan ikon serta chevron.


### Phase 10 · Muhasabah & Riwayat

Di Laporan, bagian baru berada setelah Detail Laporan dan sebelum footer. Editor memakai navigasi pekan ringkas, kartu Forest Green dua kolom, lima pilihan emoji dengan label aksesibilitas, tiga catatan multiline, tombol simpan, dan penjelasan privasi. Grid disusun vertikal pada layar sempit atau font besar. Riwayat ibadah dikelompokkan menurut tanggal dengan ikon, status, dan detail.
