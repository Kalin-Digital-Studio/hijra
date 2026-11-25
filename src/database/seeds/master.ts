export const categories = {
  prayer: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
  sunnah: ['duha', 'tahajjud', 'witr', 'before-fajr', 'before-dhuhr', 'after-dhuhr', 'after-maghrib', 'after-isha', 'tahiyyat-al-masjid',
    'before-asr', 'before-maghrib', 'before-isha', 'istikharah', 'hajat', 'taubat', 'tarawih', 'wudhu'],
  quran: ['reading'],
  dzikir: ['morning', 'evening', 'after-prayer', 'istighfar', 'tasbih', 'tahmid', 'takbir', 'salawat'],
} as const;

export type CategoryId = keyof typeof categories;
export const categoryIds = Object.keys(categories) as CategoryId[];
