# UAT Hijra

## Phase 02 · checklist verifikasi pengembangan

Checklist ini mendukung pengujian fungsi, teknis, dan regresi yang berkelanjutan. Perbaiki defek yang ditemukan, uji ulang bagian terdampak, serta catat defek terbuka dan kebutuhan verifikasi perangkat. Status **DONE** menandai implementasi dan verifikasi pengembangan yang selesai tanpa masalah kritis. Penerimaan Product Owner dicatat melalui UAT formal MVP pada Phase 12.

Gunakan Expo Go SDK 58 di Android dan iOS. Jalankan `npm start -- --go --lan --clear`, sambungkan kedua perangkat ke Wi-Fi yang sama, dan pindai QR baru. Siapkan satu lingkungan baru dan satu lingkungan dengan database Phase 01. Pertahankan lingkungan lama untuk uji upgrade. Catat perangkat, versi OS, versi Expo Go, hasil, dan langkah reproduksi.

| ID | Langkah dan hasil yang diharapkan |
| --- | --- |
| UAT-0201, 0203–0207 | Buka lingkungan baru. Periksa tiga slide, swipe, indikator, Kembali, Lanjut, Lewati dan Mulai. Lewati dan Mulai membuka formulir. Persetujuan ilustrasi menunggu aset produksi. |
| UAT-0202 | Di build native rilis Android dan iOS, periksa ikon Hijra di launcher. Lakukan cold launch dan periksa logo pada splash hijau serta perpindahan setelah inisialisasi. Expo Go dipakai untuk alur aplikasi. |
| UAT-0208–0209 | Pada pengguna baru, pastikan onboarding menggunakan Bahasa Indonesia. Setelah setup, ubah bahasa ke English melalui Profil → Bahasa. Buka Pengenalan Aplikasi untuk memeriksa terjemahan, lalu buka ulang aplikasi untuk memeriksa preferensi tersimpan. |
| UAT-0210–0213, 0216–0217 | Coba nama kosong, nama Unicode dan nama panjang. Simpan nama valid tanpa gender dan foto. Dasbor harus menyapa dengan nama tersebut serta tetap punya empat shortcut. |
| UAT-0214–0215 | Pilih foto, ganti foto, hapus foto, lalu ulangi dengan picker dibatalkan dan akses foto ditolak bila platform menawarkannya. Pastikan preview, persistensi, dan avatar bawaan benar. |
| UAT-0218 | Tutup dan buka lagi. Pastikan onboarding terlewati, profil dan preferensi pulih, serta Android Back tidak membuka onboarding. Coba link ke tab utama sebelum setup untuk menguji guard. |
| UAT-0219–0220 | Edit nama, gender, dan avatar, lalu simpan. Periksa sapaan berubah. Ulangi edit lalu Batal dan verifikasi nilai tersimpan tetap sama. |
| UAT-0221–0222 | Uji Terang, Gelap, dan Ikuti sistem serta ketujuh pilihan awal pekan. Tutup dan buka kembali untuk memeriksa pilihan tersimpan. |
| UAT-0223 | Buka Profil → Pengenalan Aplikasi. Lewati atau selesaikan. Pastikan kembali ke Profil dan status onboarding tetap. |
| UAT-0224 | Setelah proyek dimuat, aktifkan mode pesawat. Uji baca profil, edit, katalog, tema, dan akses notice lisensi. |
| UAT-0225–0227 | Buka lingkungan dengan database v1 dan periksa profil, preferensi, serta jumlah katalog. Buka ulang beberapa kali. Kasus rollback kegagalan simpan juga diperiksa oleh `npm run test:database`. |
| UAT-0228 | Bandingkan daftar lisensi terhadap inventaris dan buka notice secara offline. |
| UAT-0229–0231 | Ulangi di Android dan iOS, termasuk layar kecil, teks besar, keyboard terbuka, tema OS, semua tab, Tracker, Target, Laporan, dan empat shortcut lama. |

