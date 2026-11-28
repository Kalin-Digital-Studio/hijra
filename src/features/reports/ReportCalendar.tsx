import { useMemo,useState } from 'react';
import { Pressable,ScrollView,StyleSheet,View } from 'react-native';
import { useRouter } from 'expo-router';
import { BodyText } from '../../components/ui';
import type { ReportData } from '../../database/repositories/reports';
import { useTheme } from '../../hooks/useTheme';
import { aggregateBuckets,type Report } from '../../services/reportRules';
import { calendarRange,reportDays } from '../../services/reportDates';
import { addDays,parseLocalDate,weekDates } from '../../utils/localDate';
import { type Weekday } from '../../types/settings';
import { formatDate,type GoalTranslate } from '../goals/GoalUI';
import { PrayerAction,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';

const categories=['wajib','sunnah','quran','dhikr'] as const;
type Category=typeof categories[number];
function calendarValue(row:Report,category:Category) {
  switch(category) {
    case 'wajib':{
      const p=row.prayers;
      if(!p.eligibleDays)return {label:'outside',value:0,level:0,mark:'–'};
      if(!p.applicableSlots)return {label:'exempt',value:0,level:0,mark:'○'};
      if(p.completed===p.applicableSlots)return {label:'complete',value:p.completed,level:2,mark:'✓'};
      if(p.missed)return {label:'missed',value:p.completed,level:p.completed?1:0,mark:'!'};
      if(p.completed)return {label:'partial',value:p.completed,level:1,mark:String(p.completed)};
      return {label:'empty',value:0,level:0,mark:'–'};
    }
    case 'sunnah':return volume(row.sunnah.totalSessions,3);
    case 'quran':return volume(row.quran.ayat,20);
    case 'dhikr':return volume(row.dhikr.repetitions,33,row.dhikr.days>0);
  }
}
function volume(value:number,threshold:number,recorded=false) {
  return {label:value>=threshold?'high':value>0?'low':recorded?'logged':'empty',
    value,level:value>=threshold?2:value>0||recorded?1:0,mark:value?value>=100?'99+':String(value):recorded?'•':'–'};
}
type CardProps={data:ReportData;today:string;week:Weekday;locale:string;t:GoalTranslate};
export function ReportCalendar({data,today,week,locale,t}:CardProps) {
  const {colors}=useTheme();
  const router=useRouter();
  const [category,setCategory]=useState<Category>('wajib');
  const [picked,setPicked]=useState<string>();
  const month=calendarRange('MONTHLY',data.windows.elapsed.start,week);
  const days=reportDays(month);
  const byDay=useMemo(()=>new Map(aggregateBuckets(data.data,reportDays(data.windows.elapsed)
    .map(date=>({start:date,end:addDays(date,1)}))).map(row=>[row.range.start,row])),[data]);
  const selected=picked&&byDay.has(picked)?picked:byDay.has(today)?today:days[0];
  const report=byDay.get(selected);
  const headers=weekDates(days[0],week);
  const blanks=headers.indexOf(days[0]);
  const weekday=new Intl.DateTimeFormat(locale,{weekday:'short'});
  return <>
    <View style={prayerStyles.wrap}>{categories.map(item=><PrayerAction key={item} label={t('reports.'+item)}
      selected={category===item} onPress={()=>setCategory(item)}/>)}</View>
    <PrayerPanel>
      <ScrollView horizontal>
        <View style={styles.grid}>
          {headers.map(date=><View key={'header'+date} style={styles.cell}>
            <BodyText style={prayerStyles.small}>{weekday.format(parseLocalDate(date)!)}</BodyText>
          </View>)}
          {Array.from({length:blanks},(_,index)=><View key={'blank'+index} style={styles.cell}/>)}
          {days.map(date=>{
            const row=byDay.get(date);
            const state=row?calendarValue(row,category):null;
            const active=date===selected;
            const key=state?.label??'future';
            const background=state?.level===2?colors.primary:state?.level===1?colors.selected:colors.surface;
            const label=[formatDate(date,locale),t('reports.calendarState.'+key),state?.value].filter(item=>item!==undefined).join(', ');
            return <Pressable key={date} accessibilityRole="button" accessibilityLabel={label}
              accessibilityState={{disabled:!row,selected:active}} disabled={!row} onPress={()=>setPicked(date)}
              style={[styles.cell,{borderColor:active?colors.accent:colors.border,borderWidth:active?2:StyleSheet.hairlineWidth,backgroundColor:background}]}>
              <BodyText style={state?.level===2?{color:colors.onPrimary}:!row?{color:colors.muted}:undefined}>{Number(date.slice(-2))}</BodyText>
              <BodyText style={[prayerStyles.small,state?.level===2&&{color:colors.onPrimary}]}>{state?.mark??'·'}</BodyText>
            </Pressable>;
          })}
        </View>
      </ScrollView>
      <BodyText style={prayerStyles.small}>{t(category==='wajib'?'reports.prayerLegend':'reports.volumeLegend',{
        threshold:category==='sunnah'?3:category==='quran'?20:33,
      })}</BodyText>
    </PrayerPanel>
    {report&&<PrayerPanel>
      <BodyText style={prayerStyles.section}>{formatDate(selected,locale)} · {t('reports.'+category)}</BodyText>
      {category==='wajib'?<>
        <BodyText style={prayerStyles.small}>{t('reports.calendarState.'+calendarValue(report,category).label)}</BodyText>
        <BodyText>{report.prayers.applicableSlots?t('reports.completedApplicable',{
          completed:report.prayers.completed,applicable:report.prayers.applicableSlots,
        }):t('goals.status.NOT_APPLICABLE')}</BodyText>
        <BodyText>{t('reports.exempt')} · {report.prayers.exempt}</BodyText>
        <BodyText>{t('reports.missed')} · {report.prayers.missed} · {t('reports.notLogged')} · {report.prayers.notLogged}</BodyText>
      </>:category==='sunnah'?<BodyText>{t('reports.sessions')} · {report.sunnah.totalSessions}</BodyText>:
        category==='quran'?<BodyText>{t('reports.ayat')} · {report.quran.ayat} · {t('reports.sessions')} · {report.quran.sessions}</BodyText>:
          <BodyText>{t('reports.repetitions')} · {report.dhikr.repetitions} · {t('reports.collectionDone')} · {report.dhikr.completedCollections}</BodyText>}
      <PrayerAction label={t('goals.tracker')} onPress={()=>{
        if(category==='wajib')router.push({pathname:'/prayer',params:{date:selected}});
        else if(category==='sunnah')router.push({pathname:'/sunnah',params:{date:selected}});
        else if(category==='dhikr')router.push({pathname:'/dhikr',params:{date:selected}});
        else router.push({pathname:'/quran/history',params:{date:selected}});
      }}/>
    </PrayerPanel>}
  </>;
}
const styles=StyleSheet.create({grid:{width:336,flexDirection:'row',flexWrap:'wrap'},
  cell:{width:48,minHeight:48,alignItems:'center',justifyContent:'center'}});
