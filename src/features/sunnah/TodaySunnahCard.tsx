import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { summarizeSunnah } from '../../services/sunnahRules';
import { radius, space } from '../../theme/tokens';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { activityName } from './SunnahUI';
import { useSunnahData } from './useSunnah';

export function TodaySunnahCard() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { data } = useSunnahData(useToday(), undefined, false);
  const summary = data ? summarizeSunnah(data.sessions) : null;
  const recorded = new Set(data?.sessions.map((session) => session.activityId));
  const preview = data?.activities.filter((activity) => recorded.has(activity.id)).slice(0, 3) ?? [];
  const numeral = new Intl.NumberFormat(i18n.resolvedLanguage);
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push('/sunnah')} style={({ pressed }) => [styles.card, {
      backgroundColor: pressed ? colors.selected : colors.surface, borderColor: colors.border,
    }]}>
      <View style={prayerStyles.wrap}>
        <PrayerIcon kind="isha" color={colors.primary} background={colors.surface} />
        <View style={styles.heading}>
          <BodyText style={prayerStyles.section}>{t('sunnah.title')}</BodyText>
          <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{t('sunnah.todayTitle')}</BodyText>
        </View>
        <PrayerIcon kind="next" color={colors.primary} background={colors.surface} size={20} />
      </View>
      {summary && <>
        <BodyText style={prayerStyles.small}>{numeral.format(summary.distinctActivities)} {t('sunnah.types')} · {t('sunnah.sessionCount', { count: summary.totalSessions })} ·
          {' '}{summary.recordedRakaat === null ? t('sunnah.noRakaat') : t('sunnah.rakaatCount', { count: summary.recordedRakaat })}</BodyText>
        <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{preview.length ? preview.map((activity) => activityName(t, activity)).join(' · ') : t('sunnah.noRecords')}</BodyText>
      </>}
      {!summary && <BodyText style={prayerStyles.small}>{t(data === null ? 'loadError' : 'loading')}</BodyText>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  heading: { flex: 1 },
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.md, gap: space.sm, minHeight: 48 },
});
