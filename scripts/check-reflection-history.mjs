import assert from 'node:assert/strict';
import { initializeDatabase } from '../src/database/initialize.ts';
import { deleteReflection,readOverlappingReflection,readReflection,readReflectionHistory,readReflectionShortcut,
  readReflectionYears,ReflectionOverlap,saveReflection } from '../src/database/repositories/reflections.ts';
import { readWorshipHistory,readWorshipItem } from '../src/database/repositories/worshipHistory.ts';
import { readReport } from '../src/database/repositories/reports.ts';
import { emptyJournal,reflectionWeek,validJournal } from '../src/services/reflectionRules.ts';
import { aggregateReport } from '../src/services/reportRules.ts';
import { countAyat } from '../src/services/quranRules.ts';
import { reflection as id } from '../src/locales/id/reflection.ts';
import { reflection as en } from '../src/locales/en/reflection.ts';

export async function verifyReflectionHistory(native,db,reopen) {
  await initializeDatabase(db);
  const owner='reflection-owner',other='reflection-other',today='2024-03-09',day='2024-03-05';
  native.exec(`INSERT INTO user_profiles(id,display_name,created_at) VALUES
    ('reflection-owner','Owner','2024-03-01'), ('reflection-other','Other','2024-03-01');
    INSERT INTO prayer_logs(id,user_id,ibadah_type_id,prayer_date,status,is_on_time,notes) VALUES
    ('pray-complete','reflection-owner','fajr','2024-03-05','COMPLETED',1,'private prayer text'),
    ('pray-missed','reflection-owner','dhuhr','2024-03-05','MISSED',NULL,NULL),
    ('pray-exempt','reflection-owner','asr','2024-03-05','EXEMPT',NULL,NULL),
    ('pray-unlogged','reflection-owner','maghrib','2024-03-05','NOT_LOGGED',NULL,NULL),
    ('other-prayer','reflection-other','isha','2024-03-05','COMPLETED',1,NULL);
    INSERT INTO sunnah_prayer_logs(id,user_id,ibadah_type_id,prayer_date,prayer_time,rakaat,created_at) VALUES
    ('duha-one','reflection-owner','duha','2024-03-05','07:30',2,'2024-03-05 15:00:00'),
    ('duha-two','reflection-owner','duha','2024-03-05','08:30',NULL,'2024-03-05 14:00:00');
    INSERT INTO quran_reading_logs(id,user_id,reading_date,start_surah,start_ayah,end_surah,end_ayah,duration_minutes) VALUES
    ('reading','reflection-owner','2024-03-05',1,6,2,3,7);
    INSERT INTO quran_bookmarks(id,user_id,surah_number,ayah_number) VALUES ('bookmark','reflection-owner',2,3);
    INSERT INTO dhikr_collection_sessions(id,user_id,date,collection_id,status,snapshot) VALUES
    ('while-morning','reflection-owner','2024-03-05','morning','INCOMPLETE','{}'),
    ('done-evening','reflection-owner','2024-03-06','evening','COMPLETE','{}');
    INSERT INTO dhikr_logs(id,user_id,date,item_id,label,mode,count,checked,collection_session_id) VALUES
    ('counter','reflection-owner','2024-03-05','istighfar','Istighfar','COUNTER',33,0,NULL),
    ('child','reflection-owner','2024-03-05','tasbih','Tasbih','COUNTER',12,0,'while-morning'),
    ('checklist','reflection-owner','2024-03-06','closing','Closing','CHECKLIST',0,1,NULL);
    INSERT INTO dhikr_drafts(id,user_id,date,snapshot) VALUES ('draft','reflection-owner','2024-03-05','{}');
    DROP TABLE weekly_reflections; PRAGMA user_version=13;`);
  await initializeDatabase(db);
  assert.equal(native.prepare('PRAGMA user_version').get().user_version,14);
  assert.equal(native.prepare("SELECT count(*) AS n FROM prayer_logs WHERE user_id='reflection-owner'").get().n,4);
  assert.equal(native.prepare('SELECT count(*) AS n FROM weekly_reflections').get().n,0);

  const original=reflectionWeek(day,'monday');
  const change=reflectionWeek(day,'sunday');
  assert(!validJournal(emptyJournal));
  assert(!validJournal({...emptyJournal,gratitude:'   '}));
  assert(!validJournal({...emptyJournal,plan:'x'.repeat(5001)}));
  const usingFetch=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('unexpected network');};
  try {
    await assert.rejects(saveReflection(db,owner,'empty',original,emptyJournal,false,today),/Invalid reflection/);
    await assert.rejects(saveReflection(db,owner,'future',reflectionWeek('2024-03-15','monday'),{...emptyJournal,feeling:'OKAY'},false,today),/Invalid reflection/);
    await Promise.all([
      saveReflection(db,owner,'stable',original,{...emptyJournal,gratitude:'  private journal  '},false,today),
      saveReflection(db,owner,'stable',original,{...emptyJournal,gratitude:'  private journal  '},false,today),
    ]);
    const initial=await readReflection(db,owner,'stable');
    assert.equal(initial.gratitude,'private journal');
    assert.equal(initial.feeling,null);
    await assert.rejects(saveReflection(db,owner,'stable',original,{...emptyJournal,feeling:'CALM'},false,today),ReflectionOverlap);
    assert.equal((await readReflectionHistory(db,owner,null,0,10)).length,1);
    assert.deepEqual({...await readReflectionShortcut(db,owner,change,day)},{id:'stable'});
    assert.equal((await readOverlappingReflection(db,owner,change,day)).start,original.start);
    await assert.rejects(saveReflection(db,owner,'collision',change,{...emptyJournal,feeling:'CALM'},false,today),ReflectionOverlap);
    await assert.rejects(saveReflection(db,other,'stable',original,{...emptyJournal,feeling:'HAPPY'},true,today),/unavailable/);
    await saveReflection(db,other,'other-journal',change,{...emptyJournal,feeling:'CALM'},false,today);
    assert.equal((await readReflection(db,other,'other-journal')).gratitude,'');
    assert.equal((await readReflection(db,other,'stable'))??null,null);

    native.exec("UPDATE weekly_reflections SET updated_at='2024-03-09T00:00:00Z' WHERE id='stable'");
    await saveReflection(db,owner,'stable',original,{...emptyJournal,plan:'x'.repeat(122),feeling:'GOOD'},true,today);
    const edited=await readReflection(reopen(),owner,'stable');
    assert.equal(edited.id,initial.id);
    assert.equal(edited.createdAt,initial.createdAt);
    assert.notEqual(edited.updatedAt,'2024-03-09T00:00:00Z');
    assert.equal(edited.start,initial.start);
    const preview=(await readReflectionHistory(db,owner,'2024',0,5))[0];
    assert.equal(preview.preview.length,120);
    assert.equal(preview.truncated,1);
    assert(!Object.hasOwn(preview,'plan'));
    assert.deepEqual((await readReflectionYears(db,owner)).map(row=>row.year),['2024']);
    assert.equal((await readReflectionHistory(db,owner,'2023',0,5)).length,0);

    const get=async()=>{
      const report=await readReport(db,owner,{mode:'CUSTOM',start:original.start,last:today},today,original.preference,true);
      return {summary:aggregateReport(report.data,report.windows.elapsed),catalog:report.data.catalog};
    };
    let {summary,catalog}=await get();
    assert.equal(summary.prayers.completed,1);
    assert.equal(summary.prayers.eligibleDays,6);
    assert.equal(summary.sunnah.totalSessions,2);
    assert.equal(summary.quran.ayat,5);
    assert.equal(summary.dhikr.repetitions,45);
    const range={start:original.start,end:original.end};
    const all=await readWorshipHistory(db,owner,range,'all',30,0);
    assert.equal(all.total,10);
    assert.equal((await readWorshipHistory(db,owner,range,'all',3,3)).rows.length,3);
    assert.equal(all.rows[0].date,'2024-03-06');
    assert(!all.rows.some(row=>['draft','child','pray-unlogged','other-prayer'].includes(row.id)));
    assert(!JSON.stringify(all).includes('private'));
    const sunnah=await readWorshipHistory(db,owner,range,'sunnah',10,0);
    assert.deepEqual(sunnah.rows.map(row=>row.id),['duha-two','duha-one']);
    const prayer=await readWorshipHistory(db,owner,range,'wajib',10,0);
    assert.deepEqual(prayer.rows.map(row=>row.status).sort(),['COMPLETED','EXEMPT','MISSED']);
    assert(prayer.rows.every(row=>row.actualTime===null));
    const quran=(await readWorshipHistory(db,owner,range,'quran',3,0)).rows[0];
    assert.equal(countAyat(catalog,{surah:quran.startSurah,ayah:quran.startAyah},{surah:quran.endSurah,ayah:quran.endAyah}),5);
    assert.equal(quran.duration,7);
    const dhikr=await readWorshipHistory(db,owner,range,'dhikr',10,0);
    assert.equal(dhikr.total,4);
    const collection=await readWorshipItem(db,owner,'collection','while-morning',range);
    assert.equal(collection.row.status,'INCOMPLETE');
    assert.equal(collection.children.length,1);
    assert.equal(collection.children[0].count,12);
    assert.equal(await readWorshipItem(db,other,'collection','while-morning',range),null);

    native.exec("DELETE FROM quran_reading_logs WHERE id='reading'");
    ({summary}=await get());
    assert.equal(summary.quran.ayat,0);
    assert.equal((await readReflection(db,owner,'stable')).plan.length,122);
    await deleteReflection(db,other,'stable');
    assert(await readReflection(db,owner,'stable'));
    await deleteReflection(db,owner,'stable');
    assert.equal((await readReflection(db,owner,'stable'))??null,null);
    assert.equal(native.prepare('SELECT count(*) AS n FROM quran_bookmarks').get().n,1);
    assert.equal(native.prepare('SELECT count(*) AS n FROM dhikr_drafts').get().n,1);
    assert.equal((await readWorshipHistory(db,owner,range,'all',30,0)).total,9);
  } finally {globalThis.fetch=usingFetch;}
  assert.deepEqual(Object.keys(en).filter(key=>!key.endsWith('_one')).sort(),Object.keys(id).sort());
  assert.deepEqual(Object.keys(en.feelings).sort(),Object.keys(id.feelings).sort());
  console.log('Reflection/history v14: migration, persistence, overlap, offline summary, ownership, pagination, statuses, collection deduplication and privacy passed.');
}
