import type { PrayerId, PrayerLog } from '../types/prayer';
import type { SunnahSession } from '../types/sunnah';
import type { GoalProgress } from '../database/repositories/goals';
import { summarizeDhikr, type DhikrLog } from './dhikrRules.ts';
import { rawatib } from './goalRules.ts';
import { prayerSlots, summarizePrayers } from './prayerRules.ts';
import { countAyat, validPosition, type Catalog, type Session } from './quranRules.ts';
import { summarizeSunnah } from './sunnahRules.ts';
import { addDays } from '../utils/localDate.ts';
import { dateCount, inRange, reportDays, type DateRange } from './reportDates.ts';

export type CollectionRecord = {id:string;date:string;collection:string;status:'COMPLETE'|'INCOMPLETE'};
export type ReportGoal = GoalProgress & {open:boolean};
export type ReportSource = {ids:readonly PrayerId[];prayerStart:string|null;prayers:PrayerLog[];sunnah:SunnahSession[];
  quran:Session[];catalog:Catalog;dhikr:DhikrLog[];collections:CollectionRecord[];goals:ReportGoal[]};
export type ReportFilters = {sunnah?:string;surah?:number;dhikr?:string;collection?:string;goalCategory?:GoalProgress['version']['category'];cadence?:GoalProgress['version']['cadence']};

