import { useFonts } from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, EmptyState, Input, LoadingState, ScreenContainer } from '../../components/ui';
import { saveReading } from '../../database/repositories/quran';
import { quranFontSizes, readQuranFontSize, readQuranVisibility, readVerses, saveQuranFontSize, saveQuranVisibility, type QuranFontSize, type QuranVisibility } from '../../database/repositories/quranReader';
import type { QuranVerse } from '../../database/seeds/quranVerses';
import { canPreviewMyQuran } from '../../services/islamic/client';
import { myQuranIndonesian } from '../../services/islamic/myquran';
import { splitIntroductoryBasmalah } from '../../services/quranPresentation';
import { countAyat, newReadingSessionId, nextPosition, summarizeReading, validPosition, type Position } from '../../services/quranRules';
import { useTheme } from '../../hooks/useTheme';
import { light, space } from '../../theme/tokens';
import { localDate } from '../../utils/localDate';
import { PrayerAction, PrayerModal, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useRemote } from '../islamic/useRemote';
import { useToday } from '../prayer/usePrayer';
import { QuranArabic, quranArabicFamily } from './QuranArabic';
import { QuranWaqfDiagnostic } from './QuranWaqfDiagnostic';
import { positionLabel, QuranStatus } from './QuranUI';
import { refreshQuran, useQuran } from './useQuran';

const pageSize = 20;
const arabicFonts = { [quranArabicFamily]: require('../../../assets/fonts/AmiriQuran-Regular.ttf') };
type Pending = { id: string; date: string; start: Position; end: Position; count: number };

function useReaderTranslations(surah: number, start: number, end: number, enabled: boolean) {
  const load = useCallback((signal: AbortSignal) => myQuranIndonesian.load(surah, start, end, signal), [surah, start, end]);
  return useRemote(enabled && start <= end ? `quran:${surah}:${start}:${end}` : null, load);
}

export default function QuranReader() {
  const params = useLocalSearchParams<{ surah?: string; ayah?: string }>();
  return <Reader key={JSON.stringify([params.surah, params.ayah])} initialSurah={Number(params.surah)} initialAyah={Number(params.ayah ?? '1')} />;
}

