import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { savePrayer } from '../../services/prayer';
import { emptyPrayer, prayerSlots, summarizePrayers } from '../../services/prayerRules';
import { addDays, parseLocalDate } from '../../utils/localDate';
import { PrayerActivityCard } from './PrayerActivityCard';
import { PrayerDatePicker } from './PrayerDatePicker';
import { PrayerAction, PrayerSummary, prayerStyles } from './PrayerUI';
import { refreshPrayerReaders, usePrayerData, useToday } from './usePrayer';

export default function DailyPrayer() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const today = useToday();
  const [selection, setSelection] = useState<{ date: string | null }>();
  const [picking, setPicking] = useState(false);
  const routeDate = params.date;
  const requested = selection ? selection.date : routeDate;
  const invalid = requested != null && (!parseLocalDate(requested) || requested > today);
  const date = invalid ? today : requested ?? today;
  const db = useSQLiteContext();
  const { data, userId } = usePrayerData(date);
  const dateLabel = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'full' }).format(parseLocalDate(date)!);
  const dayLabel = date === today ? t('prayer.today') : date === addDays(today, -1) ? t('prayer.yesterday') : undefined;
  const slots = data ? prayerSlots(data.ids, data.logs, date) : [];
  function choose(next: string) {
    setSelection({ date: next === today ? null : next });
    setPicking(false);
  }

  return (
    <ScreenContainer standalone compact>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/tracker')} />
        <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('prayer.daily')}</BodyText>
        <PrayerAction label={t('prayer.history')} onPress={() => router.push({ pathname: '/prayer/history', params: { date } })} />
      </View>
      {invalid ? <>
        <EmptyState message={t('prayer.invalidDate')} />
        <PrayerAction label={t('prayer.today')} onPress={() => choose(today)} />
      </> : <>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('prayer.previous')} disabled={date === '0001-01-01'} onPress={() => choose(addDays(date, -1))} />
        <View style={styles.date}>
          <PrayerAction label={dateLabel} onPress={() => setPicking(true)} />
          {dayLabel && <BodyText style={[prayerStyles.small, styles.center]}>{dayLabel}</BodyText>}
        </View>
        <PrayerAction icon="next" label={t('prayer.next')} disabled={date >= today} onPress={() => choose(addDays(date, 1))} />
      </View>
      {date !== today && <PrayerAction label={t('prayer.today')} onPress={() => setSelection({ date: null })} />}
      {data && userId ? <>
        <PrayerSummary summary={summarizePrayers(slots.map(({ record }) => record))} />
        <View style={styles.cards}>
          {slots.map(({ id, record }) => <PrayerActivityCard date={date} key={JSON.stringify([userId, date, id])} id={id} record={record}
            save={async (change) => {
              const saved = await savePrayer(db, { userId, prayerId: id, date }, change);
              refreshPrayerReaders();
              return saved ?? emptyPrayer;
            }} />)}
        </View>
        <BodyText style={prayerStyles.small}>{t('prayer.privacy')}</BodyText>
      </> : data === null ? <>
        <EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={refreshPrayerReaders} />
      </> : <LoadingState />}
      {picking && <PrayerDatePicker date={date} today={today} choose={choose} dismiss={() => setPicking(false)} />}
      </>}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  date: { flex: 1 },
  center: { textAlign: 'center' },
  cards: { gap: 10 },
});
