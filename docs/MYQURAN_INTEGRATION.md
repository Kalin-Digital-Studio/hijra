# Integrasi MyQuran Phase 06B

Kontrak diuji langsung pada 27 November 2026 terhadap [OpenAPI v3](https://api.myquran.com/v3/doc/apimuslim) dan [OpenAPI v2](https://api.myquran.com/v2/doc/apimuslim). Semua permintaan menggunakan HTTPS. Klien membatasi permintaan ke ambang 8 detik, membatalkan permintaan usang, menggabungkan permintaan yang sama, dan dapat mengulang sekali untuk 500/502/503/504. HTTP 429 menghentikan permintaan baru hingga Retry-After. Kuota produksi belum dikonfirmasi.

| Layanan | Endpoint | Kontrak yang diperiksa |
| --- | --- | --- |
| Kota | `/v3/sholat/kabkota/cari/{keyword}` | Array ID string dan lokasi. Hasil Kediri membedakan KOTA dan KAB. Pengguna memilih WIB/WITA/WIT secara eksplisit karena respons tidak menyertakan zona. |
| Jadwal | `/v3/sholat/jadwal/{id}/{YYYY-MM}` | `data.id` dan `data.jadwal` berisi map tanggal. Provider mengatribusikan Bimas Islam Kementerian Agama RI. Uji Kediri November menghasilkan 30 baris. |
| Hijriah | `/v3/cal/hijr/{YYYY-MM-DD}` | `ce`, `hijr`, dan `method`; tanggal Masehi dibandingkan dengan permintaan. Metode live standar tanpa penyesuaian. Grid lokal memakai kalender sipil tabular dan diberi label terpisah. |
| Hadis | `/v3/hadis/enc/explore?page=N`, `/v3/hadis/enc/cari/{keyword}?page=N`, `/v3/hadis/enc/show/{id}` | HadeethEnc versi yang diobservasi 1.21.0. Daftar halaman dan detail berjalan. Pencarian minimal empat karakter. Label grade dan takhrij berasal dari detail penyedia. Al-Arba’in diuji melalui /v3/hadis/arbain dengan 42 entri. Browse per kategori HadeethEnc belum tersedia. |
| Doa | `/v2/doa/all`, `/v2/doa/sumber`, `/v2/doa/{id}` | 108 bacaan dan 7 sumber saat diuji. Nomor kandidat dari daftar diverifikasi dengan judul dan teks Arab endpoint detail sebelum bisa difavoritkan. Sumber Latin/makna yang kosong dibiarkan kosong. |
| Asmaul Husna | `/v3/husna` | Daftar 99 entri dengan nomor unik berurutan, Arab, Latin, dan arti Indonesia. |

Request aplikasi hanya berisi kode kota, tanggal, kata kunci publik, nomor halaman, atau identitas konten. Koordinat GPS, profil, riwayat, dan isi database tidak dikirim. Payload hanya dipakai untuk tampilan aktif dalam mode pengembangan. Favorit menyimpan identitas dan edisi di SQLite. [Status hak](ISLAMIC_CONTENT_LICENSES.md).
