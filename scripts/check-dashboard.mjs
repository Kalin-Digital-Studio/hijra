import assert from 'node:assert/strict';
import { readDashboard } from '../src/database/repositories/dashboard.ts';
import { createGoals,reconcileGoals } from '../src/database/repositories/goals.ts';
import { saveReading,saveBookmark } from '../src/database/repositories/quran.ts';
import { savePrayerCity,readPrayerCity } from '../src/database/repositories/islamic.ts';
import { nextPrayer,prayerDate } from '../src/services/islamic/rules.ts';
import { dashboardGoals } from '../src/services/dashboardRules.ts';
import { dashboard as en } from '../src/locales/en/dashboard.ts';
import { dashboard as id } from '../src/locales/id/dashboard.ts';

export async function verifyDashboard(native,db) {
  const user='dashboard-owner', other='dashboard-other', today='2024-02-29';
  native.exec("INSERT INTO user_profiles(id,display_name) VALUES('dashboard-owner','Owner'),('dashboard-other','Other')");
  const load=(date=today) => readDashboard(db,user,date);
  const empty=await load();
  assert.equal(empty.reading.bookmark,null);
  assert.equal(empty.goals.percentage,null);
  assert.equal(empty.recent.length,0);
  assert.equal(empty.prayer.completed,0);
  assert.equal(empty.prayer.applicableSlots,5);
  assert.deepEqual(empty.trend.map(row=>row.date),['2024-02-23','2024-02-24','2024-02-25','2024-02-26','2024-02-27','2024-02-28','2024-02-29']);
  assert(empty.trend.every(row=>row.state==='empty'));

  const sql=native.prepare(`INSERT INTO prayer_logs(id,user_id,ibadah_type_id,prayer_date,status,notes,created_at) VALUES(?,?,?,?,?,?,?)`);
  const record=(date,statuses) => {
    for (const [index,status] of statuses.entries()) {
      sql.run(date+'-'+index,user,['fajr','dhuhr','asr','maghrib','isha'][index],date,status,'private note',date+' 06:00:00');
    }
  };
  record(today,['COMPLETED','COMPLETED','COMPLETED','EXEMPT','NOT_LOGGED']);
  record('2024-02-28',['EXEMPT','EXEMPT','EXEMPT','EXEMPT','EXEMPT']);
  record('2024-02-27',['COMPLETED','COMPLETED','COMPLETED','COMPLETED','EXEMPT']);
  record('2024-02-26',['MISSED']);
  native.exec(`INSERT INTO sunnah_prayer_logs(id,user_id,ibadah_type_id,prayer_date,prayer_time,rakaat,notes,created_at) VALUES
    ('tahajjud-a','dashboard-owner','tahajjud','2024-02-29','05:45',2,'sunnah secret','2024-02-29 12:00:00'),
    ('tahajjud-b','dashboard-owner','tahajjud','2024-02-29',NULL,NULL,NULL,'2024-02-29 08:00:00'),
    ('duha-a','dashboard-owner','duha','2024-02-29','09:00',4,NULL,'2024-02-29 09:00:00');
    INSERT INTO dhikr_collection_sessions(id,user_id,date,collection_id,status,snapshot) VALUES
      ('group','dashboard-owner','2024-02-28','morning','COMPLETE','{}');
    INSERT INTO dhikr_logs(id,user_id,date,item_id,label,mode,count,checked,collection_session_id) VALUES
      ('dhikr-today','dashboard-owner','2024-02-29','istighfar','dhikr.catalog.istighfar','COUNTER',75,0,NULL),
      ('dhikr-child','dashboard-owner','2024-02-28','istighfar','dhikr.catalog.istighfar','COUNTER',10,0,'group');
    INSERT INTO dhikr_drafts(id,user_id,date,snapshot) VALUES ('draft','dashboard-owner','2024-02-29','{}')`);
  const reading=(id,start,end,date=today,owner=user,bookmark=true) => saveReading(db,owner,id,{
    date,start:{surah:2,ayah:start},end:{surah:2,ayah:end},duration:null,notes:'quran private',
  },false,bookmark);
  await reading('session',31,45);
  await reading('other-activity',1,30,today,other,false);
  await createGoals(db,user,[
    {id:'quran-daily',config:{name:'Read daily',category:'QURAN',metric:'AYAH_COUNT',filter:'all',cadence:'DAILY',target:20}},
    {id:'quran-weekly',config:{name:'Read weekly',category:'QURAN',metric:'AYAH_COUNT',filter:'all',cadence:'WEEKLY',target:100}},
  ],today,'monday');
  const nativeFetch=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('Dashboard must use SQLite offline');};
  let result;
  try {result=await load();} finally {globalThis.fetch=nativeFetch;}
  assert.equal(result.prayer.completionPercentage,75);
  assert.equal(result.prayer.completed,3);
  assert.equal(result.prayer.applicableSlots,4);
  assert.equal(result.sunnah.totalSessions,3);
  assert.equal(result.sunnah.distinctActivities,2);
  assert.equal(result.quran.ayat,15);
  assert.equal(result.dhikr.repetitions,75);
  assert.equal(result.goals.applicable,1);
  assert.equal(result.goals.previews[0].progress.result.actual,15);
  assert.equal(result.goals.hasOtherPeriods,true);
  const model=result.goals.previews[0];
  const sample=(id,status,state='ACTIVE') => ({
    ...model,version:{...model.version,goalId:id,state},
    progress:{...model.progress,result:{...model.progress.result,status,percentage:status==='NOT_APPLICABLE'?null:status==='ACHIEVED'?100:75}},
  });
  const allGoals=dashboardGoals([
    sample('a','ACHIEVED'),sample('b','ACHIEVED'),sample('c','ACHIEVED'),
    sample('d','IN_PROGRESS'),sample('e','IN_PROGRESS'),sample('na','NOT_APPLICABLE'),
    sample('paused','ACHIEVED','PAUSED'),sample('archived','ACHIEVED','ARCHIVED'),
  ]);
  assert.equal(allGoals.percentage,60);
  assert.equal(allGoals.notApplicable,1);
  assert.deepEqual(allGoals.previews.map(row=>row.version.goalId),['d','e','a']);
  assert.equal(dashboardGoals([sample('na','NOT_APPLICABLE')]).percentage,null);
  assert.deepEqual(result.reading.next,{surah:2,ayah:46});
  assert.equal(result.trend[3].state,'missed');
  assert.equal(result.trend[4].state,'complete');
  assert.equal(result.trend[4].completed,4);
  assert.equal(result.trend[5].state,'exempt');
  assert.equal(result.trend[5].completionPercentage,null);
  assert.equal(result.recent.length,5);
  const sunnahFeed=result.recent.find(row=>row.id==='tahajjud-a');
  assert.equal(sunnahFeed.time,'05:45');
  assert(!JSON.stringify(result.recent).includes('secret'));
  assert(!JSON.stringify(result.recent).includes('private'));
  assert(!result.recent.some(row=>row.id==='other-activity' || row.id==='draft'));

  await reading('extra',46,50);
  result=await load();
  assert.equal(result.quran.ayat,20);
  assert.equal(result.goals.achieved,1);
  assert.equal(result.goals.percentage,100);
  await saveBookmark(db,user,{surah:1,ayah:7});
  assert.deepEqual((await load()).reading.next,{surah:2,ayah:1});
  await saveBookmark(db,user,{surah:114,ayah:6});
  assert.equal((await load()).reading.next,'restart');
  native.exec("DELETE FROM quran_reading_logs WHERE id='extra'; DELETE FROM prayer_logs WHERE id='2024-02-27-0'");
  result=await load();
  assert.equal(result.trend[4].completed,3);
  assert.equal(result.goals.previews[0].progress.result.percentage,75);
  const prior=await load('2024-02-28');
  assert(prior.recent.some(row=>row.id==='group'));
  assert(!prior.recent.some(row=>row.id==='dhikr-child'));

  await reconcileGoals(db,user,'2024-03-01','sunday');
  const tomorrow=await load('2024-03-01');
  assert.equal(tomorrow.today,'2024-03-01');
  assert.equal(tomorrow.quran.ayat,0);
  assert.equal(tomorrow.goals.previews[0].progress.result.actual,0);
  assert.equal(tomorrow.trend[0].date,'2024-02-24');
  assert.equal(tomorrow.trend[5].completed,3);
  assert.equal(tomorrow.reading.next,'restart');
  assert.equal((await readDashboard(db,other,today)).quran.ayat,30);

  const jakarta={id:'city1',name:'A',zone:'Asia/Jakarta'};
  const jayapura={id:'city2',name:'B',zone:'Asia/Jayapura'};
  await savePrayerCity(db,jakarta);
  assert.deepEqual(await readPrayerCity(db),jakarta);
  await savePrayerCity(db,jayapura);
  assert.deepEqual(await readPrayerCity(db),jayapura);
  const evening=Date.parse('2024-12-31T15:30:00Z');
  const times={fajr:'04:10',dhuhr:'12:00',asr:'15:08',maghrib:'18:03',isha:'19:00'};
  assert.equal(prayerDate(evening,jayapura.zone),'2025-01-01');
  assert.equal(nextPrayer(evening,jakarta.zone,{'2024-12-31':times}),null);
  assert.equal(nextPrayer(evening,jakarta.zone,{'2024-12-31':times,'2025-01-01':{...times,fajr:'04:16'}}).time,'04:16');

  assert.deepEqual(Object.keys(id).sort(),Object.keys(en).filter(key=>!key.endsWith('_one')).sort());
  assert.deepEqual(Object.keys(id.trendState).sort(),Object.keys(en.trendState).sort());
  console.log('Dashboard: empty profile, offline SQLite, all daily summaries, goal updates, bookmark boundaries, trend, recent activities, city and rollover passed.');
}
