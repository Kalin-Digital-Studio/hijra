import type { SQLiteDatabase } from 'expo-sqlite';
import { assertEligibleDate } from '../../utils/localDate.ts';
import { collectionStatus, emptyProgress, maxCount, newDhikrId, type DhikrItem, type DhikrLog, type Draft, type Progress } from '../../services/dhikrRules.ts';

const queue = new WeakMap<SQLiteDatabase, Promise<unknown>>();
function transaction<T>(db: SQLiteDatabase, operation: (tx: SQLiteDatabase) => Promise<T>) {
  const run = (queue.get(db) ?? Promise.resolve()).then(async () => {
    let result!: T;
    await db.withExclusiveTransactionAsync(async (tx) => { result = await operation(tx); });
    return result;
  });
  queue.set(db, run.catch(() => undefined));
  return run;
}

export function readDhikrItems(db: SQLiteDatabase, user: string) {
  return db.getAllAsync<DhikrItem>(`SELECT i.id,i.label,i.arabic_text AS arabic,i.latin_text AS latin,i.meaning,i.notes,
    i.reference,i.mode,i.target,i.owner_user_id AS owner,i.archived,COALESCE(p.favorite,0) AS favorite,
    COALESCE(p.sort_order,0) AS sort
    FROM dhikr_items i LEFT JOIN user_dhikr_preferences p ON i.id=p.item_id AND p.user_id=?
    WHERE i.owner_user_id IS NULL OR i.owner_user_id=? ORDER BY favorite DESC,sort,i.id`, user, user);
}

export function readDhikrLogs(db: SQLiteDatabase, user: string, start: string, end = start) {
  return db.getAllAsync<DhikrLog>(`SELECT l.id,l.item_id AS itemId,l.date,l.label,l.mode,l.count,l.checked,l.target,l.collection_session_id AS collectionSession,
    c.collection_id AS collection,c.status,l.context
    FROM dhikr_logs l LEFT JOIN dhikr_collection_sessions c ON c.id=l.collection_session_id
    WHERE l.user_id=? AND l.date BETWEEN ? AND ? ORDER BY l.date DESC,l.rowid DESC`, user, start, end);
}

export async function readDhikrDrafts(db: SQLiteDatabase, user: string) {
  const rows = await db.getAllAsync<{ snapshot: string }>('SELECT snapshot FROM dhikr_drafts WHERE user_id=? ORDER BY updated_at DESC,rowid DESC', user);
  return rows.map(({ snapshot }) => JSON.parse(snapshot) as Draft);
}

async function draftById(db: SQLiteDatabase, user: string, id: string) {
  const row = await db.getFirstAsync<{ snapshot: string }>('SELECT snapshot FROM dhikr_drafts WHERE user_id=? AND id=?', user, id);
  return row ? JSON.parse(row.snapshot) as Draft : null;
}

async function storeDraft(db: SQLiteDatabase, draft: Draft) {
  await db.runAsync(`INSERT INTO dhikr_drafts (id,user_id,date,collection_id,snapshot) VALUES (?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET snapshot=excluded.snapshot,updated_at=CURRENT_TIMESTAMP`,
    draft.id, draft.userId, draft.date, draft.collection, JSON.stringify(draft));
}

export function createDhikrDraft(db: SQLiteDatabase, user: string, date: string, id: string, collection: boolean, context: string | null = null) {
  assertEligibleDate(date);
  return transaction(db, async (tx) => {
    if (!await tx.getFirstAsync('SELECT 1 FROM user_profiles WHERE id=?', user)) throw new Error('Missing profile');
    const existing = (await readDhikrDrafts(tx, user)).find((draft) => draft.date === date && draft.context === context &&
      (collection ? draft.collection === id : !draft.collection && draft.steps[0].id === id));
    if (existing) return existing;
    const available = (await readDhikrItems(tx, user)).filter((item) => !item.archived);
    const fromCollection = collection ? await tx.getAllAsync<{ id: string; target: number | null; required: number }>(
      'SELECT item_id AS id,target,required FROM dhikr_collection_items WHERE collection_id=? ORDER BY position', id)
      : [{ id, target: available.find((item) => item.id === id)?.target ?? null, required: 0 }];
    const steps = fromCollection.map((entry) => {
      const item = available.find((option) => option.id === entry.id);
      if (!item) throw new Error('Unavailable activity');
      return { id: item.id, label: item.label, arabic: item.arabic, latin: item.latin, meaning: item.meaning,
        reference: item.reference, mode: item.mode, target: entry.target, required: !!entry.required };
    });
    if (!steps.length) throw new Error('Unavailable collection');
    const metadata = collection ? await tx.getFirstAsync<{ version: number }>('SELECT version FROM dhikr_collections WHERE id=?', id) : null;
    const draft = { version: metadata?.version, id: newDhikrId(), userId: user, date, collection: collection ? id : null, context,
      steps, progress: steps.map(() => emptyProgress), current: 0 };
    await storeDraft(tx, draft);
    return draft;
  });
}

