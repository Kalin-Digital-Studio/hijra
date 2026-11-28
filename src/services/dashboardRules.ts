import { addDays } from '../utils/localDate.ts';
import { prayerSlots, summarizePrayers } from './prayerRules.ts';
import { nextPosition, type Catalog, type Position } from './quranRules.ts';
import type { PrayerId, PrayerLog } from '../types/prayer';
import type { GoalSnapshot } from '../database/repositories/goals';

export function dashboardPrayerTrend(today: string, ids: readonly PrayerId[], logs: readonly PrayerLog[]) {
  return Array.from({length:7}, (_,index) => {
    const date = addDays(today,index-6);
    const counts = summarizePrayers(prayerSlots(ids,logs,date).map(slot => slot.record));
    const state = counts.applicableSlots === 0 ? 'exempt' :
      counts.completed === counts.applicableSlots ? 'complete' :
      counts.missed > 0 ? 'missed' : counts.completed || counts.exempt ? 'recorded' : 'empty';
    return {date,state,...counts};
  });
}

export function dashboardGoals(goals: readonly GoalSnapshot[]) {
  const active = goals.filter(goal => goal.version.state === 'ACTIVE' && goal.progress);
  const daily = active.filter(goal => goal.version.cadence === 'DAILY');
  const applicable = daily.filter(goal => goal.progress?.result.percentage !== null);
  const inProgress = applicable.filter(goal => goal.progress?.result.status === 'IN_PROGRESS');
  const achieved = applicable.filter(goal => goal.progress?.result.status === 'ACHIEVED');
  return {
    applicable: applicable.length,
    achieved: achieved.length,
    inProgress: inProgress.length,
    notApplicable: daily.length - applicable.length,
    hasOtherPeriods: goals.some(goal => goal.version.state === 'ACTIVE' && goal.version.cadence !== 'DAILY'),
    percentage: applicable.length ? achieved.length / applicable.length * 100 : null,
    previews: [...inProgress,...achieved].slice(0,3),
  };
}

export function dashboardReading(catalog: Catalog, bookmark: Position | null) {
  const next = bookmark ? nextPosition(catalog,bookmark) : null;
  const chapter = catalog.get(bookmark?.surah ?? 1);
  return {catalog,bookmark,next,chapter};
}
