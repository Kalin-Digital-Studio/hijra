import type { SQLiteDatabase } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, Input } from '../../components/ui';
import { deleteReading, saveReading } from '../../database/repositories/quran';
import { countAyat, newReadingSessionId, type Catalog, type Position, type Session } from '../../services/quranRules';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { AyahField, SurahField } from './QuranUI';
import { refreshQuran } from './useQuran';

export type Draft = { date: string; userId: string; session?: Session; start?: Position; updateBookmark: boolean };
export default function ReadingForm({ db, draft: target, catalog, close }: { db: SQLiteDatabase; draft: Draft; catalog: Catalog; close: () => void }) {
  const { t } = useTranslation();
  const [draft] = useState(target);
  const initial = draft.session?.start ?? draft.start;
  const [startSurah, setStartSurah] = useState(initial?.surah ?? 1);
  const [startAyah, setStartAyah] = useState(String(initial?.ayah ?? 1));
  const [endSurah, setEndSurah] = useState(draft.session?.end.surah ?? startSurah);
  const [endAyah, setEndAyah] = useState(draft.session ? String(draft.session.end.ayah) : '');
  const [cross, setCross] = useState(!!draft.session && draft.session.start.surah !== draft.session.end.surah);
  const [duration, setDuration] = useState(draft.session?.duration?.toString() ?? '');
  const [notes, setNotes] = useState(draft.session?.notes ?? '');
  const [bookmark, setBookmark] = useState(draft.updateBookmark);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const lock = useRef(false);
  const [id] = useState(() => draft.session?.id ?? newReadingSessionId());
  const start = { surah: startSurah, ayah: parseInteger(startAyah) };
  const end = { surah: cross ? endSurah : startSurah, ayah: parseInteger(endAyah) };
  const total = countAyat(catalog, start, end);
  const minutes = duration.trim() ? parseInteger(duration) : null;
  const invalidDuration = minutes !== null && (!Number.isSafeInteger(minutes) || minutes < 1 || minutes > 1440);

  async function run(work: () => Promise<unknown>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await work();
      refreshQuran();
      close();
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  const session = draft.session;
  return <PrayerPanel>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t(session ? 'quran.edit' : 'quran.add')}</BodyText>
    <BodyText style={prayerStyles.small}>{draft.date}</BodyText>
    <SurahField catalog={catalog} value={startSurah} change={setStartSurah} label={t(cross ? 'quran.startSurah' : 'quran.surah')} />
    <AyahField label={t('quran.startAyah')} value={startAyah} change={setStartAyah} limit={catalog.get(startSurah)?.verses} />
    <Checkbox label={t('quran.cross')} checked={cross} onChange={(enabled) => { if (enabled) setEndSurah(startSurah); setCross(enabled); }} />
    {cross && <SurahField catalog={catalog} value={endSurah} change={setEndSurah} label={t('quran.endSurah')} />}
    <AyahField label={t('quran.endAyah')} value={endAyah} change={setEndAyah} limit={catalog.get(end.surah)?.verses} />
    <BodyText accessibilityLiveRegion="polite">{total === null ? t(endAyah ? 'quran.invalidRange' : 'quran.enterEnd') : t('quran.ayat', { value: total })}</BodyText>
    <BodyText style={prayerStyles.small}>{t('quran.duration')}</BodyText>
    <Input value={duration} onChangeText={setDuration} keyboardType="number-pad" maxLength={8} accessibilityLabel={t('quran.duration')} />
    {invalidDuration && <BodyText>{t('quran.invalidDuration')}</BodyText>}
    <BodyText style={prayerStyles.small}>{t('quran.notes')}</BodyText>
    <Input value={notes} onChangeText={setNotes} multiline maxLength={500} accessibilityLabel={t('quran.notes')} />
    <Checkbox label={t('quran.updateBookmark')} checked={bookmark} onChange={setBookmark} />
    {error && <BodyText accessibilityLiveRegion="polite">{t('quran.saveError')}</BodyText>}
    <PrayerAction label={t('quran.save')} disabled={busy || invalidDuration || total === null} onPress={() => {
      if (!invalidDuration && total !== null) void run(() => saveReading(db, draft.userId, id,
        { date: draft.date, start, end, duration: minutes, notes }, !!session, bookmark));
    }} />
    <PrayerAction label={t('quran.cancel')} disabled={busy} onPress={close} />
    {session && <PrayerAction label={t('quran.delete')} disabled={busy} onPress={() =>
      Alert.alert(t('quran.delete'), t('quran.confirmDelete'), [
        { text: t('quran.cancel'), style: 'cancel' },
        { text: t('quran.delete'), style: 'destructive', onPress: () => void run(() => deleteReading(db, draft.userId, id)) },
      ])} />}
  </PrayerPanel>;
}

export function parseInteger(value: string) {
  return /^\d+$/.test(value.trim()) ? Number(value.trim()) : NaN;
}
