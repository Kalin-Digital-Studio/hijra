import type { SQLiteDatabase } from 'expo-sqlite';
import type { Settings } from '../../types/settings';

export async function readSettings(db: SQLiteDatabase): Promise<Settings> {
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM app_settings');
  const saved = new Map(rows.map(({ key, value }) => [key, value]));
  const language = saved.get('language');
  const theme = saved.get('theme');
  return {
    language: language === 'en' ? 'en' : 'id',
    theme: theme === 'light' || theme === 'dark' ? theme : 'system',
  };
}

export function writeSetting<K extends keyof Settings>(db: SQLiteDatabase, key: K, value: Settings[K]) {
  return db.runAsync(
    'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key, value,
  );
}
