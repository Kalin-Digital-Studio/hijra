import type { SQLiteDatabase } from 'expo-sqlite';
import type { Weekday } from '../../types/settings';
import { addDays, localDate, parseLocalDate } from '../../utils/localDate.ts';
import { comparisonRanges, type ReportSelection } from '../../services/reportDates.ts';
import type { CollectionRecord, ReportSource } from '../../services/reportRules.ts';
import { readDhikrItems, readDhikrLogs } from './dhikr.ts';
import { readActiveGoals, readGoalHistory } from './goals.ts';
import { readPrayerLogs, readPrayerTypes } from './prayer.ts';
import { readReading, readSurahs } from './quran.ts';
import { readSunnahActivities,readSunnahSessions } from './sunnah.ts';

function creationDate(timestamp?:string) {
  if(!timestamp) return null;
  const dateOnly=parseLocalDate(timestamp);
  if(dateOnly) return localDate(dateOnly);
  const normalized=timestamp.includes(' ')?timestamp.replace(' ','T')+'Z':timestamp;
  const instant=Date.parse(normalized);
  return Number.isFinite(instant)?localDate(new Date(instant)):null;
}
export async function readReport(db:SQLiteDatabase,user:string,selection:ReportSelection,today:string,week:Weekday,calendarOnly=false) {
  const windows=comparisonRanges(selection,today,week);
  const first=calendarOnly?windows.elapsed.start:windows.previous.start;
  const end=windows.elapsed.end;
  const last=addDays(end,-1);
  const [profile,earliest,ids,prayers,sunnah,quran,catalog,dhikr,collections,closed,active,sunnahOptions,dhikrOptions,collectionOptions]=await Promise.all([
    db.getFirstAsync<{created:string}>('SELECT created_at AS created FROM user_profiles WHERE id=?',user),
    db.getFirstAsync<{date:string|null}>('SELECT MIN(prayer_date) AS date FROM prayer_logs WHERE user_id=?',user),
    readPrayerTypes(db),readPrayerLogs(db,user,first,last),readSunnahSessions(db,user,first,last),
    readReading(db,user,first,last),readSurahs(db),readDhikrLogs(db,user,first,last),
    db.getAllAsync<CollectionRecord>(`SELECT id,date,collection_id AS collection,status FROM dhikr_collection_sessions
      WHERE user_id=? AND date BETWEEN ? AND ?`,user,first,last),
    calendarOnly?[]:readGoalHistory(db,user,today,{attributionStart:first,attributionEnd:end}),
    calendarOnly?[]:readActiveGoals(db,user,today),
    calendarOnly?[]:readSunnahActivities(db,user),calendarOnly?[]:readDhikrItems(db,user),
    calendarOnly?[]:db.getAllAsync<{id:string}>('SELECT id FROM dhikr_collections ORDER BY id'),
  ]);
  if(!profile) throw new Error('Unknown profile');
  const created=creationDate(profile.created);
  const prior=earliest?.date && parseLocalDate(earliest.date) ? earliest.date : null;
  const prayerStart=prior && (!created || prior<created)?prior:created;
  const data:ReportSource={ids,prayerStart,prayers,sunnah,quran,catalog,dhikr,collections,goals:[
    ...closed.map(row=>({...row,open:false})),
    ...active.flatMap(row=>row.progress?[{...row.progress,open:true}]:[]),
  ]};
  return {data,windows,sunnahOptions,dhikrOptions,collectionOptions};
}
export type ReportData=Awaited<ReturnType<typeof readReport>>;
