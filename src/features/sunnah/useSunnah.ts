import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { create } from 'zustand';
import { readSunnahActivities, readSunnahSessions } from '../../database/repositories/sunnah';
import { ensureSunnahPreferences } from '../../services/sunnah';
import { useProfile } from '../../stores/profile';
import type { SunnahActivity, SunnahSession } from '../../types/sunnah';

const useRevision = create<{ value: number }>(() => ({ value: 0 }));
export function refreshSunnah() {
  useRevision.setState(({ value }) => ({ value: value + 1 }));
}

type Data = { activities: SunnahActivity[]; sessions: SunnahSession[] };
export function useSunnahData(start?: string, end = start, initialize = true) {
  const db = useSQLiteContext();
  const userId = useProfile((state) => state.profile?.id);
  const revision = useRevision((state) => state.value);
  const key = JSON.stringify([userId, start, end]);
  const [result, setResult] = useState<{ key: string; revision: number; data: Data | null }>();
  useFocusEffect(useCallback(() => {
    if (!userId) return;
    let active = true;
    async function load(id: string) {
      try {
        if (initialize) await ensureSunnahPreferences(db, id);
        const [activities, sessions] = await Promise.all([
          readSunnahActivities(db, id), start ? readSunnahSessions(db, id, start, end) : Promise.resolve([]),
        ]);
        if (active) setResult({ key, revision, data: { activities, sessions } });
      } catch {
        if (active) setResult({ key, revision, data: null });
      }
    }
    void load(userId);
    return () => { active = false; };
  }, [db, userId, start, end, initialize, key, revision]));
  return { userId, data: result?.key === key && (result.data || result.revision === revision) ? result.data : undefined };
}
