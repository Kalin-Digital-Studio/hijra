import type { categories } from '../database/seeds/master';

export type PrayerId = (typeof categories.prayer)[number];
export const prayerStatuses = ['NOT_LOGGED', 'COMPLETED', 'MISSED', 'EXEMPT'] as const;
export type PrayerStatus = (typeof prayerStatuses)[number];
export type PrayerAttribute = boolean | null;
export type PrayerDay = {
  status: PrayerStatus; onTime: PrayerAttribute; congregational: PrayerAttribute; notes: string | null;
};
export type PrayerLog = PrayerDay & {
  id: string; userId: string; prayerId: PrayerId; date: string; createdAt: string; updatedAt: string;
};
export type PrayerTarget = { userId: string; prayerId: PrayerId; date: string };
export type PrayerChange =
  | { type: 'status'; value: PrayerStatus }
  | { type: 'attribute'; field: 'onTime' | 'congregational'; value: PrayerAttribute }
  | { type: 'notes'; value: string };
