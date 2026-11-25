import type { SQLiteDatabase } from 'expo-sqlite';
import { checkPrayerTarget, readPrayerLog, upsertPrayer } from '../database/repositories/prayer.ts';
import type { PrayerChange, PrayerLog, PrayerTarget } from '../types/prayer';
import { assertEligibleDate } from '../utils/localDate.ts';
import { applyPrayerChange, emptyPrayer } from './prayerRules.ts';

const writes = new WeakMap<SQLiteDatabase, Promise<unknown>>();

export function savePrayer(db: SQLiteDatabase, target: PrayerTarget, change: PrayerChange): Promise<PrayerLog | null> {
  const write = async () => {
    assertEligibleDate(target.date);
    let result: PrayerLog | null = null;
    await db.withExclusiveTransactionAsync(async (tx) => {
      await checkPrayerTarget(tx, target.userId, target.prayerId);
      const current = await readPrayerLog(tx, target);
      const next = applyPrayerChange(current ?? emptyPrayer, change);
      if (!current && next.status === 'NOT_LOGGED' && !next.notes) return;
      if (current && current.status === next.status && current.onTime === next.onTime &&
        current.congregational === next.congregational && current.notes === next.notes) {
        result = current;
        return;
      }
      result = await upsertPrayer(tx, target, next);
    });
    return result;
  };
  const queued = (writes.get(db) ?? Promise.resolve()).then(write, write);
  writes.set(db, queued);
  return queued;
}
