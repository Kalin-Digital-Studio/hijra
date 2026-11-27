import type { SQLiteDatabase } from 'expo-sqlite';
import expansion from '../../../assets/data/dhikr/expansion-v2.json' with { type: 'json' };
import { readVerses } from '../repositories/quranReader.ts';
import catalog from '../../../assets/data/dhikr/catalog.json' with { type: 'json' };

export async function seedDhikr(db: SQLiteDatabase) {
  await db.runAsync("INSERT INTO dhikr_items (id,label,mode) VALUES ('free','dhikr.catalog.free','COUNTER')");
  for (const item of catalog.items) {
    await db.runAsync('INSERT INTO dhikr_items (id,label,arabic_text,reference,mode,target) VALUES (?,?,?,?,?,?)',
      item.id, `dhikr.catalog.${item.id}`, item.arabic, item.reference, item.id === 'closing' ? 'CHECKLIST' : 'COUNTER', item.target);
  }
  for (const collection of catalog.collections) {
    await db.runAsync('INSERT INTO dhikr_collections VALUES (?,?,?,?)', collection.id, collection.category, 1, collection.reference);
    for (const [position, [item, target]] of collection.steps.entries()) {
      await db.runAsync('INSERT INTO dhikr_collection_items VALUES (?,?,?,?,1)', collection.id, position, item, target);
    }
  }
}

const sharedReadings = ['guided-surah-112', 'guided-surah-113', 'guided-surah-114',
  'guided-sayyid', 'guided-protection', 'tasbih-tahmid'];

export async function expandDhikrCollections(db: SQLiteDatabase) {
  const targets = new Map<string, number | null>([['tasbih-tahmid', 100]]);
  async function insertReading(item: { id: string; arabic: string; reference: string; target: number | null }) {
    await db.runAsync('INSERT INTO dhikr_items (id,label,arabic_text,reference,mode,target) VALUES (?,?,?,?,?,?)',
      item.id, `dhikr.catalog.${item.id}`, item.arabic, item.reference, item.target === null ? 'CHECKLIST' : 'COUNTER', item.target);
    targets.set(item.id, item.target);
  }
  for (const item of expansion.items) await insertReading(item);
  for (const item of expansion.quran) {
    const verses = await readVerses(db, item.surah);
    const chapter = await db.getFirstAsync<{ count: number }>('SELECT verse_count AS count FROM quran_surahs WHERE surah_number=?', item.surah);
    if (!chapter || !verses.length || verses.length !== chapter.count || verses.some((verse, index) => verse.ayah !== index + 1)) {
      throw new Error('Incomplete Quran passage for dhikr');
    }
    await insertReading({ ...item, arabic: verses.map((verse) => verse.arabic).join('\n') });
  }
  for (const period of ['morning', 'evening']) {
    await db.runAsync('UPDATE dhikr_collections SET version=2,reference=? WHERE id=?',
      'Abu Dawud 5068, 5082, 5088 · Al-Bukhari 6306 · Muslim 2692', period);
    await db.runAsync('DELETE FROM dhikr_collection_items WHERE collection_id=?', period);
    for (const [position, id] of [`guided-${period}-dua`, ...sharedReadings].entries()) {
      await insertStep(period, position, id);
    }
  }
  await db.runAsync('INSERT INTO dhikr_collections VALUES (?,?,?,?)', 'post-591', 'POST_PRAYER', 1, 'Muslim 591');
  await insertStep('post-591', 0, 'guided-post-istighfar');
  await insertStep('post-591', 1, 'guided-post-salam');

  async function insertStep(collection: string, position: number, id: string) {
    if (!targets.has(id)) throw new Error('Missing dhikr reading');
    await db.runAsync('INSERT INTO dhikr_collection_items VALUES (?,?,?,?,1)', collection, position, id, targets.get(id) ?? null);
  }
}
