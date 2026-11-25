import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, ScreenContainer } from '../../components/ui';
import { countAyat, type Session } from '../../services/quranRules';
import { addDays, parseLocalDate } from '../../utils/localDate';
import { PrayerDatePicker } from '../prayer/PrayerDatePicker';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { positionLabel, QuranStatus, QuranSummary } from './QuranUI';
import ReadingForm, { type Draft } from './ReadingForm';
import { ContinueReader } from './ReaderNavigation';
import { refreshQuran, useQuran } from './useQuran';

export default function DailyQuran() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const today = useToday();
  const { date: routeDate } = useLocalSearchParams<{ date?: string }>();
  const [selected, select] = useState<string | null>();
  const [picking, setPicking] = useState(false);
  const [draft, setForm] = useState<Draft | null>(null);
  const requested = selected === undefined ? routeDate : selected;
  const invalid = requested != null && (!parseLocalDate(requested) || requested > today);
  const date = invalid ? today : requested ?? today;
  const { db, userId, data } = useQuran(date);
  const ready = data?.catalog.size === 114;
  const label = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'full' }).format(parseLocalDate(date)!);
  const choose = (day: string) => { select(day === today ? null : day); setPicking(false); };
  const open = (session?: Session) => {
    if (userId) setForm({ userId, date, session, updateBookmark: !session && date === today });
  };
  return <ScreenContainer standalone compact keyboard>
    <View style={prayerStyles.line}>
      <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/quran')} />
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('quran.manual')}</BodyText>
    </View>
    {draft && ready && draft.userId === userId ? <ReadingForm db={db} draft={draft} catalog={data.catalog} close={() => setForm(null)} /> : <>
      {invalid && <EmptyState message={t('quran.invalidDate')} />}
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" disabled={date === '0001-01-01'} label={t('prayer.previous')} onPress={() => choose(addDays(date, -1))} />
        <PrayerAction label={label} onPress={() => setPicking(true)} />
        <PrayerAction icon="next" disabled={date >= today} label={t('prayer.next')} onPress={() => choose(addDays(date, 1))} />
      </View>
      <View style={prayerStyles.wrap}>
        {date !== today && <PrayerAction label={t('prayer.today')} onPress={() => choose(today)} />}
        <PrayerAction label={t('quran.history')} onPress={() => router.push({ pathname: '/quran/history', params: { date } })} />
      </View>
      {!data ? <QuranStatus failed={data === null} retry={refreshQuran} /> : !ready ? <EmptyState message={t('quran.catalogUnavailable')} /> : <>
        <QuranSummary catalog={data.catalog} sessions={data.sessions} title={date === today ? t('quran.today') : label} />
        <PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.bookmark')}</BodyText>
          <BodyText>{data.bookmark ? t('quran.bookmarkPosition', { name: data.catalog.get(data.bookmark.surah)?.latin,
            ayah: data.bookmark.ayah, limit: data.catalog.get(data.bookmark.surah)?.verses }) : t('quran.noBookmark')}</BodyText>
          <PrayerAction label={t(data.bookmark ? 'quran.editBookmark' : 'quran.setBookmark')} onPress={() => router.push('/quran/bookmark')} />
          <ContinueReader catalog={data.catalog} bookmark={data.bookmark} />
        </PrayerPanel>
        <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.sessions')}</BodyText>
        {!data.sessions.length && <EmptyState message={t('quran.noSessions')} />}
        {data.sessions.map((session) => <PrayerPanel key={session.id}>
          <BodyText style={prayerStyles.section}>{positionLabel(data.catalog, session.start)} – {positionLabel(data.catalog, session.end)}</BodyText>
          <BodyText>{t('quran.ayat', { value: countAyat(data.catalog, session.start, session.end) })}
            {session.duration === null ? '' : ` · ${t('quran.minutes', { value: session.duration })}`}</BodyText>
          {session.notes && <BodyText>{session.notes}</BodyText>}
          <PrayerAction label={t('quran.edit')} onPress={() => open(session)} />
        </PrayerPanel>)}
        <PrayerAction label={t('quran.add')} onPress={() => open()} />
        <BodyText>{t('quran.privacy')}</BodyText>
      </>}
      {picking && <PrayerDatePicker date={date} today={today} choose={choose} dismiss={() => setPicking(false)} />}
    </>}
  </ScreenContainer>;
}
