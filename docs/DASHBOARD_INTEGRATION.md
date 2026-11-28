# Beranda Personal · Phase 08

Urutan layar mengikuti struktur Product Owner. Header menyajikan Hijra, avatar lokal, sapaan dengan fallback, dan tanggal. Prayer Hero bersumber dari city setting Hub, memakai engine zona WIB/WITA/WIT dan jadwal esok yang terverifikasi. Kondisi gagal, rate limit, atau tanpa jadwal tidak menghalangi pembacaan SQLite. Gate izin konten MyQuran tetap berlaku. Tidak ada penyimpanan jadwal persisten baru.

## Agregasi

- Shalat Wajib memakai `prayerSlots` dan `summarizePrayers`. Jika catatan kosong, UI membedakan belum ada aktivitas. Apabila semua slot EXEMPT, persentase kosong.
- Sunnah memakai total sesi. Quran memakai hitungan inklusif dari log. Dzikir memakai counter yang disimpan, dan checklist tetap dapat tampil sebagai aktivitas tanpa menambah pengulangan.
- Lanjutkan Quran memakai bookmark tersimpan dan `nextPosition`, termasuk pindah surah dan konfirmasi mulai ulang setelah An-Nas.
- Ringkasan Target hanya menghitung versi DAILY aktif. Persentase jumlah tercapai dibagi jumlah yang berlaku. Preview tiga berdasarkan urutan stabil, target berjalan dahulu lalu tercapai. Bar berhenti pada 100%, nilai apa adanya.
- Grafik memiliki skala 0–5. Hari tanpa catatan memakai tanda garis, EXEMPT penuh memakai N/A, dan tanda seru membedakan MISSED eksplisit. Hari yang menyelesaikan semua slot yang berlaku ditandai walaupun kurang dari lima shalat.
- Feed membatasi lima kandidat per sumber sebelum menggabungkan dan mengambil lima terakhir. Urut tanggal aktivitas, timestamp simpan jika tersedia, lalu kategori dan ID. Timestamp simpan hanya untuk urutan. Waktu tampilan hanya dari `prayer_time` Sunnah yang diisi. Koleksi Dzikir tampil sebagai parent, sementara anak koleksi dan draft tidak masuk feed.

## Refresh dan performa

Hook Beranda mempertahankan snapshot valid untuk profil dan tanggal yang sama saat refresh. Profil atau tanggal baru memakai snapshot sendiri. Refresh dipicu fokus, resume, rollover, dan invalidasi dari tracker/Target. Pembaruan avatar dan sapaan berasal dari profil Zustand. Penyimpanan kota memicu invalidasi bersama lintas layar. Tick jadwal hanya mengubah kontrol hero dan tidak membaca transaksi SQLite setiap detik.

## Tampilan dan pengujian

Pada ukuran biasa ringkasan memakai grid 2 × 2 dan grafik bar vertikal. Pada layar sempit atau font aksesibilitas, grid disusun satu kolom dan grafik diganti daftar data yang terbaca. Ringkasan Target memakai bar native sebagai padanan ring atas sesuai brief. Pemeriksaan visual dan alur pada perangkat dicatat di [Checklist](UAT_CHECKLIST.md).

**PHASE 08 DEVELOPMENT COMPLETE - READY FOR PRODUCT OWNER TESTING.** TypeScript, lint, Expo Doctor 20/20, tes SQLite dan API, ekspor Android/iOS, serta pemeriksaan bundel rilis Dzikir lulus. Tes SQLite memakai profil terisolasi dan memblokir fetch untuk verifikasi agregasi offline. Uji visual, interaksi, tema dan alur jaringan di perangkat fisik masih dijadwalkan.
