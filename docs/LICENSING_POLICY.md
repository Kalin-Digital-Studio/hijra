# Kebijakan lisensi Hijrah Apps

Kebijakan ini berlaku untuk Phase 01 dan semua fase berikutnya. Semua pustaka, framework, dependensi, paket, font, ikon, gambar, ilustrasi, animasi, audio, dataset, dan aset pihak ketiga harus dapat digunakan secara gratis dan komersial, boleh didistribusikan melalui Google Play Store dan Apple App Store, dan boleh dimodifikasi jika dibutuhkan. Syaratnya harus jelas, dapat diverifikasi, dan bebas dari kewajiban berlangganan, royalti, dan biaya lisensi berulang.

## Pemilihan komponen

- Utamakan MIT, Apache License 2.0, BSD 2-Clause, BSD 3-Clause, ISC, SIL Open Font License, serta CC0 atau public domain yang statusnya dapat dibuktikan.
- CC BY boleh dipakai jika seluruh kewajiban atribusi dapat dipenuhi. Catat pencipta, sumber, versi lisensi, dan perubahan jika diwajibkan.
- GPL, AGPL, LGPL, lisensi proprietary, source-available, dan lisensi terbatas lain memerlukan persetujuan eksplisit Product Owner sebelum digunakan. Simpan rujukan persetujuannya di inventaris.
- Komponen terlarang meliputi UI library berbayar, paket ikon premium, font berlisensi berbayar, trial library, aset ber-watermark, komponen non-komersial, konten bajakan atau tanpa izin, aset dengan lisensi yang tidak jelas atau tidak terverifikasi, layanan dengan langganan berbayar wajib, serta komponen yang memerlukan license key.
- Utamakan `lucide-react-native` setelah verifikasi ketentuan resmi, notice ikon, serta kompatibilitas dengan Expo SDK dan Expo Go yang digunakan.

## Prosedur verifikasi

1. Sebelum instalasi atau impor, periksa versi yang akan digunakan dan sumber resmi. Untuk paket, resolusikan versi langsung dan transitif tanpa instalasi. Untuk aset, identifikasi pembuat, sumber asli, dan cakupan lisensinya.
2. Konfirmasi hak penggunaan komersial, modifikasi yang diperlukan, dan redistribusi lewat kedua toko aplikasi. Periksa lisensi yang berlaku untuk versi tersebut dan kewajiban pada berkas atau aset di dalamnya, termasuk atribusi dan notice. Verifikasi kompatibilitas Expo untuk dependensi dan peer dependencies yang digunakan.
3. Catat setiap komponen di [inventaris](THIRD_PARTY_LICENSES.md). Jika ketentuan tidak jelas atau tidak sesuai, pilih alternatif yang patuh. Selesaikan konflik sebelum menandai implementasi selesai.
4. Ikat hasil audit dengan lockfile dan versi aset yang didistribusikan. Tinjau kembali setiap penambahan, penghapusan, atau perubahan versi. Sertakan teks lisensi, copyright, NOTICE, dan atribusi yang diwajibkan di aplikasi terdistribusi. Sediakan akses offline melalui **Profil > Tentang Aplikasi > Lisensi Pihak Ketiga**.

## Konten Islam

Pada fase yang relevan, verifikasi hak penggunaan komersial dan redistribusi serta autentisitas teks Arab Al-Qur’an, terjemahan Al-Qur’an, tafsir, audio tilawah, kumpulan dan terjemahan hadits, audio adzan, kumpulan doa dan dzikir, serta API dan dataset jadwal shalat. Catat edisi, penerbit atau pemegang hak, dan sumber yang dipakai untuk validasi konten. Akses publik tidak membuktikan izin redistribusi.

## Kriteria penerimaan

- [ ] Semua lisensi dependensi langsung dan transitif ditinjau.
- [ ] Semua ikon, font, dan aset eksternal memiliki lisensi yang terverifikasi.
- [ ] Tidak ada komponen berbayar atau terbatas yang dipakai tanpa persetujuan yang diwajibkan.
- [ ] Hak penggunaan komersial dan redistribusi telah diverifikasi.
- [ ] Teks lisensi, copyright, NOTICE, dan atribusi yang diwajibkan dipertahankan.
- [ ] Dokumen kebijakan dan inventaris lengkap serta sesuai versi yang digunakan.
- [ ] Informasi lisensi pihak ketiga dapat dibuka dari aplikasi saat offline.
