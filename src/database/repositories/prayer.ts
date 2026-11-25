import type { SQLiteDatabase } from 'expo-sqlite';
import { categories } from '../seeds/master.ts';
import type { PrayerDay, PrayerId, PrayerLog, PrayerTarget } from '../../types/prayer';

type Row = Omit<PrayerLog, 'onTime' | 'congregational'> & { onTime: number | null; congregational: number | null };
const fields = 'id, user_id AS userId, ibadah_type_id AS prayerId, prayer_date AS date, status, is_on_time AS onTime, is_congregational AS congregational, notes, created_at AS createdAt, updated_at AS updatedAt';

function decode(row: Row): PrayerLog {
  return { ...row, onTime: row.onTime === null ? null : row.onTime === 1, congregational: row.congregational === null ? null : row.congregational === 1 };
}

export async function readPrayerTypes(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ id: string }>('SELECT id FROM ibadah_types WHERE category_id = ?', 'prayer');
  const ids = new Set(rows.map(({ id }) => id));
  if (!categories.prayer.every((id) => ids.has(id))) throw new Error('Obligatory prayer master data is incomplete');
  return categories.prayer;
}

export async function readPrayerLogs(db: SQLiteDatabase, userId: string, start: string, end = start) {
  const rows = await db.getAllAsync<Row>(
    `SELECT ${fields} FROM prayer_logs WHERE user_id = ? AND prayer_date BETWEEN ? AND ?`, userId, start, end,
  );
  return rows.map(decode);
}

export async function readPrayerLog(db: SQLiteDatabase, { userId, prayerId, date }: PrayerTarget) {
  const row = await db.getFirstAsync<Row>(
    `SELECT ${fields} FROM prayer_logs WHERE user_id = ? AND ibadah_type_id = ? AND prayer_date = ?`, userId, prayerId, date,
  );
  return row ? decode(row) : null;
}

export async function checkPrayerTarget(db: SQLiteDatabase, userId: string, prayerId: PrayerId) {
  const row = await db.getFirstAsync<{ id: string }>(
    'SELECT p.id FROM user_profiles p CROSS JOIN ibadah_types i WHERE p.id = ? AND i.id = ? AND i.category_id = ?',
    userId, prayerId, 'prayer',
  );
  if (!row || !categories.prayer.includes(prayerId)) throw new Error('Invalid local profile or prayer type');
}

export async function upsertPrayer(db: SQLiteDatabase, target: PrayerTarget, change: PrayerDay) {
  const { userId, prayerId, date } = target;
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO prayer_logs (id, user_id, ibadah_type_id, prayer_date, status, is_on_time, is_congregational, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, ibadah_type_id, prayer_date) DO UPDATE SET status = excluded.status,
       is_on_time = excluded.is_on_time, is_congregational = excluded.is_congregational, notes = excluded.notes, updated_at = excluded.updated_at`,
    JSON.stringify([userId, prayerId, date]), userId, prayerId, date, change.status,
    change.onTime === null ? null : Number(change.onTime), change.congregational === null ? null : Number(change.congregational),
    change.notes, now, now,
  );
  const saved = await readPrayerLog(db, target);
  if (!saved) throw new Error('Prayer write failed');
  return saved;
}
