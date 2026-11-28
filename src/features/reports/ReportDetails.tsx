import { useMemo,useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet,View,useWindowDimensions } from 'react-native';
import { BodyText } from '../../components/ui';
import type { ReportData } from '../../database/repositories/reports';
import { aggregateBuckets, aggregateReport, goalReport, metricValue, reportChange, type Report, type ReportFilters, type ReportSection } from '../../services/reportRules';
import { reportBuckets,type ReportMode } from '../../services/reportDates';
import { cadences,type Cadence,type Category } from '../../services/goalRules';
import type { Weekday } from '../../types/settings';
import { useTheme } from '../../hooks/useTheme';
import { light,radius,space } from '../../theme/tokens';
import { activityLabel,goalCategories,ProgressCard,type GoalTranslate } from '../goals/GoalUI';
import { PrayerAction,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';
import { Bars,dateLabel,Filter,percent,ReportBar,StatCard,valueText } from './ReportUI';

export const sections=['wajib','sunnah','quran','dhikr','goals'] as const;
const trendUnits={wajib:'completed',sunnah:'sessions',quran:'ayat',dhikr:'repetitions',goals:'achieved'} as const;

function stats(t:GoalTranslate,locale:string,rows:[string,number|null][]) {
  return rows.map(([label,value])=>({label:t('reports.'+label),value:valueText(value,locale)}));
}
export function PrayerReportCard({report,t,locale}:{report:Report;t:GoalTranslate;locale:string}) {
  const {fontScale,width}=useWindowDimensions();
  const stacked=fontScale>1.45||width<290;
  const p=report.prayers;
  const completion=p.completionPercentage;
  const label=completion===null?t('goals.status.NOT_APPLICABLE'):percent(completion,locale);
  const size=96;
  // Right and left masks reveal the rotated half-circles in sweep order.
  const degrees=(completion??0)*3.6;
  const amounts=[Math.min(180,degrees),Math.max(0,degrees-180)];
  return <View style={visual.hero}>
    <BodyText accessibilityRole="header" style={[prayerStyles.section,visual.onHero]}>{t('reports.prayerCompletion')}</BodyText>
    <View style={[visual.heroRow,stacked&&visual.heroStack]}>
      <View accessible accessibilityLabel={t('reports.prayerCompletion')+', '+label}
        style={[visual.ring,{width:size,height:size,borderRadius:size/2}]}>
        <View style={[visual.ringTrack,{borderRadius:size/2}]}/>
        {amounts.map((amount,index)=>amount>0&&<View key={index} pointerEvents="none" style={{
          position:'absolute',top:0,left:index===0?size/2:0,width:size/2,height:size,overflow:'hidden',
        }}>
          <View style={[visual.arc,{width:size,height:size,borderRadius:size/2,left:index===0?-size/2:0,
            transform:[{rotate:((index===0?-135:45)+amount)+'deg'}]}]}/>
        </View>)}
        <BodyText style={[visual.ringLabel,visual.onHero]} maxFontSizeMultiplier={1.4}>
          {completion===null?t('prayer.na'):label}
        </BodyText>
      </View>
      <View style={stacked?visual.heroStackDetail:visual.heroDetail}>
        <BodyText style={[visual.heroValue,visual.onHero]}>{t('reports.prayerHeroValue',{
          completed:valueText(p.completed,locale),applicable:valueText(p.applicableSlots,locale),
        })}</BodyText>
        <BodyText style={visual.heroCaption}>{completion===null?t('goals.status.NOT_APPLICABLE'):t('reports.prayerHeroUnit')}</BodyText>
        <BodyText style={[visual.heroCaption,visual.coverage]}>{t('reports.prayerCoverage',{count:p.eligibleDays})}</BodyText>
      </View>
    </View>
  </View>;
}
export function reportTrend(section:ReportSection,mode:ReportMode,data:ReportData,week:Weekday,locale:string,filter:ReportFilters) {
  return aggregateBuckets(data.data,reportBuckets(mode,data.windows.elapsed,week),filter).map(report=>{
    const range=report.range;
    const value=section==='wajib'?report.prayers.applicableSlots?report.prayers.completed:null:
      section==='goals'?report.goals.achieved:metricValue(report,section);
    return {id:range.start,label:dateLabel(range,locale),value};
  });
}
export function Comparison({data,t,locale,compact,open}:{data:ReportData;t:GoalTranslate;locale:string;compact?:boolean;open?:()=>void}) {
  const {colors}=useTheme();
  const {current,previous,count}=data.windows;
  const [now,prior]=useMemo(()=>[aggregateReport(data.data,current),aggregateReport(data.data,previous)],[data.data,current,previous]);
  const signed=(value:number|null,isRate=false)=>{
    if(value===null)return '—';
    return (value>0?'+':'')+valueText(value,locale)+(isRate?' '+t('reports.points'):'');
  };
  return <PrayerPanel>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('reports.comparison')}</BodyText>
    <BodyText style={prayerStyles.small}>{t('reports.selected')} · {dateLabel(current,locale)}</BodyText>
    <BodyText style={prayerStyles.small}>{t('reports.previous')} · {dateLabel(previous,locale)}</BodyText>
    <BodyText style={prayerStyles.small}>{t('reports.matched',{count})}</BodyText>
    {(compact?sections.slice(0,3):sections).map(section=>{
      const rate=section==='wajib'||section==='goals';
      const currentValue=metricValue(now,section),previousValue=metricValue(prior,section);
      const delta=reportChange(currentValue,previousValue,rate);
      const scale=rate?100:Math.max(1,currentValue??0,previousValue??0);
      const pair=[
        {key:'selected',value:currentValue,color:colors.primary},
        {key:'previous',value:previousValue,color:colors.secondary},
      ];
      return <View key={section} style={[visual.comparisonRow,{borderColor:colors.border}]}>
        <BodyText style={visual.comparisonTitle}>{t('reports.'+section)}</BodyText>
        {pair.map(item=>{
          const label=t('reports.'+item.key);
          const formatted=item.value===null?t('prayer.na'):rate?percent(item.value,locale):valueText(item.value,locale);
          return <View key={item.key} style={visual.pair}>
            <View style={prayerStyles.line}>
              <BodyText style={[visual.comparisonCaption,{color:colors.muted}]}>{label}</BodyText>
              <BodyText style={visual.comparisonValue}>{formatted}</BodyText>
            </View>
            {item.value!==null&&<ReportBar color={item.color} label={label+' · '+formatted} value={item.value/scale*100}/>}
          </View>;
        })}
        <BodyText style={prayerStyles.small}>{t('reports.change')} {signed(delta.absolute,rate)}
          {!rate&&' · '+(delta.relative===null?t('reports.noRelative'):signed(delta.relative)+'%')}</BodyText>
        {!compact&&!rate&&<BodyText style={prayerStyles.small}>{t('reports.perDay')} {valueText(count&&currentValue!==null?currentValue/count:null,locale)} / {valueText(count&&previousValue!==null?previousValue/count:null,locale)}</BodyText>}
      </View>;
    })}
    {open&&<PrayerAction label={t('reports.comparison')} onPress={open}/>}
  </PrayerPanel>;
}

