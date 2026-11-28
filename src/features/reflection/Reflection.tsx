import { useLocalSearchParams,usePreventRemove,useRouter } from 'expo-router';
import { useCallback,useMemo,useRef,useState,type ReactNode } from 'react';
import { Alert,Pressable,StyleSheet,View,useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText,EmptyState,Input,LoadingState,ScreenContainer } from '../../components/ui';
import { readReport } from '../../database/repositories/reports';
import { useTheme } from '../../hooks/useTheme';
import { deleteReflection,readOverlappingReflection,readReflection,readReflectionHistory,readReflectionYears,
  ReflectionOverlap,saveReflection,type Reflection as SavedReflection } from '../../database/repositories/reflections';
import { emptyJournal,feelings,maxReflectionLength,normalizeJournal,reflectionFields,reflectionWeek,validJournal,type Journal,type ReflectionWeek } from '../../services/reflectionRules';
import { newReadingSessionId } from '../../services/quranRules';
import { aggregateReport,type Report } from '../../services/reportRules';
import { invalidateGoals } from '../../stores/goalRevision';
import { useSettings } from '../../stores/settings';
import { addDays,localDate } from '../../utils/localDate';
import { light,radius,space } from '../../theme/tokens';
import type { Weekday } from '../../types/settings';
import type { SQLiteDatabase } from 'expo-sqlite';
import { formatDate } from '../goals/GoalUI';
import { PrayerAction,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { dateLabel,Filter,ReportIconButton } from '../reports/ReportUI';
import { usePrivateData } from './usePrivateData';

const icons={DIFFICULT:'😓',OKAY:'😐',GOOD:'🙂',HAPPY:'😊',CALM:'😌'} as const;
const validId=(value:unknown):value is string=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(value);
const pageSize=15;

export function PrivateScreen({title,children}:{title:string;children:ReactNode}) {
  const {t}=useTranslation();
  const router=useRouter();
  return <ScreenContainer standalone compact keyboard>
    <View style={prayerStyles.wrap}>
      <ReportIconButton icon="back" label={t('back')} onPress={()=>router.canGoBack()?router.back():router.replace('/reports')}/>
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{title}</BodyText>
    </View>
    {children}
  </ScreenContainer>;
}
export function PrivateLoad({failed,retry}:{failed:boolean;retry:()=>void}) {
  const {t}=useTranslation();
  return failed?<><EmptyState message={t('loadError')}/><PrayerAction label={t('retry')} onPress={retry}/></>:<LoadingState/>;
}
async function weeklySummary(db:SQLiteDatabase,user:string,week:ReflectionWeek,today:string) {
  const last=week.end>today?today:addDays(week.end,-1);
  const data=await readReport(db,user,{mode:'CUSTOM',start:week.start,last},today,week.preference,true);
  return aggregateReport(data.data,data.windows.elapsed);
}
function Summary({report,week,today}:{report:Report;week:ReflectionWeek;today:string}) {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage??'id';
  const p=report.prayers;
  const {width,fontScale}=useWindowDimensions();
  const values=[
    ['wajib',p.applicableSlots?p.completed+'/'+p.applicableSlots:t('prayer.na')],
    ['sunnah',t('reports.sessionsValue',{count:report.sunnah.totalSessions})],
    ['quran',t('quran.ayat',{value:report.quran.ayat})],
    ['dhikr',t('dashboard.dhikrCount',{count:report.dhikr.repetitions})],
  ];
  return <PrayerPanel style={{backgroundColor:light.primary,borderColor:light.primary}}>
    <BodyText accessibilityRole="header" style={[prayerStyles.section,{color:light.onPrimary}]}>{t('reflection.summary')}</BodyText>
    <BodyText style={prayerStyles.onGreen}>{dateLabel(week,locale)} · {t(week.end>today?'reflection.ongoing':'reflection.previousWeek')}</BodyText>
    {[values.slice(0,2),values.slice(2)].map((pair,index)=><View key={index}
      style={[styles.summaryRow,(fontScale>1.4||width<300)&&styles.stacked]}>
      {pair.map(([key,value])=><View style={styles.summaryCell} key={key}>
        <BodyText style={prayerStyles.onGreen}>{t('reports.'+key)}</BodyText>
        <BodyText style={[prayerStyles.section,{color:light.onPrimary}]}>{value}</BodyText>
      </View>)}
    </View>)}
    <BodyText style={prayerStyles.onGreen}>{t('reflection.live')}</BodyText>
  </PrayerPanel>;
}
function Privacy() {
  const {t}=useTranslation();
  return <PrayerPanel>
    <BodyText style={prayerStyles.section}>{t('reflection.privateJournal')}</BodyText>
    <BodyText style={prayerStyles.small}>{t('reflection.privacy')}</BodyText>
  </PrayerPanel>;
}
function showDate(value:string,locale:string) {
  const instant=new Date(value);
  return Number.isFinite(instant.getTime())?formatDate(localDate(instant),locale):'—';
}
function Editor({db,user,week,record,today,navigation,report,overlap}:{db:SQLiteDatabase;user:string;week:ReflectionWeek;record?:SavedReflection|null;
  today:string;navigation?:(confirm:(action:()=>void)=>void)=>ReactNode;report:Report;overlap?:boolean}) {
  const {t}=useTranslation();
  const {colors}=useTheme();
  const [id]=useState(()=>record?.id??newReadingSessionId());
  const [existing,setExisting]=useState(!!record);
  const [initial,setInitial]=useState<Journal>(()=>record?{
    feeling:record.feeling,gratitude:record.gratitude,challenges:record.challenges,plan:record.plan,
  }:emptyJournal);
  const [journal,setJournal]=useState(initial);
  const [saving,setSaving]=useState(false);
  const [feedback,setFeedback]=useState<'saved'|'error'|'overlap'>();
  const lock=useRef(false);
  const dirty=reflectionFields.some(field=>journal[field]!==initial[field])||journal.feeling!==initial.feeling;
  function confirm(action:()=>void) {
    if(!dirty){action();return;}
    Alert.alert(t('reflection.discard'),t('reflection.unsaved'),[
      {text:t('quran.cancel'),style:'cancel'},{text:t('reflection.discard'),style:'destructive',onPress:action},
    ]);
  }
  usePreventRemove(dirty||saving,({repeat})=>{if(!lock.current)confirm(repeat);});
  async function save() {
    if(lock.current||!validJournal(journal))return;
    lock.current=true;setSaving(true);
    const normalized=normalizeJournal(journal);
    try {
      await saveReflection(db,user,id,week,normalized,existing,today);
      setExisting(true);setInitial(normalized);setJournal(normalized);setFeedback('saved');invalidateGoals();
    }catch(error){setFeedback(error instanceof ReflectionOverlap?'overlap':'error');}
    finally {lock.current=false;setSaving(false);}
  }
  return <>
    {navigation?.(action=>{if(!saving)confirm(action);})}
    {overlap&&<BodyText style={prayerStyles.small}>{t('reflection.overlap')}</BodyText>}
    <Summary report={report} week={week} today={today}/>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('reflection.mine')}</BodyText>
    <PrayerPanel>
      <BodyText style={prayerStyles.section}>{t('reflection.feeling')}</BodyText>
      <View style={styles.feelings}>{feelings.map(feeling=>{
        const selected=journal.feeling===feeling;
        const label=t('reflection.feelings.'+feeling);
        return <Pressable key={feeling} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{selected,disabled:saving}}
          style={({pressed})=>[styles.feeling,{borderColor:selected?colors.primary:colors.border,
            backgroundColor:pressed||selected?colors.selected:colors.surface}]}
          disabled={saving} onPress={()=>setJournal(state=>({...state,feeling:state.feeling===feeling?null:feeling}))}>
          <BodyText style={styles.emoji} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{icons[feeling]}</BodyText>
          <BodyText style={styles.feelingLabel}>{label}</BodyText>
        </Pressable>;
      })}</View>
      {journal.feeling&&<PrayerAction label={t('reflection.clearFeeling')} disabled={saving} onPress={()=>setJournal(state=>({...state,feeling:null}))}/>}
    </PrayerPanel>
    {reflectionFields.map(field=><PrayerPanel key={field}>
      <BodyText style={prayerStyles.section}>{t('reflection.fields.'+field)}</BodyText>
      <Input accessibilityLabel={t('reflection.fields.'+field)} placeholder={t('reflection.hints.'+field)}
        value={journal[field]} onChangeText={value=>setJournal(state=>({...state,[field]:value}))}
        editable={!saving} multiline maxLength={maxReflectionLength} textAlignVertical="top" style={{minHeight:96}}/>
    </PrayerPanel>)}
    {!validJournal(journal)&&<BodyText style={prayerStyles.small}>{t('reflection.required')}</BodyText>}
    {feedback&&<BodyText accessibilityLiveRegion="polite">{t('reflection.'+(feedback==='overlap'?'overlapConflict':feedback))}</BodyText>}
    <PrayerAction label={t('reflection.save')} emphasis="primary" disabled={saving||!validJournal(journal)}
      onPress={()=>void save()}/>
    <Privacy/>
  </>;
}
const styles=StyleSheet.create({
  summaryRow:{flexDirection:'row',gap:space.sm},stacked:{flexDirection:'column'},summaryCell:{flex:1,minWidth:0},
  feelings:{flexDirection:'row',flexWrap:'wrap',gap:space.xs},
  feeling:{flexGrow:1,minWidth:48,minHeight:48,paddingVertical:4,paddingHorizontal:5,borderWidth:1,borderRadius:radius.md,alignItems:'center',justifyContent:'center'},
  emoji:{fontSize:19,lineHeight:25},feelingLabel:{fontSize:12,lineHeight:16,textAlign:'center'},
});
function useReflectionData(today:string,anchor:string,preference:Weekday,id?:string) {
  const candidate=useMemo(()=>reflectionWeek(anchor,preference),[anchor,preference]);
  const load=useCallback(async(db:SQLiteDatabase,user:string)=>{
    const row=id?await readReflection(db,user,id):await readOverlappingReflection(db,user,candidate,anchor);
    if(id&&!row)return null;
    const week=row?{start:row.start,end:row.end,preference:row.preference}:candidate;
    const report=await weeklySummary(db,user,week,today);
    return {row,week,report};
  },[id,today,candidate,anchor]);
  return {...usePrivateData(JSON.stringify(id?[id]:[candidate,anchor]),load),candidate};
}
function ReflectionHome() {
  const {t,i18n}=useTranslation();
  const today=useToday();
  const weekStart=useSettings(state=>state.week_start);
  const [anchor,setDay]=useState(today);
  const {db,user,data,candidate,retry}=useReflectionData(today,anchor,weekStart);
  return <PrivateScreen title={t('reflection.title')}>
    <BodyText style={prayerStyles.small}>{t('reflection.intro')}</BodyText>
    {!data||!user?<PrivateLoad failed={data===null} retry={retry}/>:<Editor key={[user,anchor,weekStart].join(':')}
      db={db} user={user} today={today} week={data.week} record={data.row} report={data.report}
      overlap={data.week.start!==candidate.start} navigation={confirm=><>
        <View style={prayerStyles.line}>
          <ReportIconButton icon="back" label={t('prayer.previous')} disabled={candidate.start<='1900-01-07'}
            onPress={()=>confirm(()=>setDay(addDays(candidate.start,-1)))}/>
          <BodyText style={prayerStyles.small}>{dateLabel(data.week,i18n.resolvedLanguage??'id')}</BodyText>
          <ReportIconButton icon="next" label={t('prayer.next')} disabled={candidate.end>today}
            onPress={()=>confirm(()=>setDay(candidate.end))}/>
        </View>
        {candidate.end<=today&&<PrayerAction label={t('reflection.currentWeek')} onPress={()=>confirm(()=>setDay(today))}/>}
      </>}/>}
  </PrivateScreen>;
}
function ReflectionHistory() {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage??'id';
  const router=useRouter();
  const [year,setYear]=useState<string>();
  const [page,setPage]=useState(0);
  const load=useCallback(async(db:SQLiteDatabase,user:string)=>{
    const [rows,years]=await Promise.all([readReflectionHistory(db,user,year??null,page*pageSize,pageSize+1),readReflectionYears(db,user)]);
    return {rows,years};
  },[year,page]);
  const {data,retry}=usePrivateData(JSON.stringify([year,page]),load);
  return <PrivateScreen title={t('reflection.history')}>
    {!data?<PrivateLoad failed={data===null} retry={retry}/>:<>
      <Filter label={t('reflection.year')} value={year} options={data.years.map(row=>({id:row.year,label:row.year}))} t={t}
        change={value=>{setYear(value);setPage(0);}}/>
      {!data.rows.length&&<>
        <EmptyState message={t('reflection.empty')}/>
        <PrayerAction emphasis="primary" label={t('reflection.start')} onPress={()=>router.push('/reports/reflection/home')}/>
      </>}
      {!!data.rows.length&&<PrayerAction label={t('reflection.chooseWeek')} onPress={()=>router.push('/reports/reflection/home')}/>}
      {data.rows.slice(0,pageSize).map(row=>{
        const text=row.preview+(row.truncated?'…':'');
        return <PrayerPanel key={row.id}>
          <BodyText style={prayerStyles.section}>{dateLabel(row,locale)}</BodyText>
          {row.feeling&&<BodyText>{icons[row.feeling]} {t('reflection.feelings.'+row.feeling)}</BodyText>}
          <BodyText style={prayerStyles.small}>{t('reflection.updated',{date:showDate(row.updatedAt,locale)})}</BodyText>
          <BodyText numberOfLines={2} style={prayerStyles.small}>{text||t('reflection.noText')}</BodyText>
          <PrayerAction label={t('reflection.view')} onPress={()=>router.push({pathname:'/reports/reflection/[view]',params:{view:'detail',id:row.id}})}/>
        </PrayerPanel>;
      })}
      <View style={prayerStyles.wrap}>
        {page>0&&<PrayerAction label={t('prayer.previous')} onPress={()=>setPage(page-1)}/>}
        {data.rows.length>pageSize&&<PrayerAction label={t('prayer.next')} onPress={()=>setPage(page+1)}/>}
      </View>
    </>}
  </PrivateScreen>;
}
function ReflectionDetails({id,editing}:{id:string;editing:boolean}) {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage??'id';
  const router=useRouter();
  const today=useToday();
  const preference=useSettings(state=>state.week_start);
  const {db,user,data,retry}=useReflectionData(today,today,preference,id);
  const lock=useRef(false);
  const [failed,setFailed]=useState(false);
  const row=data?.row;
  function remove() {
    Alert.alert(t('reflection.delete'),t('reflection.confirmDelete'),[
      {text:t('quran.cancel'),style:'cancel'},{text:t('reflection.delete'),style:'destructive',onPress:()=>{
        if(!user||lock.current)return;
        lock.current=true;
        void deleteReflection(db,user,id).then(()=>{
          invalidateGoals();
          if(router.canGoBack())router.back();
          else router.replace('/reports/reflection/history');
        },()=>setFailed(true)).finally(()=>{lock.current=false;});
      }},
    ]);
  }
  return <PrivateScreen title={t(editing?'reflection.edit':'reflection.view')}>
    {data===undefined?<PrivateLoad failed={false} retry={retry}/>:!data||!row||!user?
      <><EmptyState message={t('reflection.unavailable')}/><PrayerAction label={t('retry')} onPress={retry}/></>:
      editing?<Editor key={row.id} db={db} user={user} week={data.week} report={data.report} record={row} today={today}/>:
      <>
        <Summary report={data.report} week={data.week} today={today}/>
        <PrayerPanel>
          <BodyText style={prayerStyles.section}>{t('reflection.feeling')}</BodyText>
          <BodyText>{row.feeling?icons[row.feeling]+' '+t('reflection.feelings.'+row.feeling):t('reflection.noText')}</BodyText>
        </PrayerPanel>
        {reflectionFields.map(field=><PrayerPanel key={field}>
          <BodyText style={prayerStyles.section}>{t('reflection.fields.'+field)}</BodyText>
          <BodyText>{row[field]||t('reflection.noText')}</BodyText>
        </PrayerPanel>)}
        <BodyText style={prayerStyles.small}>{t('reflection.created',{date:showDate(row.createdAt,locale)})}</BodyText>
        <BodyText style={prayerStyles.small}>{t('reflection.updated',{date:showDate(row.updatedAt,locale)})}</BodyText>
        {failed&&<BodyText>{t('reflection.error')}</BodyText>}
        <View style={prayerStyles.wrap}>
          <PrayerAction emphasis="primary" label={t('reflection.edit')} onPress={()=>router.push({pathname:'/reports/reflection/[view]',params:{view:'edit',id}})}/>
          <PrayerAction emphasis="danger" label={t('reflection.delete')} onPress={remove}/>
          <PrayerAction label={t('reflection.chooseWeek')} onPress={()=>router.push('/reports/reflection/home')}/>
        </View>
        <Privacy/>
      </>}
  </PrivateScreen>;
}
export function ReflectionRoute() {
  const {t}=useTranslation();
  const {view,id}=useLocalSearchParams<{view?:string;id?:string}>();
  if(view==='home')return <ReflectionHome/>;
  if(view==='history')return <ReflectionHistory/>;
  if((view==='detail'||view==='edit')&&validId(id))return <ReflectionDetails key={view+id} id={id} editing={view==='edit'}/>;
  return <PrivateScreen title={t('reflection.title')}><EmptyState message={t('reflection.unavailable')}/></PrivateScreen>;
}
