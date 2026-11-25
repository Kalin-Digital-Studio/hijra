# Brief implementasi Phase 02

Implementasikan onboarding dan satu profil lokal pada Hijra setelah Phase 01 disetujui. Pertahankan Expo SDK 58, identitas teknis aplikasi, database `hijrah.db`, katalog, navigasi, dan preferensi yang sudah ada.

- Ubah branding tampilan menjadi Hijra dan cantumkan Kalin Digital Studio. Gunakan splash native Forest Green dengan logo lokal.
- Buat tiga slide swipe bilingual dengan Skip, Back, Next, Get Started, dan indikator halaman. Pilihan bahasa persisten tersedia di Profil. Ketika diputar ulang, kembali ke Profil tanpa menyimpan ulang onboarding.
- Gunakan migrasi aditif dan satu transaksi untuk profil, preferensi, dan completion. Akses layar utama hanya setelah state SQLite valid. Tangani kegagalan dan beberapa profil lama tanpa menghapus data.
- Sediakan setup, edit, foto lokal persisten, dashboard dengan nama panggilan, dan tujuh pilihan awal pekan. Data profil tetap di perangkat dan avatar yang lama dibersihkan setelah referensi baru tersimpan.
- Ikuti kebijakan lisensi proyek. Verifikasi paket terhadap SDK yang terpasang, sertakan notice dalam aplikasi, dan tandai status aset sementara.
- Jalankan pemeriksaan database, TypeScript, lint, Expo Doctor, kesesuaian paket, dan kedua bundle. Dokumentasikan UAT perangkat, verifikasi splash native, dan status persetujuan aset. Phase 03 menunggu persetujuan Product Owner.
