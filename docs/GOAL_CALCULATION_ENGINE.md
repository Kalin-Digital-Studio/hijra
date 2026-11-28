# Mesin perhitungan Target

| Kategori | Metrik | Filter / sumber |
| --- | --- | --- |
| Wajib | Shalat selesai, hari lengkap, tepat waktu, berjamaah | Seluruh shalat wajib dari `prayer_logs`. Tepat waktu dan berjamaah membutuhkan atribut `true`. |
| Sunnah | Sesi, hari aktif, rakaat | Semua, ID aktivitas, atau Rawatib eksplisit dari `sunnah_prayer_logs`. Rakaat nullable, dengan coverage. |
| Quran | Ayat, sesi, durasi menit, hari aktif | `quran_reading_logs` dan kalkulator ayat Phase 05. Satuan durasi tersimpan dalam menit, dengan coverage. |
| Dzikir | Pengulangan, sesi, hari aktif, koleksi selesai | `dhikr_logs` untuk counter/individual. `dhikr_collection_sessions` berstatus `COMPLETE` untuk koleksi. Draft dan parent koleksi tidak masuk hitungan log individual. |

Filter memakai ID master yang tersedia untuk pemilik, termasuk kustom. Rawatib menggabungkan `before-fajr`, `before-dhuhr`, `after-dhuhr`, `after-maghrib`, `after-isha`. Filter koleksi mendukung satu koleksi, gabungan `morning` + `evening`, atau `post-591` + `post-34` + `post-33`. Metrik gabungan menghitung setiap sesi selesai atau tanggal unik sesuai pilihan. Aktivitas arsip tetap dapat dikenali dalam versi lama.

Semua interval berupa tanggal lokal [mulai, akhir). Pekan memakai preferensi pengguna yang disimpan bersama periode. Setelah preferensi berubah, batas yang sudah tersimpan dipertahankan dan rentang transisi dapat berakhir pada awal pekan yang baru. Bulan memakai kalender Gregorian. Versi baru efektif di batas berikutnya. Jeda membuat celah tanpa periode, sedangkan arsip mengakhiri periode baru setelah tanggal efektif.

Target efektif memakai minimum antara target konfigurasi dan kapasitas jika relevan. Slot EXEMPT mengurangi kapasitas Wajib, tanggal yang sepenuhnya EXEMPT tidak menjadi hari lengkap. Kapasitas nol memberi persen null. Progres memakai actual/target efektif, bar maksimal 100, dan status tercapai memakai actual tanpa pembulatan. Aktivitas tersimpan dapat melebihi target. Periode terbuka yang belum terpenuhi tetap berjalan.

Rekonsiliasi menciptakan periode yang terlewat secara deterministik dan mengerjakan insert dalam batch 100. Query progres meload transaksi per kategori dalam satu rentang untuk himpunan kartu yang diperlukan, lalu menghitung hasil dan timestamp saat dibaca. Riwayat tidak menyimpan total yang dapat kedaluwarsa. Perubahan tanggal transaksi tercermin di periode lama dan baru saat dimuat ulang. Detail menampilkan jumlah kontribusi per tanggal tanpa membaca catatan pribadi ke UI.

Verifikasi menggunakan SQLite sementara di `npm run test:database`. Tes mencakup sesi lintas surah, transaksi lama/koreksi, cakupan nilai opsional, rentang transisi, lifecycle, dan validasi pemilik.
