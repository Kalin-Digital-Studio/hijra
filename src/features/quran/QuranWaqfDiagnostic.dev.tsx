import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { BodyText, LoadingState } from '../../components/ui';
import { readVerses } from '../../database/repositories/quranReader';
import type { QuranVerse } from '../../database/seeds/quranVerses';
import { PrayerAction, PrayerPanel } from '../prayer/PrayerUI';
import { QuranArabic } from './QuranArabic';

const references = [[2, 2], [2, 45], [16, 17], [16, 21], [16, 57], [36, 76]];

export function QuranWaqfDiagnostic({ size }: { size: number }) {
  const db = useSQLiteContext();
  const [result, setResult] = useState<QuranVerse[] | 'loading' | 'error'>();
  async function compare() {
    setResult('loading');
    try {
      const chapters = await Promise.all([2, 16, 36].map(surah => readVerses(db, surah)));
      const rows = chapters.flat();
      setResult(references.map(([surah, ayah]) => {
        const verse = rows.find(row => row.surah === surah && row.ayah === ayah);
        if (!verse) throw new Error('Missing reference verse');
        return verse;
      }));
    } catch {
      setResult('error');
    }
  }
  return <PrayerPanel>
    <PrayerAction label="Dev · SQLite waqf / font A–B" disabled={result === 'loading'} onPress={() => void compare()} />
    {result === 'loading' && <LoadingState />}
    {result === 'error' && <BodyText>SQLite diagnostic failed.</BodyText>}
    {Array.isArray(result) && result.map(verse => {
      const marks = [...verse.arabic.matchAll(/[\u06D6-\u06DB]/gu)]
        .map(([mark]) => 'U+' + mark.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'));
      return <PrayerPanel key={verse.surah + ':' + verse.ayah}>
        <BodyText>{verse.surah}:{verse.ayah} · SQLite · {marks.join(', ') || '—'}</BodyText>
        <BodyText>A · System</BodyText>
        <QuranArabic text={verse.arabic} size={size} system />
        <BodyText>B · Amiri Quran</BodyText>
        <QuranArabic text={verse.arabic} size={size} />
      </PrayerPanel>;
    })}
  </PrayerPanel>;
}
