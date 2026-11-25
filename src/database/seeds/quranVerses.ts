import type { SQLiteDatabase } from 'expo-sqlite';
import source from '../../../assets/data/quran/tanzil-uthmani.json' with { type: 'json' };
import { readSurahs } from '../repositories/quran.ts';
import type { Catalog } from '../../services/quranRules.ts';

export type QuranVerse = { surah: number; ayah: number; arabic: string };

export function parseUthmani(raw: string, catalog: Catalog) {
  const verses: QuranVerse[] = [];
  let expectedSurah = 1;
  let expectedAyah = 1;
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const match = /^(\d+)\|(\d+)\|(.+)$/u.exec(line);
    const count = catalog.get(expectedSurah)?.verses;
    if (!match || !count || Number(match[1]) !== expectedSurah || Number(match[2]) !== expectedAyah) {
      throw new Error('Invalid Quran text sequence');
    }
    verses.push({ surah: expectedSurah, ayah: expectedAyah, arabic: match[3] });
    if (expectedAyah === count) {
      expectedSurah++;
      expectedAyah = 1;
    } else expectedAyah++;
  }
  if (catalog.size !== 114 || expectedSurah !== 115 || verses.length !== 6236) {
    throw new Error('Incomplete Quran text');
  }
  return verses;
}

export async function seedQuranVerses(db: SQLiteDatabase) {
  const verses = parseUthmani(source.raw, await readSurahs(db));
  for (let index = 0; index < verses.length; index += 100) {
    const batch = verses.slice(index, index + 100);
    await db.runAsync(`INSERT INTO quran_verses (surah_number, ayah_number, arabic_text)
      VALUES ${batch.map(() => '(?, ?, ?)').join(', ')}`,
    ...batch.flatMap(({ surah, ayah, arabic }) => [surah, ayah, arabic]));
  }
}
