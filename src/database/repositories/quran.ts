import type { SQLiteDatabase } from 'expo-sqlite';
import type { Position, Reading, Session, Surah } from '../../services/quranRules.ts';
import { countAyat, validPosition } from '../../services/quranRules.ts';
import { assertEligibleDate } from '../../utils/localDate.ts';

export async function readSurahs(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<Surah>(`SELECT surah_number AS number, name_arabic AS arabic,
    name_transliteration AS latin, name_id AS id, name_en AS en, verse_count AS verses
    FROM quran_surahs ORDER BY surah_number`);
  return new Map(rows.map((row) => [row.number, row]));
}

type SessionRow = Omit<Session, 'start' | 'end'> & { startSurah: number; startAyah: number; endSurah: number; endAyah: number };
export async function readReading(db: SQLiteDatabase, userId: string, start: string, end = start) {
  const rows = await db.getAllAsync<SessionRow>(`SELECT id, reading_date AS date, start_surah AS startSurah,
    start_ayah AS startAyah, end_surah AS endSurah, end_ayah AS endAyah, duration_minutes AS duration, notes
    FROM quran_reading_logs WHERE user_id = ? AND reading_date BETWEEN ? AND ? ORDER BY reading_date, created_at, id`, userId, start, end);
  return rows.map(({ startSurah, startAyah, endSurah, endAyah, ...row }): Session => ({
    ...row, start: { surah: startSurah, ayah: startAyah }, end: { surah: endSurah, ayah: endAyah },
  }));
}

export function readBookmark(db: SQLiteDatabase, userId: string) {
  return db.getFirstAsync<Position>('SELECT surah_number AS surah, ayah_number AS ayah FROM quran_bookmarks WHERE user_id = ?', userId);
}

const pending = new WeakMap<SQLiteDatabase, Promise<void>>();
function mutate<T>(db: SQLiteDatabase, work: (tx: SQLiteDatabase) => Promise<T>): Promise<T> {
  const run = (pending.get(db) ?? Promise.resolve()).then(async () => {
    let value: T | undefined;
    await db.withExclusiveTransactionAsync(async (tx) => { value = await work(tx); });
    return value as T;
  });
  pending.set(db, run.then(() => undefined, () => undefined));
  return run;
}

async function upsertBookmark(db: SQLiteDatabase, userId: string, position: Position) {
  await db.runAsync(`INSERT INTO quran_bookmarks (id, user_id, surah_number, ayah_number) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET surah_number = excluded.surah_number, ayah_number = excluded.ayah_number,
      updated_at = CURRENT_TIMESTAMP`, userId, userId, position.surah, position.ayah);
}

export function saveBookmark(db: SQLiteDatabase, userId: string, position: Position | null) {
  return mutate(db, async (tx) => {
    if (!position) {
      await tx.runAsync('DELETE FROM quran_bookmarks WHERE user_id = ?', userId);
      return;
    }
    if (!await tx.getFirstAsync('SELECT 1 FROM user_profiles WHERE id = ?', userId)) throw new Error('Profile unavailable');
    if (!validPosition(await readSurahs(tx), position)) throw new Error('Invalid bookmark');
    await upsertBookmark(tx, userId, position);
  });
}

export function saveReading(db: SQLiteDatabase, userId: string, id: string, reading: Reading, editing: boolean, bookmark: boolean) {
  return mutate(db, async (tx) => {
    if (!await tx.getFirstAsync('SELECT 1 FROM user_profiles WHERE id = ?', userId)) throw new Error('Profile unavailable');
    assertEligibleDate(reading.date);
    if (countAyat(await readSurahs(tx), reading.start, reading.end) === null) throw new Error('Invalid reading range');
    if (reading.duration !== null && (!Number.isSafeInteger(reading.duration) || reading.duration <= 0 || reading.duration > 1440)) throw new Error('Invalid duration');
    const notes = reading.notes?.trim() || null;
    if (notes && notes.length > 500) throw new Error('Notes too long');
    const values = [reading.date, reading.start.surah, reading.start.ayah, reading.end.surah, reading.end.ayah, reading.duration, notes];
    if (editing) {
      const result = await tx.runAsync(`UPDATE quran_reading_logs SET reading_date = ?, start_surah = ?, start_ayah = ?,
        end_surah = ?, end_ayah = ?, duration_minutes = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND id = ?`, ...values, userId, id);
      if (!result.changes) throw new Error('Reading session unavailable');
    } else {
      const result = await tx.runAsync(`INSERT INTO quran_reading_logs
        (reading_date, start_surah, start_ayah, end_surah, end_ayah, duration_minutes, notes, user_id, id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`, ...values, userId, id);
      if (!result.changes) return;
    }
    if (bookmark) await upsertBookmark(tx, userId, reading.end);
  });
}

export function deleteReading(db: SQLiteDatabase, userId: string, id: string) {
  return mutate(db, (tx) => tx.runAsync('DELETE FROM quran_reading_logs WHERE user_id = ? AND id = ?', userId, id));
}
