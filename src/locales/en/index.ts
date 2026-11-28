import { reflection } from './reflection.ts';
import { reports } from './reports.ts';
import { dashboard } from './dashboard.ts';
import { goals } from './goals.ts';
import personal from './personal.ts';
import prayer from './prayer.ts';
import sunnah from './sunnah.ts';
import { quran } from './quran.ts';

import { dhikr } from './dhikr.ts';

import { hub } from './hub.ts';

export default {
  reflection,
  reports,
  dashboard,
  goals,
  hub,
  dhikr,
  ...personal,
  prayer,
  sunnah,
  quran,
  tabs: { home: 'Home', tracker: 'Tracker', goals: 'Goals', reports: 'Reports', profile: 'Profile' },
  greeting: 'Assalamu’alaikum',
  tagline: 'Every day, a better journey.',
  shortcuts: 'Explore worship',
  categories: { prayer: 'Obligatory Prayers', sunnah: 'Sunnah Prayers', quran: 'Quran', dzikir: 'Dhikr' },
  types: {
    ...sunnah.catalog,
    fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
    duha: 'Duha', tahajjud: 'Tahajjud', witr: 'Witr', 'before-fajr': 'Rawatib before Fajr',
    'before-dhuhr': 'Rawatib before Dhuhr', 'after-dhuhr': 'Rawatib after Dhuhr',
    'after-maghrib': 'Rawatib after Maghrib', 'after-isha': 'Rawatib after Isha',
    'tahiyyat-al-masjid': 'Tahiyyat al-Masjid', reading: 'Read the Quran',
    morning: 'Morning Dhikr', evening: 'Evening Dhikr', 'after-prayer': 'Dhikr after Prayer',
    istighfar: 'Istighfar', tasbih: 'Tasbih', tahmid: 'Tahmid', takbir: 'Takbir', salawat: 'Salawat',
  },
  placeholder: {
    tracker: 'Worship logging will be available in a later phase.',
    goals: 'Goal planning will be available in a later phase.',
    reports: 'Reports will be available once worship logging is enabled.',
  },
  settings: {
    language: 'Language', theme: 'Appearance', about: 'About Hijra', licenses: 'Third-Party Licenses',
    system: 'System default', light: 'Light', dark: 'Dark', id: 'Bahasa Indonesia', en: 'English',
    saveError: 'Could not save settings. Please try again.',
  },
  loading: 'Loading…', loadError: 'Could not load data.', retry: 'Try again', back: 'Back',
  licensesPending: 'License notices are pending dependency verification.',
  version: 'Version {{version}}',
};