Logo native dan ikon sudah dikonfigurasi. Tiga ilustrasi produksi tanpa teks atau kontrol masih perlu disiapkan. Referensi visual `image_1.png` hingga `image_3.png` sudah diterima. Verifikasi asal dan hak penggunaan masih terbuka. Lihat [inventaris aset](THIRD_PARTY_LICENSES.md).

## Phase 12 · UAT formal MVP — PENDING

- [ ] Uji alur end-to-end, integrasi lintas modul, dan regresi penuh.
- [ ] Verifikasi Android dan iOS, fungsi offline, serta integritas database.
- [ ] Periksa lokalisasi, konsistensi UI/UX, performa, dan stabilitas.
- [ ] Periksa kepatuhan privasi dan lisensi.
- [ ] Catat keputusan penerimaan akhir Product Owner.

## Riwayat Phase 01

Percobaan awal Android terhambat oleh perbedaan Expo SDK 54 dan Expo Go SDK 58. Upgrade SDK 58 lulus pengujian pengembangan. Product Owner menyetujui Phase 01 sebelum Phase 02 dimulai. Pemeriksaan regresi Phase 01 meliputi lima tab, empat katalog dengan 5, 9, 1, dan 8 aktivitas, bahasa, tema, persistensi, safe area, dan notice lisensi offline.

## Phase 03 · verifikasi pengembangan dan regresi perangkat
- [ ] Di Ibadah, buka Shalat Wajib dan cek lima shalat dalam urutan yang benar. Tiga kategori lainnya, Target, Laporan, Profil, dan jalur notice masih dapat dibuka.
- [ ] Coba centang, batal centang, status Tidak dilaksanakan dan Tidak diwajibkan, serta semua pilihan atribut. Ketuk cepat, pindah tanggal saat simpan, dan buka ulang proyek untuk memeriksa persistensi.
- [ ] Tambah, edit, batalkan, dan hapus catatan. Pastikan perubahan status mempertahankan catatan, penolakan simpan memberi pesan, dan catatan tidak muncul di Beranda.
- [ ] Uji kalender, tanggal invalid melalui tautan, hari sebelumnya, batas hari ini, pergantian hari lokal, aplikasi resume, serta penggantian awal pekan.
- [ ] Periksa ringkasan, matriks yang dapat digeser, pemilihan tanggal, dan konsistensi mingguan. Tanggal mendatang nonaktif. Uji semua slot exempt dan tidak ada shalat selesai.
- [ ] Bandingkan kartu Beranda setelah mengubah hari ini dan setelah mengubah tanggal lampau. Uji Android/iOS, ukuran layar kecil, teks besar, tema terang/gelap, kedua bahasa, dan mode pesawat.

Formal UAT Phase 12 tetap **PENDING**.

## Phase 04 · verifikasi perangkat

- [ ] Android dan iOS melalui Expo Go. Dari Beranda dan Ibadah buka Shalat Sunnah, cek lima default, lalu catat cepat dan tambah dua sesi detail dengan dan tanpa rakaat.
- [ ] Ubah tanggal, cek pergantian hari lokal, jalankan offline, dan buka ulang aplikasi. Cocokkan ringkasan Beranda dan riwayat dengan jumlah sesi, hari aktif, serta rakaat terisi.
- [ ] Tambah dan ubah aktivitas pribadi, atur urutan, nonaktifkan aktivitas dengan riwayat, lalu pastikan sesi lama dapat dibuka dan diedit.
- [ ] Cek senin/minggu sebagai awal pekan, bahasa Indonesia/Inggris, tema terang/gelap, serta regresi profil dan Shalat Wajib.

Formal Product Owner UAT dijadwalkan pada Phase 12.

## Phase 05 · Verifikasi pengembangan perangkat

