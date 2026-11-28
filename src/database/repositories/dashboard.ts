import type { SQLiteDatabase } from 'expo-sqlite';
import { dashboardGoals, dashboardPrayerTrend, dashboardReading } from '../../services/dashboardRules.ts';
import { summarizeDhikr } from '../../services/dhikrRules.ts';
import { summarizeReading } from '../../services/quranRules.ts';
import { summarizeSunnah } from '../../services/sunnahRules.ts';
import { addDays } from '../../utils/localDate.ts';
import { readDhikrLogs } from './dhikr.ts';
import { readActiveGoals } from './goals.ts';
import { readPrayerLogs, readPrayerTypes } from './prayer.ts';
import { readBookmark, readReading, readSurahs } from './quran.ts';
import { readSunnahSessions } from './sunnah.ts';

export type RecentActivity = {
  kind: 'prayer' | 'sunnah' | 'quran' | 'dhikr' | 'collection';
  id: string;
  date: string;
  activity: string | null;
  label: string | null;
  status: string | null;
  amount: number | null;
  time: string | null;
  startSurah: number | null;
  startAyah: number | null;
  endSurah: number | null;
  endAyah: number | null;
};

async function readRecentActivities(db: SQLiteDatabase,user: string,today: string) {
  // Each existing user/date index feeds a bounded candidate list.
  const rows = await db.getAllAsync<RecentActivity>(`
    WITH prayers AS (
      SELECT 'prayer' AS kind,id,prayer_date AS date,ibadah_type_id AS activity,
        NULL AS label,status,NULL AS amount,NULL AS time,julianday(created_at) AS recorded,
        NULL AS startSurah,NULL AS startAyah,NULL AS endSurah,NULL AS endAyah
      FROM prayer_logs WHERE user_id=? AND prayer_date<=? AND status='COMPLETED'
      ORDER BY date DESC,recorded DESC,id LIMIT 5
    ), sunnah AS (
      SELECT 'sunnah',l.id,l.prayer_date AS date,l.ibadah_type_id,i.custom_name,NULL,l.rakaat,l.prayer_time,
        julianday(l.created_at) AS recorded,NULL,NULL,NULL,NULL
      FROM sunnah_prayer_logs l JOIN ibadah_types i ON i.id=l.ibadah_type_id
      WHERE l.user_id=? AND l.prayer_date<=? ORDER BY date DESC,recorded DESC,l.id LIMIT 5
    ), quran AS (
      SELECT 'quran',id,reading_date AS date,NULL,NULL,NULL,NULL,NULL,
        julianday(created_at) AS recorded,start_surah,start_ayah,end_surah,end_ayah
      FROM quran_reading_logs WHERE user_id=? AND reading_date<=? ORDER BY date DESC,recorded DESC,id LIMIT 5
    ), dhikr AS (
      SELECT 'dhikr',l.id,l.date,l.item_id,l.label,l.mode,l.count,NULL,NULL AS recorded,NULL,NULL,NULL,NULL
      FROM dhikr_logs l WHERE l.user_id=? AND l.date<=? AND l.collection_session_id IS NULL
      ORDER BY l.date DESC,l.id LIMIT 5
    ), collections AS (
      SELECT 'collection',id,date,collection_id,NULL,status,NULL,NULL,NULL AS recorded,NULL,NULL,NULL,NULL
      FROM dhikr_collection_sessions WHERE user_id=? AND date<=? ORDER BY date DESC,id LIMIT 5
    ), candidates AS (
      SELECT * FROM prayers UNION ALL SELECT * FROM sunnah UNION ALL SELECT * FROM quran
      UNION ALL SELECT * FROM dhikr UNION ALL SELECT * FROM collections
    )
    SELECT kind,id,date,activity,label,status,amount,time,startSurah,startAyah,endSurah,endAyah
    FROM candidates ORDER BY date DESC,recorded DESC,kind,id LIMIT 5`,
    user,today,user,today,user,today,user,today,user,today);
  return rows;
}

export async function readDashboard(db: SQLiteDatabase,user: string,today: string) {
  const [ids,prayer,sunnah,quran,catalog,bookmark,dhikr,goals,recent] = await Promise.all([
    readPrayerTypes(db), readPrayerLogs(db,user,addDays(today,-6),today), readSunnahSessions(db,user,today),
    readReading(db,user,today),readSurahs(db),readBookmark(db,user),readDhikrLogs(db,user,today),
    readActiveGoals(db,user,today,'DAILY'),readRecentActivities(db,user,today),
  ]);
  const trend=dashboardPrayerTrend(today,ids,prayer);
  return {
    today,prayer:trend[6],trend,sunnah:summarizeSunnah(sunnah),quran:summarizeReading(catalog,quran),
    reading:dashboardReading(catalog,bookmark ?? null),dhikr:summarizeDhikr(dhikr),goals:dashboardGoals(goals),recent,
    calculatedAt:new Date().toISOString(),
  };
}
export type DashboardSummary = Awaited<ReturnType<typeof readDashboard>>;
