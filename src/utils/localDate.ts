import type { Weekday } from '../types/settings';

export function localDate(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${String(date.getFullYear()).padStart(4, '0')}-${month}-${day}`;
}

export function parseLocalDate(value: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return localDate(date) === value ? date : null;
}

export function addDays(value: string, amount: number) {
  const date = parseLocalDate(value);
  if (!date) throw new Error('Invalid calendar date');
  date.setDate(date.getDate() + amount);
  return localDate(date);
}

export function assertEligibleDate(value: string, today = localDate()) {
  if (!parseLocalDate(value) || value > today) throw new Error('Invalid or future calendar date');
}

const weekdayIndex: Record<Weekday, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

export function weekDates(anchor: string, start: Weekday) {
  const date = parseLocalDate(anchor);
  if (!date) throw new Error('Invalid calendar date');
  const offset = (date.getDay() - weekdayIndex[start] + 7) % 7;
  return Array.from({ length: 7 }, (_, index) => addDays(anchor, index - offset));
}
