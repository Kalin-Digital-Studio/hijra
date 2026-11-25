import type { SQLiteDatabase } from 'expo-sqlite';
import type { SunnahActivity, SunnahDetails, SunnahPreference, SunnahSession, SunnahTarget } from '../../types/sunnah';

const defaultIds = ['tahajjud', 'witr', 'duha', 'before-fajr', 'after-dhuhr'] as const;
const sessionFields = 'id, user_id AS userId, ibadah_type_id AS activityId, prayer_date AS date, prayer_time AS prayerTime, rakaat, notes, created_at AS createdAt, updated_at AS updatedAt';

type ActivityRow = Omit<SunnahActivity, 'active' | 'custom'> & { active: number; custom: number };

export async function assertSunnahUser(db: SQLiteDatabase, userId: string) {
  if (!await db.getFirstAsync('SELECT id FROM user_profiles WHERE id = ?', userId)) throw new Error('profile');
}

export async function initializeSunnahPreferences(db: SQLiteDatabase, userId: string) {
  await assertSunnahUser(db, userId);
  const marker = JSON.stringify(['sunnah-preferences-v1', userId]);
  if (await db.getFirstAsync('SELECT key FROM app_settings WHERE key = ?', marker)) return;
  for (const [order, id] of defaultIds.entries()) {
    await db.runAsync(`INSERT OR IGNORE INTO user_sunnah_preferences (id, user_id, ibadah_type_id, sort_order)
      SELECT ?, ?, id, ? FROM ibadah_types WHERE id = ? AND category_id = ? AND is_custom = 0`,
      JSON.stringify([userId, id]), userId, order, id, 'sunnah');
  }
  await db.runAsync('INSERT INTO app_settings (key, value) VALUES (?, ?)', marker, 'true');
}

export async function readSunnahActivities(db: SQLiteDatabase, userId: string): Promise<SunnahActivity[]> {
  const rows = await db.getAllAsync<ActivityRow>(`SELECT i.id, i.is_custom AS custom, i.custom_name AS name,
      i.custom_description AS description, COALESCE(p.is_active, 0) AS active,
      COALESCE(p.sort_order, i.sort_order + 1000) AS "order", p.default_rakaat AS defaultRakaat
    FROM ibadah_types i LEFT JOIN user_sunnah_preferences p ON p.ibadah_type_id = i.id AND p.user_id = ?
    WHERE i.category_id = ? AND (i.is_custom = 0 OR i.owner_user_id = ?)
    ORDER BY "order", i.id`, userId, 'sunnah', userId);
  return rows.map((row) => ({ ...row, active: row.active === 1, custom: row.custom === 1 }));
}

export async function readSunnahSessions(db: SQLiteDatabase, userId: string, start: string, end = start, activityId?: string) {
  return db.getAllAsync<SunnahSession>(`SELECT ${sessionFields} FROM sunnah_prayer_logs
    WHERE user_id = ? AND prayer_date BETWEEN ? AND ? AND (? IS NULL OR ibadah_type_id = ?)
    ORDER BY prayer_date, created_at, id`, userId, start, end, activityId ?? null, activityId ?? null);
}

export function readSunnahSession(db: SQLiteDatabase, userId: string, id: string) {
  return db.getFirstAsync<SunnahSession>(`SELECT ${sessionFields} FROM sunnah_prayer_logs WHERE user_id = ? AND id = ?`, userId, id);
}

export async function writeSunnahPreference(db: SQLiteDatabase, userId: string, pref: SunnahPreference) {
  const now = new Date().toISOString();
  await db.runAsync(`INSERT INTO user_sunnah_preferences
    (id, user_id, ibadah_type_id, is_active, sort_order, default_rakaat, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, ibadah_type_id)
    DO UPDATE SET is_active = excluded.is_active, sort_order = excluded.sort_order, default_rakaat = excluded.default_rakaat, updated_at = excluded.updated_at
    WHERE is_active <> excluded.is_active OR sort_order <> excluded.sort_order OR default_rakaat IS NOT excluded.default_rakaat`,
    JSON.stringify([userId, pref.id]), userId, pref.id, Number(pref.active), pref.order, pref.defaultRakaat, now, now);
}

export async function writeCustomMaster(db: SQLiteDatabase, userId: string, id: string, name: string, description: string | null, creating: boolean) {
  if (creating) {
    await db.runAsync('INSERT INTO ibadah_types (id, category_id, sort_order, is_custom, owner_user_id, custom_name, custom_description) VALUES (?, ?, ?, 1, ?, ?, ?)',
      id, 'sunnah', 1000, userId, name, description);
  } else {
    await db.runAsync('UPDATE ibadah_types SET custom_name = ?, custom_description = ? WHERE id = ? AND owner_user_id = ? AND category_id = ? AND is_custom = 1',
      name, description, id, userId, 'sunnah');
  }
}

export async function insertSunnahSession(db: SQLiteDatabase, target: SunnahTarget, id: string, details: SunnahDetails) {
  const now = new Date().toISOString();
  await db.runAsync(`INSERT INTO sunnah_prayer_logs (id, user_id, ibadah_type_id, prayer_date, prayer_time, rakaat, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, id, target.userId, target.activityId, target.date, details.prayerTime, details.rakaat, details.notes, now, now);
}

export async function updateSunnahSession(db: SQLiteDatabase, target: SunnahTarget, id: string, details: SunnahDetails) {
  await db.runAsync(`UPDATE sunnah_prayer_logs SET prayer_time = ?, rakaat = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ? AND ibadah_type_id = ? AND prayer_date = ? AND (prayer_time IS NOT ? OR rakaat IS NOT ? OR notes IS NOT ?)`,
    details.prayerTime, details.rakaat, details.notes, new Date().toISOString(), id, target.userId, target.activityId, target.date,
    details.prayerTime, details.rakaat, details.notes);
}

export async function deleteSunnahSession(db: SQLiteDatabase, target: SunnahTarget, id: string) {
  await db.runAsync('DELETE FROM sunnah_prayer_logs WHERE id = ? AND user_id = ? AND ibadah_type_id = ? AND prayer_date = ?',
    id, target.userId, target.activityId, target.date);
}
