import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, ScreenContainer } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { summarizeReading } from '../../services/quranRules';
import { useSettings } from '../../stores/settings';
import { addDays, parseLocalDate, weekDates } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { QuranStatus, QuranSummary } from './QuranUI';
import { refreshQuran, useQuran } from './useQuran';

export default function QuranHistory() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const today = useToday();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const [anchor, setAnchor] = useState<string | null>(() => date && parseLocalDate(date) && date < today && date >= '0001-01-07' ? date : null);
  const weekStart = useSettings((state) => state.week_start);
  const days = weekDates(anchor && anchor <= today ? anchor : today, weekStart);
  const start = days[0], end = days[6];
  const { data } = useQuran(start, end < today ? end : today);
  const formatter = new Intl.DateTimeFormat(i18n.resolvedLanguage, { weekday: 'short', day: 'numeric', month: 'short' });
  const label = (day: string) => formatter.format(parseLocalDate(day)!);
  const totals = data?.catalog.size === 114 ? days.map((day) => summarizeReading(data.catalog, data.sessions.filter((entry) => entry.date === day))) : [];
  const max = Math.max(1, ...totals.map((total) => total.ayat));
  return <ScreenContainer standalone compact>
    <View style={prayerStyles.line}>
      <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/quran')} />
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('quran.history')}</BodyText>
    </View>
    <View style={prayerStyles.line}>
      <PrayerAction icon="back" label={t('prayer.previous')} disabled={start <= '0001-01-07'} onPress={() => setAnchor(addDays(start, -7) < '0001-01-07' ? '0001-01-07' : addDays(start, -7))} />
      <BodyText style={styles.range}>{label(start)} – {label(end)}</BodyText>
      <PrayerAction icon="next" label={t('prayer.next')} disabled={end >= today} onPress={() => setAnchor(addDays(start, 7))} />
    </View>
    <PrayerAction label={t('prayer.thisWeek')} onPress={() => setAnchor(null)} />
    {!data ? <QuranStatus failed={data === null} retry={refreshQuran} /> : !totals.length ?
      <EmptyState message={t('quran.catalogUnavailable')} /> : <>
      <QuranSummary catalog={data.catalog} sessions={data.sessions} title={t('quran.weekly')} weekly />
      <PrayerPanel>
        {days.map((day, index) => {
          const future = day > today;
          const count = totals[index].ayat;
          return <Pressable key={day} accessibilityRole="button" accessibilityState={{ disabled: future }} disabled={future}
            onPress={() => router.push(day === today ? '/quran/manual' : { pathname: '/quran/manual', params: { date: day } })}
            style={styles.row}>
            <View style={prayerStyles.line}>
              <BodyText>{label(day)}</BodyText>
              <BodyText>{future ? t('prayer.status.FUTURE') : t('quran.ayat', { value: count })}</BodyText>
            </View>
            {!future && <View style={[styles.bar, { backgroundColor: colors.selected }]}>
              <View style={[styles.bar, { backgroundColor: colors.primary, width: `${100 * count / max}%` }]} />
            </View>}
          </Pressable>;
        })}
      </PrayerPanel>
    </>}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  range: { flex: 1, textAlign: 'center' },
  row: { minHeight: 48, justifyContent: 'center', gap: 4 },
  bar: { height: 6, borderRadius: 3 },
});
