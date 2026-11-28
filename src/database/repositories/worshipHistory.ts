import type { SQLiteDatabase } from 'expo-sqlite';
import type { DateRange } from '../../services/reportDates';

export const worshipKinds=['wajib','sunnah','quran','dhikr','collection'] as const;
export type WorshipKind=typeof worshipKinds[number];
export type WorshipFilter=Exclude<WorshipKind,'collection'>|'all';
export type WorshipItem={
  kind:WorshipKind;id:string;date:string;activity:string|null;label:string|null;status:string|null;
  actualTime:string|null;recordedAt:string|null;amount:number|null;onTime:number|null;congregation:number|null;
  startSurah:number|null;startAyah:number|null;endSurah:number|null;endAyah:number|null;duration:number|null;
};
const sources={
  wajib:`SELECT 'wajib' AS kind,id,prayer_date AS date,ibadah_type_id AS activity,NULL AS label,status,
    NULL AS actualTime,created_at AS recordedAt,NULL AS amount,is_on_time AS onTime,is_congregational AS congregation,
    NULL AS startSurah,NULL AS startAyah,NULL AS endSurah,NULL AS endAyah,NULL AS duration
    FROM prayer_logs WHERE user_id=? AND prayer_date>=? AND prayer_date<? AND status IN ('COMPLETED','MISSED','EXEMPT')`,
  sunnah:`SELECT 'sunnah' AS kind,l.id,l.prayer_date AS date,l.ibadah_type_id AS activity,i.custom_name AS label,
    NULL AS status,l.prayer_time AS actualTime,l.created_at AS recordedAt,l.rakaat AS amount,NULL AS onTime,NULL AS congregation,
    NULL AS startSurah,NULL AS startAyah,NULL AS endSurah,NULL AS endAyah,NULL AS duration
    FROM sunnah_prayer_logs l LEFT JOIN ibadah_types i ON i.id=l.ibadah_type_id
    WHERE l.user_id=? AND l.prayer_date>=? AND l.prayer_date<?`,
  quran:`SELECT 'quran' AS kind,id,reading_date AS date,NULL AS activity,NULL AS label,NULL AS status,
    NULL AS actualTime,created_at AS recordedAt,NULL AS amount,NULL AS onTime,NULL AS congregation,
    start_surah AS startSurah,start_ayah AS startAyah,end_surah AS endSurah,end_ayah AS endAyah,duration_minutes AS duration
    FROM quran_reading_logs WHERE user_id=? AND reading_date>=? AND reading_date<?`,
  dhikr:`SELECT 'dhikr' AS kind,id,date,item_id AS activity,label,mode AS status,NULL AS actualTime,NULL AS recordedAt,
    CASE WHEN mode='COUNTER' THEN count END AS amount,NULL AS onTime,NULL AS congregation,
    NULL AS startSurah,NULL AS startAyah,NULL AS endSurah,NULL AS endAyah,NULL AS duration
    FROM dhikr_logs WHERE user_id=? AND date>=? AND date<? AND collection_session_id IS NULL`,
  collection:`SELECT 'collection' AS kind,id,date,collection_id AS activity,NULL AS label,status,
    NULL AS actualTime,NULL AS recordedAt,NULL AS amount,NULL AS onTime,NULL AS congregation,
    NULL AS startSurah,NULL AS startAyah,NULL AS endSurah,NULL AS endAyah,NULL AS duration
    FROM dhikr_collection_sessions WHERE user_id=? AND date>=? AND date<?`,
} satisfies Record<WorshipKind,string>;
export async function readWorshipHistory(db:SQLiteDatabase,user:string,range:DateRange,filter:WorshipFilter,limit:number,offset:number) {
  const kinds:readonly WorshipKind[]=filter==='all'?worshipKinds:filter==='dhikr'?['dhikr','collection']:[filter];
  const union=kinds.map(kind=>sources[kind]).join(' UNION ALL ');
  const bind=kinds.flatMap(()=>[user,range.start,range.end]);
  const rows=await db.getAllAsync<WorshipItem&{total:number}>(`WITH records AS (${union}), ranked AS (
    SELECT *,COUNT(*) OVER() AS total,
      CASE WHEN COUNT(actualTime) OVER(PARTITION BY date)=COUNT(*) OVER(PARTITION BY date) THEN actualTime END AS sortableTime
    FROM records
  ) SELECT * FROM ranked ORDER BY date DESC,sortableTime DESC,julianday(recordedAt) DESC,kind,id LIMIT ? OFFSET ?`,...bind,limit,offset);
  const total=rows[0]?.total??(offset>0?(await db.getFirstAsync<{count:number}>(`SELECT COUNT(*) AS count FROM (${union})`,...bind))?.count??0:0);
  return {rows,total};
}
export async function readWorshipItem(db:SQLiteDatabase,user:string,kind:WorshipKind,id:string,range:DateRange) {
  const row=await db.getFirstAsync<WorshipItem>(`SELECT * FROM (${sources[kind]}) WHERE id=?`,user,range.start,range.end,id);
  const children=row&&kind==='collection'?await db.getAllAsync<{id:string;label:string;mode:string;count:number}>(`
    SELECT id,label,mode,count FROM dhikr_logs WHERE user_id=? AND date=? AND collection_session_id=? ORDER BY rowid`,user,row.date,id):[];
  return row?{row,children}:null;
}
