# Audit hak layanan Islam Phase 06B

[Situs MyQuran](https://api.myquran.com/) menjelaskan API gratis dan penggunaan data untuk aplikasi. Belum ditemukan izin eksplisit yang menutup seluruh syarat Hijra untuk komersial, kedua toko aplikasi, penyimpanan sementara yang dapat dipakai ulang, cache SQLite, redistribusi offline, dan bundling.

| Fitur | Pemilik atau sumber yang perlu diverifikasi | Live rilis | Cache dan bundling |
| --- | --- | --- | --- |
| Jadwal dan kota | MyQuran dan Bimas Islam Kemenag RI | Belum terverifikasi | Belum terverifikasi |
| Kalender | MyQuran, metode standar | Belum terverifikasi | Belum terverifikasi |
| Hadis | MyQuran dan [HadeethEnc](https://hadeethenc.com/en), termasuk ketentuan versi, atribusi dan integritas teks terjemahan | Belum terverifikasi | Belum terverifikasi |
| Doa | MyQuran v2 dan pemegang hak tiap koleksi atau terjemahan | Belum terverifikasi | Belum terverifikasi |
| Asmaul Husna | MyQuran v3 dan pemegang hak Latin serta arti Indonesia | Belum terverifikasi | Belum terverifikasi |

Mode pengembangan menjalankan uji live yang diizinkan oleh akses publik penyedia. Build rilis menampilkan status fitur dan memblokir permintaan sebelum fetch. Tidak ada cache payload atau dataset baru. Lokasi manual/gawai dihitung lokal. Fase ini tidak mengubah status review Dzikir yang sudah tercatat.
