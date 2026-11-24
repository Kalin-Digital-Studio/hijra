# Arsitektur Phase 01

- `app/` memuat route Expo Router, lima Expo Tabs, detail kategori, Tentang Aplikasi, dan Lisensi Pihak Ketiga.
- `src/components/` dan `src/theme/` memuat komponen UI bersama dan design tokens. `src/features/` memuat layar fitur.
- `src/database/` memuat migrasi, seed, dan repository. SQLite menyimpan master data dan pilihan pengguna. Startup memuat preferensi ke Zustand setelah migrasi dan seed.
- `src/stores/` memuat snapshot pengaturan untuk UI. Profil menyimpan perubahan ke SQLite sebelum menerapkannya. Pemilihan tema sistem menggunakan skema warna perangkat.
- `src/locales/` dan `src/services/i18n.ts` menyediakan resource Bahasa Indonesia dan English. ID katalog independen dari bahasa.
- `scripts/` memuat pemeriksaan perilaku SQLite dan pengumpulan bukti audit lisensi.

## Runtime Expo SDK 58

- Expo Router tetap memakai Stack dan lima tab JavaScript. Versi Gesture Handler, Reanimated, dan Worklets mengikuti SDK 58 karena dependensi transitif Router membutuhkan peer native tersebut.
- Config aplikasi masih memakai slug `hijrah-apps`, skema URL `hijrah`, dan identifier `app.hijrah.mobile` pada Android dan iOS. Database tetap bernama `hijrah.db` dengan skema v1.
- Pengujian Expo Go memakai Metro di LAN. Inventaris lisensi memakai source map kedua bundle untuk menemukan modul yang didistribusikan dan asset map Metro untuk mencatat aset serta atribusinya.