- [ ] Expo Go Android dan iOS. Buka dari Beranda dan Ibadah. Catat Al-Baqara ayat 1–5 lalu 6–10. Pada hari tanpa catatan awal, Beranda menampilkan 10 ayat dan 2 sesi, serta posisi terakhir ayat 10 jika opsi penanda dipilih.
- [ ] Cek 114 surah dan rendering Arab. Cari berdasarkan nomor dan nama Latin atau Arab.
- [ ] Catat ayat tunggal dan lintas surah. Uji batas ayat, beberapa sesi, durasi opsional, catatan, edit, hapus, dan pembatalan.
- [ ] Atur bookmark, lanjutkan dalam surah dan di batas surah, konfirmasi awal Al-Fatihah setelah An-Nas, lalu hapus bookmark sambil mempertahankan sesi.
- [ ] Cek hari lampau, pergantian hari, awal pekan, statistik Beranda, tema, mode offline, buka ulang aplikasi, dan regresi Phase 01–04.

Formal Product Owner UAT dijadwalkan pada Phase 12.

### Enhancement Phase 05 · Pengujian perangkat

- [ ] Android dan iOS. Buka daftar 114 surah, cari Al-Fatihah, buka dan periksa ketujuh ayat Arab.
- [ ] Pada profil atau tanggal kosong, catat ayat 1–5 dengan penanda aktif. Di Beranda, periksa 5 ayat dan 1 sesi. Lanjutkan dari ayat 6 dan simpan sampai ayat 7. Periksa 7 ayat, 2 sesi, dan posisi berikutnya Al-Baqara ayat 1.
- [ ] Buka Al-Baqara, lompat ke ayat 286, dan uji sesi lintas surah setelah konfirmasi. Uji mulai sesi baru, riwayat, serta input manual.
- [ ] Uji empat ukuran huruf, tanda jeda, diakritik, RTL, tidak terpotong, mode terang/gelap, serta antarmuka Indonesia/Inggris. Periksa Bismillah pada Al-Fatihah, Al-Baqara, dan At-Tawbah.
- [ ] Buka ulang dengan mode pesawat pada build yang menyertakan bundle lokal. Cek teks, ukuran font, riwayat, penanda, dan total Beranda. Di Expo Go, Metro diperlukan saat memuat bundle dari awal.
- [ ] Buka atribusi di modul dan notice lengkap di Profil → Tentang Aplikasi → Lisensi Pihak Ketiga.

Formal Product Owner UAT tetap di Phase 12.

## Phase 06 · Dzikir & Tasbih

1. Buka Dzikir & Tasbih. Lakukan ketukan cepat, koreksi, reset, ganti target, keluar, dan buka ulang draf.
2. Jalankan koleksi pagi, petang, serta dua variasi setelah shalat. Simpan koleksi penuh dan sebagian dan cek hitungan di Beranda serta riwayat.
3. Pada shalat yang tercatat selesai, buka Dzikir Setelah Shalat dan cek konteks shalat dan tanggalnya. Uji edit/hapus sesi lampau, checklist, favorit, dan arsip aktivitas pribadi.
4. Uji dua bahasa, tema terang/gelap, font Arab, getaran Android, dan pemulihan draf offline. Formal UAT tetap Phase 12.

## Enhancement Phase 06 · Koleksi dan navigasi

Pada perangkat fisik, buka koleksi baru Pagi dan Petang. Gunakan Sebelumnya, Selanjutnya, dan daftar bacaan. Verifikasi hitungan tetap, tombol batas nonaktif, harakat dan Basmalah tampil sesuai Quran Reader, serta koleksi berfungsi dalam mode pesawat setelah bundle dimuat. Buka draf yang sudah ada sebelum migrasi untuk memeriksa daftar dan progres aslinya.

## Enhancement Phase 06 · Pembaca Dzikir untuk pemula

