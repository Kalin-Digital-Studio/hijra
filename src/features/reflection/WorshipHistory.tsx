import { useLocalSearchParams,useRouter } from 'expo-router';
import type { SQLiteDatabase } from 'expo-sqlite';
import { useCallback,useState } from 'react';
import { Pressable,StyleSheet,View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText,EmptyState,Input } from '../../components/ui';
import { readSurahs } from '../../database/repositories/quran';
import { readWorshipHistory,readWorshipItem,worshipKinds,type WorshipFilter,type WorshipItem } from '../../database/repositories/worshipHistory';
import { useTheme } from '../../hooks/useTheme';
import { countAyat,type Catalog } from '../../services/quranRules';
import { calendarRange,clip,validCustom,type DateRange } from '../../services/reportDates';
import { useSettings } from '../../stores/settings';
import { light,space } from '../../theme/tokens';
import { addDays } from '../../utils/localDate';
import { formatDate,type GoalTranslate } from '../goals/GoalUI';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { PrayerAction,PrayerModal,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { dateLabel,Filter } from '../reports/ReportUI';
import { PrivateLoad,PrivateScreen } from './Reflection';
import { usePrivateData } from './usePrivateData';

const filters=['all','wajib','sunnah','quran','dhikr'] as const;
const ranges=['today','week','month','custom'] as const;
type RangeMode=typeof ranges[number];
const icon={wajib:'building',sunnah:'moon',quran:'book',dhikr:'droplet',collection:'target'} as const;
const pageSize=24;

function reading(item:WorshipItem,catalog:Catalog,t:GoalTranslate) {
  const {startSurah,startAyah,endSurah,endAyah}=item;
  if(startSurah===null||startAyah===null||endSurah===null||endAyah===null)return t('reflection.noText');
  const start={surah:startSurah,ayah:startAyah},end={surah:endSurah,ayah:endAyah};
  const total=countAyat(catalog,start,end);
  const startName=catalog.get(startSurah)?.latin??String(startSurah);
  const endName=catalog.get(endSurah)?.latin??String(endSurah);
  const range=startName+' '+startAyah+' – '+(startSurah===endSurah?'':endName+' ')+endAyah;
  return total===null?range:range+' · '+t('quran.ayat',{value:total});
}
function titleOf(item:WorshipItem,t:GoalTranslate) {
  if(item.kind==='quran')return t('reflection.quranReading');
  if(item.kind==='collection')return t('dhikr.catalog.'+item.activity);
  if(item.kind==='dhikr')return item.label?.startsWith('dhikr.catalog.')?t(item.label):item.label??t('reports.dhikr');
  return item.label??t('types.'+item.activity);
}
function detailsOf(item:WorshipItem,catalog:Catalog,t:GoalTranslate) {
  switch(item.kind) {
    case 'wajib':return [t('prayer.status.'+item.status),
      item.onTime===null?null:t('prayer.onTime')+' · '+t(item.onTime===1?'prayer.yes':'prayer.no'),
      item.congregation===null?null:t('prayer.congregational')+' · '+t(item.congregation===1?'prayer.yes':'prayer.no')].filter(Boolean).join(' · ');
    case 'sunnah':return item.amount===null?t('dashboard.sunnahSession'):t('dashboard.rakaat',{count:item.amount});
    case 'quran':return [reading(item,catalog,t),item.duration===null?null:t('quran.minutes',{value:item.duration})].filter(Boolean).join(' · ');
    case 'dhikr':return item.status==='CHECKLIST'?t('dashboard.dhikrChecked'):t('dashboard.dhikrCount',{count:item.amount});
    case 'collection':return t(item.status==='COMPLETE'?'dashboard.collectionComplete':'dashboard.collectionPartial');
  }
}

function HistoryHome() {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage??'id';
  const router=useRouter();
  const today=useToday();
  const week=useSettings(state=>state.week_start);
  const [mode,setMode]=useState<RangeMode>('week');
  const [custom,setCustom]=useState<DateRange>();
  const [start,setStart]=useState(today);
  const [last,setLast]=useState(today);
  const [dialog,setDialog]=useState(false);
  const [category,setCategory]=useState<WorshipFilter>('all');
  const [page,setPage]=useState(0);
  const nextDay=addDays(today,1);
  const range=mode==='custom'&&custom?custom:mode==='today'?{start:today,end:nextDay}:
    clip(calendarRange(mode==='month'?'MONTHLY':'WEEKLY',today,week),nextDay);
  const {start:from,end}=range;
  const load=useCallback(async(db:SQLiteDatabase,user:string)=>{
    const [result,catalog]=await Promise.all([readWorshipHistory(db,user,{start:from,end},category,pageSize,page*pageSize),readSurahs(db)]);
    return {...result,catalog};
  },[from,end,category,page]);
  const {data,retry}=usePrivateData(JSON.stringify([from,end,category,page]),load);
  const groups=new Map<string,WorshipItem[]>();
  for(const row of data?.rows??[]) {
    const list=groups.get(row.date)??[];
    list.push(row);groups.set(row.date,list);
  }
  const {colors}=useTheme();
  return <PrivateScreen title={t('reflection.worship')}>
    <BodyText style={prayerStyles.small}>{t('reflection.worshipIntro')}</BodyText>
    <PrayerPanel style={{backgroundColor:light.primary,borderColor:light.primary}}>
      <BodyText style={[prayerStyles.section,{color:light.onPrimary}]}>{dateLabel(range,locale)}</BodyText>
    </PrayerPanel>
    <View style={prayerStyles.wrap}>{ranges.map(item=><PrayerAction key={item} label={t('reflection.ranges.'+item)}
      selected={item===mode} onPress={()=>{
        if(item==='custom'){setStart(from);setLast(addDays(end,-1));setDialog(true);}
        else {setMode(item);setPage(0);}
      }}/>)}</View>
    {dialog&&<PrayerModal dismiss={()=>setDialog(false)}>
      <BodyText style={prayerStyles.section}>{t('reflection.ranges.custom')}</BodyText>
      <Input value={start} onChangeText={setStart} maxLength={10} placeholder={t('reports.start')} accessibilityLabel={t('reports.start')}/>
      <Input value={last} onChangeText={setLast} maxLength={10} placeholder={t('reports.end')} accessibilityLabel={t('reports.end')}/>
      {!validCustom(start,last,today)&&<BodyText>{t('reports.rangeError')}</BodyText>}
      <PrayerAction label={t('reports.apply')} disabled={!validCustom(start,last,today)}
        onPress={()=>{setCustom({start,end:addDays(last,1)});setMode('custom');setPage(0);setDialog(false);}}/>
      <PrayerAction label={t('quran.cancel')} onPress={()=>setDialog(false)}/>
    </PrayerModal>}
    <Filter label={t('goals.category')} allLabel={t('reflection.allActivities')} value={category==='all'?undefined:category}
      options={filters.filter(id=>id!=='all').map(id=>({id,label:t('reports.'+id)}))} t={t}
      change={value=>{setCategory(filters.find(item=>item===value)??'all');setPage(0);}}/>
    {!data?<PrivateLoad failed={data===null} retry={retry}/>:<>
      <BodyText style={prayerStyles.small}>{t('reflection.records',{count:data.total})}</BodyText>
      {!data.rows.length&&<EmptyState message={t('reflection.emptyWorship')}/>}
      {[...groups].map(([date,rows])=><PrayerPanel key={date}>
        <BodyText accessibilityRole="header" style={prayerStyles.section}>{formatDate(date,locale)}</BodyText>
        {rows.map(row=><Pressable key={row.kind+':'+row.id} accessibilityRole="button"
          onPress={()=>router.push({pathname:'/reports/worship-history/[view]',params:{view:'detail',kind:row.kind,id:row.id}})}
          style={({pressed})=>[styles.row,pressed&&{backgroundColor:colors.selected}]}>
          <View style={[styles.badge,{backgroundColor:colors.selected}]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <PrayerIcon kind={icon[row.kind]} color={colors.primary} background={colors.selected} size={20}/>
          </View>
          <View style={styles.flex}>
            <BodyText style={styles.title}>{titleOf(row,t)}</BodyText>
            <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{detailsOf(row,data.catalog,t)}</BodyText>
          </View>
          {!!row.actualTime&&<BodyText style={prayerStyles.small}>{row.actualTime}</BodyText>}
          <PrayerIcon kind="next" color={colors.primary} background={colors.surface} size={18}/>
        </Pressable>)}
      </PrayerPanel>)}
      <View style={prayerStyles.wrap}>
        {page>0&&<PrayerAction label={t('prayer.previous')} onPress={()=>setPage(page-1)}/>}
        {(page+1)*pageSize<data.total&&<PrayerAction label={t('prayer.next')} onPress={()=>setPage(page+1)}/>}
      </View>
    </>}
  </PrivateScreen>;
}

function ActivityDetails({kind,id}:{kind:WorshipItem['kind'];id:string}) {
  const {t,i18n}=useTranslation();
  const today=useToday();
  const router=useRouter();
  const load=useCallback(async(db:SQLiteDatabase,user:string)=>{
    const [item,catalog]=await Promise.all([readWorshipItem(db,user,kind,id,{start:'0001-01-01',end:addDays(today,1)}),readSurahs(db)]);
    return {item,catalog};
  },[kind,id,today]);
  const {data,retry}=usePrivateData(JSON.stringify([kind,id,today]),load);
  const item=data?.item;
  const row=item?.row;
  function go() {
    if(!row)return;
    if(row.kind==='wajib')router.push({pathname:'/prayer',params:{date:row.date}});
    else if(row.kind==='sunnah')router.push({pathname:'/sunnah',params:{date:row.date,activity:row.activity??''}});
    else if(row.kind==='quran')router.push({pathname:'/quran/history',params:{date:row.date}});
    else router.push({pathname:'/dhikr/history',params:{date:row.date}});
  }
  return <PrivateScreen title={t('reflection.activityDetail')}>
    {!data?<PrivateLoad failed={data===null} retry={retry}/>:!item||!row?
      <><EmptyState message={t('reflection.activityUnavailable')}/><PrayerAction label={t('retry')} onPress={retry}/></>:
      <>
        <PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{titleOf(row,t)}</BodyText>
          <BodyText>{formatDate(row.date,i18n.resolvedLanguage??'id')}{row.actualTime?' · '+row.actualTime:''}</BodyText>
          <BodyText>{detailsOf(row,data.catalog,t)}</BodyText>
        </PrayerPanel>
        {row.kind==='collection'&&<PrayerPanel>
          <BodyText style={prayerStyles.section}>{t('reflection.collectionActivities')}</BodyText>
          {item.children.some(child=>child.mode==='COUNTER')&&<BodyText>{t('dashboard.dhikrCount',{
            count:item.children.reduce((sum,child)=>sum+(child.mode==='COUNTER'?child.count:0),0),
          })}</BodyText>}
          {item.children.map(child=><BodyText key={child.id}>
            {child.label.startsWith('dhikr.catalog.')?t(child.label):child.label} · {child.mode==='CHECKLIST'?
              t('dashboard.dhikrChecked'):t('dashboard.dhikrCount',{count:child.count})}
          </BodyText>)}
        </PrayerPanel>}
        <PrayerAction label={t('goals.tracker')} onPress={go}/>
      </>}
  </PrivateScreen>;
}

export function WorshipHistoryRoute() {
  const {t}=useTranslation();
  const {view,kind,id}=useLocalSearchParams<{view?:string;kind?:string;id?:string}>();
  const source=worshipKinds.find(item=>item===kind);
  if(view==='home')return <HistoryHome/>;
  if(view==='detail'&&source&&typeof id==='string'&&id.trim()&&id.length<=300)return <ActivityDetails kind={source} id={id}/>;
  return <PrivateScreen title={t('reflection.worship')}><EmptyState message={t('reflection.activityUnavailable')}/></PrivateScreen>;
}
const styles=StyleSheet.create({
  row:{minHeight:48,paddingVertical:space.xs,flexDirection:'row',alignItems:'center',gap:space.sm},
  badge:{width:34,height:34,borderRadius:10,alignItems:'center',justifyContent:'center'},flex:{flex:1},title:{fontWeight:'700'},
});
