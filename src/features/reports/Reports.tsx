import { useRouter } from 'expo-router';
import { useMemo,useState } from 'react';
import { Pressable,StyleSheet,View,useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText,EmptyState,LoadingState,ScreenContainer } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { calendarRange,clip,dateCount,firstReportDate,reportRange,validCustom,type ReportSelection } from '../../services/reportDates';
import { aggregateReport } from '../../services/reportRules';
import { addDays } from '../../utils/localDate';
import { radius,space } from '../../theme/tokens';
import { PrayerAction,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { useToday } from '../prayer/usePrayer';
import { ReflectionShortcuts } from '../reflection/ReflectionShortcuts';
import { Bars,ReportIconButton,ReportPeriod,valueText } from './ReportUI';
import { Comparison,Detail,PrayerReportCard,reportTrend,sections } from './ReportDetails';
import { ReportCalendar } from './ReportCalendar';
import { useReports } from './useReports';

export type ReportView='home'|'calendar'|'comparison'|typeof sections[number];
const reportIcons={wajib:'building',sunnah:'moon',quran:'book',dhikr:'droplet',goals:'target',calendar:'calendar'} as const;
const shortcuts=[...sections,'calendar'] as const;
export default function Reports() {return <ReportsScreen view="home"/>;}
export function ReportsScreen({view,initial}:{view:ReportView;initial?:ReportSelection}) {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage??'id';
  const router=useRouter();
  const {colors}=useTheme();
  const today=useToday();
  const [chosen,setChosen]=useState(initial);
  const selection:ReportSelection=chosen??{mode:view==='calendar'?'MONTHLY':'WEEKLY',anchor:today};
  const {data,week,retry}=useReports(selection,today,view==='calendar');
  const {width,fontScale}=useWindowDimensions();
  const period=reportRange(selection,today,week);
  const elapsed=clip(period,addDays(today,1));
  const active=period.end>today;
  const current=calendarRange(selection.mode==='CUSTOM'?'WEEKLY':selection.mode,today,week);
  const atCurrent=period.start===current.start&&period.end===current.end;
  const report=useMemo(()=>data?aggregateReport(data.data,data.windows.elapsed):undefined,[data]);
  const trend=useMemo(()=>view==='home'&&data?reportTrend('wajib',selection.mode,data,week,locale,{}):[],
    [data,locale,selection.mode,view,week]);
  function shifted(step:number):ReportSelection|undefined {
    if(selection.mode==='CUSTOM') {
      const offset=dateCount(period)*step;
      const start=addDays(selection.start,offset), boundary=addDays(selection.last,offset);
      const last=boundary>today?today:boundary;
      return validCustom(start,last,today)?{mode:'CUSTOM',start,last}:undefined;
    }
    const anchor=step<0?addDays(period.start,-1):period.end;
    return anchor>=firstReportDate&&anchor<=today?{mode:selection.mode,anchor}:undefined;
  }
  function go(section:Exclude<ReportView,'home'>) {
    const params=selection.mode==='CUSTOM'?{section,mode:selection.mode,start:selection.start,last:selection.last}:
      {section,mode:selection.mode,anchor:selection.anchor};
    router.push({pathname:'/reports/[section]',params});
  }
  const title=t(view==='home'?'reports.title':'reports.'+view);
  const previous=shifted(-1),next=shifted(1);
  const summary=report?[
    {key:'sunnah',value:valueText(report.sunnah.totalSessions,locale),unit:t('goals.units.sessions',{count:report.sunnah.totalSessions})},
    {key:'quran',value:valueText(report.quran.ayat,locale),unit:t('goals.units.ayat',{count:report.quran.ayat})},
    {key:'dhikr',value:valueText(report.dhikr.repetitions,locale),unit:t('goals.units.repetitions',{count:report.dhikr.repetitions})},
    {key:'goals',value:report.goals.applicable?valueText(report.goals.achieved,locale)+'/'+valueText(report.goals.applicable,locale):t('prayer.na'),
      unit:t('reports.goalKpiUnit')},
  ] as const:[];
  return <ScreenContainer standalone={view!=='home'} compact keyboard>
    <View style={styles.top}>
      <View style={styles.header}>
        {view!=='home'&&<ReportIconButton icon="back" label={t('back')} onPress={()=>router.canGoBack()?router.back():router.replace('/reports')}/>}
        <BodyText accessibilityRole="header" style={[prayerStyles.title,styles.title]}>{title}</BodyText>
        {view==='home'&&<ReportIconButton icon="calendar" label={t('reports.calendar')} outlined onPress={()=>go('calendar')}/>}
      </View>
      {view==='home'&&<BodyText style={[styles.body,{color:colors.muted}]}>{t('reports.subtitle')}</BodyText>}
      <ReportPeriod selection={selection} today={today} range={view==='calendar'?period:elapsed} ongoing={active}
        t={t} locale={locale} calendarOnly={view==='calendar'} choose={setChosen} next={!!next} previous={!!previous} atCurrent={atCurrent}
        move={step=>{const value=shifted(step);if(value)setChosen(value);}}/>
    </View>
    {data===undefined?<LoadingState/>:data===null?<><EmptyState message={t('loadError')}/><PrayerAction label={t('retry')} onPress={retry}/></>:
      report&&<>
        {view==='home'&&<>
          <PrayerReportCard report={report} t={t} locale={locale}/>
          <View style={styles.cards}>
            <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('reports.summary')}</BodyText>
            {[summary.slice(0,2),summary.slice(2)].map((row,index)=><View key={index}
              style={{flexDirection:width>=320&&fontScale<=1.35?'row':'column',gap:8}}>
            {row.map(item=><Pressable key={item.key} accessibilityRole="button"
              accessibilityLabel={[t('reports.'+item.key),item.value,item.unit].join(', ')} onPress={()=>go(item.key)}
              style={({pressed})=>[styles.summaryCard,{borderColor:colors.border,backgroundColor:pressed?colors.selected:colors.surface}]}>
              <View style={prayerStyles.line} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <View style={[styles.badge,{backgroundColor:colors.selected}]}>
                  <PrayerIcon kind={reportIcons[item.key]} color={colors.primary} background={colors.selected} size={20}/>
                </View>
                <PrayerIcon kind="next" color={colors.muted} background={colors.surface} size={18}/>
              </View>
              <BodyText style={styles.label}>{t('reports.'+item.key)}</BodyText>
              <BodyText style={[item.key==='goals'&&!report.goals.applicable?styles.metricStatus:styles.metric,
                {color:colors.primary}]}>{item.value}</BodyText>
              <BodyText style={[styles.caption,{color:colors.muted}]}>{item.unit}</BodyText>
            </Pressable>)}
            </View>)}
            {!report.prayers.completed&&!report.prayers.missed&&!report.prayers.exempt&&!report.sunnah.totalSessions&&
              !report.quran.sessions&&!report.dhikr.days&&!report.goals.closed.length&&!report.goals.open.length&&
              <BodyText style={[styles.caption,{color:colors.muted}]}>{t('reports.empty')}</BodyText>}
          </View>
          <Bars title={t('reports.prayerTrend')} rows={trend} t={t} locale={locale} unit={t('reports.completed')}/>
          <Comparison data={data} t={t} locale={locale} compact open={()=>go('comparison')}/>
          <PrayerPanel>
            <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('reports.details')}</BodyText>
            {shortcuts.map((section,index)=><Pressable key={section} accessibilityRole="button"
              accessibilityLabel={t('reports.'+section)} accessibilityHint={t('reports.shortcut.'+section)}
              onPress={()=>go(section)} style={({pressed})=>[styles.shortcut,index>0&&{borderTopWidth:StyleSheet.hairlineWidth},
                {borderColor:colors.border,backgroundColor:pressed?colors.selected:colors.surface}]}>
              <View style={[styles.badge,{backgroundColor:colors.selected}]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <PrayerIcon kind={reportIcons[section]} color={colors.primary} background={colors.selected} size={20}/>
              </View>
              <View style={styles.shortcutText}>
                <BodyText style={styles.label}>{t('reports.'+section)}</BodyText>
                <BodyText style={[styles.caption,{color:colors.muted}]}>{t('reports.shortcut.'+section)}</BodyText>
              </View>
              <PrayerIcon kind="next" color={colors.primary} background={colors.surface} size={20}/>
            </Pressable>)}
          </PrayerPanel>
          <ReflectionShortcuts/>
          <BodyText style={[styles.body,{color:colors.muted}]}>{t('reports.footer')}</BodyText>
        </>}
        {view==='comparison'&&<Comparison data={data} t={t} locale={locale}/>}
        {view==='calendar'&&<ReportCalendar data={data} today={today} week={week} locale={locale} t={t}/>}
        {view!=='home'&&view!=='comparison'&&view!=='calendar'&&
          <Detail section={view} mode={selection.mode} data={data} week={week} t={t} locale={locale}/>}
      </>}
  </ScreenContainer>;
}
const styles=StyleSheet.create({
  top:{gap:8},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:space.sm},
  title:{flex:1},
  cards:{gap:8},
  body:{fontSize:14,lineHeight:19},
  label:{fontSize:14,lineHeight:19,fontWeight:'700'},
  caption:{fontSize:12,lineHeight:16},
  metric:{fontSize:21,lineHeight:26,fontWeight:'700',fontVariant:['tabular-nums']},
  metricStatus:{fontSize:14,lineHeight:26,fontWeight:'600'},
  summaryCard:{flex:1,minWidth:0,minHeight:48,borderWidth:StyleSheet.hairlineWidth,borderRadius:radius.md,padding:12,gap:3},
  badge:{width:32,height:32,borderRadius:10,alignItems:'center',justifyContent:'center'},
  shortcut:{flexDirection:'row',alignItems:'center',gap:space.sm,minHeight:48,paddingVertical:space.xs},
  shortcutText:{flex:1},
});
