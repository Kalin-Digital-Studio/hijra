import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { prayerSlots, summarizePrayers } from '../../services/prayerRules';
import { radius, space } from '../../theme/tokens';
import { StatusIcon, prayerStyles } from './PrayerUI';
import { usePrayerData, useToday } from './usePrayer';

export function TodayPrayerCard() {
  const today = useToday();
  const { data } = usePrayerData(today);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const slots = data ? prayerSlots(data.ids, data.logs, today) : [];
  const summary = data ? summarizePrayers(slots.map(({ record }) => record)) : null;
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push('/prayer')} style={({ pressed }) => [styles.card, {
      backgroundColor: pressed ? colors.selected : colors.surface, borderColor: colors.border,
    }]}>
      <View style={prayerStyles.line}>
        <BodyText style={[prayerStyles.section, styles.title]}>{t('prayer.todayCard')}</BodyText>
        {summary && <BodyText style={prayerStyles.section}>
          {summary.applicableSlots ? `${summary.completed}/${summary.applicableSlots}` : t('prayer.na')}
        </BodyText>}
      </View>
      {summary ? <>
        <View style={prayerStyles.wrap}>
          {slots.map(({ id, record }) => <View key={id} accessible accessibilityLabel={`${t(`types.${id}`)}, ${t(`prayer.status.${record.status}`)}`} style={styles.badge}>
            <BodyText style={[prayerStyles.small, styles.center]}>{t(`types.${id}`)}</BodyText>
            <StatusIcon status={record.status} />
          </View>)}
        </View>
        <BodyText style={prayerStyles.small}>{summary.onTimeYes} {t('prayer.onTime')} · {summary.congregationalYes} {t('prayer.congregational')}</BodyText>
      </> : <BodyText accessibilityLiveRegion="polite" style={prayerStyles.small}>{t(data === null ? 'loadError' : 'loading')}</BodyText>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.md, gap: space.sm, minHeight: 48 },
  title: { flexShrink: 1 },
  badge: { flexGrow: 1, alignItems: 'center', gap: space.xs },
  center: { textAlign: 'center' },
});
