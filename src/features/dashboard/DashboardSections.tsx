import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, ProgressBar } from '../../components/ui';
import type { DashboardSummary, RecentActivity } from '../../database/repositories/dashboard';
import { useTheme } from '../../hooks/useTheme';
import { definition } from '../../services/goalRules';
import { countAyat, type Catalog } from '../../services/quranRules';
import { radius, space } from '../../theme/tokens';
import { parseLocalDate } from '../../utils/localDate';
import { formatDate, formatPercent } from '../goals/GoalUI';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { ContinueReader } from '../quran/ReaderNavigation';
import { positionLabel } from '../quran/QuranUI';

type T = ReturnType<typeof useTranslation>['t'];
const icons = {prayer:'building',sunnah:'moon',quran:'book',dhikr:'droplet',collection:'droplet'} as const;

function CategoryIcon({kind}: {kind:RecentActivity['kind']}) {
  const {colors} = useTheme();
  return <View style={[styles.icon,{backgroundColor:colors.selected}]} accessible={false} importantForAccessibility="no-hide-descendants">
    <PrayerIcon kind={icons[kind]} color={colors.primary} background={colors.selected} size={19} />
  </View>;
}
function heading(text: string) {
  return <BodyText accessibilityRole="header" style={prayerStyles.section}>{text}</BodyText>;
}
export function DailyWorship({data}: {data:DashboardSummary}) {
  const {t,i18n} = useTranslation();
  const locale=i18n.resolvedLanguage ?? 'id';
  const router=useRouter();
  const {colors}=useTheme();
  const {width,fontScale}=useWindowDimensions();
  const wide=width>=320 && fontScale<=1.35;
  const {prayer,sunnah,quran,dhikr}=data;
  const prayerLabel=t('dashboard.prayerValue',{completed:prayer.completed,applicable:prayer.applicableSlots});
  const prayerRate=prayer.completionPercentage;
  const cards=[
    {kind:'prayer',label:t('categories.prayer'),route:'/prayer',value:prayer.applicableSlots ? prayer.completed+'/'+prayer.applicableSlots : t('prayer.na'),
      caption:prayerRate===null ? t('goals.status.NOT_APPLICABLE') :
        prayer.state==='empty' ? t('dashboard.trendState.empty') : formatPercent(prayerRate,locale),progress:prayerRate},
    {kind:'sunnah',label:t('categories.sunnah'),route:'/sunnah',value:sunnah.totalSessions,caption:t('dashboard.sessions',{count:sunnah.totalSessions})},
    {kind:'quran',label:t('quran.title'),route:'/quran',value:quran.ayat,caption:t('dashboard.ayahs',{count:quran.ayat})},
    {kind:'dhikr',label:t('dhikr.title'),route:'/dhikr',value:dhikr.repetitions,caption:dhikr.repetitions===0 && dhikr.sessions>0 ?
      t('dashboard.dhikrLogged',{count:dhikr.sessions}) : t('dashboard.repetitions',{count:dhikr.repetitions})},
  ] as const;
  return <View style={styles.section}>
    {heading(t('dashboard.worshipToday'))}
    {[cards.slice(0,2),cards.slice(2)].map((row,index) => <View key={index} style={wide ? styles.gridRow : styles.section}>
      {row.map(card => <Pressable key={card.kind} accessibilityRole="button"
        accessibilityLabel={[card.label,card.kind==='prayer' && prayer.applicableSlots ? prayerLabel : card.value,card.caption].join(', ')}
        onPress={() => router.push(card.route)} style={({pressed}) => [
          styles.kpi,wide && styles.kpiWide,{borderColor:colors.border,backgroundColor:pressed ? colors.selected : colors.surface},
        ]}>
        <CategoryIcon kind={card.kind} />
        <BodyText style={styles.kpiLabel}>{card.label}</BodyText>
        <BodyText style={[styles.metric,{color:colors.primary}]}>{card.value}</BodyText>
        <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{card.caption}</BodyText>
        {'progress' in card && card.progress!==null && <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <ProgressBar label={prayerLabel} value={card.progress} />
        </View>}
      </Pressable>)}
    </View>)}
  </View>;
}
export function DashboardReading({reading}: {reading:DashboardSummary['reading']}) {
  const {t}=useTranslation();
  const router=useRouter();
  const {colors}=useTheme();
  return <PrayerPanel style={{backgroundColor:colors.selected}}>
    {heading(t('dashboard.continueReading'))}
    {reading.bookmark && reading.chapter ? <>
      <View style={prayerStyles.line}>
        <BodyText style={[styles.kpiLabel,styles.flex]}>{reading.chapter.latin}</BodyText>
        {!!reading.chapter.arabic && <BodyText accessibilityLanguage="ar" style={{color:colors.primary}}>{reading.chapter.arabic}</BodyText>}
      </View>
      <BodyText style={prayerStyles.small}>{t('quran.dashboardPosition',{position:positionLabel(reading.catalog,reading.bookmark)})}</BodyText>
      {reading.next === 'restart' ? <BodyText style={prayerStyles.small}>{t('quran.atEnd')}</BodyText> :
        reading.next && <BodyText style={prayerStyles.small}>{t('quran.nextPosition',{position:positionLabel(reading.catalog,reading.next)})}</BodyText>}
      <ContinueReader catalog={reading.catalog} bookmark={reading.bookmark} emphasis="primary" />
    </> : <>
      <BodyText style={prayerStyles.small}>{t('dashboard.noBookmark')}</BodyText>
      <PrayerAction label={t('quran.startReading')} emphasis="primary" onPress={() => router.push(reading.catalog.has(1) ?
        {pathname:'/quran/reader',params:{surah:'1',ayah:'1'}} : '/quran')} />
    </>}
  </PrayerPanel>;
}
export function DashboardGoals({goals}: {goals:DashboardSummary['goals']}) {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage ?? 'id';
  const {colors}=useTheme();
  const router=useRouter();
  const count=goals.applicable+goals.notApplicable;
  const summary=t('goals.summary',{achieved:goals.achieved,applicable:goals.applicable});
  return <PrayerPanel>
    {heading(t('dashboard.goalsToday'))}
    {!!count ? <>
      <View style={prayerStyles.line}>
        <BodyText style={[styles.kpiLabel,styles.flex]}>{goals.percentage===null ? t('goals.status.NOT_APPLICABLE') : summary}</BodyText>
        {goals.percentage!==null && <BodyText style={[styles.metric,{color:colors.primary}]}>{formatPercent(goals.percentage,locale)}</BodyText>}
      </View>
      {goals.percentage!==null && <ProgressBar label={summary} value={goals.percentage} />}
      <BodyText style={prayerStyles.small}>{t('goals.summaryInProgress',{value:goals.inProgress})}</BodyText>
      {goals.notApplicable>0 && <BodyText style={prayerStyles.small}>{t('goals.notApplicableCount',{value:goals.notApplicable})}</BodyText>}
      {goals.previews.map(({version,progress}) => {
        if (!progress) return null;
        const {result}=progress;
        const unit=t('goals.units.'+definition(version.category,version.metric)?.unit,{count:result.effective});
        const value=t('goals.targetProgress',{actual:result.actual,target:result.effective,unit});
        const label=[version.name,value,t('goals.status.'+result.status)].join(', ');
        return <Pressable key={version.goalId} accessibilityRole="button" accessibilityLabel={label}
          style={({pressed}) => [styles.goalRow,{borderColor:colors.border,backgroundColor:pressed?colors.selected:colors.surface}]}
          onPress={() => router.push({pathname:'/goals/[view]',params:{view:'detail',id:version.goalId}})}>
          <View style={prayerStyles.line}>
            <BodyText style={[styles.kpiLabel,styles.flex]}>{version.name}</BodyText>
            <BodyText style={prayerStyles.small}>{result.actual}/{result.effective} {unit}</BodyText>
          </View>
          {result.bar!==null && <ProgressBar label={label} value={result.bar} />}
          {result.percentage!==null && <BodyText style={[prayerStyles.small,{color:colors.muted}]}>
            {formatPercent(result.percentage,locale)} · {t('goals.status.'+result.status)}
          </BodyText>}
        </Pressable>;
      })}
    </> : <>
      {!goals.hasOtherPeriods && <BodyText style={styles.kpiLabel}>{t('goals.empty')}</BodyText>}
      <BodyText style={prayerStyles.small}>{t(goals.hasOtherPeriods ? 'dashboard.noDailyGoals' : 'dashboard.createGoalHint')}</BodyText>
      {!goals.hasOtherPeriods && <PrayerAction label={t('goals.create')} emphasis="primary"
        onPress={() => router.push({pathname:'/goals/[view]',params:{view:'create'}})} />}
    </>}
    <PrayerAction label={t('dashboard.openGoals')} onPress={() => router.push('/goals')} />
  </PrayerPanel>;
}

