import { weekdays,type Weekday } from '../types/settings.ts';
import { addDays,parseLocalDate,weekDates } from '../utils/localDate.ts';

export const feelings=['DIFFICULT','OKAY','GOOD','HAPPY','CALM'] as const;
export type Feeling=typeof feelings[number];
export const reflectionFields=['gratitude','challenges','plan'] as const;
export const maxReflectionLength=5000;
export type Journal={feeling:Feeling|null;gratitude:string;challenges:string;plan:string};
export type ReflectionWeek={start:string;end:string;preference:Weekday};
export const emptyJournal:Journal={feeling:null,gratitude:'',challenges:'',plan:''};
export function reflectionWeek(anchor:string,preference:Weekday):ReflectionWeek {
  if(!weekdays.includes(preference))throw new Error('Invalid week preference');
  const [start]=weekDates(anchor,preference);
  return {start,end:addDays(start,7),preference};
}
export function validReflectionWeek(week:ReflectionWeek,today:string) {
  return !!parseLocalDate(week.start)&&week.start<=today&&weekdays.includes(week.preference)&&
    week.start===reflectionWeek(week.start,week.preference).start&&week.end===addDays(week.start,7);
}
export function normalizeJournal(journal:Journal):Journal {
  return {...journal,gratitude:journal.gratitude.trim(),challenges:journal.challenges.trim(),plan:journal.plan.trim()};
}
export function validJournal(journal:Journal) {
  const normalized=normalizeJournal(journal);
  return (normalized.feeling===null||feelings.includes(normalized.feeling))&&
    (normalized.feeling!==null||reflectionFields.some(field=>normalized[field].length>0))&&
    reflectionFields.every(field=>Array.from(normalized[field]).length<=maxReflectionLength);
}
