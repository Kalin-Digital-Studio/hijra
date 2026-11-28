# Laporan Ibadah · Phase 09

Tab **Laporan** mulai dari pekan berjalan sesuai preferensi awal pekan. Pilih periode, geser ke periode lain, atau masukkan rentang khusus. Detail membawa parameter rentang yang tervalidasi. Kembali dari detail mempertahankan pilihan di tab. Kalender membuka bulan dari pilihan laporan dengan navigasi bulan tersendiri.

Tampilan mengikuti urutan brief. Ringkasan Wajib memakai bar native sebagai padanan ring. Tren menggunakan bar horizontal berlabel yang sesuai untuk tanggal panjang. Kartu ringkasan menjadi satu kolom pada lebar sempit atau font besar. Kisi kalender menyediakan scroll horizontal untuk target sentuh 48 dp. Perbedaan status dilabeli selain melalui warna.

Repositori memuat rentang terpilih dan pembanding dengan query tanggal terindeks serta satu pembacaan per sumber utama. Pemuatan Kalender membatasi query ke bulan terpilih. Filter detail, tren, dan tanggal kalender memakai data yang sudah dibaca. Tidak ada backend atau salinan summary dalam database. `useReports` memuat ulang saat fokus, tanggal lokal, awal pekan, profil, dan revisi tracker/Target berubah. Respons usang diabaikan bila request dibatalkan oleh perpindahan fokus atau revisi lebih baru.

[Aturan kalkulasi](REPORT_CALCULATION_RULES.md) · [Checklist perangkat](UAT_CHECKLIST.md).

**PHASE 09 DEVELOPMENT COMPLETE - READY FOR PRODUCT OWNER TESTING.** TypeScript, lint, Expo Doctor 20/20, tes SQLite dan API, bundel Android/iOS, dan pemeriksaan rilis Dzikir lulus. Agregasi diuji dengan fetch diblokir. Tes kalender dan rentang juga dijalankan dalam zona America/New_York. Pemeriksaan visual, tema, alur sentuh, dan mode pesawat pada perangkat masih terbuka.


## Phase 09A · Penyempurnaan tampilan

Refinement menggunakan hasil agregasi yang sama. Periode dan kalender mempertahankan rute, validasi dan batas tanggal. Ringkasan Wajib sekarang menggunakan cincin Forest Green dan menampilkan cakupan hari. Total slot yang diharapkan tetap tersedia pada detail Wajib. Semua tren dan perbandingan menggunakan bar native, dengan status N/A serta penyebut nol tetap dijelaskan. Pencarian kode layar, root layout dan komponen sekitar tidak menemukan gear melayang milik aplikasi. Atribusi ikon pada screenshot belum dapat dipastikan karena lampiran brief hanya memuat teks dan perangkat Android tidak tersedia di workspace.