const ticks=[5,4,3,2,1,0];
export function DashboardTrend({trend}: {trend:DashboardSummary['trend']}) {
  const {t,i18n}=useTranslation();
  const {colors}=useTheme();
  const {fontScale,width}=useWindowDimensions();
  const locale=i18n.resolvedLanguage ?? 'id';
  const dayFormat=new Intl.DateTimeFormat(locale,{day:'numeric',month:'numeric'});
  function describe(day: DashboardSummary['trend'][number]) {
    const count=day.state==='exempt' ? t('goals.status.NOT_APPLICABLE') :
      t('dashboard.prayerValue',{completed:day.completed,applicable:day.applicableSlots});
    const status=t('dashboard.trendState.'+day.state);
    return [formatDate(day.date,locale),count,
      t('dashboard.trendCoverage',{exempt:day.exempt,unlogged:day.notLogged,missed:day.missed}),status].join(', ');
  }
  return <PrayerPanel>
    {heading(t('dashboard.trend'))}
    <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{t('goals.metrics.COMPLETED_PRAYERS')}</BodyText>
    {fontScale>1.35 || width<320 ? trend.map(day => <BodyText key={day.date} style={prayerStyles.small}>{describe(day)}</BodyText>) :
    <View style={styles.chart}>
      <View style={styles.axis} accessible={false} importantForAccessibility="no-hide-descendants">
        {ticks.map(tick => <BodyText key={tick} style={[styles.tick,{color:colors.muted}]}>{tick}</BodyText>)}
      </View>
      <View style={styles.columns}>
        {trend.map(day => {
          return <View key={day.date} accessible accessibilityLabel={describe(day)} style={styles.day}>
            <View style={[styles.barArea,{borderColor:colors.border}]}>
              {day.completed>0 && <View style={[styles.bar,{
                height:day.completed/5*100+'%',backgroundColor:day.state==='complete'?colors.primary:colors.secondary,
              }]} />}
              {day.state==='exempt' && <BodyText style={[styles.tick,{color:colors.muted}]}>{t('prayer.na')}</BodyText>}
              {day.state==='empty' && <BodyText style={[styles.tick,{color:colors.muted}]}>–</BodyText>}
            </View>
            <BodyText style={[styles.tick,{color:day.missed ? colors.danger : colors.muted}]}>
              {day.state==='complete' ? '✓' : day.missed ? '!' : day.completed || ' '}
            </BodyText>
            <BodyText style={[styles.tick,{color:colors.muted}]}>{dayFormat.format(parseLocalDate(day.date)!)}</BodyText>
          </View>;
        })}
      </View>
    </View>}
    <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{t('dashboard.trendLegend')}</BodyText>
  </PrayerPanel>;
}
function recentLabel(row: RecentActivity,catalog:Catalog,t:T) {
  switch (row.kind) {
    case 'prayer': return {title:t('types.'+row.activity),detail:t('prayer.status.COMPLETED')};
    case 'sunnah': return {title:row.label ?? t('types.'+row.activity),detail:row.amount===null ? t('dashboard.sunnahSession') :
      t('dashboard.rakaat',{count:row.amount})};
    case 'quran': {
      if (!row.startSurah || !row.endSurah || !row.startAyah || !row.endAyah) return {title:t('quran.title'),detail:''};
      const start={surah:row.startSurah,ayah:row.startAyah}, end={surah:row.endSurah,ayah:row.endAyah};
      const value=countAyat(catalog,start,end);
      return {title:catalog.get(row.startSurah)?.latin ?? t('quran.title'),
        detail:t('dashboard.readingRange',{start:positionLabel(catalog,start),end:positionLabel(catalog,end),count:value ?? 0})};
    }
    case 'dhikr': return {title:row.label?.startsWith('dhikr.catalog.') ? t(row.label) : row.label ?? t('dhikr.title'),
      detail:row.status==='CHECKLIST' ? t('dashboard.dhikrChecked') : t('dashboard.dhikrCount',{count:row.amount ?? 0})};
    case 'collection': return {title:t('dhikr.catalog.'+row.activity),detail:t(row.status==='COMPLETE' ? 'dashboard.collectionComplete' : 'dashboard.collectionPartial')};
  }
}
export function DashboardRecent({recent,catalog}: {recent:RecentActivity[];catalog:Catalog}) {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage ?? 'id';
  const router=useRouter();
  const {colors}=useTheme();
  function open(row:RecentActivity) {
    if (row.kind==='prayer') router.push({pathname:'/prayer',params:{date:row.date}});
    else if (row.kind==='sunnah') router.push({pathname:'/sunnah',params:{date:row.date,activity:row.activity ?? ''}});
    else if (row.kind==='quran') router.push({pathname:'/quran/history',params:{date:row.date}});
    else router.push({pathname:'/dhikr',params:{date:row.date,activity:row.kind==='collection' ? 'collection:'+row.activity : row.activity ?? ''}});
  }
  return <PrayerPanel>
    {heading(t('dashboard.recent'))}
    {!recent.length && <BodyText style={prayerStyles.small}>{t('dashboard.noRecent')}</BodyText>}
    {recent.map((row,index) => {
      const {title,detail}=recentLabel(row,catalog,t);
      const when=[formatDate(row.date,locale),row.time].filter(Boolean).join(' · ');
      return <Pressable key={row.kind+':'+row.id} accessibilityRole="button" accessibilityLabel={[title,detail,when].join(', ')}
        onPress={() => open(row)} style={({pressed}) => [styles.recentRow,index>0 && {borderTopWidth:StyleSheet.hairlineWidth},{
          borderColor:colors.border,backgroundColor:pressed ? colors.selected : colors.surface,
        }]}>
        <CategoryIcon kind={row.kind} />
        <View style={styles.flex}>
          <BodyText style={styles.kpiLabel}>{title}</BodyText>
          {!!detail && <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{detail}</BodyText>}
          <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{when}</BodyText>
        </View>
        <PrayerIcon kind="next" color={colors.primary} background={colors.surface} size={18} />
      </Pressable>;
    })}
  </PrayerPanel>;
}

