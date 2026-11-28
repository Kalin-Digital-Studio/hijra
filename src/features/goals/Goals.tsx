import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ProgressBar, ScreenContainer } from '../../components/ui';
import { invalidateGoals } from '../../stores/goalRevision';
import type { Cadence } from '../../services/goalRules';
import { light } from '../../theme/tokens';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { CadencePicker, formatDate, formatPercent, ProgressCard } from './GoalUI';
import { useGoals } from './useGoals';

export default function Goals() {
  const {t,i18n} = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'id';
  const router = useRouter();
  const [cadence,setCadence] = useState<Cadence>('DAILY');
  const {data} = useGoals();
  const active = data?.goals.filter(row => row.progress && row.version.cadence === cadence) ?? [];
  const applicable = active.filter(row => row.progress?.result.percentage !== null);
  const achieved = applicable.filter(row => row.progress?.result.status === 'ACHIEVED').length;
  const summary = applicable.length ? achieved/applicable.length*100 : null;
  const open = (view: string, id?: string) => router.push({pathname:'/goals/[view]',params:{view,...(id ? {id} : {})}});
  return <ScreenContainer compact>
    <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('goals.title')}</BodyText>
    <BodyText>{t('goals.subtitle')}</BodyText>
    {data === undefined ? <LoadingState /> : data === null ? <>
      <EmptyState message={t('goals.error')} /><PrayerAction label={t('retry')} onPress={invalidateGoals} />
    </> : <>
      <PrayerPanel style={{backgroundColor:light.primary,borderColor:light.primary}}>
        <View style={prayerStyles.line}>
          <BodyText style={[prayerStyles.section,{color:light.onPrimary}]}>{t('goals.active')}</BodyText>
          <BodyText style={[prayerStyles.section,{color:light.onPrimary}]}>{summary === null ? '—' : formatPercent(summary,locale)}</BodyText>
        </View>
        <BodyText style={prayerStyles.onGreen}>{summary === null ? t('goals.status.NOT_APPLICABLE') :
          t('goals.summary',{achieved,applicable:applicable.length})}</BodyText>
        {summary !== null && <ProgressBar label={t('goals.summary',{achieved,applicable:applicable.length})} value={summary} />}
        <BodyText style={prayerStyles.onGreen}>{t('goals.summaryInProgress',{value:applicable.length-achieved})}</BodyText>
        {active.length > applicable.length && <BodyText style={prayerStyles.onGreen}>{t('goals.notApplicableCount',{value:active.length-applicable.length})}</BodyText>}
      </PrayerPanel>
      <CadencePicker value={cadence} onChange={setCadence} t={t} />
      {!active.length && <PrayerPanel>
        {!data.goals.length && <BodyText style={prayerStyles.section}>{t('goals.empty')}</BodyText>}
        <BodyText>{t(data.goals.length ? 'goals.emptyPeriod' : 'goals.emptyBody')}</BodyText>
      </PrayerPanel>}
      {active.map(row => <View key={row.version.goalId} style={{gap:6}}>
        {row.progress && <ProgressCard item={row.progress} t={t} locale={locale} onPress={() => open('detail',row.version.goalId)} />}
        {row.pending && <BodyText style={prayerStyles.small}>{t('goals.pending',{date:formatDate(row.pending.from,locale)})}</BodyText>}
      </View>)}
      <PrayerAction label={t('goals.create')} emphasis="primary" onPress={() => open('create')} />
      <PrayerAction label={t('goals.templates')} onPress={() => open('templates')} />
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('goals.history')} onPress={() => open('history')} />
        <PrayerAction label={t('goals.manage')} onPress={() => open('manage')} />
      </View>
    </>}
  </ScreenContainer>;
}