type Change = { type: 'count'; delta: 1 | -1 } | { type: 'check' | 'reset' } |
  { type: 'manual'; count: number } | { type: 'position'; index: number } | { type: 'target'; target: number | null };

function progressAfter(mode: string, progress: Progress, change: Change): Progress {
  switch (change.type) {
    case 'count': return mode === 'COUNTER' ? { ...progress, count: Math.max(0, Math.min(maxCount, progress.count + change.delta)) } : progress;
    case 'check': return mode === 'CHECKLIST' ? { count: 0, checked: !progress.checked } : progress;
    case 'reset': return emptyProgress;
    case 'manual': return mode === 'COUNTER' ? { count: change.count, checked: false } : progress;
    default: return progress;
  }
}

export function changeDhikrDraft(db: SQLiteDatabase, user: string, id: string, change: Change) {
  return transaction(db, async (tx) => {
    const draft = await draftById(tx, user, id);
    if (!draft) throw new Error('Draft unavailable');
    if (change.type === 'position') {
      if (!Number.isInteger(change.index) || !draft.steps[change.index]) throw new Error('Invalid position');
      draft.current = change.index;
    } else if (change.type === 'target') {
      if (draft.collection || !validTarget(change.target)) throw new Error('Invalid target');
      draft.steps[draft.current].target = change.target;
    } else {
      if (change.type === 'manual' && (!Number.isInteger(change.count) || change.count < 0 || change.count > maxCount)) throw new Error('Invalid count');
      const index = draft.current;
      draft.progress[index] = progressAfter(draft.steps[index].mode, draft.progress[index], change);
    }
    await storeDraft(tx, draft);
    return draft;
  });
}

function validTarget(target: number | null) {
  return target === null || (Number.isInteger(target) && target >= 1 && target <= maxCount);
}

export function saveDhikrDraft(db: SQLiteDatabase, user: string, id: string, allowPartial: boolean) {
  return transaction(db, async (tx) => {
    const draft = await draftById(tx, user, id);
    if (!draft) {
      if (await tx.getFirstAsync('SELECT id FROM dhikr_logs WHERE user_id=? AND (id=? OR collection_session_id=?)', user, id, id)) return;
      throw new Error('Draft unavailable');
    }
    assertEligibleDate(draft.date);
    const status = collectionStatus(draft.steps, draft.progress);
    const entries = draft.steps.flatMap((step, index) => {
      const progress = draft.progress[index];
      return step.mode === 'COUNTER' ? (progress.count ? [{ step, progress, index }] : [])
        : (progress.checked ? [{ step, progress, index }] : []);
    });
    if (!entries.length || (draft.collection && !status.complete && !allowPartial)) throw new Error('Incomplete draft');
    if (draft.collection) {
      await tx.runAsync(`INSERT INTO dhikr_collection_sessions (id,user_id,date,collection_id,context,status,snapshot) VALUES (?,?,?,?,?,?,?)`,
        id, user, draft.date, draft.collection, draft.context, status.complete ? 'COMPLETE' : 'INCOMPLETE', JSON.stringify(draft));
    }
    for (const { step, progress, index } of entries) {
      await tx.runAsync(`INSERT INTO dhikr_logs (id,user_id,date,item_id,label,mode,count,checked,target,collection_session_id,context)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`, draft.collection ? JSON.stringify([id,index]) : id,
        user, draft.date, step.id, step.label, step.mode, progress.count, Number(progress.checked), step.target,
        draft.collection ? id : null, draft.context);
    }
    await tx.runAsync('DELETE FROM dhikr_drafts WHERE user_id=? AND id=?', user, id);
  });
}

export function deleteDhikrDraft(db: SQLiteDatabase, user: string, id: string) {
  return transaction(db, (tx) => tx.runAsync('DELETE FROM dhikr_drafts WHERE user_id=? AND id=?', user, id));
}