export function prayerReport(ids:readonly PrayerId[],logs:PrayerLog[],days:string[]) {
  const byDate = new Map<string,PrayerLog[]>();
  for (const row of logs) {
    const group=byDate.get(row.date)??[];
    group.push(row);
    byDate.set(row.date,group);
  }
  const slots=days.map(date=>prayerSlots(ids,byDate.get(date)??[],date).map(slot=>slot.record));
  const completeDays=slots.filter(records=>{
    const stats=summarizePrayers(records);
    return stats.applicableSlots>0 && stats.completed===stats.applicableSlots;
  }).length;
  return {...summarizePrayers(slots.flat()),eligibleDays:days.length,completeDays,
    byType:ids.map((id,index)=>({id,...summarizePrayers(slots.map(records=>records[index]))}))};
}
export function allocateAyat(catalog:Catalog,session:Session) {
  const total=countAyat(catalog,session.start,session.end);
  if(total===null || !validPosition(catalog,session.start) || !validPosition(catalog,session.end)) return [];
  const rows:{surah:number;ayat:number}[]=[];
  for(let surah=session.start.surah;surah<=session.end.surah;surah++) {
    const start=surah===session.start.surah?session.start.ayah:1;
    const end=surah===session.end.surah?session.end.ayah:catalog.get(surah)!.verses;
    rows.push({surah,ayat:end-start+1});
  }
  if(rows.reduce((value,row)=>value+row.ayat,0)!==total) throw new Error('Inconsistent Quran allocation');
  return rows;
}
export function quranReport(catalog:Catalog,rows:Session[],days:number,surah?:number) {
  const distribution=new Map<number,number>();
  let ayat=0, sessions=0, duration=0, knownDuration=0, unallocated=0;
  const active=new Set<string>();
  for(const row of rows) {
    const allocated=allocateAyat(catalog,row);
    const matching=surah?allocated.filter(item=>item.surah===surah):allocated;
    if(surah&&!matching.length) continue;
    if(!allocated.length)unallocated++;
    for(const item of matching) {
      distribution.set(item.surah,(distribution.get(item.surah)??0)+item.ayat);
      ayat+=item.ayat;
    }
    sessions++;
    active.add(row.date);
    if(row.duration!==null && !surah) {duration+=row.duration;knownDuration++;}
  }
  return {ayat,sessions,activeDays:active.size,perDay:days>0?ayat/days:null,perActive:active.size?ayat/active.size:null,
    duration:knownDuration?duration:null,knownDuration,unallocated,
    distribution:[...distribution].map(([id,value])=>({id,value})).sort((a,b)=>b.value-a.value||a.id-b.id)};
}
export function goalReport(rows:ReportGoal[],range:DateRange,filter:ReportFilters={}) {
  const included=rows.filter(row=>(!filter.goalCategory||row.version.category===filter.goalCategory)
    && (!filter.cadence||row.version.cadence===filter.cadence));
  const open=included.filter(row=>row.open && row.period.start<range.end && row.period.end>range.start);
  const closed=included.filter(row=>!row.open && inRange(addDays(row.period.end,-1),range));
  const achieved=closed.filter(row=>row.result.status==='ACHIEVED').length;
  const missed=closed.filter(row=>row.result.status==='NOT_ACHIEVED').length;
  const notApplicable=closed.filter(row=>row.result.status==='NOT_APPLICABLE').length;
  return {closed,open,achieved,missed,notApplicable,applicable:achieved+missed,
    rate:achieved+missed ? achieved/(achieved+missed)*100 : null};
}
function groupBy<T>(rows:T[],key:(row:T)=>string) {
  const groups=new Map<string,T[]>();
  for(const row of rows) {
    const id=key(row);
    const group=groups.get(id)??[];
    group.push(row);
    groups.set(id,group);
  }
  return [...groups];
}
export function aggregateReport(data:ReportSource,range:DateRange,filter:ReportFilters={}) {
  const days=reportDays(range);
  const eligible=data.prayerStart?days.filter(day=>day>=data.prayerStart!):[];
  const prayers=prayerReport(data.ids,data.prayers.filter(row=>inRange(row.date,range)),eligible);
  const sunnah=data.sunnah.filter(row=>inRange(row.date,range)&&(!filter.sunnah||filter.sunnah===row.activityId||
    (filter.sunnah==='rawatib'&&rawatib.includes(row.activityId))));
  const quran=data.quran.filter(row=>inRange(row.date,range));
  const dhikr=data.dhikr.filter(row=>inRange(row.date,range)&&(!filter.dhikr||filter.dhikr===row.itemId)
    &&(!filter.collection||filter.collection===row.collection));
  const linked=new Set(dhikr.map(row=>row.collectionSession));
  const collections=data.collections.filter(row=>inRange(row.date,range)&&(!filter.collection||row.collection===filter.collection)
    &&(!filter.dhikr||linked.has(row.id)));
  return {range,days:Math.max(0,dateCount(range)),prayers,sunnah:{...summarizeSunnah(sunnah),
    distribution:groupBy(sunnah,row=>row.activityId).map(([id,rows])=>({id,...summarizeSunnah(rows)}))},
    quran:quranReport(data.catalog,quran,days.length,filter.surah),dhikr:{...summarizeDhikr(dhikr),
      days:new Set([...dhikr,...collections].map(row=>row.date)).size,
      completedCollections:collections.filter(row=>row.status==='COMPLETE').length,
      partialCollections:collections.filter(row=>row.status==='INCOMPLETE').length,
      distribution:groupBy(dhikr,row=>row.itemId).map(([id,rows])=>({id,label:rows[0].label,...summarizeDhikr(rows)})),
      collections:groupBy(collections,row=>row.collection).map(([id,rows])=>({id,
        completed:rows.filter(row=>row.status==='COMPLETE').length,partial:rows.filter(row=>row.status==='INCOMPLETE').length}))},
    goals:goalReport(data.goals,range,filter)};
}
export type Report = ReturnType<typeof aggregateReport>;
export function aggregateBuckets(data:ReportSource,ranges:DateRange[],filter:ReportFilters={}) {
  const dateIndex=new Map<string,ReportSource>();
  const sources=ranges.map(range=>{
    const source:ReportSource={ids:data.ids,prayerStart:data.prayerStart,catalog:data.catalog,
      prayers:[],sunnah:[],quran:[],dhikr:[],collections:[],goals:[]};
    for(const date of reportDays(range))dateIndex.set(date,source);
    return source;
  });
  for(const row of data.prayers)dateIndex.get(row.date)?.prayers.push(row);
  for(const row of data.sunnah)dateIndex.get(row.date)?.sunnah.push(row);
  for(const row of data.quran)dateIndex.get(row.date)?.quran.push(row);
  for(const row of data.dhikr)dateIndex.get(row.date)?.dhikr.push(row);
  for(const row of data.collections)dateIndex.get(row.date)?.collections.push(row);
  for(const row of data.goals) {
    if(!row.open)dateIndex.get(addDays(row.period.end,-1))?.goals.push(row);
    else for(const [index,range] of ranges.entries()) {
      if(row.period.start<range.end&&row.period.end>range.start)sources[index].goals.push(row);
    }
  }
  return ranges.map((range,index)=>aggregateReport(sources[index],range,filter));
}
export type ReportSection = 'wajib'|'sunnah'|'quran'|'dhikr'|'goals';
export function metricValue(report:Report,key:ReportSection) {
  switch(key) {
    case 'wajib':return report.prayers.completionPercentage;
    case 'sunnah':return report.sunnah.totalSessions;
    case 'quran':return report.quran.ayat;
    case 'dhikr':return report.dhikr.repetitions;
    case 'goals':return report.goals.rate;
  }
}
export function reportChange(current:number|null,previous:number|null,rate:boolean) {
  if(current===null||previous===null)return {absolute:null,relative:null};
  return {absolute:current-previous,relative:!rate&&previous!==0?(current-previous)/previous*100:null};
}
