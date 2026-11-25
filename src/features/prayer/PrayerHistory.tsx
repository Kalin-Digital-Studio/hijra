import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { prayerSlots, summarizePrayers } from '../../services/prayerRules';
import { useSettings } from '../../stores/settings';
import { space } from '../../theme/tokens';
import { prayerStatuses } from '../../types/prayer';
import { addDays, parseLocalDate, weekDates } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, PrayerSummary, StatusIcon, prayerStyles } from './PrayerUI';
import { refreshPrayerReaders, usePrayerData, useToday } from './usePrayer';

export default function PrayerHistory() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const today = useToday();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const weekStart = useSettings((state) => state.week_start);
  const [anchor, setAnchor] = useState<string | null>(() => date && parseLocalDate(date) && date < today && date > '0001-01-07' ? date : null);
  const dates = weekDates(anchor ?? today, weekStart);
  const start = dates[0];
  const end = dates[6];
  const { data } = usePrayerData(start, end < today ? end : today);
  const dayFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage, { weekday: 'short' });
  const dateFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium' });
  const dayLabel = (day: string) => dayFormat.format(parseLocalDate(day)!);
  const formatted = (day: string) => dateFormat.format(parseLocalDate(day)!);
  const byDay = data ? dates.map((day) => day <= today ? prayerSlots(data.ids, data.logs, day) : []) : [];
  const completedByDay = byDay.map((slots) => summarizePrayers(slots.map(({ record }) => record)).completed);
  const eligible = dates.map((day) => day <= today);
  const openDay = (day: string) => router.push(day === today ? '/prayer' : { pathname: '/prayer', params: { date: day } });

  return (
    <ScreenContainer standalone compact>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/prayer')} />
        <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('prayer.history')}</BodyText>
      </View>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('prayer.previous')} disabled={start <= '0001-01-07'} onPress={() => setAnchor(addDays(start, -7))} />
        <BodyText style={[prayerStyles.small, styles.range]}>{formatted(start)} – {formatted(end)}</BodyText>
        <PrayerAction icon="next" label={t('prayer.next')} disabled={end >= today} onPress={() => setAnchor(addDays(start, 7))} />
      </View>
      <PrayerAction label={t('prayer.thisWeek')} onPress={() => setAnchor(null)} />
      {data ? <>
        <PrayerSummary weekly summary={summarizePrayers(byDay.flatMap((slots) => slots.map(({ record }) => record)))} />
        <PrayerPanel>
          <ScrollView horizontal>
            <View>
              <View style={styles.matrixRow}>
                <View style={styles.rowName} />
                {dates.map((day, index) => <Pressable key={day} disabled={!eligible[index]} accessibilityRole="button"
                  accessibilityLabel={formatted(day)} accessibilityState={{ disabled: !eligible[index] }} onPress={() => openDay(day)} style={styles.cell}>
                  <BodyText style={prayerStyles.small}>{dayLabel(day)}</BodyText>
                </Pressable>)}
              </View>
              {data.ids.map((id, row) => <View key={id} style={[styles.matrixRow, { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border }]}>
                <BodyText style={[prayerStyles.small, styles.rowName]}>{t(`types.${id}`)}</BodyText>
                {dates.map((day, col) => {
                  const status = byDay[col][row]?.record.status ?? 'FUTURE';
                  return <Pressable key={day} disabled={!eligible[col]} accessibilityRole="button" accessibilityState={{ disabled: !eligible[col] }}
                    accessibilityLabel={t('prayer.historyCell', { prayer: t(`types.${id}`), date: formatted(day), status: t(`prayer.status.${status}`) })}
                    onPress={() => openDay(day)} style={styles.cell}><StatusIcon status={status} /></Pressable>;
                })}
              </View>)}
            </View>
          </ScrollView>
          <View style={prayerStyles.wrap}>
            {[...prayerStatuses, 'FUTURE' as const].map((status) => <View key={status} style={styles.legend}>
              <StatusIcon status={status} /><BodyText style={prayerStyles.small}>{t(`prayer.status.${status}`)}</BodyText>
            </View>)}
          </View>
        </PrayerPanel>
        <PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('prayer.consistency')}</BodyText>
          <View style={styles.chart}>
            {dates.map((day, index) => {
              const count = completedByDay[index];
              return <View key={day} accessible accessibilityLabel={`${formatted(day)}: ${eligible[index] ? t('prayer.progress', { completed: count, total: data.ids.length }) : t('prayer.status.FUTURE')}`} style={styles.chartDay}>
                <BodyText style={prayerStyles.small}>{eligible[index] ? count : ''}</BodyText>
                <View style={[styles.track, { backgroundColor: eligible[index] ? colors.selected : colors.background }]}>
                  {eligible[index] && <View style={{ height: `${count / data.ids.length * 100}%`, backgroundColor: colors.primary, width: '100%' }} />}
                </View>
                <BodyText style={[prayerStyles.small, styles.center]}>{dayLabel(day)}</BodyText>
              </View>;
            })}
          </View>
        </PrayerPanel>
      </> : data === null ? <>
        <EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={refreshPrayerReaders} />
      </> : <LoadingState />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  range: { flex: 1, textAlign: 'center' },
  matrixRow: { flexDirection: 'row', alignItems: 'center' },
  rowName: { width: 84 },
  cell: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', gap: space.xs, alignItems: 'center' },
  chart: { flexDirection: 'row', gap: 3 },
  chartDay: { flex: 1, alignItems: 'center', gap: space.xs },
  track: { height: 64, width: '65%', overflow: 'hidden', justifyContent: 'flex-end', borderRadius: 4 },
  center: { textAlign: 'center' },
});
