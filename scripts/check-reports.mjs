import assert from 'node:assert/strict';
import { readReport } from '../src/database/repositories/reports.ts';
import { saveReading } from '../src/database/repositories/quran.ts';
import { createGoals,changeGoal,reconcileGoals } from '../src/database/repositories/goals.ts';
import { aggregateBuckets,aggregateReport,allocateAyat,goalReport,quranReport,reportChange } from '../src/services/reportRules.ts';
import { calendarRange,comparisonRanges,dateCount,reportBuckets,reportDays,validCustom } from '../src/services/reportDates.ts';
import { weekdays } from '../src/types/settings.ts';
import { reports as id } from '../src/locales/id/reports.ts';
import { reports as en } from '../src/locales/en/reports.ts';

export async function verifyReports(native,db) {
  const user='report-owner',other='report-other',today='2024-02-29',week='monday';
  native.exec("INSERT INTO user_profiles(id,display_name,created_at) VALUES ('report-owner','Owner','2024-02-01'),('report-other','Other','2024-02-27')");
  const range={start:'2024-02-19',end:'2024-02-26'};
  const insert=native.prepare("INSERT INTO prayer_logs(id,user_id,ibadah_type_id,prayer_date,status,is_on_time,is_congregational) VALUES(?,?,?,?,?,?,?)");
  let index=0;
  for(const day of reportDays(range)) for(const prayer of ['fajr','dhuhr','asr','maghrib','isha']) {
    const status=index<28?'COMPLETED':index<30?'EXEMPT':index<32?'MISSED':'NOT_LOGGED';
    insert.run('prayer-'+index,user,prayer,day,status,index<12?1:index<20?0:null,index<3?1:null);
    index++;
  }
  for(const prayer of ['fajr','dhuhr','asr','maghrib','isha'])insert.run('exempt-'+prayer,user,prayer,'2024-02-29','EXEMPT',null,null);
  native.exec(`INSERT INTO sunnah_prayer_logs(id,user_id,ibadah_type_id,prayer_date,rakaat) VALUES
    ('duha-a','report-owner','duha','2024-02-21',2),('duha-b','report-owner','duha','2024-02-21',4),
    ('witir','report-owner','witr','2024-02-22',NULL);
    INSERT INTO dhikr_collection_sessions(id,user_id,date,collection_id,status,snapshot) VALUES
      ('morning-saved','report-owner','2024-02-21','morning','COMPLETE','{}'),
      ('partial-saved','report-owner','2024-02-22','morning','INCOMPLETE','{}');
    INSERT INTO dhikr_logs(id,user_id,date,item_id,label,mode,count,checked,collection_session_id) VALUES
      ('counter','report-owner','2024-02-21','istighfar','Istighfar','COUNTER',75,0,'morning-saved'),
      ('check','report-owner','2024-02-22','closing','Closing','CHECKLIST',0,1,'partial-saved');
    INSERT INTO dhikr_drafts(id,user_id,date,snapshot) VALUES ('draft','report-owner','2024-02-21','{}')`);
  const record=(id,date,start,end,duration=null,owner=user)=>saveReading(db,owner,id,{date,start,end,duration,notes:null},false,false);
  await record('cross','2024-02-21',{surah:1,ayah:6},{surah:2,ayah:3},12);
  await record('repeat','2024-02-21',{surah:2,ayah:1},{surah:2,ayah:15});
  await record('visitor','2024-02-21',{surah:2,ayah:1},{surah:2,ayah:99},null,other);
  const fetch=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('unexpected network access');};
  let snapshot;
  try {snapshot=await readReport(db,user,{mode:'WEEKLY',anchor:'2024-02-21'},today,week);}
  finally {globalThis.fetch=fetch;}
  let report=aggregateReport(snapshot.data,snapshot.windows.elapsed);
  assert.equal(report.prayers.totalSlots,35);
  assert.equal(report.prayers.applicableSlots,33);
  assert.equal(report.prayers.completed,28);
  assert.equal(report.prayers.completionPercentage.toFixed(2),'84.85');
  assert.equal(report.prayers.missed,2);
  assert.equal(report.prayers.notLogged,3);
  assert.equal(report.prayers.onTimeUnspecified,8);
  assert.equal(report.prayers.onTimePercentage,12/28*100);
  assert.equal(report.sunnah.totalSessions,3);
  assert.equal(report.sunnah.distinctActivities,2);
  assert.equal(report.sunnah.activeDays,2);
  assert.equal(report.sunnah.recordedRakaat,6);
  assert.equal(report.sunnah.sessionsWithoutRakaat,1);
  assert.equal(aggregateReport(snapshot.data,range,{sunnah:'duha'}).sunnah.activeDays,1);
  assert.equal(report.quran.ayat,20);
  assert.equal(report.quran.duration,12);
  assert.equal(report.quran.perActive,20);
  const cross=snapshot.data.quran.find(row=>row.id==='cross');
  assert.deepEqual(allocateAyat(snapshot.data.catalog,cross),[{surah:1,ayat:2},{surah:2,ayat:3}]);
  const legacy=quranReport(snapshot.data.catalog,[{...cross,end:{surah:2,ayah:999}}],7);
  assert.deepEqual([legacy.ayat,legacy.unallocated,legacy.sessions,legacy.duration],[0,1,1,12]);
  assert.equal(aggregateReport(snapshot.data,range,{surah:2}).quran.ayat,18);
  assert.equal(aggregateReport(snapshot.data,range,{surah:2}).quran.duration,null);
  assert.equal(report.dhikr.repetitions,75);
  assert.equal(report.dhikr.checks,1);
  assert.equal(report.dhikr.sessions,2);
  assert.equal(report.dhikr.completedCollections,1);
  assert.equal(report.dhikr.partialCollections,1);
  const bucketsForWeek=reportBuckets('WEEKLY',range,week);
  const summed=aggregateBuckets(snapshot.data,bucketsForWeek);
  assert.deepEqual(summed,bucketsForWeek.map(bucket=>aggregateReport(snapshot.data,bucket)));
  assert.equal(summed.reduce((n,row)=>n+row.quran.ayat,0),report.quran.ayat);
  assert.equal(summed.reduce((n,row)=>n+row.prayers.completed,0),report.prayers.completed);
  assert.equal(summed.reduce((n,row)=>n+row.dhikr.repetitions,0),report.dhikr.repetitions);
  assert.equal(aggregateReport(snapshot.data,{start:'2024-02-21',end:'2024-02-22'}).sunnah.totalSessions,2);
  const visitor=await readReport(db,other,{mode:'MONTHLY',anchor:today},today,week);
  assert.equal(aggregateReport(visitor.data,visitor.windows.elapsed).prayers.eligibleDays,3);
  const exempt=await readReport(db,user,{mode:'CUSTOM',start:today,last:today},today,week,true);
  assert.equal(aggregateReport(exempt.data,exempt.windows.elapsed).prayers.completionPercentage,null);

  const config={category:'QURAN',metric:'AYAH_COUNT',filter:'all',cadence:'WEEKLY',target:20,name:'Weekly'};
  await createGoals(db,user,[{id:'weekly-report',config}],'2024-02-21',week);
  await changeGoal(db,user,'weekly-report',{action:'edit',config:{...config,target:50}},'2024-02-22',week);
  await reconcileGoals(db,user,today,week);
  snapshot=await readReport(db,user,{mode:'MONTHLY',anchor:today},today,week);
  report=aggregateReport(snapshot.data,snapshot.windows.elapsed);
  assert.equal(report.goals.achieved,1);
  assert.equal(report.goals.rate,100);
  assert.equal(report.goals.closed[0].version.target,20);
  assert.equal(report.goals.open[0].version.target,50);
  const make=(status)=>({...report.goals.closed[0],result:{status}});
  assert.equal(goalReport([...Array(15).fill('ACHIEVED'),...Array(3).fill('NOT_ACHIEVED'),...Array(2).fill('NOT_APPLICABLE')].map(make),
    snapshot.windows.elapsed).rate.toFixed(2),'83.33');
  const crossing={...report.goals.closed[0],period:{start:'2024-02-26',end:'2024-03-04'}};
  assert.equal(goalReport([crossing],{start:'2024-02-01',end:'2024-03-01'}).closed.length,0);
  assert.equal(goalReport([crossing],{start:'2024-03-01',end:'2024-04-01'}).closed.length,1);
  native.exec("DELETE FROM quran_reading_logs WHERE id='repeat'");
  snapshot=await readReport(db,user,{mode:'MONTHLY',anchor:today},today,week);
  report=aggregateReport(snapshot.data,snapshot.windows.elapsed);
  assert.equal(report.quran.ayat,5);
  assert.equal(report.goals.achieved,0);
  assert.equal(report.goals.closed[0].version.target,20);

  assert.deepEqual(reportChange(150,100,false),{absolute:50,relative:50});
  assert.deepEqual(reportChange(100,0,false),{absolute:100,relative:null});
  assert.deepEqual(reportChange(90,80,true),{absolute:10,relative:null});
  assert.deepEqual(reportChange(null,80,true),{absolute:null,relative:null});
  const partial=comparisonRanges({mode:'MONTHLY',anchor:'2024-11-10'},'2024-11-10',week);
  assert.deepEqual(partial.elapsed,{start:'2024-11-01',end:'2024-11-11'});
  assert.deepEqual(partial.previous,{start:'2024-10-01',end:'2024-10-11'});
  const unequal=comparisonRanges({mode:'MONTHLY',anchor:'2024-03-31'},'2024-04-01',week);
  assert.equal(unequal.count,29);
  assert.equal(unequal.current.end,'2024-03-30');
  assert.equal(unequal.previous.end,'2024-03-01');
  assert.equal(calendarRange('YEARLY',today,week).end,'2025-01-01');
  assert.equal(dateCount(calendarRange('YEARLY',today,week)),366);
  assert.equal(dateCount(calendarRange('MONTHLY','2024-04-10',week)),30);
  assert.equal(dateCount(calendarRange('MONTHLY','2024-01-08',week)),31);
  for(const start of weekdays) {
    assert.equal(new Date(calendarRange('WEEKLY',today,start).start+'T12:00:00').toLocaleDateString('en',{weekday:'long'}).toLowerCase(),start);
    const buckets=reportBuckets('MONTHLY',{start:'2024-02-01',end:'2024-03-01'},start);
    assert.equal(buckets[0].start,'2024-02-01');
    assert.equal(buckets.at(-1).end,'2024-03-01');
    assert(buckets.every((item,index)=>index===0||buckets[index-1].end===item.start));
  }
  assert(validCustom('2024-01-01','2024-12-31','2024-12-31'));
  assert(!validCustom('2023-12-31','2024-12-31','2024-12-31'));
  assert(!validCustom(today,'2024-03-01',today));
  assert(!validCustom('2023-02-29',today,today));
  assert.deepEqual(Object.keys(en).filter(key=>!key.endsWith('_one')).sort(),Object.keys(id).sort());
  console.log('Reports: offline, prayer coverage and exemptions, surah allocation, optional metrics, goal attribution/corrections, comparison and calendar boundaries passed.');
}