export function saveCustomDhikr(db: SQLiteDatabase, user: string, item: DhikrItem) {
  const label = item.label.trim();
  if (!label || label.length > 80 || !validTarget(item.target) || (item.mode !== 'COUNTER' && item.mode !== 'CHECKLIST')) throw new Error('Invalid item');
  return transaction(db, async (tx) => {
    if (!await tx.getFirstAsync('SELECT 1 FROM user_profiles WHERE id=?', user)) throw new Error('Missing profile');
    const result = await tx.runAsync(`INSERT INTO dhikr_items (id,owner_user_id,label,arabic_text,latin_text,meaning,notes,mode,target,archived)
      VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET label=excluded.label,arabic_text=excluded.arabic_text,
      latin_text=excluded.latin_text,meaning=excluded.meaning,notes=excluded.notes,mode=excluded.mode,target=excluded.target,archived=excluded.archived
      WHERE owner_user_id=excluded.owner_user_id`, item.id, user, label, item.arabic, item.latin, item.meaning, item.notes,
      item.mode, item.mode === 'COUNTER' ? item.target : null, item.archived);
    if (!result.changes) throw new Error('Unavailable activity');
  });
}

export function saveDhikrPreference(db: SQLiteDatabase, user: string, id: string, favorite: number, sort: number) {
  return transaction(db, async (tx) => {
    if (!(await readDhikrItems(tx, user)).some((item) => item.id === id)) throw new Error('Unavailable activity');
    await tx.runAsync(`INSERT INTO user_dhikr_preferences (user_id,item_id,favorite,sort_order) VALUES (?,?,?,?)
      ON CONFLICT(user_id,item_id) DO UPDATE SET favorite=excluded.favorite,sort_order=excluded.sort_order`, user, id, favorite, sort);
  });
}

export function editDhikrLog(db: SQLiteDatabase, user: string, id: string, date: string, count: number) {
  assertEligibleDate(date);
  if (!Number.isInteger(count) || count < 0 || count > maxCount) throw new Error('Invalid count');
  return transaction(db, (tx) => tx.runAsync(`UPDATE dhikr_logs SET date=?,count=CASE WHEN mode='COUNTER' THEN ? ELSE 0 END
    WHERE user_id=? AND id=? AND collection_session_id IS NULL AND (mode='CHECKLIST' OR ?>0)`, date, count, user, id, count));
}

export function deleteDhikrLog(db: SQLiteDatabase, user: string, id: string, collection: boolean) {
  return transaction(db, async (tx) => {
    if (collection) await tx.runAsync('DELETE FROM dhikr_logs WHERE user_id=? AND collection_session_id=?', user, id);
    await tx.runAsync(collection ? 'DELETE FROM dhikr_collection_sessions WHERE user_id=? AND id=?'
      : 'DELETE FROM dhikr_logs WHERE user_id=? AND id=? AND collection_session_id IS NULL', user, id);
  });
}

export async function readDhikrHaptics(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{value: string}>("SELECT value FROM app_settings WHERE key='dhikr_haptics_enabled'");
  return row?.value !== 'false';
}

export function writeDhikrHaptics(db: SQLiteDatabase, enabled: boolean) {
  return db.runAsync("INSERT INTO app_settings (key,value) VALUES ('dhikr_haptics_enabled',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    String(enabled));
}

export function reorderDhikr(db: SQLiteDatabase, user: string, ids: string[]) {
  return transaction(db, async (tx) => {
    const available = await readDhikrItems(tx, user);
    for (const [sort, id] of ids.entries()) {
      if (!available.some((item) => item.id === id)) throw new Error('Unavailable activity');
      await tx.runAsync(`INSERT INTO user_dhikr_preferences (user_id,item_id,sort_order) VALUES (?,?,?)
        ON CONFLICT(user_id,item_id) DO UPDATE SET sort_order=excluded.sort_order`, user, id, sort);
    }
  });
}

const displayKeys = {
  latin: 'dhikr_show_transliteration',
  translation: 'dhikr_show_translation',
} as const;

export type DhikrDisplayPreferences = Record<keyof typeof displayKeys, boolean>;

export async function readDhikrDisplayPreferences(db: SQLiteDatabase): Promise<DhikrDisplayPreferences> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key,value FROM app_settings WHERE key IN (?,?)', displayKeys.latin, displayKeys.translation);
  const disabled = new Set(rows.filter((row) => row.value === 'false').map((row) => row.key));
  return { latin: !disabled.has(displayKeys.latin), translation: !disabled.has(displayKeys.translation) };
}

export function writeDhikrDisplayPreference(db: SQLiteDatabase, setting: keyof DhikrDisplayPreferences, enabled: boolean) {
  return db.runAsync(`INSERT INTO app_settings (key,value) VALUES (?,?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value`, displayKeys[setting], String(enabled));
}
