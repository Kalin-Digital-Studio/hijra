# Aturan kalkulasi Laporan

Rentang internal [awal, akhir). Pekan memakai preferensi awal pekan, bulan/tahun memakai kalender Gregorian. Rentang khusus 1–366 hari, mulai 1900 atau sesudahnya, berakhir paling lambat hari ini. Periode aktif dipotong pada awal hari berikutnya. Bucket harian untuk pekan, segmen pekan untuk bulan, dan bulanan untuk tahun. Rentang khusus memakai bucket harian hingga 14 hari, mingguan hingga 62, kemudian bulanan.

- **Wajib.** Cakupan berawal dari tanggal lokal pembuatan profil atau catatan Wajib yang lebih awal. Bila kedua bukti tanggal tidak tersedia, kapasitas laporan belum diketahui. Lima slot per hari dalam cakupan. EXEMPT mengurangi penyebut, absen tetap belum dicatat, dan MISSED hanya dari catatan eksplisit. Tepat waktu/berjamaah memakai YES dibagi seluruh COMPLETED. UNKNOWN dilaporkan terpisah. Hari lengkap mengharuskan setidaknya satu slot yang berlaku.
- **Sunnah.** Sesi, hari unik, aktivitas menurut ID, serta jumlah rakaat yang diketahui. Filter Rawatib memakai ID kanonis yang juga digunakan Target.
- **Quran.** `countAyat` menentukan hitungan inklusif dan alokasi lintas surah dibagi sesuai batas setiap surah. Durasi adalah menit tercatat per sesi. Saat difilter per surah, durasi tidak dialokasikan ke surah. Baris legacy yang rangkanya rusak dilaporkan terpisah. Skema saat ini tidak memiliki kolom total terpisah yang bisa dipakai untuk memulihkan hitungan baris rusak.
- **Dzikir.** Counter final memberi angka pengulangan, checklist memberi aktivitas. Parent koleksi `COMPLETE`/`INCOMPLETE` dihitung sendiri. Anak yang tersimpan dihitung sekali sebagai log individual, sementara draft diabaikan.
- **Target.** Periode tutup berada pada tanggal `end_exclusive − 1`. Periode terbuka yang beririsan ditampilkan terpisah. Pencapaian adalah jumlah tercapai dibagi periode selesai yang berlaku. Mesin Target membaca versi historis dan transaksi yang sudah dikoreksi.

Perbandingan memakai rentang sebelum periode yang dipilih. Kedua rentang dipotong ke jumlah hari bersama. Halaman menampilkan tanggal sesungguhnya, total, dan angka per hari untuk volume. Selisih persentase tingkat penyelesaian dinyatakan dalam poin persentase. Baseline nol menghasilkan selisih absolut dan label persentase relatif tidak tersedia.

Kalender memakai kategori terpisah. Wajib membedakan lengkap, parsial, terlewat, kosong, EXEMPT, di luar cakupan, dan mendatang. Ambang warna untuk Sunnah adalah 3 sesi, Quran 20 ayat, dan Dzikir 33 pengulangan. Simbol terpisah menandai Dzikir tanpa pengulangan. Angka berbeda per kategori menggambarkan aktivitas tersimpan.
