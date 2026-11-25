export type SunnahActivity = {
  id: string; custom: boolean; name: string | null; description: string | null;
  active: boolean; order: number; defaultRakaat: number | null;
};
export type SunnahPreference = Pick<SunnahActivity, 'id' | 'active' | 'order' | 'defaultRakaat'>;
export type SunnahTarget = { userId: string; activityId: string; date: string };
export type SunnahDetails = { prayerTime: string | null; rakaat: number | null; notes: string | null };
export type SunnahSession = SunnahTarget & SunnahDetails & { id: string; createdAt: string; updatedAt: string };
export type SunnahMeasurement = 'ACTIVE_DAYS' | 'SESSION_COUNT' | 'RAKAAT_COUNT';
