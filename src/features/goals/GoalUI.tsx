import type { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { BodyText, ProgressBar } from '../../components/ui';
import type { GoalProgress } from '../../database/repositories/goals';
import { useTheme } from '../../hooks/useTheme';
import { cadences, definition, filters, type Activities, type Cadence, type Category, type Config } from '../../services/goalRules';
import { addDays, parseLocalDate } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';

export type GoalTranslate = ReturnType<typeof useTranslation>['t'];
export const goalCategories: Category[] = ['WAJIB','SUNNAH','QURAN','DHIKR'];
export const categoryGlyphs: Record<Category,string> = { WAJIB:'✓',SUNNAH:'☾',QURAN:'▤',DHIKR:'◎' };
export const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
export function formatPercent(value: number, locale: string) {
  const safe = value < 100 ? Math.floor(value * 100) / 100 : value;
  return formatNumber(safe,locale) + '%';
}
export function formatDate(value: string, locale: string) {
  const date = parseLocalDate(value);
  return date ? new Intl.DateTimeFormat(locale,{day:'numeric',month:'short',year:'numeric'}).format(date) : value;
}
export function activityLabel(t: GoalTranslate, label: string) {
  if (label === 'all') return t('goals.allActivities');
  if (label === 'rawatib' || label === 'morningEvening' || label === 'postPrayer') return t('goals.'+label);
  if (label.startsWith('types.') || label.startsWith('dhikr.catalog.')) return t(label);
  return label;
}
export function goalActivity(t: GoalTranslate, config: Config, options: Activities) {
  const metric = definition(config.category,config.metric);
  const activity = metric && filters(metric.filter,options).find(row => row.id === config.filter);
  return activity ? activityLabel(t,activity.label) : config.filter;
}
export function CadencePicker({value,onChange,t}: {value:Cadence;onChange:(value:Cadence)=>void;t:GoalTranslate}) {
  return <View style={prayerStyles.wrap}>{cadences.map(item => <PrayerAction key={item} label={t('goals.cadence.'+item)}
    selected={item===value} onPress={() => onChange(item)} />)}</View>;
}
export function ProgressCard({item,t,locale,detail,onPress}: {item:GoalProgress;t:GoalTranslate;locale:string;detail?:boolean;onPress?:()=>void}) {
  const {period,version,result} = item;
  const {colors} = useTheme();
  const metric = definition(version.category,version.metric);
  const unit = t('goals.units.'+metric?.unit,{count:result.effective});
  const percent = result.percentage === null ? '—' : formatPercent(result.percentage,locale);
  const label = t('goals.targetProgress',{actual:formatNumber(result.actual,locale),target:formatNumber(result.effective,locale),unit});
  const dates = t(period.transition ? 'goals.transition' : 'goals.range',{
    start:formatDate(period.start,locale),end:formatDate(addDays(period.end,-1),locale),
  });
  return <PrayerPanel>
    <View style={prayerStyles.line}>
      <View style={[styles.icon,{backgroundColor:colors.selected}]} accessible={false} importantForAccessibility="no-hide-descendants">
        <BodyText style={{color:colors.primary}}>{categoryGlyphs[version.category]}</BodyText>
      </View>
      <BodyText style={[prayerStyles.section,styles.flex]}>{version.name}</BodyText>
      <BodyText style={{color:colors.primary}}>{percent}</BodyText>
    </View>
    <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{dates}</BodyText>
    <BodyText>{label}</BodyText>
    {result.bar !== null && <ProgressBar label={label} value={result.bar} />}
    <BodyText style={[prayerStyles.small,{color:colors.primary}]}>
      {result.status === 'ACHIEVED' ? t('goals.achievedNote') : t('goals.status.'+result.status)}
    </BodyText>
    {result.effective !== version.target && <BodyText style={prayerStyles.small}>{t('goals.adjusted',{
      configured:version.target,effective:result.effective,unit,
    })}</BodyText>}
    {result.missing > 0 && <BodyText style={prayerStyles.small}>{t('goals.coverage',result)}</BodyText>}
    {detail && result.remaining > 0 && <BodyText style={prayerStyles.small}>{t('goals.remaining',{
      value:formatNumber(result.remaining,locale),unit:t('goals.units.'+metric?.unit,{count:result.remaining}),
    })}</BodyText>}
    {onPress && <PrayerAction label={t('goals.detail') + ' · ' + version.name} onPress={onPress} />}
  </PrayerPanel>;
}
const styles = StyleSheet.create({
  icon:{width:36,height:36,borderRadius:12,alignItems:'center',justifyContent:'center'},
  flex:{flex:1},
});
