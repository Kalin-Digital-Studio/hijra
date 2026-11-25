import type { TFunction } from 'i18next';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { summarizeSunnah } from '../../services/sunnahRules';
import { light, space } from '../../theme/tokens';
import type { SunnahActivity, SunnahSession } from '../../types/sunnah';
import { PrayerPanel, prayerStyles } from '../prayer/PrayerUI';

export function activityName(t: TFunction, activity: SunnahActivity) {
  return activity.name ?? t(`sunnah.catalog.${activity.id}`);
}

export function sunnahError(t: TFunction, error: unknown) {
  const code = error instanceof Error ? error.message : '';
  const known = ['rakaat', 'time', 'notesLength', 'name', 'description', 'duplicate', 'inactive', 'changed'];
  return known.includes(code) ? t(`sunnah.errors.${code}`) : t('sunnah.failed');
}

export function SunnahSummary({ sessions, title, weekly }: { sessions: readonly SunnahSession[]; title: string; weekly?: boolean }) {
  const { t } = useTranslation();
  const summary = summarizeSunnah(sessions);
  return (
    <PrayerPanel style={styles.summary}>
      <BodyText accessibilityRole="header" style={[prayerStyles.section, styles.white]}>{title}</BodyText>
      <View style={prayerStyles.wrap}>
        <Count title={t(weekly ? 'sunnah.days' : 'sunnah.types')} value={weekly ? summary.activeDays : summary.distinctActivities} />
        <Count title={t('sunnah.sessions')} value={summary.totalSessions} />
        <Count title={t('sunnah.recordedRakaat')} value={summary.recordedRakaat} />
      </View>
      {weekly && <BodyText style={prayerStyles.onGreen}>
        {summary.distinctActivities} {t('sunnah.types')} · {summary.sessionsWithRakaat} {t('sunnah.known')} · {summary.sessionsWithoutRakaat} {t('sunnah.unknown')}
      </BodyText>}
      {!summary.totalSessions && <BodyText style={prayerStyles.onGreen}>{t('sunnah.noRecords')}</BodyText>}
    </PrayerPanel>
  );
}

function Count({ title, value }: { title: string; value: number | null }) {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.stat}>
      <BodyText style={value === null ? prayerStyles.onGreen : [prayerStyles.big, styles.white]}>
        {value === null ? t('sunnah.noRakaat') : new Intl.NumberFormat(i18n.resolvedLanguage).format(value)}
      </BodyText>
      <BodyText style={prayerStyles.onGreen}>{title}</BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { backgroundColor: light.primary, borderColor: light.primary },
  white: { color: '#FFFFFF' },
  stat: { flexGrow: 1, minWidth: 68, gap: space.xs },
});
