import { addDays, localDate, parseLocalDate, weekDates } from '../utils/localDate.ts';
import type { Weekday } from '../types/settings';

export const reportModes = ['WEEKLY','MONTHLY','YEARLY','CUSTOM'] as const;
export type ReportMode = typeof reportModes[number];
export type CalendarMode = Exclude<ReportMode,'CUSTOM'>;
export type DateRange = {start:string;end:string};
export type ReportSelection = { mode:CalendarMode;anchor:string } | {mode:'CUSTOM';start:string;last:string};
export const firstReportDate = '1900-01-01';

export function dateCount(range:DateRange) {
  const ordinal=(date:string) => {
    const [year,month,day]=date.split('-').map(Number);
    return Date.UTC(year,month-1,day)/86400000;
  };
  return ordinal(range.end)-ordinal(range.start);
}
export function clip(range:DateRange, end:string):DateRange {
  return {start:range.start,end:range.end<end ? range.end : end};
}
export function validCustom(start:string,last:string,today:string) {
  return !!parseLocalDate(start) && !!parseLocalDate(last) && start>=firstReportDate &&
    start<=last && last<=today && dateCount({start,end:addDays(last,1)})<=366;
}
export function calendarRange(mode:CalendarMode,anchor:string,week:Weekday):DateRange {
  if (mode==='WEEKLY') {
    const [start]=weekDates(anchor,week);
    return {start,end:addDays(start,7)};
  }
  const date=parseLocalDate(anchor);
  if (!date) throw new Error('Invalid report date');
  date.setDate(1);
  if (mode==='YEARLY') date.setMonth(0);
  const start=localDate(date);
  date.setMonth(date.getMonth()+(mode==='YEARLY'?12:1));
  return {start,end:localDate(date)};
}
export function reportRange(selection:ReportSelection,today:string,week:Weekday) {
  if (selection.mode==='CUSTOM') {
    if (!validCustom(selection.start,selection.last,today)) throw new Error('Invalid report range');
    return {start:selection.start,end:addDays(selection.last,1)};
  }
  return calendarRange(selection.mode,selection.anchor,week);
}
export function comparisonRanges(selection:ReportSelection,today:string,week:Weekday) {
  const period=reportRange(selection,today,week);
  const elapsed=clip(period,addDays(today,1));
  const previous=selection.mode==='CUSTOM' ? {start:addDays(period.start,-dateCount(period)),end:period.start} :
    calendarRange(selection.mode,addDays(period.start,-1),week);
  const count=Math.max(0,Math.min(dateCount(elapsed),dateCount(previous)));
  return {period,elapsed,current:{start:period.start,end:addDays(period.start,count)},
    previous:{start:previous.start,end:addDays(previous.start,count)},count};
}
export function reportBuckets(mode:ReportMode,range:DateRange,week:Weekday) {
  const length=dateCount(range);
  const daily=mode==='WEEKLY'||mode==='CUSTOM'&&length<=14;
  const size=mode==='YEARLY'||mode==='CUSTOM'&&length>62 ? 'MONTHLY' : 'WEEKLY';
  const buckets:DateRange[]=[];
  for(let start=range.start;start<range.end;) {
    const next=daily?addDays(start,1):calendarRange(size,start,week).end;
    const end=next<range.end?next:range.end;
    buckets.push({start,end});
    start=end;
  }
  return buckets;
}
export function reportDays(range:DateRange) {
  return Array.from({length:Math.max(0,dateCount(range))},(_,index)=>addDays(range.start,index));
}
export function inRange(date:string,range:DateRange) {
  return date>=range.start&&date<range.end;
}
