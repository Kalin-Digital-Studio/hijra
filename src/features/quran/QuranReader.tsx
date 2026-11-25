import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, EmptyState, Input, LoadingState, ScreenContainer } from '../../components/ui';
import { saveReading } from '../../database/repositories/quran';
import { quranFontSizes, readQuranFontSize, readVerses, saveQuranFontSize, type QuranFontSize } from '../../database/repositories/quranReader';
import type { QuranVerse } from '../../database/seeds/quranVerses';
import { countAyat, newReadingSessionId, nextPosition, validPosition, type Position } from '../../services/quranRules';
import { space } from '../../theme/tokens';
import { localDate } from '../../utils/localDate';
import { PrayerAction, PrayerModal, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { positionLabel, QuranStatus } from './QuranUI';
import { refreshQuran, useQuran } from './useQuran';

const pageSize = 20;
type Pending = { id: string; date: string; start: Position; end: Position; count: number };

export default function QuranReader() {
  const params = useLocalSearchParams<{ surah?: string; ayah?: string }>();
  return <Reader key={JSON.stringify([params.surah, params.ayah])} initialSurah={Number(params.surah)} initialAyah={Number(params.ayah ?? '1')} />;
}

function Reader({ initialSurah, initialAyah }: { initialSurah: number; initialAyah: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const { data, userId } = useQuran(useToday());
  const [surah, setSurah] = useState(initialSurah);
  const [page, setPage] = useState(initialAyah);
  const [start, setStart] = useState<Position>({ surah: initialSurah, ayah: initialAyah });
  const [font, setFont] = useState<QuranFontSize>(30);
  const [fontBusy, setFontBusy] = useState(false);
  const [fontError, setFontError] = useState(false);
  const [loaded, setLoaded] = useState<{ surah: number; rows: QuranVerse[] | null }>();
  const [attempt, retry] = useState(0);
  const [jump, setJump] = useState<{ mode: 'go' | 'start'; value: string }>();
  const [pending, setPending] = useState<Pending>();
  const [bookmark, setBookmark] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState<number>();
  const [ended, setEnded] = useState(false);
  const lock = useRef(false);
  const fontLock = useRef(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const catalog = data?.catalog;
  const chapter = catalog?.get(surah);
  const rows = loaded?.surah === surah ? loaded.rows : undefined;

  useEffect(() => {
    let active = true;
    readQuranFontSize(db).then((size) => { if (active && !fontLock.current) setFont(size); }, () => { if (active) setFontError(true); });
    return () => { active = false; };
  }, [db]);

  useEffect(() => {
    if (!chapter) return;
    let active = true;
    readVerses(db, surah).then(
      (result) => { if (active) setLoaded({ surah, rows: result.length === chapter.verses ? result : null }); },
      () => { if (active) setLoaded({ surah, rows: null }); },
    );
    return () => { active = false; };
  }, [attempt, chapter, db, surah]);

  function move(number: number, ayah: number) {
    setSurah(number);
    setPage(ayah);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }

  async function chooseFont(size: QuranFontSize) {
    if (fontLock.current) return;
    fontLock.current = true;
    setFontBusy(true);
    setFontError(false);
    try {
      await saveQuranFontSize(db, size);
      setFont(size);
    } catch {
      setFontError(true);
    } finally {
      fontLock.current = false;
      setFontBusy(false);
    }
  }

  function newStart(position: Position) {
    setStart(position);
    setSaved(undefined);
    setEnded(false);
    move(position.surah, position.ayah);
  }

  function finish(ayah: number) {
    if (!catalog || ended) return;
    const end = { surah, ayah };
    const count = countAyat(catalog, start, end);
    if (count === null) {
      Alert.alert(t('quran.invalidRange'));
      return;
    }
    setError(false);
    setBookmark(true);
    setPending({ start, end, count, date: localDate(), id: newReadingSessionId() });
  }

  async function save() {
    if (!userId || !pending || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await saveReading(db, userId, pending.id, { date: pending.date, start: pending.start, end: pending.end, duration: null, notes: null }, false, bookmark);
      setSaved(pending.count);
      setPending(undefined);
      refreshQuran();
      const next = catalog && nextPosition(catalog, pending.end);
      if (next && next !== 'restart') setStart(next);
      else setEnded(true);
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  const limit = chapter?.verses ?? 0;
  const last = Math.min(page + pageSize - 1, limit);
  const initial = { surah: initialSurah, ayah: initialAyah };
  const back = () => router.canGoBack() ? router.back() : router.replace('/quran');
  const jumpAyah = jump && /^\d+$/.test(jump.value.trim()) ? Number(jump.value) : 0;
  const position = { surah, ayah: jumpAyah };

  return <ScreenContainer standalone compact keyboard scrollRef={scroll}>
    <View style={styles.header}>
      <PrayerAction icon="back" label={t('back')} onPress={back} />
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{chapter?.latin ?? t('quran.title')}</BodyText>
    </View>
    {!data ? <QuranStatus failed={data === null} retry={refreshQuran} /> : !chapter || !catalog || !validPosition(catalog, initial) ?
      <EmptyState message={t('quran.invalidRange')} /> : <>
      <PrayerPanel>
        {!!chapter.arabic && <BodyText style={[styles.verse, { fontSize: 26, lineHeight: 40 }]}>{chapter.arabic}</BodyText>}
        <BodyText>{chapter.number}. {chapter.latin} · {t('quran.ayat', { value: limit })}</BodyText>
        <BodyText>{t('quran.fontSize')}</BodyText>
        <View style={prayerStyles.wrap}>
          {quranFontSizes.map((size, index) => <PrayerAction key={size} label={t(`quran.font${index}`)} selected={font === size} disabled={fontBusy} onPress={() => void chooseFont(size)} />)}
        </View>
        {fontError && <BodyText accessibilityLiveRegion="polite">{t('quran.saveError')}</BodyText>}
      </PrayerPanel>
      <PrayerPanel>
        <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.readingRange')}</BodyText>
        <BodyText>{t('quran.startAyah')} · {positionLabel(catalog, start)}</BodyText>
        {saved !== undefined && <BodyText accessibilityLiveRegion="polite">{t('quran.readingSaved', { value: saved })}</BodyText>}
        <View style={prayerStyles.wrap}>
          <PrayerAction label={t('quran.startReading')} onPress={() => setJump({ mode: 'start', value: String(start.surah === surah ? start.ayah : page) })} />
          <PrayerAction label={t('quran.goToAyah')} onPress={() => setJump({ mode: 'go', value: String(page) })} />
        </View>
      </PrayerPanel>
      {rows === null ? <QuranStatus failed retry={() => retry((value) => value + 1)} /> : !rows ? <LoadingState /> :
        rows.slice(page - 1, last).map((verse) => <PrayerPanel key={verse.ayah}>
          <BodyText style={prayerStyles.small}>{t('quran.ayahNumber', { value: verse.ayah })}</BodyText>
          <BodyText accessibilityLanguage="ar" style={[styles.verse, { fontSize: font, lineHeight: Math.ceil(font * 1.85) }]}>{verse.arabic}</BodyText>
          <PrayerAction disabled={ended || start.surah > surah || (start.surah === surah && verse.ayah < start.ayah)} label={t('quran.finishAt', { value: verse.ayah })} onPress={() => finish(verse.ayah)} />
        </PrayerPanel>)}
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('quran.previousAyat')} disabled={page <= 1} onPress={() => move(surah, Math.max(1, page - pageSize))} />
        <PrayerAction label={t('quran.nextAyat')} disabled={last >= limit} onPress={() => move(surah, last + 1)} />
      </View>
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('quran.previousSurah')} disabled={surah <= 1} onPress={() =>
          Alert.alert(t('quran.previousSurah'), t('quran.resetRange'), [
            { text: t('quran.cancel'), style: 'cancel' }, { text: t('quran.startReading'), onPress: () => newStart({ surah: surah - 1, ayah: 1 }) },
          ])} />
        <PrayerAction label={t('quran.nextSurah')} disabled={surah >= 114} onPress={() =>
          start.surah === surah + 1 ? move(surah + 1, 1) : Alert.alert(t('quran.nextSurah'), t('quran.contiguous'), [
            { text: t('quran.cancel'), style: 'cancel' },
            { text: t('quran.newRange'), onPress: () => newStart({ surah: surah + 1, ayah: 1 }) },
            ...(last === limit ? [{ text: t('quran.contiguousConfirm'), onPress: () => move(surah + 1, 1) }] : []),
          ])} />
      </View>
      {jump && <PrayerModal dismiss={() => setJump(undefined)}>
        <BodyText style={prayerStyles.section}>{t(jump.mode === 'go' ? 'quran.goToAyah' : 'quran.startReading')}</BodyText>
        <Input accessibilityLabel={t('quran.ayahNumber', { value: `1–${limit}` })} value={jump.value} keyboardType="number-pad"
          onChangeText={(value) => setJump({ ...jump, value })} maxLength={3} />
        <PrayerAction label={t(jump.mode === 'go' ? 'quran.goToAyah' : 'quran.startReading')} disabled={!validPosition(catalog, position)} onPress={() => {
          setJump(undefined);
          if (jump.mode === 'start') newStart(position);
          else move(surah, jumpAyah);
        }} />
        <PrayerAction label={t('quran.cancel')} onPress={() => setJump(undefined)} />
      </PrayerModal>}
      {pending && <PrayerModal dismiss={() => { if (!lock.current) setPending(undefined); }}>
        <BodyText style={prayerStyles.section}>{t('quran.confirmReading', { value: pending.count })}</BodyText>
        <BodyText>{positionLabel(catalog, pending.start)} – {positionLabel(catalog, pending.end)}</BodyText>
        <Checkbox label={t('quran.updateBookmark')} checked={bookmark} onChange={(value) => { if (!lock.current) setBookmark(value); }} />
        {error && <BodyText accessibilityLiveRegion="polite">{t('quran.saveError')}</BodyText>}
        <PrayerAction emphasis="primary" label={t('quran.saveReading')} disabled={busy} onPress={() => void save()} />
        <PrayerAction label={t('quran.cancel')} disabled={busy} onPress={() => setPending(undefined)} />
      </PrayerModal>}
    </>}
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  verse: { textAlign: 'right', writingDirection: 'rtl' },
});