function Reader({ initialSurah, initialAyah }: { initialSurah: number; initialAyah: number }) {
  const { t } = useTranslation();
  const [arabicReady, arabicError] = useFonts(arabicFonts);
  const { colors } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { data, userId } = useQuran(useToday());
  const [surah, setSurah] = useState(initialSurah);
  const [page, setPage] = useState(initialAyah);
  const [start, setStart] = useState<Position>({ surah: initialSurah, ayah: initialAyah });
  const [font, setFont] = useState<QuranFontSize>(30);
  const [fontBusy, setFontBusy] = useState(false);
  const [fontError, setFontError] = useState(false);
  const [settings, showSettings] = useState(true);
  const [visibility, setVisibility] = useState({ transliteration: true, translation: true });
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [loaded, setLoaded] = useState<{
    surah: number;
    rows: QuranVerse[] | null;
    introduction?: ReturnType<typeof splitIntroductoryBasmalah>;
  }>();
  const [attempt, retry] = useState(0);
  const [jump, setJump] = useState<{ mode: 'go' | 'start' | 'end'; value: string }>();
  const [verseMenu, setVerseMenu] = useState<number>();
  const [pending, setPending] = useState<Pending>();
  const [bookmark, setBookmark] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState<number>();
  const [ended, setEnded] = useState(false);
  const lock = useRef(false);
  const fontLock = useRef(false);
  const visibilityLocks = useRef(new Set<QuranVisibility>());
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const summaryOffset = useRef(0);
  const catalog = data?.catalog;
  const chapter = catalog?.get(surah);
  const rows = loaded?.surah === surah ? loaded.rows : undefined;
  const introduction = page === 1 && loaded?.surah === surah ? loaded.introduction : null;
  const limit = chapter?.verses ?? 0;
  const pageStart = Math.floor((page - 1) / pageSize) * pageSize + 1;
  const last = Math.min(pageStart + pageSize - 1, limit);
  const translations = useReaderTranslations(surah, pageStart, last,
    preferencesReady && visibility.translation && Number.isInteger(page) && page >= 1 && page <= limit);

  useEffect(() => {
    let active = true;
    void Promise.all([readQuranFontSize(db), readQuranVisibility(db, 'transliteration'), readQuranVisibility(db, 'translation')]).then(
      ([size, transliteration, translation]) => {
        if (!active) return;
        setFont(size);
        setVisibility({ transliteration, translation });
        setPreferencesReady(true);
      },
      () => { if (active) setFontError(true); },
    );
    return () => { active = false; };
  }, [db]);

  useEffect(() => {
    if (!chapter) return;
    let active = true;
    const opening = surah === 1 || surah === 9 ? Promise.resolve([]) : readVerses(db, 1);
    void Promise.all([readVerses(db, surah), opening]).then(
      ([result, fatihah]) => {
        if (!active) return;
        if (result.length !== chapter.verses) { setLoaded({ surah, rows: null }); return; }
        const introduction = splitIntroductoryBasmalah(surah, result[0].arabic, fatihah[0]?.arabic ?? '');
        setLoaded({ surah, rows: result, introduction });
      },
      () => { if (active) setLoaded({ surah, rows: null }); },
    );
    return () => { active = false; };
  }, [attempt, chapter, db, surah]);

  function move(number: number, ayah: number) {
    setSurah(number);
    setPage(ayah);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }

  async function chooseVisibility(setting: QuranVisibility, enabled: boolean) {
    if (!preferencesReady || visibilityLocks.current.has(setting)) return;
    visibilityLocks.current.add(setting);
    setVisibility(current => ({ ...current, [setting]: enabled }));
    setFontError(false);
    try {
      await saveQuranVisibility(db, setting, enabled);
    } catch {
      setVisibility(current => ({ ...current, [setting]: !enabled }));
      setFontError(true);
    } finally {
      visibilityLocks.current.delete(setting);
    }
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

  function newStart(position: Position, keepEnd = false) {
    const count = keepEnd && pending && catalog ? countAyat(catalog, position, pending.end) : null;
    setPending(pending && count !== null ? { ...pending, start: position, count } : undefined);
    setStart(position);
    setSaved(undefined);
    setEnded(false);
    if (position.surah !== surah || position.ayah < page || position.ayah > last) move(position.surah, position.ayah);
  }

  function finish(ayah: number, showSummary = false) {
    if (!catalog || ended || lock.current) return;
    const end = { surah, ayah };
    const count = countAyat(catalog, start, end);
    if (count === null) {
      Alert.alert(t('quran.invalidRange'));
      return;
    }
    setError(false);
    setPending({ start, end, count, date: localDate(), id: newReadingSessionId() });
    if (showSummary) scroll.current?.scrollTo({ y: summaryOffset.current, animated: true });
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

  const initial = { surah: initialSurah, ayah: initialAyah };
  const back = () => router.canGoBack() ? router.back() : router.replace('/quran');
  const jumpAyah = jump && /^\d+$/.test(jump.value.trim()) ? Number(jump.value) : 0;
  const position = { surah, ayah: jumpAyah };
  const jumpLabel = jump?.mode === 'start' ? 'startAyah' : jump?.mode === 'end' ? 'endAyah' : 'goToAyah';
  const today = data && summarizeReading(data.catalog, data.sessions);

  return <ScreenContainer standalone compact keyboard scrollRef={scroll}>
    <View style={styles.header}>
      <PrayerAction icon="back" label={t('back')} onPress={back} />
      <BodyText accessibilityRole="header" style={styles.headerTitle}>{chapter?.latin ?? t('quran.title')}</BodyText>
      <PrayerAction label={t('quran.readerSettings')} selected={settings} icon="settings" onPress={() => showSettings(!settings)} />
    </View>
    {!data ? <QuranStatus failed={data === null} retry={refreshQuran} /> : !chapter || !catalog || !validPosition(catalog, initial) ?
      <EmptyState message={t('quran.invalidRange')} /> : <>
      <PrayerPanel style={styles.green}>
        <View style={styles.ornament} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={styles.goldLine} /><BodyText style={styles.gold}>&#9671; &#9671; &#9671;</BodyText><View style={styles.goldLine} />
        </View>
        {arabicReady && !!chapter.arabic && <QuranArabic text={chapter.arabic} size={28} color={light.accent} centered />}
        <BodyText style={[styles.center, prayerStyles.onGreen, prayerStyles.section]}>{chapter.latin}</BodyText>
        <BodyText style={[styles.center, prayerStyles.onGreen]}>{t('quran.chapterInfo', { number: chapter.number, count: limit })}</BodyText>
      </PrayerPanel>
      {settings && <PrayerPanel>
        <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.readerSettings')}</BodyText>
        <Checkbox label={t('quran.showLatin')} checked={visibility.transliteration} onChange={value => void chooseVisibility('transliteration', value)} />
        <Checkbox label={t('quran.showTranslation')} checked={visibility.translation} onChange={value => void chooseVisibility('translation', value)} />
        {visibility.transliteration && <BodyText style={prayerStyles.small}>{t('quran.latinUnavailable')}</BodyText>}
        <View style={prayerStyles.wrap}>
          <BodyText style={prayerStyles.small}>{t('quran.fontSize')}</BodyText>
          {quranFontSizes.map((size, index) => <PrayerAction key={size} label={t('quran.font' + index)} selected={font === size}
            disabled={fontBusy || !preferencesReady} onPress={() => void chooseFont(size)} />)}
        </View>
        {fontError && <BodyText accessibilityLiveRegion="polite">{t('quran.saveError')}</BodyText>}
        <PrayerAction label={t('quran.goToAyah')} onPress={() => setJump({ mode: 'go', value: String(page) })} />
      </PrayerPanel>}
      <PrayerPanel style={{ backgroundColor: colors.selected }}>
        <View style={prayerStyles.line}>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.today')}</BodyText>
          <BodyText>{t('quran.ayat', { value: today?.ayat ?? 0 })}</BodyText>
        </View>
        <BodyText style={prayerStyles.small}>{t('quran.sessionsCount', { value: today?.sessions ?? 0 })}</BodyText>
        {saved !== undefined && <BodyText accessibilityLiveRegion="polite">{t('quran.readingSaved', { value: saved })}</BodyText>}
      </PrayerPanel>
      {visibility.translation && preferencesReady && <View>
        <BodyText style={prayerStyles.small}>{t(!canPreviewMyQuran || translations.error ? 'quran.translationUnavailable' :
          translations.data ? 'quran.translationSource' : 'quran.translationLoading')}</BodyText>
        {translations.error && <PrayerAction label={t('retry')} onPress={translations.retry} />}
      </View>}
      {arabicReady && __DEV__ && <QuranWaqfDiagnostic size={font} />}
      {arabicReady && introduction && <PrayerPanel>
        <QuranArabic text={introduction.introduction} size={font} centered />
      </PrayerPanel>}
      {arabicError ? <EmptyState message={t('quran.arabicFontError')} /> :
        rows === null ? <QuranStatus failed retry={() => retry(value => value + 1)} /> : !rows || !arabicReady ? <LoadingState /> :
        rows.slice(page - 1, last).map(verse => <PrayerPanel key={verse.ayah}>
          <View style={prayerStyles.line}>
            <BodyText accessibilityLabel={t('quran.ayahNumber', { value: verse.ayah })} style={styles.badge}>{verse.ayah}</BodyText>
            <View style={styles.markers}>
              {start.surah === surah && start.ayah === verse.ayah && <BodyText style={prayerStyles.small}>{t('quran.startAyah')}</BodyText>}
              {pending?.end.surah === surah && pending.end.ayah === verse.ayah && <BodyText style={prayerStyles.small}>{t('quran.endAyah')}</BodyText>}
            </View>
            <PrayerAction icon="more" label={t('quran.verseActions', { value: verse.ayah })} disabled={busy} onPress={() => setVerseMenu(verse.ayah)} />
          </View>
          <QuranArabic text={verse.ayah === 1 && introduction ? introduction.firstAyah : verse.arabic} size={font} />
          {visibility.translation && translations.data && <BodyText accessibilityLanguage={myQuranIndonesian.language} style={[styles.translation, { borderColor: colors.border, color: colors.muted }]}>
            {translations.data.get(verse.ayah)}
          </BodyText>}
        </PrayerPanel>)}
      <View onLayout={event => { summaryOffset.current = event.nativeEvent.layout.y; }}>
        <PrayerPanel style={styles.green}>
          <View style={prayerStyles.line}>
            <BodyText style={[prayerStyles.onGreen, prayerStyles.section]}>{t('quran.sessions')}</BodyText>
            <BodyText style={prayerStyles.onGreen}>{t('quran.ayat', { value: pending?.count ?? 0 })}</BodyText>
          </View>
          <BodyText style={prayerStyles.onGreen}>{t('quran.startAyah')} &#183; {positionLabel(catalog, start)}</BodyText>
          <BodyText style={prayerStyles.onGreen}>{t('quran.endAyah')} &#183; {pending ? positionLabel(catalog, pending.end) : '\u2014'}</BodyText>
          <View style={prayerStyles.wrap}>
            <PrayerAction disabled={busy} label={t('quran.startAyah')} onPress={() => setJump({ mode: 'start', value: String(start.surah === surah ? start.ayah : page) })} />
            <PrayerAction disabled={busy || ended} label={t('quran.endAyah')} onPress={() => setJump({ mode: 'end', value: String(pending?.end.surah === surah ? pending.end.ayah : last) })} />
          </View>
          <PrayerPanel>
            <Checkbox label={t('quran.updateBookmark')} checked={bookmark} onChange={value => { if (!lock.current) setBookmark(value); }} />
            {error && <BodyText accessibilityLiveRegion="polite">{t('quran.saveError')}</BodyText>}
            <PrayerAction emphasis="primary" label={t('quran.finishSave')} disabled={!pending || busy} onPress={() => void save()} />
            {pending && <PrayerAction label={t('quran.cancel')} disabled={busy} onPress={() => setPending(undefined)} />}
          </PrayerPanel>
        </PrayerPanel>
      </View>
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('quran.previousAyat')} disabled={page <= 1} onPress={() => move(surah, page > pageStart ? pageStart : Math.max(1, pageStart - pageSize))} />
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
        <BodyText style={prayerStyles.section}>{t('quran.' + jumpLabel)}</BodyText>
        <Input accessibilityLabel={t('quran.ayahNumber', { value: `1–${limit}` })} value={jump.value} keyboardType="number-pad"
          onChangeText={(value) => setJump({ ...jump, value })} maxLength={3} />
        <PrayerAction label={t('quran.' + jumpLabel)} disabled={!validPosition(catalog, position) || (jump.mode === 'end' && countAyat(catalog, start, position) === null)} onPress={() => {
          setJump(undefined);
          if (jump.mode === 'start') newStart(position, true);
          else if (jump.mode === 'end') finish(jumpAyah);
          else move(surah, jumpAyah);
        }} />
        <PrayerAction label={t('quran.cancel')} onPress={() => setJump(undefined)} />
      </PrayerModal>}
      {verseMenu !== undefined && <PrayerModal dismiss={() => setVerseMenu(undefined)}>
        <BodyText style={prayerStyles.section}>{t('quran.ayahNumber', { value: verseMenu })}</BodyText>
        <PrayerAction label={t('quran.startAt', { value: verseMenu })} onPress={() => {
          newStart({ surah, ayah: verseMenu }, true);
          setVerseMenu(undefined);
        }} />
        <PrayerAction label={t('quran.finishAt', { value: verseMenu })}
          disabled={ended || countAyat(catalog, start, { surah, ayah: verseMenu }) === null}
          onPress={() => { finish(verseMenu, true); setVerseMenu(undefined); }} />
        <PrayerAction label={t('quran.cancel')} onPress={() => setVerseMenu(undefined)} />
      </PrayerModal>}
    </>}
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },
  green: { backgroundColor: light.primary, borderColor: light.primary },
  center: { textAlign: 'center' },
  gold: { color: light.accent },
  ornament: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  goldLine: { flex: 1, height: 1, backgroundColor: light.accent },
  badge: { backgroundColor: light.primary, color: light.onPrimary, borderRadius: 20, paddingHorizontal: space.sm, paddingVertical: 2, overflow: 'hidden' },
  markers: { flex: 1, alignItems: 'flex-end' },
  translation: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: space.sm, textAlign: 'left' },
});
