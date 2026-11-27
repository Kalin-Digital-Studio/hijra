import type { PropsWithChildren, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { summarizeDhikr, type DhikrLog, type Draft } from '../../services/dhikrRules';
import { light } from '../../theme/tokens';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { refreshDhikr } from './useDhikr';

export function DhikrScreen({ children, title, action }: PropsWithChildren<{ title: string; action?: ReactNode }>) {
  const router = useRouter();
  const { t } = useTranslation();
  return <ScreenContainer standalone compact keyboard>
    <View style={prayerStyles.line}>
      <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/tracker')} />
      <BodyText style={prayerStyles.title} accessibilityRole="header">{title}</BodyText>
      {action}
    </View>
    {children}
  </ScreenContainer>;
}

export function DhikrLoad({ failed }: { failed: boolean }) {
  const { t } = useTranslation();
  return failed ? <><EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={refreshDhikr} /></> : <LoadingState />;
}

export function DhikrSummary({ logs, weekly }: { logs: DhikrLog[]; weekly?: boolean }) {
  const { t } = useTranslation();
  const totals = summarizeDhikr(logs);
  return <PrayerPanel style={{ backgroundColor: light.primary, borderColor: light.primary }}>
    <BodyText style={prayerStyles.onGreen}>{t(weekly ? 'dhikr.weekly' : 'dhikr.today')}</BodyText>
    <BodyText style={[prayerStyles.onGreen, prayerStyles.big]}>{t('dhikr.repetitions', { value: totals.repetitions })}</BodyText>
    <BodyText style={prayerStyles.onGreen}>{t('dhikr.stats', { ...totals })}</BodyText>
    {(weekly || !!(totals.completedCollections + totals.partialCollections)) && <BodyText style={prayerStyles.onGreen}>
      {t('dhikr.collectionTotals', totals)}
    </BodyText>}
  </PrayerPanel>;
}

export function draftTitle(t: (key: string) => string, draft: Draft) {
  return draft.collection ? t(`dhikr.catalog.${draft.collection}`) : t(draft.steps[0].label);
}
