import type { Config } from '../../services/goalRules';

const prayers = {category:'WAJIB',metric:'COMPLETED_PRAYERS',filter:'all',cadence:'DAILY',target:5} as const;
const quran = {category:'QURAN',metric:'AYAH_COUNT',filter:'all',cadence:'DAILY'} as const;
const istighfar = {category:'DHIKR',metric:'REPETITION_COUNT',filter:'istighfar',cadence:'DAILY'} as const;
const morning = {category:'DHIKR',metric:'COLLECTION_COMPLETION',filter:'collection:morning',cadence:'DAILY',target:1} as const;
const evening = {...morning,filter:'collection:evening'};
export const templates = {
  start:[prayers,{...quran,target:5},{...istighfar,target:33}],
  steady:[prayers,{category:'SUNNAH',metric:'ACTIVE_DAYS',filter:'duha',cadence:'WEEKLY',target:3},
    {...quran,target:20},morning,evening],
  grow:[{...prayers,metric:'ON_TIME_PRAYERS'},{category:'SUNNAH',metric:'SESSION_COUNT',filter:'tahajjud',cadence:'WEEKLY',target:3},
    {...quran,target:50},{...istighfar,target:100},morning,evening],
} satisfies Record<string,Omit<Config,'name'>[]>;
