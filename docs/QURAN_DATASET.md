# Dataset metadata Al-Qur’an

Phase 05 memakai **Tanzil Quran Metadata v1.0**, diambil 25 November 2026. Katalog berisi 114 surah dengan nomor, nama Latin, nama Arab, dan jumlah ayat. Makna nama Indonesia dan Inggris ditunda hingga Release 2. Antarmuka tracker tetap tersedia dalam kedua bahasa.

## Sumber dan lisensi

- [Dokumentasi Tanzil](https://tanzil.net/docs/Quran_Metadata) menunjuk ke [quran-data.xml](https://tanzil.net/res/text/metadata/quran-data.xml). Root artefak resmi menyatakan `type="metadata" version="1.0" copyright="(C) 2008-2009 Tanzil.info" license="cc-by"`. Label berkas adalah CC BY tanpa nomor versi. Notice Hijra merujuk ke [CC BY 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode), versi lisensi CC BY sezaman yang didokumentasikan Tanzil. Bukti izin untuk data ini adalah deklarasi dalam XML metadata.
- CC BY memberikan izin penggunaan komersial, penggandaan, distribusi offline, dan konversi format dengan atribusi. Atribusi menyebut Tanzil.info, copyright, tautan sumber dan lisensi, serta perubahan format. Tersedia offline di **Profil → Tentang Aplikasi → Lisensi Pihak Ketiga → Tanzil Quran Metadata**.
- Konversi mengambil `index`, `tname`, `name`, dan `ayas` dari setiap elemen `sura`, mempertahankan nilainya, serta membuang kolom lain. JSON UTF-8 diimpor ke SQLite melalui migrasi transaksional v7. Aplikasi memakai file lokal saat instalasi dan upgrade.
- `quran-meta` v7.0.0 dievaluasi. [Lisensi kode MIT](https://github.com/quran-center/quran-meta/blob/3b7afc7f8c905da3d8fb3e8725f86805bd76b2bd/LICENSE) mencakup perangkat lunak. [Dokumentasi data](https://quran-center.github.io/quran-meta/docs/) mencantumkan beberapa sumber upstream. Metadata npm menyatakan Node >=22 dan tidak mencantumkan dependensi runtime. Node workspace v24.22.1 memenuhi syarat pengembangan. Paket tidak dipasang. Kompatibilitas runtime Expo dan React Native tidak diperlukan untuk data JSON yang diambil langsung dari Tanzil.

## Validasi dan SHA-256

| Artefak | SHA-256 |
| --- | --- |
| XML resmi Tanzil | `8867c1d88191472adec9db694b3cd9f135b1a2ef580574d32cf888dcb22c5c7a` |
| [JSON dalam aplikasi](../assets/data/quran/tanzil-surahs.json) | `f68bf6abb0525f6fe7f1e332a2ab21500bee93e9409fcfaef5aa4612d732255f` |
| Referensi King Fahd Quran Complex Hafs v2.0, [salinan audit yang dipin](https://github.com/quran-center/quran-meta/blob/3b7afc7f8c905da3d8fb3e8725f86805bd76b2bd/examples/data-check/data/hafsData_v2-0.json) | `d2960b3217962e7e4252abdcece67bea3d6b48271e4cd3af45bbbb2dd5c872ca` |

Jumlah ayat masing-masing dari 114 surah Tanzil cocok dengan urutan ayat dalam referensi [King Fahd Quran Complex](https://qurancomplex.gov.sa/en/techquran/dev/). Validasi juga memeriksa nomor 1–114 berurutan dan unik, nama Latin dan Arab terisi, jumlah ayat positif, dan offset kumulatif. Totalnya 6.236 ayat bernomor dalam konvensi Hafs/Kufah. Bismillah tanpa nomor tidak dihitung. Referensi King Fahd hanya digunakan untuk validasi dan tidak ikut dibundel. Tes database memeriksa checksum JSON serta hasil impor SQLite.

## Teks digital · Tanzil Uthmani v1.1

[Artefak resmi bernomor](https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&agree=true) diambil 25 November 2026 dari [Tanzil](https://tanzil.net/download/). Header unduhan menyebut **Copyright (C) 2007–2026 Tanzil Project** dan **Creative Commons Attribution 3.0**. [Ketentuan resmi Tanzil](https://tanzil.net/docs/Text_License) memberikan izin untuk menyalin dan mendistribusikan verbatim serta menggunakan dalam aplikasi, termasuk aplikasi komersial, dengan atribusi, tautan dan preservasi notice. Syarat Tanzil melarang perubahan terhadap teks. Notice aplikasi diambil langsung dari header artefak, dan tautan Tanzil dapat dibuka melalui modul.

| Artefak | SHA-256 |
| --- | --- |
| Unduhan asli | `bf4f57b968d03f4131c070b1e285da9be0e0a108a21c910e872801ca273312c8` |
| [Pembungkus JSON](../assets/data/quran/tanzil-uthmani.json) | `f8ddeb66df064d38579d37ecbae1ddd833ff5088b595f2329e8b77d7b1864f51` |

Properti `raw` di JSON mereproduksi byte UTF-8 unduhan secara persis, termasuk notice. Importer hanya memisahkan kolom nomor surah, nomor ayat, dan teks. Tes membandingkan hasil baca ulang dari SQLite dengan seluruh 6.236 baris bernomor dari sumber. Hash, urutan, jumlah dan setiap string ayat cocok. Bismillah Al-Fatihah adalah ayat 1. Bismillah pengantar yang menjadi awalan ayat 1 dalam format sumber dipertahankan tanpa baris bernomor tambahan. At-Tawbah mengikuti sumber tanpa pengantar. UI memakai font sistem. Pemeriksaan bentuk glyph dan pemenggalan pada perangkat Android/iOS masih pending.

### Reader dan terjemahan tambahan · 28 November 2026

Reader memakai 114 surah Tanzil Metadata dan 6.236 ayat Tanzil Uthmani v1.1 persis dari SQLite, dengan font Arab bawaan sistem. Pengantar Basmalah, harakat, waqf dan sajdah mengikuti teks sumber. Terjemahan Indonesia MyQuran ditampilkan terpisah pada pengembangan. Latin per ayat dan terjemahan Inggris belum tersedia dari respons terverifikasi. [Pemetaan dan endpoint](MYQURAN_INTEGRATION.md).


### Audit waqf dan sajdah

Artefak produksi sekarang adalah [Tanzil Uthmani v1.1 dengan marks=true dan sajdah=true](https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&agree=true&marks=true&sajdah=true). SHA-256 unduhan: `18c719bb3ba26d32ef457f40dad77cd28c4c5a34156833e26a8e5fcfdd246fb1`. SHA-256 pembungkus JSON (LF): `83bd39308e0424dcb00f6afa5fefff24136bd58a48f0c36b2762c766ce8e9776`. Angka hash di atas bagian ini merujuk pada impor awal. Notice rilis tetap dipertahankan sesuai [ketentuan Tanzil](https://tanzil.net/docs/Text_License).

| Ayat | Impor awal | Tanzil dengan tanda, diverifikasi di SQLite |
| --- | --- | --- |
| 2:2 | Kosong | U+06DB dua kali |
| 2:45 | Kosong | U+06DA |
| 16:17 | Kosong | U+06D7 |
| 16:21 | Kosong | U+06D6 |
| 16:57 | Kosong | U+06D9 |
| 36:76 | Kosong | U+06D8 |

Frekuensi U+06D6–U+06DB berturut-turut 1.682, 603, 22, 68, 1.972 dan 12. Unduhan juga memiliki 5 saktah terpisah U+06DC dan 15 tanda sajdah U+06E9. Membandingkan 6.236 ayat verbatim, lalu mengabaikan hanya tanda baru dan spasi yang menyertainya pada salinan audit, menghasilkan urutan dan teks yang persis sama dengan impor awal. Kode produksi tidak menghapus atau menyisipkan tanda. Dataset sebelumnya tidak memuat tanda tersebut sejak sebelum impor. Reader memakai teks SQLite, bukan Arab MyQuran.

Reader tidak mengatur `fontFamily` dan tidak membundel font Arab. React Native memakai font sistem dan fallback perangkat sehingga nama dan file glyph aktual bergantung pada OS. Kode reader menetapkan rata kanan, RTL, dan line height 1,85 kali ukuran Arab. Pemeriksaan glyph, shaping, harakat dan clipping masih perlu Android/iOS fisik.

### Amiri Quran dan tampilan Basmalah

Reader memakai Amiri Quran Regular 1.003 setelah font dimuat. Artefak `AmiriQuran.ttf` berasal dari [rilis upstream 1.003](https://github.com/aliftype/amiri/releases/tag/1.003), disalin tanpa perubahan sebagai `assets/fonts/AmiriQuran-Regular.ttf`. SHA-256 font `e2a47644762d16bdfb6d33e0d8db8c6ff30beae84150ef5a705316bbd829455c`. Tabel Unicode cmap mencakup U+06D6–U+06DC, U+06E9, U+064B–U+0652, dan U+0670. Tampilan A/B dengan data SQLite tersedia di reader pengembangan untuk pemeriksaan di perangkat.

Artefak Tanzil dan SQLite tetap verbatim. Saat halaman menampilkan ayat 1, Reader memisahkan prefix Basmalah dengan batas spasi yang persis cocok. Tanzil memberi tasydid pada ba pembuka di surah 95 dan 97. Di keduanya, Reader menampilkan prefix asli itu. Al-Fatihah 1 sudah merupakan ayat bernomor. At-Tawbah tidak memiliki pengantar. An-Naml 30 tampil utuh, termasuk Basmalah yang merupakan bagian ayat. Pengantar tidak punya tindakan, ID, nomor, bookmark, atau hitungan.