const styles=StyleSheet.create({
  section:{gap:space.sm},
  gridRow:{flexDirection:'row',gap:space.sm},
  icon:{width:34,height:34,borderRadius:10,alignItems:'center',justifyContent:'center'},
  kpi:{borderWidth:1,borderRadius:radius.md,padding:space.sm,gap:space.xs,minHeight:48},
  kpiWide:{flex:1,minWidth:0},
  kpiLabel:{fontSize:14,lineHeight:20,fontWeight:'700'},
  flex:{flex:1},
  metric:{fontSize:24,lineHeight:29,fontWeight:'800',fontVariant:['tabular-nums']},
  goalRow:{minHeight:48,paddingVertical:space.sm,gap:space.xs,borderTopWidth:StyleSheet.hairlineWidth},
  chart:{flexDirection:'row',gap:space.xs},
  axis:{height:108,justifyContent:'space-between'},
  columns:{flex:1,flexDirection:'row',gap:3},
  day:{flex:1,minWidth:0,alignItems:'center'},
  barArea:{height:108,alignSelf:'stretch',borderBottomWidth:1,justifyContent:'flex-end',alignItems:'center'},
  bar:{width:'62%',maxWidth:30,borderTopLeftRadius:5,borderTopRightRadius:5,minHeight:1},
  tick:{fontSize:11,lineHeight:17,textAlign:'center'},
  recentRow:{minHeight:48,paddingVertical:space.sm,gap:space.sm,flexDirection:'row',alignItems:'center'},
});
