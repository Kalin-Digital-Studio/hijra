import { Modal, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { PropsWithChildren } from 'react';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { summarizePrayers } from '../../services/prayerRules';
import { light, radius, space } from '../../theme/tokens';
import type { PrayerStatus } from '../../types/prayer';
import { PrayerIcon } from './PrayerIcon';

export function PrayerPanel({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { colors } = useTheme();
  return <View style={[prayerStyles.panel, { borderColor: colors.border, backgroundColor: colors.surface }, style]}>{children}</View>;
}

export function PrayerAction({ label, onPress, disabled, icon, selected, emphasis }: {
  label: string; onPress: () => void; disabled?: boolean; icon?: 'back' | 'next' | 'more' | 'up' | 'down'; selected?: boolean; emphasis?: 'primary' | 'danger';
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected }}
      disabled={disabled} onPress={onPress} style={({ pressed }) => [prayerStyles.action, {
        backgroundColor: emphasis === 'primary' ? colors.primary : pressed || selected ? colors.selected : colors.surface, opacity: disabled ? 0.45 : 1,
        borderColor: colors.border,
      }]}>
      {icon ? <PrayerIcon kind={icon} color={colors.primary} background={colors.surface} size={22} /> :
        <BodyText style={[prayerStyles.small, emphasis === 'primary' && { color: colors.onPrimary }, emphasis === 'danger' && { color: colors.danger }]}>{label}</BodyText>}
    </Pressable>
  );
}

export function StatusIcon({ status }: { status: PrayerStatus | 'FUTURE' }) {
  const { colors, isDark } = useTheme();
  const palette = {
    COMPLETED: [colors.selected, colors.primary], NOT_LOGGED: [colors.background, colors.muted],
    MISSED: isDark ? ['#472925', '#FFB4A6'] : ['#F8E5E0', '#8D392C'],
    EXEMPT: isDark ? ['#483A25', '#F2D297'] : ['#F6EDD8', '#765619'],
    FUTURE: [colors.background, colors.border],
  };
  const [background, color] = palette[status];
  return (
    <View style={[prayerStyles.badge, { backgroundColor: background }]}>
      <PrayerIcon kind={status} color={color} background={background} size={18} />
    </View>
  );
}

export function PrayerSummary({ summary, weekly = false }: { summary: ReturnType<typeof summarizePrayers>; weekly?: boolean }) {
  const { t, i18n } = useTranslation();
  const format = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 1 });
  const rate = (value: number | null) => value === null ? t('prayer.na') : format.format(value / 100);
  const stats = [
    [summary.onTimeYes, t('prayer.onTime')], [summary.congregationalYes, t('prayer.congregational')],
    [summary.notLogged, t('prayer.status.NOT_LOGGED')],
    ...(weekly ? [[summary.missed, t('prayer.status.MISSED')], [summary.exempt, t('prayer.status.EXEMPT')]] : []),
  ];
  return (
    <PrayerPanel style={{ backgroundColor: light.primary, borderColor: light.primary }}>
      <BodyText style={prayerStyles.onGreen}>{t(weekly ? 'prayer.weeklySummary' : 'prayer.dailySummary')}</BodyText>
      <BodyText style={prayerStyles.onGreen}>{t('prayer.recorded')}</BodyText>
      <View style={prayerStyles.line}>
        <BodyText style={[prayerStyles.onGreen, prayerStyles.big]}>{summary.completed}/{summary.applicableSlots}</BodyText>
        <BodyText style={prayerStyles.onGreen}>{rate(summary.completionPercentage)}</BodyText>
      </View>
      {summary.completionPercentage !== null && <View accessibilityRole="progressbar"
        accessibilityLabel={t('prayer.progress', { completed: summary.completed, total: summary.applicableSlots })}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(summary.completionPercentage) }}
        style={prayerStyles.progress}>
        <View style={{ width: `${summary.completionPercentage}%`, height: '100%', backgroundColor: light.accent }} />
      </View>}
      <View style={prayerStyles.wrap}>{stats.map(([count, label]) => <BodyText key={label} style={prayerStyles.onGreen}>{count} {label}</BodyText>)}</View>
      {weekly && <>
        <BodyText style={prayerStyles.onGreen}>{t('prayer.totalSlots')} {summary.totalSlots} · {t('prayer.applicable')} {summary.applicableSlots}</BodyText>
        <BodyText style={prayerStyles.onGreen}>{t('prayer.onTime')} {rate(summary.onTimePercentage)} · {t('prayer.congregational')} {rate(summary.congregationalPercentage)}</BodyText>
      </>}
    </PrayerPanel>
  );
}

export function PrayerModal({ children, dismiss }: PropsWithChildren<{ dismiss: () => void }>) {
  return <Modal transparent animationType="fade" onRequestClose={dismiss}>
    <View style={prayerStyles.scrim}><PrayerPanel style={prayerStyles.dialog}>{children}</PrayerPanel></View>
  </Modal>;
}

export const prayerStyles = StyleSheet.create({
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', flexShrink: 1 },
  section: { fontSize: 16, lineHeight: 23, fontWeight: '700' },
  small: { fontSize: 13, lineHeight: 18 },
  panel: { borderWidth: 1, borderRadius: radius.md, padding: space.md, gap: space.sm },
  action: { minHeight: 48, minWidth: 48, paddingHorizontal: space.sm, paddingVertical: space.xs, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignItems: 'center' },
  badge: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  big: { fontSize: 30, lineHeight: 36, fontWeight: '700' },
  onGreen: { color: '#FFFFFF', fontSize: 13, lineHeight: 19 },
  progress: { height: 6, borderRadius: 4, overflow: 'hidden', backgroundColor: '#507467' },
  scrim: { flex: 1, backgroundColor: '#0008', padding: space.lg, justifyContent: 'center' },
  dialog: { width: '100%', maxWidth: 480, alignSelf: 'center' },
});
