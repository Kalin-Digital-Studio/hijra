# Target Ibadah · Phase 07

Target adalah alat perencanaan pribadi yang membaca hasil tracker lokal. Dalam tab **Target**, pilih Harian, Mingguan atau Bulanan. Tambahkan target dengan kategori, metrik, aktivitas, nama opsional dan jumlah. Catatan lama dari periode yang sedang berjalan langsung dihitung. Detail menunjukkan progres, rentang, jumlah yang tersisa, kontribusi, riwayat terbaru dan pintasan tracker.

- **Langkah Awal** mencakup shalat harian, lima ayat, dan istighfar 33 kali.
- **Membangun Konsistensi** mencakup shalat harian, Dhuha tiga hari per pekan, 20 ayat, Dzikir Pagi dan Dzikir Petang.
- **Terus Bertumbuh** mencakup shalat tepat waktu, Tahajud tiga sesi per pekan, 50 ayat, istighfar 100 kali, Dzikir Pagi dan Dzikir Petang.

Grup bersifat opsional. Pengguna dapat memilih sebagian atau seluruh target dan menyunting jumlah/periode sebelum review. Penyimpanan grup atomik dengan peringatan target ekuivalen. Nama boleh diubah tanpa mengubah identitas goal.

**Kelola Target** memuat target aktif, dijeda dan diarsip. Detail menampilkan perubahan yang dijadwalkan dan pembatalannya. **Riwayat Target** memuat periode selesai, termasuk milik target yang diarsipkan. Nama dan target historis berasal dari versi periode tersebut.

Rute stack `/goals/[view]` menerima `create`, `templates`, `detail`, `edit`, `history`, dan `manage`. Detail/edit memerlukan ID yang lolos validasi dan dimiliki profil. Android dan iOS memakai komponen Expo SDK 58 dan SQLite tanpa API baru. [Mesin perhitungan](GOAL_CALCULATION_ENGINE.md) · [Checklist perangkat](UAT_CHECKLIST.md).