Di perangkat, buka Dzikir Petang dan pilih Al-Ikhlas dalam antarmuka Inggris untuk memeriksa arti Pickthall. Coba dua pengaturan secara terpisah sambil menjaga hitungan dan checklist. Ulangi menggunakan dzikir pribadi yang berisi Latin dan arti pada antarmuka Indonesia. Buka ulang offline untuk memeriksa pengaturan, lalu simpan sesi dan periksa Beranda. Skenario Latin dan arti Indonesia bawaan menunggu konten terverifikasi.

### Preview draf bacaan Dzikir

- [ ] Mulai ulang Metro setelah pembaruan konfigurasi, buka Dzikir Petang, dan pilih Doa Petang. Periksa teks Latin, arti, referensi, dan label Konten dalam review.
- [ ] Uji Latin dan arti secara terpisah. Simpan sesi dan buka ulang untuk mencocokkan preferensi dan progres.
- [ ] Periksa dzikir harian dan setelah shalat, surah bernomor, serta prioritas terjemahan Pickthall pada bahasa Inggris.
- [ ] Gunakan `npm run export:release` dan verifikasi keluaran rilis dari perangkat atau build terpasang. Konten draf hanya tersedia dalam build pengembangan.

## Phase 06B · Hub Ibadah

Di Expo Go, pilih Kediri dan WIB, cek countdown, lima waktu, serta ganti bulan. Uji lintang/bujur manual secara offline. Uji izin lokasi ditolak dan diberikan, sensor, mode magnetik, dan pindah layar saat sensor berjalan. Periksa dua koleksi hadis, pencarian, doa, 99 nama, favorit, kalender, regresi tracker dan navigasi. Formal UAT tetap Phase 12.

### Enhancement Reader Quran · Pemeriksaan perangkat

- [ ] Buka **Ibadah → Al-Qur’an → Al-Fatihah**. Periksa tujuh kartu, harakat, dan mode terang/gelap pada Android dan iOS.
- [ ] Dalam Expo Go pengembangan dengan internet, cek terjemahan Indonesia, matikan Latin dan terjemahan secara terpisah, lalu buka ulang untuk cek preferensi. Dalam antarmuka Inggris, cek label bahasa terjemahan.
- [ ] Pilih 1–5, simpan dengan penanda aktif, lalu cek kenaikan dashboard 5 ayat dan 1 sesi. **Lanjutkan Membaca** membuka ayat 6. Simpan 6–7 dan pastikan posisi berikutnya Al-Baqarah 1.
- [ ] Coba Al-Fatihah 6 sampai Al-Baqarah 3 sebagai satu sesi. Ringkasan menunjukkan 5 ayat. Batalkan sesi lain dan cek tidak ada perubahan pada riwayat.
- [ ] Matikan internet dan buka ulang. Cek teks Arab, simpan sesi, riwayat, penanda, dan ringkasan tetap berjalan. Cek status terjemahan dan retry saat koneksi kembali.

Checklist ini belum diverifikasi pada perangkat fisik. UAT formal tetap Phase 12.


### Pemeriksaan perangkat untuk tanda waqf

