import { addDays, localDate, parseLocalDate, weekDates } from '../utils/localDate.ts';
import type { Weekday } from '../types/settings';
import { countAyat, type Catalog, type Session } from './quranRules.ts';

export const cadences = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;
export type Cadence = typeof cadences[number];
export type GoalState = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type Category = keyof typeof goalMetrics;
type FilterKind = 'none' | 'sunnah' | 'dhikr' | 'counter' | 'collection' | 'dhikrOrCollection';
type Definition = { filter: FilterKind; unit: string; capacity?: 'days' | 'prayers'; route: '/prayer' | '/sunnah' | '/quran' | '/dhikr' };
export const goalMetrics = {
  WAJIB: {
    COMPLETED_PRAYERS: { filter: 'none', unit: 'prayers', capacity: 'prayers', route: '/prayer' },
    COMPLETE_DAYS: { filter: 'none', unit: 'days', capacity: 'days', route: '/prayer' },
    ON_TIME_PRAYERS: { filter: 'none', unit: 'prayers', capacity: 'prayers', route: '/prayer' },
    CONGREGATIONAL_PRAYERS: { filter: 'none', unit: 'prayers', capacity: 'prayers', route: '/prayer' },
  },
  SUNNAH: {
    SESSION_COUNT: { filter: 'sunnah', unit: 'sessions', route: '/sunnah' },
    ACTIVE_DAYS: { filter: 'sunnah', unit: 'days', capacity: 'days', route: '/sunnah' },
    RAKAAT_COUNT: { filter: 'sunnah', unit: 'rakaat', route: '/sunnah' },
  },
  QURAN: {
    AYAH_COUNT: { filter: 'none', unit: 'ayat', route: '/quran' },
    SESSION_COUNT: { filter: 'none', unit: 'sessions', route: '/quran' },
    DURATION_MINUTES: { filter: 'none', unit: 'minutes', route: '/quran' },
    ACTIVE_DAYS: { filter: 'none', unit: 'days', capacity: 'days', route: '/quran' },
  },
  DHIKR: {
    REPETITION_COUNT: { filter: 'counter', unit: 'repetitions', route: '/dhikr' },
    SESSION_COUNT: { filter: 'dhikr', unit: 'sessions', route: '/dhikr' },
    ACTIVE_DAYS: { filter: 'dhikrOrCollection', unit: 'days', capacity: 'days', route: '/dhikr' },
    COLLECTION_COMPLETION: { filter: 'collection', unit: 'collections', route: '/dhikr' },
  },
} satisfies Record<string, Record<string, Definition>>;
export type Config = { [C in Category]: {
  category: C; metric: keyof typeof goalMetrics[C]; name: string; filter: string; target: number; cadence: Cadence;
} }[Category];
export type Version = Config & { goalId: string; from: string; state: GoalState };
export type Period = { goalId: string; start: string; end: string; versionFrom: string; weekStart: Weekday | null; transition: number };
export type Activity = { id: string; label: string; archived?: boolean; checklist?: boolean };
export type Activities = { sunnah: Activity[]; dhikr: Activity[]; collection: Activity[] };
export const rawatib = ['before-fajr', 'before-dhuhr', 'after-dhuhr', 'after-maghrib', 'after-isha'];
export const morningEvening = ['morning', 'evening'];
export const postPrayerCollections = ['post-591', 'post-34', 'post-33'];
export function definition(category: Category, metric: string): Definition | undefined {
  if (!Object.hasOwn(goalMetrics, category)) return;
  const group: Record<string, Definition> = goalMetrics[category];
  return Object.hasOwn(group, metric) ? group[metric] : undefined;
}
export function filters(kind: FilterKind, activities: Activities): Activity[] {
  const all = { id: 'all', label: 'all' };
  const collections = activities.collection.map(row => ({ ...row, id: 'collection:' + row.id }));
  if (morningEvening.every(id => activities.collection.some(row => row.id === id))) collections.push({id:'collection:morning-evening',label:'morningEvening'});
  if (postPrayerCollections.every(id => activities.collection.some(row => row.id === id))) collections.push({id:'collection:post-prayer',label:'postPrayer'});
  switch (kind) {
    case 'none': return [all];
    case 'sunnah': return [all, ...(rawatib.every(id => activities.sunnah.some(row => row.id === id)) ? [{id:'rawatib',label:'rawatib'}] : []), ...activities.sunnah];
    case 'collection': return collections;
    case 'counter': return [all, ...activities.dhikr.filter(row => !row.checklist)];
    case 'dhikrOrCollection': return [all, ...activities.dhikr, ...collections];
    case 'dhikr': return [all, ...activities.dhikr];
  }
}
export function maximum(cadence: Cadence, capacity?: Definition['capacity']) {
  const days = cadence === 'DAILY' ? 1 : cadence === 'WEEKLY' ? 7 : 31;
  return capacity === 'days' ? days : capacity === 'prayers' ? days * 5 : 1000000;
}
export function validateGoal(config: Config, activities: Activities, allowArchived?: string) {
  const metric = definition(config.category, config.metric);
  return !!metric && cadences.includes(config.cadence) && config.name.trim().length > 0 && config.name.trim().length <= 80 &&
    Number.isSafeInteger(config.target) && config.target > 0 && config.target <= maximum(config.cadence, metric.capacity) &&
    filters(metric.filter, activities).some(item => item.id === config.filter && (!item.archived || item.id === allowArchived));
}
export function calendarPeriod(date: string, cadence: Cadence, weekStart: Weekday) {
  if (cadence === 'DAILY') return { start: date, end: addDays(date, 1) };
  if (cadence === 'WEEKLY') {
    const [start] = weekDates(date, weekStart);
    return {start, end: addDays(start, 7)};
  }
  const next = parseLocalDate(date);
  if (!next) throw new Error('date');
  next.setDate(1);
  next.setMonth(next.getMonth() + 1);
  return {start: date.slice(0, 7) + '-01', end: localDate(next)};
}
export function makePeriod(version: Version, start: string, weekStart: Weekday): Period {
  const aligned = calendarPeriod(start, version.cadence, weekStart);
  return {goalId:version.goalId, start, end:aligned.end, versionFrom:version.from, weekStart:version.cadence === 'WEEKLY' ? weekStart : null,
    transition: Number(start !== aligned.start)};
}
type RecordBase = { id: string; date: string };
export type Worship = {
  catalog: Catalog;
  prayer: (RecordBase & {status:string; onTime: boolean | null; congregational: boolean | null})[];
  sunnah: (RecordBase & {activityId:string; rakaat:number | null})[];
  quran: Session[];
  dhikr: (RecordBase & {itemId:string; mode:string; count:number})[];
  collections: (RecordBase & {collection:string; status:string})[];
};
export function calculateGoal(version: Version, period: Period, data: Worship, today: string) {
  const within = ({date}: RecordBase) => date >= period.start && date < period.end && date <= today;
  const days: string[] = [];
  for (let date = period.start; date < period.end; date = addDays(date, 1)) days.push(date);
  const matchCollection = (id: string) => {
    if (version.filter === 'collection:morning-evening') return morningEvening.includes(id);
    if (version.filter === 'collection:post-prayer') return postPrayerCollections.includes(id);
    return version.filter === 'collection:' + id;
  };
  let capacity = definition(version.category, version.metric)?.capacity === 'days' ? days.length : null;
  let actual = 0;
  let known = 0;
  let missing = 0;
  let records: RecordBase[] = [];
  switch (version.category) {
    case 'WAJIB': {
      const prayer = data.prayer.filter(within);
      const completed = prayer.filter(row => row.status === 'COMPLETED');
      const exempt = prayer.filter(row => row.status === 'EXEMPT');
      if (version.metric === 'COMPLETE_DAYS') {
        const applicable = days.filter(date => exempt.filter(row => row.date === date).length < 5);
        const complete = new Set(applicable.filter(date => completed.filter(row => row.date === date).length === 5 - exempt.filter(row => row.date === date).length));
        capacity = applicable.length;
        actual = complete.size;
        records = completed.filter(row => complete.has(row.date));
      } else {
        capacity = days.length * 5 - exempt.length;
        records = completed.filter(row => version.metric === 'COMPLETED_PRAYERS' ||
          (version.metric === 'ON_TIME_PRAYERS' ? row.onTime === true : row.congregational === true));
        actual = records.length;
      }
      break;
    }
    case 'SUNNAH': {
      const rows = data.sunnah.filter(row => within(row) && (version.filter === 'all' || row.activityId === version.filter ||
        (version.filter === 'rawatib' && rawatib.includes(row.activityId))));
      records = rows;
      missing = version.metric === 'RAKAAT_COUNT' ? rows.filter(row => row.rakaat === null).length : 0;
      actual = version.metric === 'RAKAAT_COUNT' ? rows.reduce((sum,row) => sum + (row.rakaat ?? 0),0) :
        version.metric === 'ACTIVE_DAYS' ? new Set(rows.map(row => row.date)).size : rows.length;
      break;
    }
    case 'QURAN': {
      const rows = data.quran.filter(within);
      records = rows;
      if (version.metric === 'DURATION_MINUTES') {
        missing = rows.filter(row => row.duration === null).length;
        actual = rows.reduce((sum,row) => sum + (row.duration ?? 0),0);
      } else if (version.metric === 'AYAH_COUNT') {
        actual = rows.reduce((sum,row) => {
          const value = countAyat(data.catalog, row.start, row.end);
          if (value === null) throw new Error('invalid saved Quran range');
          return sum + value;
        },0);
      } else actual = version.metric === 'ACTIVE_DAYS' ? new Set(rows.map(row => row.date)).size : rows.length;
      break;
    }
    case 'DHIKR': {
      if (version.filter.startsWith('collection:')) {
        records = data.collections.filter(row => within(row) && row.status === 'COMPLETE' && matchCollection(row.collection));
        actual = version.metric === 'ACTIVE_DAYS' ? new Set(records.map(row => row.date)).size : records.length;
      } else {
        const rows = data.dhikr.filter(row => within(row) && (version.filter === 'all' || version.filter === row.itemId) &&
          (version.metric !== 'REPETITION_COUNT' || row.mode === 'COUNTER'));
        records = rows;
        actual = version.metric === 'REPETITION_COUNT' ? rows.reduce((sum,row) => sum + row.count,0) :
          version.metric === 'ACTIVE_DAYS' ? new Set(rows.map(row => row.date)).size : rows.length;
      }
      break;
    }
  }
  known = records.length - missing;
  const effective = capacity === null ? version.target : Math.min(version.target, capacity);
  const percentage = effective === 0 ? null : actual / effective * 100;
  const status = effective === 0 ? 'NOT_APPLICABLE' : actual >= effective ? 'ACHIEVED' :
    today < period.end ? 'IN_PROGRESS' : 'NOT_ACHIEVED';
  return {actual, effective, capacity, percentage, bar: percentage === null ? null : Math.min(100, percentage), status,
    remaining: Math.max(0, effective - actual), records:records.map(({id,date}) => ({id,date})),
    known, missing, calculatedAt: new Date().toISOString()};
}
export type GoalResult = ReturnType<typeof calculateGoal>;
