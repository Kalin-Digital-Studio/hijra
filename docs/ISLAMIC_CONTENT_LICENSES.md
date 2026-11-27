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

## Terjemahan Al-Qur’an dalam Reader

[Situs MyQuran](https://api.myquran.com/) menyatakan API gratis, sementara [kontrak Quran](https://api.myquran.com/v3/doc) menyediakan terjemahan Indonesia tanpa ketentuan hak yang cukup untuk produksi Hijra. Pemegang hak dan edisi terjemahan perlu dikonfirmasi bersama izin penggunaan komersial, tampilan dalam aplikasi, cache persisten, redistribusi offline, serta bundling. Nama `kemenag` di tafsir bukan bukti lisensi atau edisi terjemahan. Resource Quran mengikuti gate pengembangan yang sudah ada, dengan cache persisten dan bundling dinonaktifkan. Belum ada sumber Latin ayat atau terjemahan Inggris yang diverifikasi.


### Kandidat Latin Quran

[LPMQ Kemenag](https://quran-api.lpmqkemenag.id/) menawarkan transliterasi resmi Mushaf Standar Indonesia melalui pengajuan akun dan token. [Pedoman resmi LPMQ](https://quran.kemenag.go.id/assets/files/Juz-Amma-Metode-Tilawah.pdf) mendokumentasikan sistem Arab–Latin Indonesia. Kandidat utama ini masih memerlukan konfirmasi pemetaan/kelengkapan serta izin komersial, akses live dan redistribusi atau cache bila diperlukan. [Tanzil English Transliteration](https://tanzil.net/trans/) memakai skema bahasa Inggris dan halaman penyedia membatasi penggunaan komersial tanpa izin pemegang hak. CC BY 3.0 teks Arab tidak mencakup daftar transliterasi. Belum ada provider Latin yang dipasang.

### Audit kandidat Latin id-skb

[Manifest quran-json](https://quran-json.risanb.com/transliteration/index.json) menyatakan `id-skb` hasil generasi berbasis aturan dari teks Arab Mushaf Standar Indonesia dengan konvensi SKB 1987, Hafs, dan lisensi CC BY-SA 4.0. Payload memakai `chapter.id`, `verse.id` dan `transliteration`. Audit live memeriksa semua 114 ID surah dan 6.236 pasangan ID ayat, tanpa duplikasi atau teks Latin kosong. Sampel Al-Fatihah 1–2, Al-Baqarah 1–2, At-Tawbah 1, An-Naml 30, At-Tin 1, Al-Qadr 1 dan An-Nas 6 sesuai posisi yang diharapkan. Ini pemeriksaan struktur dan sampel, bukan penilaian fasih/tajwid. Penyedia menyatakan belum ditinjau pembaca Al-Qur’an yang berkualifikasi.

[PMA 44/2016 Pasal 8](https://jdih.kemenag.go.id/regulation-download/penerbitan-pentashihan-dan-peredaran-mushaf-al-qur%27an) membedakan teks mushaf dari khat dan anotasi penerbit. Deklarasi penyedia mendasari evaluasi, tetapi provenance edisi tepat dan hak anotasi yang dipakai dalam konversi masih perlu dikonfirmasi. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) mensyaratkan atribusi, tautan lisensi, penandaan perubahan, dan lisensi yang sama atau kompatibel atas adaptasi yang didistribusikan, serta tanpa pembatas tambahan terhadap hak itu. Sebelum aktivasi diperlukan persetujuan Product Owner, verifikasi hak sumber, dan review ahli untuk SKB, harakat, tajwid, waqf dan batas ayat. Tidak disimpan atau didistribusikan oleh Hijra. API LPMQ resmi tetap kandidat utama untuk konten yang telah ditinjau.
