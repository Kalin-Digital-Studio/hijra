import type { SQLiteDatabase } from 'expo-sqlite';
import { normalizeJournal,reflectionFields,validJournal,validReflectionWeek,type Journal,type ReflectionWeek } from '../../services/reflectionRules.ts';
import { localDate } from '../../utils/localDate.ts';

export type Reflection=ReflectionWeek&Journal&{id:string;createdAt:string;updatedAt:string};
type ReflectionPreview=Pick<Reflection,'id'|'start'|'end'|'feeling'|'updatedAt'>&{preview:string;truncated:number};
const select=`id,week_start AS start,week_end_exclusive AS end,week_start_preference AS preference,feeling,
  COALESCE(gratitude,'') AS gratitude,COALESCE(challenges,'') AS challenges,COALESCE(improvement_plan,'') AS plan,
  created_at AS createdAt,updated_at AS updatedAt`;
export function readReflection(db:SQLiteDatabase,user:string,id:string) {
  return db.getFirstAsync<Reflection>(`SELECT ${select} FROM weekly_reflections WHERE user_id=? AND id=?`,user,id);
}
export function readReflectionShortcut(db:SQLiteDatabase,user:string,week:ReflectionWeek,anchor:string) {
  return db.getFirstAsync<{id:string}>(`SELECT id FROM weekly_reflections
    WHERE user_id=? AND week_start<? AND week_end_exclusive>?
    ORDER BY (week_start<=? AND week_end_exclusive>?) DESC,week_start DESC LIMIT 1`,user,week.end,week.start,anchor,anchor);
}
export function readOverlappingReflection(db:SQLiteDatabase,user:string,week:ReflectionWeek,anchor=week.start) {
  return db.getFirstAsync<Reflection>(`SELECT ${select} FROM weekly_reflections
    WHERE user_id=? AND week_start<? AND week_end_exclusive>?
    ORDER BY (week_start<=? AND week_end_exclusive>?) DESC,week_start DESC LIMIT 1`,user,week.end,week.start,anchor,anchor);
}
export function readReflectionHistory(db:SQLiteDatabase,user:string,year:string|null,offset:number,limit:number) {
  return db.getAllAsync<ReflectionPreview>(`SELECT id,week_start AS start,week_end_exclusive AS end,feeling,
    updated_at AS updatedAt,substr(COALESCE(gratitude,challenges,improvement_plan,''),1,120) AS preview,
    length(COALESCE(gratitude,challenges,improvement_plan,''))>120 AS truncated FROM weekly_reflections
    WHERE user_id=? AND (? IS NULL OR (week_start>=? AND week_start<?))
    ORDER BY week_start DESC,id LIMIT ? OFFSET ?`,user,year,year?year+'-01-01':null,
    year?String(Number(year)+1)+'-01-01':null,limit,offset);
}
export function readReflectionYears(db:SQLiteDatabase,user:string) {
  return db.getAllAsync<{year:string}>(`SELECT DISTINCT substr(week_start,1,4) AS year
    FROM weekly_reflections WHERE user_id=? ORDER BY year DESC`,user);
}
export class ReflectionOverlap extends Error {}
const queue=new WeakMap<SQLiteDatabase,Promise<unknown>>();
export function saveReflection(db:SQLiteDatabase,user:string,id:string,week:ReflectionWeek,journal:Journal,editing:boolean,today=localDate()) {
  const run=(queue.get(db)??Promise.resolve()).then(async()=>{
    if(!validJournal(journal)||!validReflectionWeek(week,today)||!/^[a-zA-Z0-9_-]{1,100}$/.test(id))throw new Error('Invalid reflection');
    const text=normalizeJournal(journal);
    const now=new Date().toISOString();
    await db.withExclusiveTransactionAsync(async tx=>{
      if(!await tx.getFirstAsync('SELECT id FROM user_profiles WHERE id=?',user))throw new Error('Unknown profile');
      const original=await readReflection(tx,user,id);
      if(original && original.start===week.start && original.end===week.end && original.preference===week.preference) {
        if(!editing) {
          if(original.feeling!==text.feeling||reflectionFields.some(field=>original[field]!==text[field])) {
            throw new ReflectionOverlap('Reflection already saved with different content');
          }
          return;
        }
        await tx.runAsync(`UPDATE weekly_reflections SET feeling=?,gratitude=?,challenges=?,improvement_plan=?,updated_at=?
          WHERE user_id=? AND id=?`,text.feeling,text.gratitude||null,text.challenges||null,text.plan||null,now,user,id);
        return;
      }
      if(editing||original)throw new Error('Reflection unavailable');
      if(await readOverlappingReflection(tx,user,week))throw new ReflectionOverlap('Overlapping week');
      await tx.runAsync(`INSERT INTO weekly_reflections
        (id,user_id,week_start,week_end_exclusive,week_start_preference,feeling,gratitude,challenges,improvement_plan,created_at,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,id,user,week.start,week.end,week.preference,text.feeling,
      text.gratitude||null,text.challenges||null,text.plan||null,now,now);
    });
  });
  queue.set(db,run.catch(()=>undefined));
  return run;
}
export function deleteReflection(db:SQLiteDatabase,user:string,id:string) {
  return db.runAsync('DELETE FROM weekly_reflections WHERE user_id=? AND id=?',user,id);
}
