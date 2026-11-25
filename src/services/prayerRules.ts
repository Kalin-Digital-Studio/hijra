import { prayerStatuses, type PrayerChange, type PrayerDay, type PrayerId, type PrayerLog } from '../types/prayer.ts';

export const maxPrayerNoteLength = 500;
export const emptyPrayer: PrayerDay = { status: 'NOT_LOGGED', onTime: null, congregational: null, notes: null };

export function applyPrayerChange(current: PrayerDay, change: PrayerChange): PrayerDay {
  switch (change.type) {
    case 'status':
      if (!prayerStatuses.includes(change.value)) throw new Error('Invalid prayer status');
      return current.status === change.value ? current :
        { ...current, status: change.value, onTime: null, congregational: null };
    case 'attribute':
      if (current.status !== 'COMPLETED' || (change.field !== 'onTime' && change.field !== 'congregational') ||
        (change.value !== null && typeof change.value !== 'boolean')) throw new Error('Invalid prayer attribute');
      return { ...current, [change.field]: change.value };
    case 'notes': {
      const notes = change.value.trim();
      if (Array.from(notes).length > maxPrayerNoteLength) throw new Error('Prayer note is too long');
      return { ...current, notes: notes || null };
    }
  }
}

export function prayerSlots(ids: readonly PrayerId[], logs: readonly PrayerLog[], date: string) {
  return ids.map((id) => ({ id, record: logs.find((log) => log.prayerId === id && log.date === date) ?? emptyPrayer }));
}

export function summarizePrayers(slots: readonly PrayerDay[]) {
  let completed = 0, notLogged = 0, missed = 0, exempt = 0;
  let onTimeYes = 0, onTimeNo = 0, congregationalYes = 0, congregationalNo = 0;
  for (const item of slots) {
    switch (item.status) {
      case 'COMPLETED':
        completed++;
        if (item.onTime === true) onTimeYes++;
        if (item.onTime === false) onTimeNo++;
        if (item.congregational === true) congregationalYes++;
        if (item.congregational === false) congregationalNo++;
        break;
      case 'NOT_LOGGED': notLogged++; break;
      case 'MISSED': missed++; break;
      case 'EXEMPT': exempt++; break;
    }
  }
  const applicableSlots = slots.length - exempt;
  const percentage = (count: number, total: number) => total ? count / total * 100 : null;
  return {
    totalSlots: slots.length, applicableSlots, completed, notLogged, missed, exempt,
    onTimeYes, onTimeNo, onTimeUnspecified: completed - onTimeYes - onTimeNo,
    congregationalYes, congregationalNo, congregationalUnspecified: completed - congregationalYes - congregationalNo,
    completionPercentage: percentage(completed, applicableSlots), onTimePercentage: percentage(onTimeYes, completed),
    congregationalPercentage: percentage(congregationalYes, completed),
  };
}
