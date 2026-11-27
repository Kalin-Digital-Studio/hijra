import personal from './personal.ts';
import prayer from './prayer.ts';
import sunnah from './sunnah.ts';
import { quran } from './quran.ts';

import { dhikr } from './dhikr.ts';

import { hub } from './hub.ts';

export default {
  hub,
  dhikr,
  ...personal,
  prayer,
  sunnah,
  quran,
  tabs: { home: 'Beranda', tracker: 'Ibadah', goals: 'Target', reports: 'Laporan', profile: 'Profil' },
  greeting: 'Assalamu’alaikum',
  tagline: 'Selangkah lebih baik setiap hari.',
  shortcuts: 'Jelajahi ibadah',
  categories: { prayer: 'Shalat Wajib', sunnah: 'Shalat Sunnah', quran: 'Al-Qur’an', dzikir: 'Dzikir' },
  types: {
    ...sunnah.catalog,
    fajr: 'Subuh', dhuhr: 'Dzuhur', asr: 'Ashar', maghrib: 'Maghrib', isha: 'Isya',
    duha: 'Dhuha', tahajjud: 'Tahajud', witr: 'Witir', 'before-fajr': 'Rawatib Qobliyah Subuh',
    'before-dhuhr': 'Rawatib Qobliyah Dzuhur', 'after-dhuhr': 'Rawatib Ba’diyah Dzuhur',
    'after-maghrib': 'Rawatib Ba’diyah Maghrib', 'after-isha': 'Rawatib Ba’diyah Isya',
    'tahiyyat-al-masjid': 'Tahiyatul Masjid', reading: 'Membaca Al-Qur’an',
    morning: 'Dzikir Pagi', evening: 'Dzikir Petang', 'after-prayer': 'Dzikir Setelah Shalat',
    istighfar: 'Istighfar', tasbih: 'Tasbih', tahmid: 'Tahmid', takbir: 'Takbir', salawat: 'Shalawat',
  },
  placeholder: {
    tracker: 'Pencatatan ibadah akan tersedia pada fase berikutnya.',
    goals: 'Perencanaan target akan tersedia pada fase berikutnya.',
    reports: 'Laporan akan tersedia setelah pencatatan ibadah diaktifkan.',
  },
  settings: {
    language: 'Bahasa', theme: 'Tampilan', about: 'Tentang Hijra', licenses: 'Lisensi Pihak Ketiga',
    system: 'Ikuti sistem', light: 'Terang', dark: 'Gelap', id: 'Bahasa Indonesia', en: 'English',
    saveError: 'Pengaturan gagal disimpan. Silakan coba lagi.',
  },
  loading: 'Memuat…', loadError: 'Data gagal dimuat.', retry: 'Coba lagi', back: 'Kembali',
  licensesPending: 'Pemberitahuan lisensi sedang menunggu verifikasi dependensi.',
  version: 'Versi {{version}}',
};
