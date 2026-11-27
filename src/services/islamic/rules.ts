import { addDays, parseLocalDate } from '../../utils/localDate.ts';

export const zones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'] as const;
export type Zone = typeof zones[number];
export type City = { id: string; name: string; zone: Zone };
export const prayerIds = ['fajr','dhuhr','asr','maghrib','isha'] as const;
export type PrayerId = typeof prayerIds[number];
export type PrayerTimes = Record<PrayerId, string> & { imsak?: string; sunrise?: string; duha?: string };

const offset: Record<Zone, number> = { 'Asia/Jakarta': 7, 'Asia/Makassar': 8, 'Asia/Jayapura': 9 };
export function prayerDate(now: number, zone: Zone) {
  return new Date(now + offset[zone] * 3600000).toISOString().slice(0, 10);
}
export function nextPrayer(now: number, zone: Zone, rows: Readonly<Record<string, PrayerTimes>>) {
  const today = prayerDate(now, zone);
  for (const date of [today, addDays(today, 1)]) {
    const row = rows[date];
    if (!row) return null;
    for (const prayer of prayerIds) {
      const time = row[prayer];
      const instant = Date.parse(`${date}T${time}:00+0${offset[zone]}:00`);
      if (instant > now) return { prayer, time, date, seconds: Math.ceil((instant - now) / 1000) };
    }
  }
  return null;
}

export const isTime = (value: unknown): value is string => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
export function monthShift(month: string, step: number) {
  const date = parseLocalDate(month + '-01');
  if (!date) throw new Error('Invalid month');
  date.setMonth(date.getMonth() + step);
  return `${String(date.getFullYear()).padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}`;
}
export function monthDates(month: string) {
  const next = monthShift(month, 1);
  const last = Number(addDays(next + '-01', -1).slice(-2));
  return Array.from({ length: last }, (_, index) => `${month}-${String(index+1).padStart(2,'0')}`);
}

export const angle = (value: number) => (value % 360 + 360) % 360;
export function qiblaBearing(lat: number, lon: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat)>90 || Math.abs(lon)>180) return null;
  const rad = (value: number) => value * Math.PI / 180;
  const target = rad(21.4225), origin = rad(lat), delta = rad(39.8262 - lon);
  const y = Math.sin(delta) * Math.cos(target);
  const x = Math.cos(origin)*Math.sin(target) - Math.sin(origin)*Math.cos(target)*Math.cos(delta);
  return Math.hypot(x,y)<1e-12 ? null : angle(Math.atan2(y,x)*180/Math.PI);
}
export function compassDelta(previous: number, next: number) {
  return angle(next - previous + 180) - 180;
}
