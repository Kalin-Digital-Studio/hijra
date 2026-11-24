# UAT Phase 01

UAT ulang SDK 58 **menunggu verifikasi perangkat**. Percobaan sebelumnya terhenti di Android karena project SDK 54 dan Expo Go SDK 58. Jalankan langkah berikut di Android dan iOS. Catat model perangkat, versi OS, versi Expo Go, hasil, dan langkah reproduksi jika gagal.

- [ ] Pastikan perangkat memakai Expo Go SDK 58. Jalankan `npm start -- --go --lan --clear` dan buka QR baru. Verifikasi bahwa Hijrah terbuka tanpa pesan versi SDK tidak cocok.
- [ ] Pada perangkat dengan data Hijrah lama, pakai instalasi Expo Go serta alamat Metro yang sama. Verifikasi bahasa dan tema yang disimpan sebelumnya tanpa menghapus data Expo Go. Pada perangkat tanpa data Hijrah lama, pastikan Beranda memakai Bahasa Indonesia.
- [ ] Buka Beranda, Ibadah, Target, Laporan, dan Profil. Pastikan setiap tab dapat dibuka dan ketiga tab fitur mendatang menampilkan status yang jelas.
- [ ] Dari Beranda, buka dan kembali dari setiap shortcut. Verifikasi Shalat Wajib memiliki 5 tipe, Shalat Sunnah 9, Al-Qur’an 1, dan Dzikir 8. Cocokkan urutan dan nama dengan brief.
- [ ] Di Profil pilih English. Periksa label tab, layar kategori, pengaturan, dan format tanggal Beranda langsung berubah. Ganti kembali ke Bahasa Indonesia dan pastikan terjemahan kembali.
- [ ] Pilih Terang dan Gelap. Periksa teks, kartu, tab, dan status bar. Pilih Ikuti sistem lalu ubah tema OS. Pastikan tampilan mengikuti OS.
- [ ] Atur English dan Dark. Tutup Expo Go sepenuhnya, lalu buka ulang proyek dari QR. Pastikan kedua pilihan tetap tersimpan dan jumlah katalog tetap sama.
- [ ] Setelah layar aplikasi dimuat, aktifkan mode pesawat. Buka katalog, ganti pengaturan, dan pindah tab. Buka Profil → Tentang Aplikasi → Lisensi Pihak Ketiga lalu pilih satu komponen dan baca notice tanpa jaringan.
- [ ] Ulangi navigasi pada ponsel kecil dan besar serta ukuran teks yang diperbesar. Pastikan konten dapat digulir dan kontrol tetap dalam safe area.
- [ ] Catat hasil per platform. Product Owner mengisi keputusan UAT setelah temuan ditangani.

