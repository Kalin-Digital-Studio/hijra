import { invalidateGoals } from '../../stores/goalRevision';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { create } from 'zustand';
import { readPrayerLogs, readPrayerTypes } from '../../database/repositories/prayer';
import { useProfile } from '../../stores/profile';
import type { PrayerId, PrayerLog } from '../../types/prayer';
import { localDate } from '../../utils/localDate';

const usePrayerRevision = create<{ revision: number }>(() => ({ revision: 0 }));
export function refreshPrayerReaders() {
  invalidateGoals();
  usePrayerRevision.setState(({ revision }) => ({ revision: revision + 1 }));
}

export function useToday() {
  const [today, setToday] = useState(localDate);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      clearTimeout(timer);
      const now = new Date();
      setToday(localDate(now));
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      timer = setTimeout(update, Math.min(30_000, midnight.getTime() - now.getTime()));
    }
    update();
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') update(); });
    return () => { clearTimeout(timer); subscription.remove(); };
  }, []);
  return today;
}

type PrayerData = { ids: readonly PrayerId[]; logs: PrayerLog[] };
export function usePrayerData(start: string, end = start) {
  const db = useSQLiteContext();
  const userId = useProfile((state) => state.profile?.id);
  const revision = usePrayerRevision((state) => state.revision);
  const key = JSON.stringify([userId, start, end]);
  const [result, setResult] = useState<{ key: string; revision: number; data: PrayerData | null }>();
  useFocusEffect(useCallback(() => {
    if (!userId) return;
    let active = true;
    void Promise.all([readPrayerTypes(db), readPrayerLogs(db, userId, start, end)]).then(([ids, logs]) => {
      if (active) setResult({ key, revision, data: { ids, logs } });
    }, () => { if (active) setResult({ key, revision, data: null }); });
    return () => { active = false; };
  }, [db, userId, start, end, key, revision]));
  return { userId, data: result?.key === key && (result.data || result.revision === revision) ? result.data : undefined };
}