export function Detail({section,mode,data,week,t,locale}:{section:ReportSection;mode:ReportMode;data:ReportData;week:Weekday;t:GoalTranslate;locale:string}) {
  const [selected,setSelected]=useState<string>();
  const [collection,setCollection]=useState<string>();
  const [cadence,setCadence]=useState<string>();
  const router=useRouter();
  const [limit,setLimit]=useState(12);
  const filter:ReportFilters=useMemo(()=>({
    sunnah:section==='sunnah'?selected:undefined,
    surah:section==='quran'&&selected?Number(selected):undefined,
    dhikr:section==='dhikr'?selected:undefined,
    goalCategory:section==='goals'?selected as Category|undefined:undefined,
    cadence:section==='goals'?cadence as Cadence|undefined:undefined,
    collection,
  }),[section,selected,cadence,collection]);
  const report=useMemo(()=>aggregateReport(data.data,data.windows.elapsed,filter),[data,filter]);
  const trend=useMemo(()=>reportTrend(section,mode,data,week,locale,filter),[data,filter,locale,mode,section,week]);
  const {prayers,sunnah,quran,dhikr,goals}=report;
  const opt=section==='sunnah'?[{id:'rawatib',label:t('goals.rawatib')},...data.sunnahOptions.map(row=>({id:row.id,label:row.name??t('types.'+row.id)}))]:
    section==='quran'?[...data.data.catalog.values()].map(row=>({id:String(row.number),label:row.latin})):
      section==='dhikr'?data.dhikrOptions.map(row=>({id:row.id,label:row.owner?row.label:activityLabel(t,row.label)})):
        goalCategories.map(id=>({id,label:t('goals.categories.'+id)}));
  const distribution=(section==='sunnah'?sunnah.distribution.map(row=>({id:row.id,label:opt.find(value=>value.id===row.id)?.label??row.id,value:row.totalSessions,days:row.activeDays})):
    section==='quran'?quran.distribution.map(row=>({id:row.id,label:data.data.catalog.get(row.id)?.latin??String(row.id),value:row.value})):
    section==='dhikr'?dhikr.distribution.map(row=>({id:row.id,label:opt.find(value=>value.id===row.id)?.label??row.label,value:row.repetitions})):[])
    .sort((a,b)=>b.value-a.value||String(a.id).localeCompare(String(b.id)));

  return <>
    {section!=='wajib'&&<Filter label={t(section==='quran'?'quran.surah':section==='goals'?'goals.category':'goals.activity')} t={t}
      value={selected} options={opt} change={value=>{setSelected(value);setLimit(12);}}/>}
    {section==='dhikr'&&<Filter label={t('reports.collections')} t={t} value={collection}
      options={data.collectionOptions.map(row=>({id:row.id,label:t('dhikr.catalog.'+row.id)}))} change={setCollection}/>}
    {section==='goals'&&<Filter label={t('goals.period')} t={t} value={cadence} options={cadences.map(id=>({id,label:t('goals.cadence.'+id)}))}
      change={value=>{setCadence(value);setLimit(12);}}/>}
    {section==='wajib'&&<>
      <PrayerReportCard report={report} t={t} locale={locale}/>
      <StatCard title={t('reports.breakdown')} values={stats(t,locale,[
        ['expected',prayers.totalSlots],['applicable',prayers.applicableSlots],['completed',prayers.completed],['missed',prayers.missed],
        ['notLogged',prayers.notLogged],['exempt',prayers.exempt],['completeDays',prayers.completeDays],
      ])}/>
      <BodyText style={prayerStyles.small}>{t('reports.coverageStart')}</BodyText>
      {([
        ['onTime',prayers.onTimeYes,prayers.onTimeNo,prayers.onTimeUnspecified,prayers.onTimePercentage],
        ['jamaah',prayers.congregationalYes,prayers.congregationalNo,prayers.congregationalUnspecified,prayers.congregationalPercentage],
      ] as const).map(([label,yes,no,unknown,rate])=><StatCard key={label} title={t('reports.'+label)}
        values={[{label:t('reports.completedRate'),value:rate===null?t('goals.status.NOT_APPLICABLE'):percent(rate,locale)},
          ...stats(t,locale,[['yes',yes],['no',no],['unknown',unknown]])]}/>)}
      <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('reports.prayerTypes')}</BodyText>
        {prayers.byType.map(row=><StatCard key={row.id} title={t('types.'+row.id)}
          values={[{label:t('reports.completedApplicable',{completed:row.completed,applicable:row.applicableSlots}),value:percent(row.completionPercentage,locale)},
            ...stats(t,locale,[['missed',row.missed],['notLogged',row.notLogged],['exempt',row.exempt],['onTime',row.onTimeYes],['jamaah',row.congregationalYes]])]}/>)}
      </PrayerPanel>
    </>}
    {section==='sunnah'&&<StatCard title={t('reports.sunnah')} values={stats(t,locale,[
      ['sessions',sunnah.totalSessions],['activities',sunnah.distinctActivities],['activeDays',sunnah.activeDays],
      ['rakaat',sunnah.recordedRakaat],['known',sunnah.sessionsWithRakaat],['unknown',sunnah.sessionsWithoutRakaat],
    ])}/>}
    {section==='quran'&&<>
      <StatCard title={t('reports.quran')} values={stats(t,locale,[
        ['ayat',quran.ayat],['sessions',quran.sessions],['activeDays',quran.activeDays],['perDay',quran.perDay],['perActive',quran.perActive],
        ...(!selected?[['minutes',quran.duration],['known',quran.knownDuration],['unknown',quran.sessions-quran.knownDuration]] as [string,number|null][]:[]),
      ])}/>
      {selected&&<BodyText style={prayerStyles.small}>{t('reports.surahDuration')}</BodyText>}
      {quran.unallocated>0&&<BodyText style={prayerStyles.small}>{t('reports.unallocated',{count:quran.unallocated})}</BodyText>}
    </>}
    {section==='dhikr'&&<StatCard title={t('reports.dhikr')} values={stats(t,locale,[
      ['repetitions',dhikr.repetitions],['sessions',dhikr.sessions],['activeDays',dhikr.days],['activities',dhikr.activities],
      ['checks',dhikr.checks],['collectionDone',dhikr.completedCollections],['collectionPartial',dhikr.partialCollections],
    ])}/>}
    {section==='goals'&&<>
      <StatCard title={t('reports.goals')} progress={goals.rate} values={[
        {label:t('reports.goalRate'),value:goals.rate===null?t('goals.status.NOT_APPLICABLE'):percent(goals.rate,locale)},
        ...stats(t,locale,[['applicable',goals.applicable],['achieved',goals.achieved],['goalMissed',goals.missed],['notApplicable',goals.notApplicable]]),
      ]}/>
      {[goalCategories,cadences].map((keys,index)=><PrayerPanel key={index}>
        <BodyText style={prayerStyles.section}>{t(index?'goals.period':'goals.category')}</BodyText>
        {keys.filter(id=>index?(!cadence||id===cadence):(!selected||id===selected)).map(id=>{
          const bucket=goalReport(data.data.goals,data.windows.elapsed,index?{...filter,cadence:id as Cadence}:{...filter,goalCategory:id as Category});
          return <BodyText key={id}>{t((index?'goals.cadence.':'goals.categories.')+id)} · {bucket.achieved}/{bucket.applicable} · {percent(bucket.rate,locale)}</BodyText>;
        })}
      </PrayerPanel>)}
      <BodyText style={prayerStyles.section}>{t('reports.openGoals')}</BodyText>
      {!goals.open.length&&<BodyText>{t('reports.empty')}</BodyText>}
      {goals.open.slice(0,limit).map(item=><ProgressCard key={item.version.goalId} item={item} t={t} locale={locale}
        onPress={()=>router.push({pathname:'/goals/[view]',params:{view:'detail',id:item.version.goalId}})}/>)}
      <BodyText style={prayerStyles.section}>{t('reports.closedGoals')}</BodyText>
      {!goals.closed.length&&<BodyText>{t('reports.empty')}</BodyText>}
      {goals.closed.slice(0,limit).map(item=><ProgressCard key={item.version.goalId+item.period.start} item={item} t={t} locale={locale}
        onPress={()=>router.push({pathname:'/goals/[view]',params:{view:'detail',id:item.version.goalId}})}/>)}
      {Math.max(goals.open.length,goals.closed.length)>limit&&<PrayerAction label={t('goals.more')} onPress={()=>setLimit(limit+12)}/>}
    </>}
    <Bars title={t('reports.trend')} rows={trend} t={t} locale={locale} unit={t('reports.'+trendUnits[section])}/>
    {distribution.length>0&&<Bars title={t('reports.distribution')} rows={distribution.slice(0,limit).map(row=>({
      ...row,label:row.label+('days' in row?' · '+t('reports.daysValue',{count:row.days}):''),
    }))} t={t} locale={locale}/>}
    {distribution.length>limit&&<PrayerAction label={t('goals.more')} onPress={()=>setLimit(limit+12)}/>}
    {section==='dhikr'&&dhikr.collections.map(row=><StatCard key={row.id} title={t('dhikr.catalog.'+row.id)}
      values={stats(t,locale,[['collectionDone',row.completed],['collectionPartial',row.partial]])}/>)}
  </>;
}
const visual=StyleSheet.create({
  hero:{backgroundColor:light.primary,borderRadius:radius.md,padding:14,gap:space.sm},
  onHero:{color:light.onPrimary},
  heroRow:{flexDirection:'row',alignItems:'center',gap:space.md},
  heroStack:{flexDirection:'column',alignItems:'flex-start'},
  heroDetail:{flex:1,minWidth:0,gap:3},
  heroStackDetail:{alignSelf:'stretch',gap:3},
  heroValue:{fontSize:24,lineHeight:29,fontWeight:'800'},
  heroCaption:{color:light.onPrimary,fontSize:12,lineHeight:17},
  coverage:{marginTop:space.xs},
  ring:{alignItems:'center',justifyContent:'center'},
  ringTrack:{position:'absolute',top:0,right:0,bottom:0,left:0,borderWidth:7,borderColor:light.secondary},
  arc:{position:'absolute',top:0,borderWidth:7,borderTopColor:light.accent,borderRightColor:light.accent,
    borderBottomColor:'transparent',borderLeftColor:'transparent'},
  ringLabel:{fontSize:19,lineHeight:25,fontWeight:'800',fontVariant:['tabular-nums']},
  comparisonRow:{borderTopWidth:StyleSheet.hairlineWidth,paddingTop:space.sm,gap:space.xs},
  comparisonTitle:{fontSize:14,lineHeight:19,fontWeight:'700'},
  comparisonCaption:{fontSize:12,lineHeight:17},
  comparisonValue:{fontSize:13,lineHeight:18,fontWeight:'700'},
  pair:{gap:3},
});
