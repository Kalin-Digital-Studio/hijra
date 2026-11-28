import type { SQLiteDatabase } from 'expo-sqlite';
import { addDays, assertEligibleDate } from '../../utils/localDate.ts';
import type { Weekday } from '../../types/settings';
import { calendarPeriod, calculateGoal, makePeriod, validateGoal, type Activities, type Cadence, type Category,
  type Config, type GoalState, type Period, type Version, type Worship } from '../../services/goalRules.ts';
import { readPrayerLogs } from './prayer.ts';
import { readSunnahActivities, readSunnahSessions } from './sunnah.ts';
import { readReading, readSurahs } from './quran.ts';
import { readDhikrItems, readDhikrLogs } from './dhikr.ts';

const versionFields = 'v.goal_id AS goalId,v.effective_from AS "from",v.name,v.category,v.filter,v.metric,v.target,v.cadence,v.state';
const periodFields = 'p.goal_id AS goalId,p.start,p.end_exclusive AS end,p.version_from AS versionFrom,p.week_start AS weekStart,p.transition';
const queue = new WeakMap<SQLiteDatabase, Promise<unknown>>();
function transaction<T>(db: SQLiteDatabase, action: (tx: SQLiteDatabase) => Promise<T>) {
  const run = (queue.get(db) ?? Promise.resolve()).then(async () => {
    let result!: T;
    await db.withExclusiveTransactionAsync(async tx => { result = await action(tx); });
    return result;
  });
  queue.set(db, run.catch(() => undefined));
  return run;
}
export async function readGoalActivities(db: SQLiteDatabase, user: string): Promise<Activities> {
  const [sunnah, dhikr, collection] = await Promise.all([
    readSunnahActivities(db,user), readDhikrItems(db,user),
    db.getAllAsync<{id:string}>('SELECT id FROM dhikr_collections ORDER BY id'),
  ]);
  return {
    sunnah:sunnah.map(row => ({id: row.id, label:row.name ?? 'types.'+row.id})),
    dhikr:dhikr.map(row => ({id:row.id,label:row.label,archived:!!row.archived,checklist:row.mode === 'CHECKLIST'})),
    collection:collection.map(row => ({id:row.id,label:'dhikr.catalog.'+row.id})),
  };
}
async function readVersions(db: SQLiteDatabase,user: string, id?: string) {
  return db.getAllAsync<Version>(`SELECT ${versionFields} FROM personal_goal_versions v
    JOIN personal_goals g ON g.id=v.goal_id WHERE g.user_id=? AND (? IS NULL OR v.goal_id=?)
    ORDER BY v.goal_id,v.effective_from`,user,id ?? null,id ?? null);
}
async function insertVersion(db: SQLiteDatabase, version: Version) {
  await db.runAsync(`INSERT INTO personal_goal_versions
    (goal_id,effective_from,name,category,filter,metric,target,cadence,state) VALUES (?,?,?,?,?,?,?,?,?)`,
    version.goalId,version.from,version.name.trim(),version.category,version.filter,version.metric,version.target,version.cadence,version.state);
}
async function insertPeriods(db: SQLiteDatabase, periods: Period[]) {
  for (let index=0; index<periods.length; index+=100) {
    const batch = periods.slice(index,index+100);
    await db.runAsync(`INSERT INTO personal_goal_periods (goal_id,start,end_exclusive,version_from,week_start,transition)
      VALUES ${batch.map(() => '(?,?,?,?,?,?)').join(',')}`,
      ...batch.flatMap(p => [p.goalId,p.start,p.end,p.versionFrom,p.weekStart,p.transition]));
  }
}
async function reconcile(tx: SQLiteDatabase, user: string, today: string, week: Weekday) {
  const [versions, latest] = await Promise.all([
    readVersions(tx,user),
    tx.getAllAsync<{goalId:string;end:string}>(`SELECT p.goal_id AS goalId, MAX(p.end_exclusive) AS end
      FROM personal_goal_periods p JOIN personal_goals g ON g.id=p.goal_id WHERE g.user_id=? GROUP BY p.goal_id`,user),
  ]);
  const ends = new Map(latest.map(row => [row.goalId,row.end]));
  const periods: Period[] = [];
  for (const [index, version] of versions.entries()) {
    if (version.state !== 'ACTIVE') continue;
    const next = versions[index+1]?.goalId === version.goalId ? versions[index+1].from : null;
    let start = ends.get(version.goalId) ?? version.from;
    if (start < version.from) start = version.from;
    while (start <= today && (!next || start < next)) {
      const period = makePeriod(version,start,week);
      if (next && period.end > next) period.end = next;
      periods.push(period);
      start = period.end;
    }
    ends.set(version.goalId,start);
  }
  await insertPeriods(tx,periods);
}
export function reconcileGoals(db: SQLiteDatabase,user: string,today: string,week: Weekday) {
  return transaction(db,tx => reconcile(tx,user,today,week));
}
const fingerprint = (goal: Config) => JSON.stringify([goal.category,goal.metric,goal.filter,goal.cadence,goal.target]);
export class DuplicateGoalError extends Error {}

