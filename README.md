# Hijra

Hijra dari Kalin Digital Studio adalah aplikasi Islamic Lifestyle dengan data lokal. Phase 01 menyediakan fondasi Expo dan katalog master ibadah. Phase 02 menambah onboarding bilingual, profil lokal, foto profil, dan pilihan awal pekan.

## Menjalankan dengan Expo Go

1. Siapkan Node.js 24 LTS versi 24.3 atau lebih tinggi, npm, dan Expo Go yang kompatibel dengan [Expo SDK 58](https://expo.dev/go) pada perangkat Android atau iOS. Jika Expo Go meminta sesi Expo, ikuti instruksinya. Hijra sendiri tidak memiliki akun.
2. Dari root repositori, jalankan `npm ci --ignore-scripts`.
3. Hubungkan komputer dan perangkat ke Wi-Fi yang sama, lalu jalankan `npm start -- --go --lan --clear`. Opsi `--clear` menyegarkan cache Metro.
4. Pindai QR dengan Expo Go di Android atau Kamera di iOS. Jika koneksi gagal, periksa apakah perangkat dapat menjangkau komputer dan firewall mengizinkan port Metro, biasanya 8081.
5. Ikuti [langkah UAT](docs/UAT_CHECKLIST.md) pada kedua platform.

Proyek menggunakan Expo SDK 58. Untuk menguji persistensi setelah upgrade, gunakan perangkat, instalasi Expo Go, dan alamat Metro yang sama dengan sesi sebelumnya. Pertahankan data aplikasi Expo Go. Konfigurasi Phase 01 menggunakan LAN untuk pengujian perangkat. Tunnel WebContainer dari Expo CLI digantikan oleh modul lokal LAN-only. Detailnya tersedia pada [inventaris lisensi](docs/THIRD_PARTY_LICENSES.md).

## Pemeriksaan pengembangan

```sh
npm run test:database
npm run typecheck
npm run lint
npx expo-doctor
npm exec -- expo install --check
npm exec -- expo export --platform android --platform ios --source-maps external --dump-assetmap --output-dir dist
```

## Memperbarui bukti lisensi

Sebelum menginstal perubahan lockfile, jalankan `npm run audit:licenses` dan `node scripts/review-upstream-notices.mjs`. Perintah ini mengambil tarball resmi, memeriksa integritasnya, dan mengumpulkan bukti di `.expo/license-review`. Tinjau hak, notice, dan perubahan dependensi sesuai [kebijakan lisensi](docs/LICENSING_POLICY.md).

Setelah audit diselesaikan, instal dependensi, lakukan export dengan source map dan asset map, jalankan `node scripts/build-license-inventory.mjs dist`, lalu export kembali agar bundle memuat daftar notice terbaru.

## Phase 03 · Shalat Wajib
Buka **Ibadah → Shalat Wajib** atau kartu shalat hari ini di Beranda. Perubahan status dan atribut langsung disimpan. Buka **Riwayat Shalat** untuk melihat ringkasan, matriks, dan grafik pekanan. Profil, catatan, dan riwayat berada di perangkat.

## Phase 04 · Shalat Sunnah

Dari **Ibadah → Shalat Sunnah**, pilih tanggal lalu centang aktivitas untuk menyimpan satu sesi. Buka detail untuk menambah sesi atau mengisi rakaat, jam, dan catatan. **Kelola Aktivitas** mengatur daftar aktif, urutan, rakaat default, dan aktivitas pribadi. **Riwayat** menampilkan jumlah sesi pekanan dan rincian per aktivitas. Beranda menampilkan ringkasan hari ini.

## Phase 05 · Tracker bacaan Al-Qur’an

an**’an** atau kartu Al-Qur’an di Beranda pada Expo Go. Tracker menampilkan status katalog pada build ini. Pencatatan, riwayat, dan penanda bacaan membutuhkan 114 metadata surah dengan lisensi dan akurasi terverifikasi. Jalankan `npm run test:database` untuk verifikasi migrasi dan perhitungan menggunakan fixture. Lihat [audit dataset](docs/QURAN_DATASET.md).

## Digital Quran Reader

Dari **Ibadah → Al-Qur’an**, pilih surah dan baca teks Arab offline. Gunakan **Mulai Membaca** atau **Lompat ke Ayat** untuk memilih posisi. Pilih **Selesai membaca sampai ayat …**, periksa jumlah ayat, lalu simpan. **Lanjutkan Membaca** di Beranda membuka ayat sesudah penanda. Riwayat dan catatan manual tersedia di layar Al-Qur’an.
