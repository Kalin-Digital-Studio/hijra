import type { SQLiteDatabase } from 'expo-sqlite';
import tanzilSurahs from '../../../assets/data/quran/tanzil-surahs.json' with { type: 'json' };

export async function seedQuranCatalog(db: SQLiteDatabase) {
  const total = tanzilSurahs.reduce((sum, row) => sum + row.verses, 0);
  const valid = tanzilSurahs.length === 114 && total === 6236 && tanzilSurahs.every((row, index) =>
    row.number === index + 1 && Number.isInteger(row.verses) && row.verses > 0 && row.latin.trim() && row.arabic.trim());
  if (!valid) throw new Error('Invalid bundled Quran catalog');

  const existing = await db.getAllAsync<{ number: number; verses: number }>(
    'SELECT surah_number AS number, verse_count AS verses FROM quran_surahs');
  for (const row of existing) {
    if (tanzilSurahs[row.number - 1]?.verses !== row.verses) throw new Error('Existing Quran verse numbering differs');
  }

  for (const row of tanzilSurahs) {
    await db.runAsync(`INSERT INTO quran_surahs (surah_number, name_transliteration, name_arabic, verse_count)
      VALUES (?, ?, ?, ?) ON CONFLICT(surah_number) DO UPDATE SET
      name_transliteration = excluded.name_transliteration, name_arabic = excluded.name_arabic`,
      row.number, row.latin, row.arabic, row.verses);
  }
}
