import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { create } from 'zustand';
import { readDhikrDrafts, readDhikrItems, readDhikrLogs } from '../../database/repositories/dhikr';
import type { DhikrItem, DhikrLog, Draft } from '../../services/dhikrRules';
import { useProfile } from '../../stores/profile';

const useRevision = create<{ value: number }>(() => ({ value: 0 }));
export function refreshDhikr() {
  useRevision.setState(({ value }) => ({ value: value + 1 }));
}
type Data = { items: DhikrItem[]; drafts: Draft[]; logs: DhikrLog[] };
export function useDhikr(date: string, end = date) {
  const db = useSQLiteContext();
  const user = useProfile((state) => state.profile?.id);
  const revision = useRevision((state) => state.value);
  const key = JSON.stringify([user, date, end]);
  const [result, setResult] = useState<{ key: string; revision: number; data: Data | null }>();
  useFocusEffect(useCallback(() => {
    if (!user) return;
    let current = true;
    void Promise.all([readDhikrItems(db, user), readDhikrDrafts(db, user), readDhikrLogs(db, user, date, end)])
      .then(([items, drafts, logs]) => { if (current) setResult({ key, revision, data: { items, drafts, logs } }); },
        () => { if (current) setResult({ key, revision, data: null }); });
    return () => { current = false; };
  }, [db, user, date, end, key, revision]));
  return { db, user, data: result?.key === key && (result.data || result.revision === revision) ? result.data : undefined };
}
