import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { summarizeSunnah } from '../../services/sunnahRules';
import { useSettings } from '../../stores/settings';
import { space } from '../../theme/tokens';
import { addDays, parseLocalDate, weekDates } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { activityName, SunnahSummary } from './SunnahUI';
import { refreshSunnah, useSunnahData } from './useSunnah';

export default function SunnahHistory() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const today = useToday();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const weekStart = useSettings((state) => state.week_start);
  const [anchor, setAnchor] = useState<string | null>(() => date && parseLocalDate(date) && date < today && date > '0001-01-07' ? date : null);
  const dates = weekDates(anchor && anchor <= today ? anchor : today, weekStart);
  const start = dates[0], end = dates[6];
  const { data } = useSunnahData(start, end < today ? end : today);
  const dateFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium' });
  const dayFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage, { weekday: 'short' });
  const formatted = (day: string) => dateFormat.format(parseLocalDate(day)!);
  const open = (day: string) => router.push(day === today ? '/sunnah' : { pathname: '/sunnah', params: { date: day } });
  const rows = (data?.activities ?? []).map((activity) => {
    const sessions = data?.sessions.filter((session) => session.activityId === activity.id) ?? [];
    const totals = summarizeSunnah(sessions);
    return { activity, totals, counts: dates.map((day) => sessions.filter((session) => session.date === day).length) };
  }).filter(({ activity, totals }) => activity.active || totals.totalSessions > 0);
  const breakdown = rows.filter(({ totals }) => totals.totalSessions).sort((a, b) => b.totals.totalSessions - a.totals.totalSessions || a.activity.id.localeCompare(b.activity.id));

  return (
    <ScreenContainer standalone compact>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/sunnah')} />
        <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('sunnah.history')}</BodyText>
      </View>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('prayer.previous')} disabled={start <= '0001-01-07'} onPress={() => setAnchor(addDays(start, -7))} />
        <BodyText style={[prayerStyles.small, styles.range]}>{formatted(start)} – {formatted(end)}</BodyText>
        <PrayerAction icon="next" label={t('prayer.next')} disabled={end >= today} onPress={() => setAnchor(addDays(start, 7))} />
      </View>
      <PrayerAction label={t('prayer.thisWeek')} onPress={() => setAnchor(null)} />
      {data ? <>
        <SunnahSummary sessions={data.sessions} title={t('sunnah.weeklyTitle')} weekly />
        <PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('sunnah.matrix')}</BodyText>
          <ScrollView horizontal>
            <View>
              <View style={styles.row}>
                <View style={styles.name} />
                {dates.map((day) => <View key={day} style={styles.cell}><BodyText style={prayerStyles.small}>{dayFormat.format(parseLocalDate(day)!)}</BodyText></View>)}
              </View>
              {rows.map(({ activity, counts }) => <View key={activity.id} style={[styles.row, { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border }]}>
                <BodyText style={[styles.name, prayerStyles.small]}>{activityName(t, activity)}</BodyText>
                {dates.map((day, index) => {
                  const future = day > today;
                  const count = counts[index];
                  const status = future ? t('prayer.status.FUTURE') : count ? t('sunnah.sessionCount', { count }) : t('sunnah.notLogged');
                  return <Pressable key={day} accessibilityRole="button" disabled={future} accessibilityState={{ disabled: future }}
                    accessibilityLabel={t('sunnah.cell', { name: activityName(t, activity), date: formatted(day), status })}
                    onPress={() => open(day)} style={styles.cell}>
                    <View style={[styles.badge, { backgroundColor: !future && count ? colors.selected : colors.background }]}>
                      <BodyText style={[prayerStyles.small, { color: future ? colors.muted : colors.text }]}>{future ? '' : count || '—'}</BodyText>
                    </View>
                  </Pressable>;
                })}
              </View>)}
            </View>
          </ScrollView>
          <BodyText style={prayerStyles.small}>{t('sunnah.legend')}</BodyText>
        </PrayerPanel>
        <PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('sunnah.breakdown')}</BodyText>
          {!breakdown.length && <BodyText style={prayerStyles.small}>{t('sunnah.noRecords')}</BodyText>}
          {breakdown.map(({ activity, totals }) => <View key={activity.id} accessible style={styles.breakdown}>
            <View style={prayerStyles.line}>
              <BodyText style={[prayerStyles.small, styles.flex]}>{activityName(t, activity)}</BodyText>
              <BodyText style={prayerStyles.small}>{t('sunnah.sessionCount', { count: totals.totalSessions })}</BodyText>
            </View>
            <View style={[styles.track, { backgroundColor: colors.selected }]}>
              <View style={{ height: '100%', width: `${totals.totalSessions / breakdown[0].totals.totalSessions * 100}%`, backgroundColor: colors.primary }} />
            </View>
            <BodyText style={prayerStyles.small}>{totals.activeDays} {t('sunnah.days')} · {totals.recordedRakaat === null ?
              t('sunnah.noRakaat') : t('sunnah.rakaatCount', { count: totals.recordedRakaat })}</BodyText>
          </View>)}
        </PrayerPanel>
      </> : data === null ? <>
        <EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={refreshSunnah} />
      </> : <LoadingState />}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  range: { flex: 1, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { width: 120, paddingRight: space.xs },
  cell: { width: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  badge: { minWidth: 30, minHeight: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  breakdown: { gap: space.xs },
  track: { height: 6, borderRadius: 4, overflow: 'hidden' },
  flex: { flex: 1 },
});
