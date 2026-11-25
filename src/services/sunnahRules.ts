import type { SunnahDetails, SunnahMeasurement, SunnahSession } from '../types/sunnah';

export const maxRakaat = 999;
export const maxSunnahNotes = 500;
export const maxActivityName = 60;
export const maxActivityDescription = 300;

export function optionalRakaat(value: string) {
  const clean = value.trim();
  if (!clean) return null;
  if (!/^\d+$/.test(clean)) throw new Error('rakaat');
  return assertRakaat(Number(clean));
}

export function assertRakaat(value: number | null) {
  if (value !== null && (!Number.isSafeInteger(value) || value < 1 || value > maxRakaat)) throw new Error('rakaat');
  return value;
}

export function normalizeDetails(details: SunnahDetails): SunnahDetails {
  const time = details.prayerTime?.trim() || null;
  const notes = details.notes?.trim() || null;
  if (time && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('time');
  if (notes && Array.from(notes).length > maxSunnahNotes) throw new Error('notesLength');
  return { prayerTime: time, notes, rakaat: assertRakaat(details.rakaat) };
}

export function normalizeActivityName(name: string) {
  return name.normalize('NFKC').replace(/[’‘]/g, "'").trim().replace(/\s+/g, ' ').toLowerCase();
}

export function summarizeSunnah(sessions: readonly SunnahSession[]) {
  const activities = new Set<string>();
  const days = new Set<string>();
  let recordedRakaat = 0;
  let sessionsWithRakaat = 0;
  for (const session of sessions) {
    activities.add(session.activityId);
    days.add(session.date);
    if (session.rakaat !== null) {
      recordedRakaat += session.rakaat;
      sessionsWithRakaat++;
    }
  }
  return {
    distinctActivities: activities.size, totalSessions: sessions.length, activeDays: days.size,
    recordedRakaat: sessionsWithRakaat ? recordedRakaat : null, sessionsWithRakaat,
    sessionsWithoutRakaat: sessions.length - sessionsWithRakaat,
  };
}

export function measureSunnahActivity(sessions: readonly SunnahSession[], id: string, measurement: SunnahMeasurement) {
  const summary = summarizeSunnah(sessions.filter((session) => session.activityId === id));
  const values = { ACTIVE_DAYS: summary.activeDays, SESSION_COUNT: summary.totalSessions, RAKAAT_COUNT: summary.recordedRakaat };
  return { value: values[measurement], sessionsWithoutRakaat: summary.sessionsWithoutRakaat };
}
