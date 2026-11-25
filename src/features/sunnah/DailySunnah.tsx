import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { useToday } from '../prayer/usePrayer';
import { addDays, parseLocalDate } from '../../utils/localDate';
import { PrayerDatePicker } from '../prayer/PrayerDatePicker';
import { PrayerAction, prayerStyles } from '../prayer/PrayerUI';
import { SunnahActivityCard } from './SunnahActivityCard';
import { SunnahSummary } from './SunnahUI';
import { refreshSunnah, useSunnahData } from './useSunnah';

export default function DailySunnah() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const today = useToday();
  const { date: routeDate } = useLocalSearchParams<{ date?: string }>();
  const [selection, setSelection] = useState<{ date: string | null }>();
  const [picking, setPicking] = useState(false);
  const requested = selection ? selection.date : routeDate;
  const invalid = requested != null && (!parseLocalDate(requested) || requested > today);
  const date = invalid ? today : requested ?? today;
  const { data, userId } = useSunnahData(date);
  const dateLabel = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'full' }).format(parseLocalDate(date)!);
  const relative = date === today ? t('prayer.today') : date === addDays(today, -1) ? t('prayer.yesterday') : undefined;
  function choose(next: string) {
    setSelection({ date: next === today ? null : next });
    setPicking(false);
  }
  const active = data?.activities.filter((activity) => activity.active) ?? [];
  const inactive = data?.activities.filter((activity) => !activity.active && data.sessions.some((session) => session.activityId === activity.id)) ?? [];
  return (
    <ScreenContainer standalone compact>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/tracker')} />
        <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('sunnah.title')}</BodyText>
      </View>
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('sunnah.manage')} onPress={() => router.push('/sunnah/manage')} />
        <PrayerAction label={t('sunnah.history')} onPress={() => router.push({ pathname: '/sunnah/history', params: { date } })} />
      </View>
      {invalid ? <>
        <EmptyState message={t('prayer.invalidDate')} />
        <PrayerAction label={t('prayer.today')} onPress={() => choose(today)} />
      </> : <>
        <View style={prayerStyles.line}>
          <PrayerAction icon="back" label={t('prayer.previous')} disabled={date === '0001-01-01'} onPress={() => choose(addDays(date, -1))} />
          <View style={styles.date}>
            <PrayerAction label={dateLabel} onPress={() => setPicking(true)} />
            {relative && <BodyText style={[prayerStyles.small, styles.center]}>{relative}</BodyText>}
          </View>
          <PrayerAction icon="next" label={t('prayer.next')} disabled={date >= today} onPress={() => choose(addDays(date, 1))} />
        </View>
        {date !== today && <PrayerAction label={t('prayer.today')} onPress={() => choose(today)} />}
        {data && userId ? <>
          <SunnahSummary sessions={data.sessions} title={date === today ? t('sunnah.todayTitle') : `${t('sunnah.dailyTitle')} · ${dateLabel}`} />
          {[{ title: 'mine', activities: active }, { title: 'inactiveRecorded', activities: inactive }].map(({ title, activities }) => {
            if (!activities.length && title === 'inactiveRecorded') return null;
            return <View key={title} style={styles.cards}>
              <BodyText accessibilityRole="header" style={prayerStyles.section}>{t(`sunnah.${title}`)}</BodyText>
              {!activities.length && <EmptyState message={t('sunnah.noActivities')} />}
              {activities.map((activity) => <SunnahActivityCard key={JSON.stringify([userId, date, activity.id])} activity={activity}
                target={{ activityId: activity.id, userId, date }} sessions={data.sessions.filter((session) => session.activityId === activity.id)} />)}
            </View>;
          })}
          <PrayerAction label={t('sunnah.addActivity')} onPress={() => router.push('/sunnah/manage')} />
          <BodyText style={prayerStyles.small}>{t('sunnah.privacy')}</BodyText>
        </> : data === null ? <>
          <EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={refreshSunnah} />
        </> : <LoadingState />}
      </>}
      {picking && <PrayerDatePicker date={date} today={today} choose={choose} dismiss={() => setPicking(false)} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  date: { flex: 1 },
  center: { textAlign: 'center' },
  cards: { gap: 10 },
});
