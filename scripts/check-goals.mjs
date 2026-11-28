import assert from 'node:assert/strict';
import { calendarPeriod, goalMetrics } from '../src/services/goalRules.ts';
import { changeGoal, createGoals, DuplicateGoalError, readActiveGoals, readGoalHistory, reconcileGoals } from '../src/database/repositories/goals.ts';
import { saveReading } from '../src/database/repositories/quran.ts';
import { weekdays } from '../src/types/settings.ts';
import { goals as en } from '../src/locales/en/goals.ts';
import { goals as id } from '../src/locales/id/goals.ts';

export async function verifyGoals(native, db) {
  native.exec("INSERT INTO user_profiles(id,display_name) VALUES('goal-owner','Owner'),('goal-other','Other')");
  const owner='goal-owner', other='goal-other', monday='monday', today='2024-02-29';
  const make=(category,metric,filter,target,cadence='DAILY') => ({name:metric,category,metric,filter,target,cadence});
  const dayQuran=make('QURAN','AYAH_COUNT','all',20);
  const list=async (date=today) => Object.fromEntries((await readActiveGoals(db,owner,date)).map(row=>[row.version.goalId,row]));
  const reading=(id,date,start,end,duration=null) => saveReading(db,owner,id,{date,start,end,duration,notes:null},false,false);
  const position=(surah,ayah) => ({surah,ayah});
  await reading('first',today,position(2,1),position(2,15),10);
  await createGoals(db,owner,[{id:'daily-quran',config:dayQuran}],today,monday);
  assert.equal((await list())['daily-quran'].progress.result.percentage,75);
  await createGoals(db,owner,[{id:'daily-quran',config:dayQuran}],today,monday);
  const invalidAtomic=[{id:'valid-first',config:make('QURAN','SESSION_COUNT','all',2)},{id:'duplicate',config:dayQuran}];
  await assert.rejects(createGoals(db,owner,invalidAtomic,today,monday),DuplicateGoalError);
  assert.equal((await list())['valid-first'],undefined);
  await createGoals(db,owner,[{id:'separate',config:dayQuran}],today,monday,true);
  await reading('second',today,position(2,1),position(2,15));
  let calculated=(await list())['daily-quran'].progress.result;
  assert.equal(calculated.percentage,150);
  assert.equal(calculated.bar,100);
  assert.equal(calculated.status,'ACHIEVED');
  native.exec("DELETE FROM quran_reading_logs WHERE id='second'");
  assert.equal((await list())['daily-quran'].progress.result.status,'IN_PROGRESS');
  native.exec("INSERT INTO app_settings(key,value) VALUES('quran_show_translation','0') ON CONFLICT(key) DO UPDATE SET value='0'");
  assert.equal((await list())['daily-quran'].progress.result.actual,15);
  await reading('cross',today,position(1,6),position(2,3));
  assert.equal((await list())['daily-quran'].progress.result.actual,20);

  native.exec(`INSERT INTO ibadah_types(id,category_id,sort_order,is_custom,owner_user_id,custom_name) VALUES
    ('custom-goal-test','sunnah',100,1,'goal-owner','Custom');
    INSERT INTO sunnah_prayer_logs(id,user_id,ibadah_type_id,prayer_date,rakaat) VALUES
    ('d1','goal-owner','duha','2024-02-29',2),('d2','goal-owner','duha','2024-02-29',4),('d3','goal-owner','duha','2024-02-28',NULL),
    ('t1','goal-owner','tahajjud','2024-02-29',2),('t2','goal-owner','tahajjud','2024-02-28',2),
    ('c1','goal-owner','custom-goal-test','2024-02-29',2);
    INSERT INTO dhikr_collection_sessions(id,user_id,date,collection_id,status,snapshot) VALUES
    ('partial','goal-owner','2024-02-29','morning','INCOMPLETE','{}'),
    ('full','goal-owner','2024-02-28','morning','COMPLETE','{}');
    INSERT INTO dhikr_logs(id,user_id,date,item_id,label,mode,count,checked,collection_session_id) VALUES
    ('dh1','goal-owner','2024-02-29','istighfar','Istighfar','COUNTER',75,0,'partial'),
    ('dh2','goal-owner','2024-02-29','closing','Closing','CHECKLIST',0,1,'partial');
    INSERT INTO dhikr_drafts(id,user_id,date,snapshot) VALUES ('draft-only','goal-owner','2024-02-29','{}')`);
  const goals=[
    ['wajib',make('WAJIB','COMPLETED_PRAYERS','all',5)],['ontime',make('WAJIB','ON_TIME_PRAYERS','all',5)],
    ['jamaah',make('WAJIB','CONGREGATIONAL_PRAYERS','all',5)],
    ['wajib-week',make('WAJIB','COMPLETE_DAYS','all',7,'WEEKLY')],
    ['duha',make('SUNNAH','SESSION_COUNT','duha',4)],['duha-days',make('SUNNAH','ACTIVE_DAYS','duha',1)],
    ['duha-rakaat',make('SUNNAH','RAKAAT_COUNT','duha',10,'WEEKLY')],
    ['tahajjud',make('SUNNAH','SESSION_COUNT','tahajjud',3,'WEEKLY')],
    ['custom-sunnah',make('SUNNAH','SESSION_COUNT','custom-goal-test',1)],
    ['quran-duration',make('QURAN','DURATION_MINUTES','all',30)]
  ];
  await createGoals(db,owner,goals.map(([id,config])=>({id,config})),today,monday);
  await createGoals(db,owner,[
    {id:'count',config:make('DHIKR','REPETITION_COUNT','istighfar',100)},
    {id:'sessions',config:make('DHIKR','SESSION_COUNT','all',2)},
    {id:'morning',config:make('DHIKR','COLLECTION_COMPLETION','collection:morning',1)},
    {id:'morning-days',config:make('DHIKR','ACTIVE_DAYS','collection:morning',2,'WEEKLY')},
  ],today,monday);
  await assert.rejects(createGoals(db,other,[{id:'foreign-custom',config:goals[8][1]}],today,monday),/invalid goal/);
  await assert.rejects(createGoals(db,owner,[{id:'checklist-counter',config:make('DHIKR','REPETITION_COUNT','closing',2)}],today,monday),/invalid goal/);
  await assert.rejects(changeGoal(db,other,'wajib',{action:'pause'},today,monday),/unknown goal/);
  assert.equal((await readActiveGoals(db,other,today)).length,0);
  assert.equal((await list()).wajib.progress.result.actual,0);
  await assert.rejects(createGoals(db,'missing-user',[{id:'no-owner',config:dayQuran}],today,monday),/profile/);
  await createGoals(db,owner,[{id:'month-days',config:make('QURAN','ACTIVE_DAYS','all',31,'MONTHLY')}],today,monday);
  assert.equal((await list())['month-days'].progress.result.effective,29);
  native.exec(`INSERT INTO prayer_logs(id,user_id,ibadah_type_id,prayer_date,status,is_on_time,is_congregational) VALUES
    ('f','goal-owner','fajr','2024-02-29','COMPLETED',1,1),('d','goal-owner','dhuhr','2024-02-29','COMPLETED',NULL,NULL),
    ('a','goal-owner','asr','2024-02-29','COMPLETED',0,0),
    ('m','goal-owner','maghrib','2024-02-29','NOT_LOGGED',NULL,NULL),('i','goal-owner','isha','2024-02-29','NOT_LOGGED',NULL,NULL)`);
  assert.equal((await list()).wajib.progress.result.percentage,60);
  native.exec("UPDATE prayer_logs SET status='EXEMPT' WHERE id='m'");
  let daily=await list();
  assert.equal(daily.wajib.progress.result.percentage,75);
  assert.equal(daily.ontime.progress.result.actual,1);
  assert.equal(daily.jamaah.progress.result.actual,1);
  native.exec("UPDATE prayer_logs SET status='COMPLETED' WHERE id='i'");
  assert.equal((await list()).wajib.progress.result.status,'ACHIEVED');
  native.exec("UPDATE prayer_logs SET status='EXEMPT', is_on_time=NULL, is_congregational=NULL");
  daily=await list();
  assert.equal(daily.wajib.progress.result.status,'NOT_APPLICABLE');
  assert.equal(daily.wajib.progress.result.percentage,null);
  assert.equal(daily['wajib-week'].progress.result.effective,6);
  assert.equal(daily['wajib-week'].progress.result.actual,0);
  assert.equal(daily.duha.progress.result.actual,2);
  assert.equal(daily['duha-days'].progress.result.actual,1);
  assert.equal(daily['duha-rakaat'].progress.result.actual,6);
  assert.equal(daily['duha-rakaat'].progress.result.missing,1);
  assert.equal(daily.tahajjud.progress.result.actual,2);
  assert.equal(daily['custom-sunnah'].progress.result.actual,1);
  assert.equal(daily['quran-duration'].progress.result.actual,10);
  assert.equal(daily['quran-duration'].progress.result.missing,1);
  assert.equal(daily.count.progress.result.percentage,75);
  assert.equal(daily.sessions.progress.result.actual,2);
  assert.equal(daily.morning.progress.result.actual,0);
  assert.equal(daily['morning-days'].progress.result.actual,1);
  native.exec("UPDATE dhikr_collection_sessions SET status='COMPLETE' WHERE id='partial'; UPDATE dhikr_logs SET count=100 WHERE id='dh1'");
  daily=await list();
  assert.equal(daily.sessions.progress.result.actual,2);
  assert.equal(daily.count.progress.result.status,'ACHIEVED');
  assert.equal(daily.morning.progress.result.actual,1);
  native.exec("UPDATE dhikr_collection_sessions SET status='INCOMPLETE' WHERE id='full'");
  assert.equal((await list())['morning-days'].progress.result.actual,1);

  for (const weekday of weekdays) {
    const range=calendarPeriod(today,'WEEKLY',weekday);
    assert.equal(new Date(range.start+'T12:00:00').toLocaleDateString('en',{weekday:'long'}).toLowerCase(),weekday);
    assert(range.start<=today && range.end>today);
  }
  assert.deepEqual(calendarPeriod(today,'MONTHLY',monday),{start:'2024-02-01',end:'2024-03-01'});
  assert.equal(calendarPeriod('2025-02-28','MONTHLY',monday).end,'2025-03-01');
  assert.equal(calendarPeriod('2024-04-30','MONTHLY',monday).end,'2024-05-01');
  assert.equal(calendarPeriod('2024-12-31','MONTHLY',monday).end,'2025-01-01');
  await createGoals(db,owner,[{id:'weekly',config:make('QURAN','AYAH_COUNT','all',140,'WEEKLY')}],today,monday);
  await reconcileGoals(db,owner,today,'wednesday');
  assert.equal((await list()).weekly.progress.period.weekStart,monday);
  await reconcileGoals(db,owner,'2024-03-04','wednesday');
  const transition=(await list('2024-03-04')).weekly.progress.period;
  assert.deepEqual([transition.start,transition.end,transition.transition],['2024-03-04','2024-03-06',1]);
  await changeGoal(db,owner,'weekly',{action:'edit',config:make('QURAN','SESSION_COUNT','all',3,'MONTHLY')},'2024-03-04','wednesday');
  let item=(await list('2024-03-04')).weekly;
  assert.equal(item.version.target,140);
  assert.equal(item.pending.from,'2024-03-06');
  assert.equal(item.pending.target,3);
  await changeGoal(db,owner,'weekly',{action:'cancel'},'2024-03-04','wednesday');
  assert.equal((await list('2024-03-04')).weekly.pending,undefined);
  await changeGoal(db,owner,'weekly',{action:'edit',config:make('QURAN','SESSION_COUNT','all',3,'MONTHLY')},'2024-03-04','wednesday');
  await reconcileGoals(db,owner,'2024-03-06','wednesday');
  item=(await list('2024-03-06')).weekly;
  assert.equal(item.progress.period.end,'2024-04-01');
  assert.equal(item.progress.period.transition,1);
  assert.equal(item.version.metric,'SESSION_COUNT');
  await changeGoal(db,owner,'weekly',{action:'pause'},'2024-03-06','wednesday');
  await changeGoal(db,owner,'weekly',{action:'cancel'},'2024-03-06','wednesday');
  assert.equal((await list('2024-03-06')).weekly.pending,undefined);
  await changeGoal(db,owner,'weekly',{action:'pause'},'2024-03-06','wednesday');
  await reconcileGoals(db,owner,'2024-04-02','wednesday');
  assert.equal((await list('2024-04-02')).weekly.version.state,'PAUSED');
  assert.equal((await list('2024-04-02')).weekly.progress,undefined);
  await changeGoal(db,owner,'weekly',{action:'resume'},'2024-04-02','wednesday');
  assert.equal((await list('2024-04-02')).weekly.pending.from,'2024-05-01');
  await reconcileGoals(db,owner,'2024-05-01','wednesday');
  assert.equal((await list('2024-05-01')).weekly.progress.period.start,'2024-05-01');
  await changeGoal(db,owner,'weekly',{action:'archive'},'2024-05-01','wednesday');
  assert.equal((await list('2024-05-01')).weekly.pending.state,'ARCHIVED');
  await changeGoal(db,owner,'weekly',{action:'cancel'},'2024-05-01','wednesday');
  assert.equal((await list('2024-05-01')).weekly.pending,undefined);
  await changeGoal(db,owner,'weekly',{action:'archive'},'2024-05-01','wednesday');
  await Promise.all([reconcileGoals(db,owner,'2024-06-04','wednesday'),reconcileGoals(db,owner,'2024-06-04','wednesday')]);
  assert.equal((await list('2024-06-04')).weekly.version.state,'ARCHIVED');
  const history=await readGoalHistory(db,owner,'2024-06-04',{id:'weekly'});
  assert.deepEqual(history.map(x=>x.period.start),['2024-05-01','2024-03-06','2024-03-04','2024-02-26']);
  assert(history.every((row,i)=>i===0 || row.period.end<=history[i-1].period.start));
  assert.equal(history.at(-1).version.target,140);
  assert.equal(history.at(-1).result.actual,20);
  native.exec("UPDATE quran_reading_logs SET reading_date='2024-03-04' WHERE id='first'");
  const corrected=await readGoalHistory(db,owner,'2024-06-04',{id:'weekly'});
  assert.equal(corrected.at(-1).result.actual,5);
  assert.equal(corrected.at(-2).result.actual,15);
  assert.equal(corrected.at(-1).version.target,140);
  assert.equal((await readGoalHistory(db,other,'2024-06-04',{id:'weekly'})).length,0);
  assert.equal((await readGoalHistory(db,owner,'2024-06-04',{id:'weekly',limit:1,offset:1}))[0].period.start,'2024-03-06');
  const wCount=native.prepare("SELECT COUNT(*) AS n FROM personal_goal_periods WHERE goal_id='daily-quran'").get().n;
  assert.equal(wCount,97);
  assert.equal(native.prepare('PRAGMA foreign_key_check').all().length,0);
  for (const locale of [id,en]) for (const [category,metrics] of Object.entries(goalMetrics)) {
    assert(locale.categories[category]);
    for (const [metric,def] of Object.entries(metrics)) {
      assert(locale.metrics[metric]);
      assert(locale.units[def.unit]);
    }
  }
  console.log('Goals v13: authoritative metrics, real local activity, corrections, ownership, atomic duplicates, transitions, lifecycle and locales passed.');
}
