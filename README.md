# Hijrah Apps

Hijrah adalah aplikasi Islamic Lifestyle dengan data lokal. Phase 01 menyediakan fondasi Expo, navigasi, katalog master ibadah, serta pengaturan bahasa dan tema.

## Menjalankan dengan Expo Go

1. Siapkan Node.js 24 LTS versi 24.3 atau lebih tinggi, npm, dan Expo Go yang kompatibel dengan [Expo SDK 58](https://expo.dev/go) pada perangkat Android atau iOS. Jika Expo Go meminta sesi Expo, ikuti instruksinya. Hijrah sendiri tidak memiliki akun.
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
npx expo install --fix
npm exec -- expo export --platform android --platform ios --source-maps external --dump-assetmap --output-dir dist
```

## Memperbarui bukti lisensi

Sebelum menginstal perubahan lockfile, jalankan `npm run audit:licenses` dan `node scripts/review-upstream-notices.mjs`. Perintah ini mengambil tarball resmi, memeriksa integritasnya, dan mengumpulkan bukti di `.expo/license-review`. Tinjau hak, notice, dan perubahan dependensi sesuai [kebijakan lisensi](docs/LICENSING_POLICY.md).

Setelah audit diselesaikan, instal dependensi, lakukan export dengan source map dan asset map, jalankan `node scripts/build-license-inventory.mjs dist`, lalu export kembali agar bundle memuat daftar notice terbaru.

