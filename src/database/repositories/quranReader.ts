import type { SQLiteDatabase } from 'expo-sqlite';
import type { QuranVerse } from '../seeds/quranVerses.ts';

export const quranFontSizes = [24, 30, 38, 46] as const;
export type QuranFontSize = typeof quranFontSizes[number];
export type QuranVisibility = 'transliteration' | 'translation';

export async function readQuranVisibility(db: SQLiteDatabase, setting: QuranVisibility) {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', 'quran_show_' + setting);
  return row?.value !== '0';
}

export function saveQuranVisibility(db: SQLiteDatabase, setting: QuranVisibility, enabled: boolean) {
  return db.runAsync(`INSERT INTO app_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`, 'quran_show_' + setting, enabled ? '1' : '0');
}

export function readVerses(db: SQLiteDatabase, surah: number) {
  return db.getAllAsync<QuranVerse>(`SELECT surah_number AS surah, ayah_number AS ayah, arabic_text AS arabic
    FROM quran_verses WHERE surah_number = ? ORDER BY ayah_number`, surah);
}

export async function readQuranFontSize(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', 'quran_font_size');
  return quranFontSizes.find((size) => String(size) === row?.value) ?? 30;
}

export function saveQuranFontSize(db: SQLiteDatabase, size: QuranFontSize) {
  return db.runAsync(`INSERT INTO app_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`, 'quran_font_size', String(size));
}
