import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { create } from 'zustand';
import { readBookmark, readReading, readSurahs } from '../../database/repositories/quran';
import { useProfile } from '../../stores/profile';
import type { Catalog, Position, Session } from '../../services/quranRules';

const useRevision = create<{ version: number }>(() => ({ version: 0 }));
export function refreshQuran() {
  useRevision.setState(({ version }) => ({ version: version + 1 }));
}

type QuranData = { catalog: Catalog; bookmark: Position | null; sessions: Session[] };
export function useQuran(start: string, end = start) {
  const db = useSQLiteContext();
  const userId = useProfile((state) => state.profile?.id);
  const version = useRevision((state) => state.version);
  const key = JSON.stringify([userId, start, end]);
  const [result, setResult] = useState<{ key: string; version: number; data: QuranData | null }>();
  useFocusEffect(useCallback(() => {
    if (!userId) return;
    let active = true;
    void Promise.all([readSurahs(db), readBookmark(db, userId), readReading(db, userId, start, end)]).then(
      ([catalog, bookmark, sessions]) => { if (active) setResult({ key, version, data: { catalog, bookmark, sessions } }); },
      () => { if (active) setResult({ key, version, data: null }); },
    );
    return () => { active = false; };
  }, [db, userId, start, end, key, version]));
  return { db, userId, data: result?.key === key && (result.data || result.version === version) ? result.data : undefined };
}
