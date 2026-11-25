import type { SQLiteDatabase } from 'expo-sqlite';
import { weekdays, type OnboardingSettings, type Settings, type Weekday } from '../../types/settings.ts';

type SettingValues = Settings & OnboardingSettings;
const defaults = {
  language: 'id', theme: 'system', week_start: 'monday',
  onboarding_completed: 'false', onboarding_completed_at: '', onboarding_version: '1',
} satisfies SettingValues;

export async function seedSettings(db: SQLiteDatabase) {
  for (const [key, value] of Object.entries(defaults)) {
    await db.runAsync('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)', key, value);
  }
}

export async function readSettings(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM app_settings');
  const saved = new Map(rows.map(({ key, value }) => [key, value]));
  const language = saved.get('language');
  const theme = saved.get('theme');
  const week = weekdays.find((day) => day === saved.get('week_start'));
  return {
    language: language === 'en' ? 'en' : 'id',
    theme: theme === 'light' || theme === 'dark' ? theme : 'system',
    week_start: week ?? 'monday',
    completed: saved.get('onboarding_completed') === 'true' && saved.get('onboarding_version') === '1',
  } satisfies Settings & { completed: boolean };
}

export function writeSetting<K extends keyof Settings>(db: SQLiteDatabase, key: K, value: Settings[K]): ReturnType<SQLiteDatabase['runAsync']>;
export function writeSetting<K extends keyof OnboardingSettings>(db: SQLiteDatabase, key: K, value: OnboardingSettings[K]): ReturnType<SQLiteDatabase['runAsync']>;
export function writeSetting(db: SQLiteDatabase, key: keyof SettingValues, value: string) {
  if (key === 'week_start' && !weekdays.includes(value as Weekday)) throw new Error('Invalid weekday');
  return db.runAsync(
    'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key, value,
  );
}
