# Audit dataset Dzikir Phase 06

Diverifikasi 27 November 2026. [Hadith API](https://github.com/fawazahmed0/hadith-api) revisi `df57907be35291c91ad6a6691180e22ca9920784` menyediakan edisi Arab Sahih Muslim dan Sahih al-Bukhari. Aplikasi mengambil fragmen formula dari teks klasik berbahasa Arab. Setiap string diuji sebagai potongan yang sama dengan artefak tersebut. Tidak ada pengubahan diakritik. Teks sanad, komentar, terjemahan modern, dan edisi lengkap tidak dibundel. [Unlicense pada revisi sumber](https://github.com/fawazahmed0/hadith-api/blob/df57907be35291c91ad6a6691180e22ca9920784/LICENSE) memberi izin penyalinan, adaptasi, penggunaan komersial dan redistribusi atas hak yang dikuasai penerbitnya. Formula klasik yang dipakai di sini juga merupakan teks historis yang telah lama beredar. Notice lengkap dicatat melalui Lisensi Pihak Ketiga.

| Bacaan atau koleksi | Referensi dan kriteria |
| --- | --- |
| Tasbih, Tahmid, Takbir, Tahlil | [Sahih Muslim 2137a](https://sunnah.com/muslim:2137a) · artefak 5601. |
| Istighfar | [Sahih Muslim 484d](https://sunnah.com/muslim/4/250) · artefak 1088. Nilai 100 pada aktivitas harian adalah preset pribadi. |
| Shalawat Ibrahimiyah dan Hauqalah | [Al-Bukhari 6357](https://sunnah.com/bukhari:6357) dan [Al-Bukhari 6384](https://sunnah.com/bukhari:6384). |
| Dzikir Pagi dan Petang | [Sahih Muslim 2692](https://sunnah.com/muslim:2692) · artefak 6843. Masing-masing satu bacaan Tasbih dan Tahmid 100 kali. |
| Setelah shalat 33–33–34 | [Sahih Muslim 596a](https://sunnah.com/muslim:596a) · artefak 1349. Scope semua shalat wajib. |
| Setelah shalat 33–33–33 dengan penutup | [Sahih Muslim 597a](https://sunnah.com/muslim:597a) · artefak 1352. Penutup adalah langkah checklist wajib untuk status koleksi lengkap. |

Kedua pilihan setelah shalat memakai konteks umum atau salah satu dari lima shalat tanpa mengubah aturan baca. Katalog memilih riwayat di atas dan tidak menetapkan susunan yang lengkap atau kewajiban beribadah. Makna dan transliterasi opsional tetap NULL. Font Arab memakai font sistem seperti Quran Reader.

| Artefak | SHA-256 |
| --- | --- |
| editions/ara-muslim.json | `194073b24090c5368e4d14a3f55c9e0ef144c7437bd7e5aa83aa4d2bc54a8ea0` |
| editions/ara-bukhari.json | `e34a3402889ca378871da3c5984b7875c680920e93f1c8738ac7afe502179562` |
| [catalog.json](../assets/data/dhikr/catalog.json) | `42f453ee163f758b97473f967c20901084f627d2d3ebef4d849e207d73415738` |

Konversi menyimpan fragmen yang cocok persis dengan string sumber, ID dan label lokal, referensi, serta aturan hitung. Bahan uji teknis tidak dimasukkan dalam katalog produksi.

## Enhancement Phase 06 · Koleksi dan navigasi

| Koleksi | Bacaan dan cara mencatat |
| --- | --- |
| Pagi v2 | Doa pagi dari [Abu Dawud 5068](https://sunnah.com/abudawud:5068) sebagai checklist. Al-Ikhlas, Al-Falaq, dan An-Nas masing-masing 3 surah utuh dari [Abu Dawud 5082](https://sunnah.com/abudawud:5082). Sayyidul Istighfar dari [Al-Bukhari 6306](https://sunnah.com/bukhari:6306) sebagai checklist. Bismillahilladzi la yadhurru 3 kali dari [Abu Dawud 5088](https://sunnah.com/abudawud:5088). Tasbih dan Tahmid 100 kali dari [Muslim 2692](https://sunnah.com/muslim:2692). |
| Petang v2 | Susunan navigasi yang sama dengan doa petang dari [Abu Dawud 5068](https://sunnah.com/abudawud:5068). Bacaan lainnya memiliki rujukan dan cara mencatat yang sama dengan Pagi v2. |
| Setelah shalat · Istighfar dan doa salam v1 | Istighfar 3 kali dan Allahumma antas-salam sebagai checklist, keduanya dari [Muslim 591](https://sunnah.com/muslim:591). |
| Setelah shalat · 33–33–34 v1 | Tasbih 33, Tahmid 33, Takbir 34 dari [Muslim 596a](https://sunnah.com/muslim:596a). |
| Setelah shalat · 33–33–33 dengan penutup v1 | Tasbih 33, Tahmid 33, Takbir 33 dan Tahlil penutup sebagai checklist dari [Muslim 597a](https://sunnah.com/muslim:597a). |

Urutan layar adalah pilihan navigasi Hijra. Checklist adalah status pencatatan aplikasi. Ayat Kursi tersedia di Quran Reader. Pengaitan Ayat Kursi dengan slot koleksi dan kriteria repetisi ditunda menunggu verifikasi riwayat yang sesuai. Raditu billahi rabba versi pagi/petang juga ditunda. Abu Dawud 5072 yang ditinjau ditandai daif menurut Al-Albani pada [edisi rujukan](https://sunnah.com/abudawud:5072).

Teks Arab doa diambil sebagai kutipan persis dari Hadith API pada commit yang sama dengan audit awal. ID artefak yang diperiksa adalah Al-Bukhari 6306, Muslim 1334, Abu Dawud 5068 dan 5088. Berkas Arab Abu Dawud dari [artefak terpin](https://raw.githubusercontent.com/fawazahmed0/hadith-api/df57907be35291c91ad6a6691180e22ca9920784/editions/ara-abudawud.json) memiliki SHA-256 `216139c5f40a8147e700d62ffa3b5b2fe45d0e034f86941a193c598c10056189`. Artefak lokal [expansion-v2.json](../assets/data/dhikr/expansion-v2.json) memiliki SHA-256 `0c2cead6487a6fec218f96a379048e14a24fe8c8abeca15750c7f643c7512485`. Untuk doa, audit membatasi penggunaan pada formula Arab klasik dan mempertahankan notice Unlicense edisi sumber. Terjemahan modern, sanad lengkap, dan basis data hadits lengkap tidak ikut dibundel.

Tiga surah dibaca dari tabel `quran_verses` yang sudah ada. Migrasi memisahkan ayat dengan baris baru dan mempertahankan setiap string ayat, termasuk harakat, tanda waqf, dan Basmalah yang sudah tertanam pada ayat pertama. Aplikasi menampilkan tautan Tanzil, memakai ukuran font yang tersimpan untuk Quran Reader dan tidak menulis log Quran dari kegiatan Dzikir. [Ketentuan Tanzil](https://tanzil.net/docs/Text_License).

## Enhancement Phase 06 · Pembaca Dzikir untuk pemula

Katalog memuat 18 bacaan Arab unik. Pembaca baru memakai tiga terjemahan Inggris domain publik untuk surah 112–114 dari [cetakan Pickthall 1930](https://archive.org/details/in.ernet.dli.2015.216140), hlm. 676–678. SHA-256 PDF `a73f81fa8c4161c9e2b605279d1d261eb374c696226bbdf59d2fb38912fa1f05`. SHA-256 JSON `7b6fb381e67faa6db105b5782e6d8bf4dd5bd83e7ce3836391d7af9a059f3e64`. Pemisahan mencakup Basmalah dan teks ayat bernomor. Pengantar dan catatan kaki edisi tidak dibundel. Penggunaan komersial dan distribusi offline berlaku untuk teks asli domain publik. Edisi terbit 1930 dan penerjemah wafat 1936. [Bukti edisi dan status domain publik](https://commons.wikimedia.org/wiki/File:The_Meaning_of_the_Glorious_Koran_(1930).pdf). Latin dan arti Indonesia belum lolos review. Ketentuan QuranEnc mensyaratkan teks dipertahankan dan versi diperbarui. Hak distribusi kutipan yang dibutuhkan belum dipastikan, sehingga sumber itu tidak digunakan. [Matriks review](DHIKR_CONTENT_REVIEW.md).

## Draf bantuan bacaan · preview internal

Draf Latin dan arti Indonesia untuk 18 bacaan, serta 11 draf Inggris, berada di `assets/data/dhikr/review-drafts.dev.json`. SHA-256 LF adalah `c1e0a7073110bc743e0d03a64a5cd709e567b5ce93b7997701932c6b0ac21222`. Pencocokan memakai ID, string Arab persis dan referensi. Draf otomatis muncul pada Expo Go dalam mode pengembangan, mengikuti dua pengaturan yang sama, dan diberi label Konten dalam review. Draf tidak diimpor ke SQLite. Bundle rilis hanya menyertakan modul kosong untuk sumber draf dan tetap menampilkan arti Pickthall yang sudah diaudit. Gunakan `npm run export:release` untuk ekspor dengan pemeriksaan isi bundle serta source maps. [Matriks dan lafaz untuk review](DHIKR_CONTENT_REVIEW.md).