- [ ] Cek 2:2, 2:45, 16:17, 16:21, 16:57, dan 36:76 pada Android dan iOS, di semua ukuran huruf Arab. Bandingkan dengan [rujukan Tanzil](https://tanzil.net/docs/pause_marks). Pastikan tanda waqf, harakat dan posisi baris tetap terbaca.
- [ ] Cek sajdah di 7:206, Basmalah di 1:1 dan di pengantar 2:1, pengecualian 9:1, serta Basmalah dalam 27:30. Aktifkan mode offline dan verifikasi tracker dan penanda.

### Pembanding Amiri Quran di Expo Go

- [ ] Reload proyek tanpa menghapus data aplikasi. Di reader, tekan **Dev · SQLite waqf / font A–B**. Cek 2:2 menampilkan dua U+06DB dari SQLite dan bandingkan teks yang sama pada A (System) dan B (Amiri Quran), serta lima ayat rujukan lain.
- [ ] Pada varian B, periksa shaping, tanda di atas kata, wrapping ayat panjang dan clipping pada semua pilihan ukuran. Periksa pula satu tanda sajdah.
- [ ] Bandingkan awal Al-Fatihah, Al-Baqarah, At-Tawbah, An-Naml dan Al-Ikhlas. Cek Basmalah dalam An-Naml 30 tetap satu ayat, dan **Lanjutkan Membaca** dari ayat 2 atau lebih tidak menampilkan pengantar.
- [ ] Cek terjemahan dan bookmark Al-Baqarah 1 tetap di ayat 1. Simpan Al-Baqarah 1–5 dan pastikan ringkasan bertambah 5, termasuk saat offline.


## Phase 07 · Verifikasi perangkat Target Ibadah

- [ ] Buka Target pada perangkat dengan data lama. Cek profil, bookmark dan riwayat ibadah tetap tersedia.
- [ ] Catat 15 ayat, buat target harian 20 ayat, cek 75%. Tambahkan 15 ayat, cek 150% dengan bar penuh. Hapus sesi kedua dan cek kembali 75%.
- [ ] Cek Shalat Wajib dengan 3 selesai dan 1 EXEMPT menghasilkan 3/4. Uji 5 EXEMPT dan pastikan persentase kosong.
- [ ] Gunakan target Dhuha/Tahajud dan Dzikir Pagi. Cek pintasan, satu hari dari beberapa sesi, koleksi parsial vs selesai, dan custom activity.
- [ ] Pilih satu atau semua rekomendasi, sesuaikan jumlah/periode, review, cancel, lalu ulang dan simpan. Uji peringatan duplikat.
- [ ] Edit nama, metrik dan jenis periode. Cek jadwal penerapan, batalkan, lalu ulang. Uji jeda, lanjutkan dan arsip. Ubah awal pekan dan cek periode transisi setelah pergantian.
- [ ] Buka riwayat dengan filter, cek periode arsip, lalu koreksi transaksi historis dan cek progres yang berubah.
- [ ] Verifikasi Android/iOS, tema terang/gelap/sistem, Indonesia/Inggris, skala font dan mode pesawat. Formal UAT tetap Phase 12.


## Phase 08 · Verifikasi perangkat Beranda

- [ ] Buka Beranda. Periksa avatar dan tanggal, mode terang/gelap/sistem, bahasa Indonesia/Inggris, dan ukuran font besar.
- [ ] Ganti kota lewat **Lihat Jadwal Lengkap** dan cek Beranda. Periksa jadwal berikutnya setelah Isya dan pergantian bulan, termasuk status jadwal tidak tersedia saat koneksi putus.
- [ ] Catat tiga shalat selesai, satu EXEMPT, dan satu belum dicatat. Cek **3/4 dan 75%**. Cek grafik untuk hari kosong, terlewat, lengkap dengan pengecualian, dan semua EXEMPT.
- [ ] Simpan dua Tahajud dan satu Dhuha. Simpan 75 kali istighfar dan buat draft tambahan. Cek ringkasan tiga sesi Sunnah dan 75 pengulangan.
- [ ] Simpan 15 ayat yang berakhir di Al-Baqarah 45, lalu cek tombol lanjut membuka ayat 46. Uji penanda akhir surah dan opsi mulai ulang setelah An-Nas.
- [ ] Buat target harian 20 ayat. Cek 15/20, simpan 5 ayat lagi dan cek target tercapai. Tambahkan target pekanan dan cek pengecualiannya di ringkasan hari ini.
- [ ] Koreksi transaksi lama dan pastikan grafik dan target mengikuti. Cek feed maksimal lima, tanggal fallback, pintasan, dan satu parent per koleksi.
- [ ] Uji mode pesawat setelah Expo Go terbuka. Uji kembali dari latar belakang dan pergantian tanggal. Tes dengan profil terisolasi untuk kondisi kosong, dengan data Product Owner tetap tersedia.


## Phase 09 · Verifikasi perangkat Laporan

- [ ] Reload Expo Go, buka **Laporan** dan cek Mingguan, Bulanan, Tahunan, serta Rentang khusus. Coba kembali ke periode kini, masuk detail, lalu kembali dan periksa pilihan tetap dipertahankan.
- [ ] Uji data Shalat Wajib lengkap, terlewat, belum dicatat dan EXEMPT. Pastikan tanggal mendatang tidak masuk. Cek atribut Ya, Tidak dan Belum diisi.
- [ ] Buat sesi Quran lintas Al-Fatihah 6 hingga Al-Baqarah 3. Periksa alokasi 2 + 3. Coba filter surah dan cek durasi hanya pada ringkasan sesi yang cocok.
- [ ] Cek beberapa sesi Sunnah di hari yang sama, aktivitas kustom, rakaat kosong, counter dan checklist Dzikir, serta status koleksi parsial dan selesai.
- [ ] Cek filter kategori/frekuensi Target, versi lama setelah edit, periode terbuka, dan atribusi periode tutup lintas bulan.
- [ ] Bandingkan bulan berjalan dengan bulan sebelumnya. Cek hari yang dibandingkan, perubahan poin persentase, dan baseline nol.
- [ ] Pilih hari pada Kalender dan buka tracker terkait. Koreksi transaksi dan cek laporan otomatis berubah. Uji mode pesawat setelah Expo Go terbuka, kedua bahasa, tema, ukuran font, serta Android/iOS.

Formal UAT tetap Phase 12.


### Phase 09A · Pemeriksaan visual Laporan

- [ ] Pada Android kecil dengan ukuran font normal, cek judul dan ikon kalender, empat segmen satu baris, serta awal KPI dalam viewport bila ukuran perangkat memungkinkan. Pada font aksesibilitas, cek segmen dan KPI terbaca saat dibungkus.
- [ ] Geser ke periode lama dan cek tautan periode kini hanya muncul di sana. Uji periode Custom, panah nonaktif untuk masa depan, dan jalur dari ikon kalender.
- [ ] Periksa hero pada 0%, persentase parsial, 100% dan semua EXEMPT. Cek bar tren, pasangan perbandingan, kondisi baseline nol, serta pintasan detail.
- [ ] Cek terang/gelap/sistem, Indonesia/Inggris, label pembaca layar, dan ulangi alur offline Phase 09 di HP. Bila gear melayang masih muncul, bandingkan dengan Expo Go lain atau build rilis untuk mengidentifikasi pemiliknya.


## Phase 10 · Verifikasi perangkat

- [ ] Pada Expo Go dengan profil yang sudah ada, buka **Laporan → Muhasabah & Riwayat**. Simpan hanya perasaan, kosongkan semua input untuk cek validasi, lalu edit dan buka ulang.
- [ ] Ketik perubahan lalu tekan Back atau pindah minggu. Pastikan dialog pembuangan muncul dan membatalkan dialog mempertahankan draf. Periksa keyboard, kedua bahasa, tema, dan font besar.
- [ ] Ubah awal pekan. Pastikan kandidat yang beririsan membuka tanggal asli dan kandidat non-overlap bisa dipakai. Cek filter tahun dan konfirmasi hapus.
- [ ] Cocokkan ringkasan dengan Laporan untuk rentang yang sama. Koreksi catatan tracker dan pastikan statistik berubah dengan jurnal tetap tersimpan.
- [ ] Cek setiap filter riwayat dan rentang khusus. Cek status Wajib, sesi Quran lintas surah, abaikan draft, serta lihat anak koleksi dari detail parent. Periksa jam yang kosong dan kembali ke filter semula.
- [ ] Aktifkan mode pesawat setelah Expo Go terbuka. Uji simpan, buka ulang, lihat riwayat dan periksa data ibadah tetap ada setelah satu jurnal dihapus. Formal UAT tetap Phase 12.
