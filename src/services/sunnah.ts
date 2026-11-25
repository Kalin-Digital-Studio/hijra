import type { SQLiteDatabase } from 'expo-sqlite';
import {
  assertSunnahUser, deleteSunnahSession, initializeSunnahPreferences, insertSunnahSession,
  readSunnahActivities, readSunnahSession, readSunnahSessions, updateSunnahSession, writeCustomMaster, writeSunnahPreference,
} from '../database/repositories/sunnah.ts';
import id from '../locales/id/sunnah.ts';
import en from '../locales/en/sunnah.ts';
import type { SunnahActivity, SunnahDetails, SunnahTarget } from '../types/sunnah';
import { assertEligibleDate } from '../utils/localDate.ts';
import { assertRakaat, maxActivityDescription, maxActivityName, normalizeActivityName, normalizeDetails } from './sunnahRules.ts';

const queue = new WeakMap<SQLiteDatabase, Promise<unknown>>();
const emptyDetails: SunnahDetails = { prayerTime: null, rakaat: null, notes: null };
const builtInNames = new Set([...Object.values(id.catalog), ...Object.values(en.catalog)].map(normalizeActivityName));

export function newSunnahId(kind: 'activity' | 'session') {
  const unique = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `sunnah-${kind}-${unique}`;
}

function transaction<T>(db: SQLiteDatabase, run: (tx: SQLiteDatabase) => Promise<T>) {
  async function write() {
    let result!: T;
    await db.withExclusiveTransactionAsync(async (tx) => { result = await run(tx); });
    return result;
  }
  const next = (queue.get(db) ?? Promise.resolve()).then(write, write);
  queue.set(db, next);
  return next;
}

export function ensureSunnahPreferences(db: SQLiteDatabase, userId: string) {
  return transaction(db, (tx) => initializeSunnahPreferences(tx, userId));
}

async function validateTarget(db: SQLiteDatabase, target: SunnahTarget) {
  assertEligibleDate(target.date);
  await assertSunnahUser(db, target.userId);
  const activity = (await readSunnahActivities(db, target.userId)).find((row) => row.id === target.activityId);
  if (!activity) throw new Error('activity');
  return activity;
}

function matches(target: SunnahTarget, row: SunnahTarget) {
  return row.userId === target.userId && row.activityId === target.activityId && row.date === target.date;
}

export function quickRecordSunnah(db: SQLiteDatabase, target: SunnahTarget) {
  return transaction(db, async (tx) => {
    const activity = await validateTarget(tx, target);
    const [existing] = await readSunnahSessions(tx, target.userId, target.date, target.date, target.activityId);
    if (existing) return existing;
    if (!activity.active) throw new Error('inactive');
    const id = newSunnahId('session');
    await insertSunnahSession(tx, target, id, emptyDetails);
    return readSunnahSession(tx, target.userId, id);
  });
}

export function saveSunnahSession(db: SQLiteDatabase, target: SunnahTarget, id: string, details: SunnahDetails, editing: boolean) {
  return transaction(db, async (tx) => {
    const activity = await validateTarget(tx, target);
    const clean = normalizeDetails(details);
    const existing = await readSunnahSession(tx, target.userId, id);
    if (existing && !matches(target, existing)) throw new Error('changed');
    if (!editing && existing) return existing;
    if (editing) {
      if (!existing) throw new Error('changed');
      await updateSunnahSession(tx, target, id, clean);
    } else {
      if (!activity.active) throw new Error('inactive');
      await insertSunnahSession(tx, target, id, clean);
    }
    return readSunnahSession(tx, target.userId, id);
  });
}

export function removeSunnahSession(db: SQLiteDatabase, target: SunnahTarget, id: string, quick = false, confirmed = false) {
  return transaction(db, async (tx) => {
    await validateTarget(tx, target);
    const existing = await readSunnahSession(tx, target.userId, id);
    if (!existing) return;
    if (!matches(target, existing)) throw new Error('changed');
    if (quick) {
      const sessions = await readSunnahSessions(tx, target.userId, target.date, target.date, target.activityId);
      if (sessions.length !== 1 || (!confirmed && (existing.rakaat !== null || existing.prayerTime || existing.notes))) {
        throw new Error('changed');
      }
    }
    await deleteSunnahSession(tx, target, id);
  });
}

export function cleanCustomName(name: string, description: string | null) {
  const clean = name.trim();
  const detail = description?.trim() || null;
  if (!clean || Array.from(clean).length > maxActivityName) throw new Error('name');
  if (detail && Array.from(detail).length > maxActivityDescription) throw new Error('description');
  return { name: clean, description: detail };
}

export function saveSunnahPreferences(db: SQLiteDatabase, userId: string, draft: readonly SunnahActivity[]) {
  return transaction(db, async (tx) => {
    await initializeSunnahPreferences(tx, userId);
    const existing = await readSunnahActivities(tx, userId);
    const current = new Map(existing.map((activity) => [activity.id, activity]));
    const planned = new Map(draft.map((activity) => [activity.id, activity]));
    if (draft.length !== planned.size) throw new Error('activity');
    const names = new Set(builtInNames);
    for (const activity of [...draft, ...existing.filter((item) => !planned.has(item.id))]) {
      if (!activity.custom) continue;
      const { name } = cleanCustomName(activity.name ?? '', activity.description);
      const normalized = normalizeActivityName(name);
      if (names.has(normalized)) throw new Error('duplicate');
      names.add(normalized);
    }
    for (const activity of draft) {
      assertRakaat(activity.defaultRakaat);
      if (!Number.isSafeInteger(activity.order) || activity.order < 0 || typeof activity.active !== 'boolean') throw new Error('activity');
      const original = current.get(activity.id);
      if (original ? original.custom !== activity.custom : !activity.custom || !/^sunnah-activity-[a-z0-9-]+$/i.test(activity.id)) throw new Error('activity');
      if (activity.custom) {
        const { name, description } = cleanCustomName(activity.name ?? '', activity.description);
        if (!original || original.name !== name || original.description !== description) {
          await writeCustomMaster(tx, userId, activity.id, name, description, !original);
        }
      }
      await writeSunnahPreference(tx, userId, activity);
    }
  });
}
