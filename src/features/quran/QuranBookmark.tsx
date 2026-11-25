import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, ScreenContainer } from '../../components/ui';
import { saveBookmark } from '../../database/repositories/quran';
import { validPosition, type Position } from '../../services/quranRules';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { AyahField, QuranStatus, SurahField } from './QuranUI';
import { parseInteger } from './ReadingForm';
import { refreshQuran, useQuran } from './useQuran';

export default function QuranBookmark() {
  const { t } = useTranslation();
  const router = useRouter();
  const { db, userId, data } = useQuran(useToday());
  const [selection, select] = useState<number>();
  const [input, setInput] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const lock = useRef(false);
  const back = () => router.canGoBack() ? router.back() : router.replace('/quran');
  const surah = selection ?? data?.bookmark?.surah ?? 1;
  const ayah = input ?? String(data?.bookmark?.ayah ?? 1);
  const position = { surah, ayah: parseInteger(ayah) };
  async function save(value: Position | null) {
    if (!userId || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await saveBookmark(db, userId, value);
      refreshQuran();
      back();
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return <ScreenContainer standalone compact keyboard>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <PrayerAction icon="back" label={t('back')} disabled={busy} onPress={back} />
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('quran.bookmark')}</BodyText>
    </View>
    {!data ? <QuranStatus failed={data === null} retry={refreshQuran} /> : data.catalog.size !== 114 ?
      <EmptyState message={t('quran.catalogUnavailable')} /> : <PrayerPanel>
      <SurahField catalog={data.catalog} value={surah} change={select} label={t('quran.surah')} />
      <AyahField value={ayah} change={setInput} label={t('quran.lastReadAyah')} limit={data.catalog.get(surah)?.verses} />
      {error && <BodyText accessibilityLiveRegion="polite">{t('quran.saveError')}</BodyText>}
      <PrayerAction emphasis="primary" label={t('quran.save')} disabled={busy || !validPosition(data.catalog, position)} onPress={() => void save(position)} />
      <PrayerAction label={t('quran.cancel')} disabled={busy} onPress={back} />
      {data.bookmark && <PrayerAction emphasis="danger" disabled={busy} label={t('quran.clearBookmark')} onPress={() =>
        Alert.alert(t('quran.clearBookmark'), t('quran.confirmClear'), [
          { text: t('quran.cancel'), style: 'cancel' },
          { text: t('quran.clearBookmark'), style: 'destructive', onPress: () => void save(null) },
        ])} />}
    </PrayerPanel>}
  </ScreenContainer>;
}
