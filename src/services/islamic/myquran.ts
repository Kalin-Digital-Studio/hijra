import { array, IslamicError, object, request, string } from './client.ts';
import { isTime, monthDates, type City, type PrayerTimes } from './rules.ts';
import { parseLocalDate } from '../../utils/localDate.ts';

const fields = { fajr:'subuh', dhuhr:'dzuhur', asr:'ashar', maghrib:'maghrib', isha:'isya' } as const;
export function parseSchedule(raw: unknown, id: string, month: string) {
  const data = object(raw);
  if (data.id!==id) throw new IslamicError('schema');
  const days = object(data.jadwal);
  const rows: Record<string,PrayerTimes> = {};
  for (const date of monthDates(month)) {
    const row = object(days[date]);
    const times = Object.fromEntries(Object.entries(fields).map(([key,source]) => {
      const value = row[source];
      if (!isTime(value)) throw new IslamicError('schema');
      return [key,value];
    })) as PrayerTimes;
    if (isTime(row.imsak)) times.imsak=row.imsak;
    if (isTime(row.terbit)) times.sunrise=row.terbit;
    if (isTime(row.dhuha)) times.duha=row.dhuha;
    rows[date]=times;
  }
  return rows;
}
export async function searchCities(query: string, signal: AbortSignal) {
  return array(await request('prayer','/v3/sholat/kabkota/cari/'+encodeURIComponent(query),signal))
    .map((value): Omit<City,'zone'> => { const row=object(value); return { id:string(row.id), name:string(row.lokasi) }; });
}
export async function scheduleMonth(city: City, month: string, signal: AbortSignal) {
  const rows=await request('prayer','/v3/sholat/jadwal/'+encodeURIComponent(city.id)+'/'+encodeURIComponent(month),signal);
  return parseSchedule(rows,city.id,month);
}
export async function hijriDate(date: string, signal: AbortSignal) {
  if (!parseLocalDate(date)) throw new IslamicError('schema');
  const row=object(await request('calendar','/v3/cal/hijr/'+encodeURIComponent(date),signal));
  const ce=object(row.ce), hijri=object(row.hijr);
  const [year,month,day]=date.split('-').map(Number);
  if(ce.year!==year || ce.month!==month || ce.day!==day || !Number.isInteger(hijri.year)
    || typeof hijri.month!=='number' || hijri.month<1 || hijri.month>12 || typeof hijri.day!=='number' || hijri.day<1 || hijri.day>30)
    throw new IslamicError('schema');
  return { year: Number(hijri.year), month:string(hijri.monthName), day:hijri.day, method:string(row.method) };
}
export type Entry = { id: string|null; title: string; arabic?: string; latin?: string; meaning?: string; reference?: string; category?:string; grade?: string };
const optional = (value: unknown) => typeof value==='string' && value.trim() ? value : undefined;
const contentId = (value: unknown) => typeof value==='number' && Number.isSafeInteger(value) && value>0 ? String(value) :
  typeof value==='string' && /^[A-Za-z0-9_-]+$/.test(value) ? value : null;
export async function narratorBooks(signal: AbortSignal) {
  return array(await request('hadith', '/v2/hadis/perawi', signal)).map(value => {
    const row = object(value);
    const slug = string(row.slug);
    if (!/^[a-z-]+$/.test(slug) || typeof row.total !== 'number' || !Number.isSafeInteger(row.total) || row.total < 1)
      throw new IslamicError('schema');
    return { slug, name: string(row.name), total: row.total };
  });
}
export async function narratorHadith(slug: string, number: number, signal: AbortSignal) {
  const row = object(await request('hadith', '/v2/hadis/' + encodeURIComponent(slug) + '/' + number, signal));
  if (row.number !== number) throw new IslamicError('schema');
  return { arabic: string(row.arab), meaning: string(row.id) };
}
export async function husna(signal: AbortSignal) {
  const rows=array(await request('husna','/v3/husna',signal)).map((entry): Entry => {
    const row=object(entry); const latin=string(row.latin);
    return { id:contentId(row.id), title:latin, latin, arabic:string(row.arab), meaning:string(row.indo) };
  });
  if(rows.length!==99 || rows.some((entry,index)=> entry.id!==String(index+1))) throw new IslamicError('schema');
  return rows;
}
function doaEntry(entry: unknown, id: string | null): Entry {
  const row=object(entry);
  return { id, title:string(row.judul), arabic:string(row.doa), latin:optional(row.latin),
    meaning:optional(row.artinya), category:optional(row.source), reference:optional(row.ayat) ?? optional(row.source) };
}
export async function dua(signal: AbortSignal) {
  return array(await request('dua','/v2/doa/all',signal)).map((entry,index)=>doaEntry(entry,String(index+1)));
}
export async function duaDetail(candidate: Entry, signal: AbortSignal) {
  const row=doaEntry(await request('dua','/v2/doa/'+encodeURIComponent(candidate.id!),signal),candidate.id);
  if(row.title!==candidate.title || row.arabic!==candidate.arabic) throw new IslamicError('schema');
  return row;
}
export async function duaSources(signal: AbortSignal) {
  return array(await request('dua','/v2/doa/sumber',signal)).map(string);
}
export async function hadith(query: string, page: number, signal: AbortSignal) {
  const path=query ? '/v3/hadis/enc/cari/'+encodeURIComponent(query) : '/v3/hadis/enc/explore';
  const data=object(await request('hadith',path+'?page='+page,signal));
  const paging=object(data.paging);
  if (paging.current!==page || typeof paging.has_next!=='boolean') throw new IslamicError('schema');
  const entries=array(data.hadis).map((entry): Entry => {
    const row=object(entry), id=contentId(row.id);
    if (!id) throw new IslamicError('schema');
    const snippet=typeof row.text==='string' ? row.text : optional(object(row.text).id);
    return { id, title:'#'+id, meaning:snippet, reference:'HadeethEnc' };
  });
  return { entries, next:paging.has_next };
}
export async function hadithDetail(id: string, signal: AbortSignal): Promise<Entry> {
  const row=object(await request('hadith','/v3/hadis/enc/show/'+encodeURIComponent(id),signal));
  if (contentId(row.id)!==id) throw new IslamicError('schema');
  const body=object(row.text);
  return { id,title:'#'+id, arabic:string(body.ar), meaning:optional(body.id),
    reference:optional(row.takhrij) ?? 'HadeethEnc', grade:optional(row.grade) };
}

export async function arbain(signal: AbortSignal) {
  const entries=array(await request('hadith','/v3/hadis/arbain',signal)).map((entry):Entry=>{
    const row=object(entry);
    const id=contentId(row.no);
    if(!id) throw new IslamicError('schema');
    return {id,title:string(row.judul),arabic:string(row.arab),meaning:optional(row.indo),reference:'Al-Arba’in al-Nawawiyyah · '+id};
  });
  if(new Set(entries.map(entry=>entry.id)).size!==entries.length) throw new IslamicError('schema');
  return entries;
}