export function createGoals(db: SQLiteDatabase,user: string, entries: {id:string;config:Config}[],today: string,week: Weekday, allowDuplicates = false) {
  assertEligibleDate(today);
  return transaction(db,async tx => {
    if (!await tx.getFirstAsync('SELECT id FROM user_profiles WHERE id=?',user)) throw new Error('profile');
    const [options, versions] = await Promise.all([readGoalActivities(tx,user),readVersions(tx,user)]);
    if (!entries.length || entries.length > 10 || entries.some(({id,config}) => !id || !validateGoal(config,options))) throw new Error('invalid goal');
    const existing = new Map<string,Version>();
    for (const version of versions) if (version.from <= today) existing.set(version.goalId,version);
    const fingerprints = new Set([...existing.values()].filter(row => row.state === 'ACTIVE').map(fingerprint));
    for (const {id,config} of entries) {
      const sameId = existing.get(id);
      if (sameId && fingerprint(sameId) === fingerprint(config) && sameId.name === config.name.trim()) continue;
      const key = fingerprint(config);
      if (!allowDuplicates && fingerprints.has(key)) throw new DuplicateGoalError('equivalent');
      fingerprints.add(key);
      await tx.runAsync('INSERT INTO personal_goals(id,user_id,created_date) VALUES(?,?,?)',id,user,today);
      const from = calendarPeriod(today,config.cadence,week).start;
      await insertVersion(tx,{...config,goalId:id,from,state:'ACTIVE'});
    }
    await reconcile(tx,user,today,week);
  });
}
export type GoalChange = {action:'edit'; config:Config} | {action:'cancel' | 'pause' | 'resume' | 'archive'};
export function changeGoal(db: SQLiteDatabase,user: string,id: string,change: GoalChange,today: string,week: Weekday) {
  assertEligibleDate(today);
  return transaction(db,async tx => {
    await reconcile(tx,user,today,week);
    const versions = await readVersions(tx,user,id);
    const current = versions.filter(v => v.from <= today).at(-1);
    const pending = versions.find(v => v.from > today);
    if (!current || current.state === 'ARCHIVED') throw new Error('unknown goal');
    if (change.action === 'cancel') {
      if (pending) await tx.runAsync('DELETE FROM personal_goal_versions WHERE goal_id=? AND effective_from=?',id,pending.from);
      return;
    }
    if ((change.action === 'resume' && current.state !== 'PAUSED') ||
      ((change.action === 'pause' || change.action === 'edit') && current.state !== 'ACTIVE')) throw new Error('invalid lifecycle');
    const open = await tx.getFirstAsync<{end:string}>(`SELECT end_exclusive AS end FROM personal_goal_periods
      WHERE goal_id=? AND start<=? AND end_exclusive>?`,id,today,today);
    const from = open?.end ?? calendarPeriod(today,current.cadence,week).end;
    const config = change.action === 'edit' ? change.config : current;
    if (change.action === 'edit' && !validateGoal(config,await readGoalActivities(tx,user),current.filter)) throw new Error('invalid goal');
    const state: GoalState = change.action === 'pause' ? 'PAUSED' : change.action === 'archive' ? 'ARCHIVED' : 'ACTIVE';
    if (pending) await tx.runAsync('DELETE FROM personal_goal_versions WHERE goal_id=? AND effective_from=?',id,pending.from);
    await insertVersion(tx,{...config,goalId:id,from,state});
  });
}
type HistoryFilter = { id?:string; category?:Category; cadence?:Cadence; limit?:number; offset?:number; attributionStart?:string; attributionEnd?:string };
type PeriodRow = Period & { version: Version };
async function readPeriods(db: SQLiteDatabase,user: string,today: string, filter: HistoryFilter | undefined, currentCadence?: Cadence): Promise<PeriodRow[]> {
  const rows = await db.getAllAsync<Period & Omit<Version,'goalId'|'from'>>(`SELECT ${periodFields},
    v.name,v.category,v.filter,v.metric,v.target,v.cadence,v.state
    FROM personal_goal_periods p JOIN personal_goals g ON g.id=p.goal_id
    JOIN personal_goal_versions v ON v.goal_id=p.goal_id AND v.effective_from=p.version_from
    WHERE g.user_id=? AND p.start<=? AND (p.end_exclusive ${filter ? '<=' : '>'} ?)
    AND (? IS NULL OR p.goal_id=?) AND (? IS NULL OR v.category=?) AND (? IS NULL OR v.cadence=?)
    AND (? IS NULL OR p.end_exclusive>?) AND (? IS NULL OR p.end_exclusive<=?)
    ORDER BY p.start DESC,p.goal_id LIMIT ? OFFSET ?`,user,today,today,filter?.id ?? null,filter?.id ?? null,
    filter?.category ?? null,filter?.category ?? null,filter?.cadence ?? currentCadence ?? null,filter?.cadence ?? currentCadence ?? null,
    filter?.attributionStart ?? null,filter?.attributionStart ?? null,filter?.attributionEnd ?? null,filter?.attributionEnd ?? null,
    filter?.limit ?? -1,filter?.offset ?? 0);
  return rows.map(row => ({...row,version:{...row,from:row.versionFrom} as Version}));
}
async function worship(db: SQLiteDatabase,user: string,periods: PeriodRow[],today: string): Promise<Worship> {
  const start = periods.reduce((value,row) => row.start < value ? row.start : value,today);
  const end = periods.reduce((value,row) => row.end > value ? row.end : value,addDays(start,1));
  const last = addDays(end,-1) < today ? addDays(end,-1) : today;
  const categories = new Set(periods.map(row => row.version.category));
  const [catalog,prayer,sunnah,quran,dhikr,collections] = await Promise.all([
    categories.has('QURAN') ? readSurahs(db) : new Map(),
    categories.has('WAJIB') ? readPrayerLogs(db,user,start,last) : [],
    categories.has('SUNNAH') ? readSunnahSessions(db,user,start,last) : [],
    categories.has('QURAN') ? readReading(db,user,start,last) : [],
    categories.has('DHIKR') ? readDhikrLogs(db,user,start,last) : [],
    categories.has('DHIKR') ? db.getAllAsync<Worship['collections'][number]>(`SELECT id,date,collection_id AS collection,status
      FROM dhikr_collection_sessions WHERE user_id=? AND date BETWEEN ? AND ?`,user,start,last) : [],
  ]);
  return {catalog,prayer,sunnah,quran,dhikr,collections};
}
async function calculatePeriods(db: SQLiteDatabase,user: string,today: string,periods: PeriodRow[]) {
  if (!periods.length) return [];
  const data = await worship(db,user,periods,today);
  return periods.map(period => ({period,version:period.version,result:calculateGoal(period.version,period,data,today)}));
}
export async function readActiveGoals(db: SQLiteDatabase,user:string,today:string,cadence?:Cadence) {
  const [versions,periods] = await Promise.all([readVersions(db,user),readPeriods(db,user,today,undefined,cadence)]);
  const calculated = await calculatePeriods(db,user,today,periods);
  const current = new Map<string,Version>(), pending = new Map<string,Version>();
  for (const item of versions) (item.from <= today ? current : pending).set(item.goalId,item);
  const progress = new Map(calculated.map(item => [item.version.goalId,item]));
  return [...current.values()].map(version => ({version,pending:pending.get(version.goalId),progress:progress.get(version.goalId)}));
}
export async function readGoalHistory(db: SQLiteDatabase,user:string,today:string,filter: HistoryFilter) {
  return calculatePeriods(db,user,today,await readPeriods(db,user,today,filter));
}
export type GoalSnapshot = Awaited<ReturnType<typeof readActiveGoals>>[number];
export type GoalProgress = Awaited<ReturnType<typeof readGoalHistory>>[number];
