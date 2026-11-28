import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { changeGoal, type GoalChange, type GoalSnapshot } from '../../database/repositories/goals';
import { cadences, definition, makePeriod, type Cadence, type Category } from '../../services/goalRules';
import { invalidateGoals } from '../../stores/goalRevision';
import { addDays } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { GoalEditor, GoalTemplates, type GoalContext } from './GoalEditor';
import { formatDate, goalActivity, goalCategories, ProgressCard } from './GoalUI';
import { useGoals } from './useGoals';

const views = ['create','templates','detail','edit','history','manage'] as const;
type ViewName = typeof views[number];
const pageSize = 20;
export default function GoalRoutes() {
  const {view,id} = useLocalSearchParams<{view?:string;id?:string}>();
  const mode = views.find(item => item === view);
  const ownerRoute = mode === 'detail' || mode === 'edit';
  const validId = typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id) ? id : undefined;
  return <GoalWorkspace key={JSON.stringify([mode,validId])} mode={ownerRoute && !validId ? undefined : mode} id={ownerRoute ? validId : undefined} />;
}
function GoalWorkspace({mode,id}: {mode?:ViewName;id?:string}) {
  const {t,i18n} = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'id';
  const router = useRouter();
  const [category,setCategory] = useState<Category>();
  const [cadence,setCadence] = useState<Cadence>();
  const [page,setPage] = useState(0);
  const context = useGoals({id,history:mode==='history'||mode==='detail',limit:mode==='detail'?7:pageSize+1,
    offset:mode==='history'?page*pageSize:0,category,cadence});
  const {data} = context;
  const selected = id && data ? data.goals.find(row => row.version.goalId === id) : undefined;
  function open(view: ViewName, goalId?: string) {
    router.push({pathname:'/goals/[view]',params:{view,...(goalId ? {id:goalId} : {})}});
  }
  function content() {
    if (!mode) return <EmptyState message={t('goals.error')} />;
    if (data === undefined) return <LoadingState />;
    if (data === null) return <><EmptyState message={t('goals.error')} /><PrayerAction label={t('retry')} onPress={invalidateGoals} /></>;
    const ready = {...context,data};
    if (mode==='create') return <GoalEditor context={ready} />;
    if (mode==='templates') return <GoalTemplates context={ready} />;
    if (mode==='edit') return selected?.version.state==='ACTIVE' ? <GoalEditor context={ready} editing={selected} /> :
      <EmptyState message={t('goals.error')} />;
    if (mode==='detail') return selected ? <GoalDetail context={ready} goal={selected} edit={() => open('edit',id)} /> :
      <EmptyState message={t('goals.error')} />;
    if (mode==='manage') return data.goals.length ? data.goals.map(({version,pending}) => <PrayerPanel key={version.goalId}>
      <BodyText style={prayerStyles.section}>{version.name}</BodyText>
      <BodyText>{t('goals.status.'+version.state)} · {t('goals.cadence.'+version.cadence)}</BodyText>
      {pending && <BodyText style={prayerStyles.small}>{t('goals.pending',{date:formatDate(pending.from,locale)})}</BodyText>}
      <PrayerAction label={t('goals.detail') + ' · ' + version.name} onPress={() => open('detail',version.goalId)} />
    </PrayerPanel>) : <EmptyState message={t('goals.emptyManage')} />;
    return <>
      <View style={prayerStyles.wrap}>{[undefined,...goalCategories].map(item => <PrayerAction key={item ?? 'all'}
        selected={item===category} label={item ? t('goals.categories.'+item) : t('goals.all')}
        onPress={() => {setPage(0);setCategory(item);}} />)}</View>
      <View style={prayerStyles.wrap}>{[undefined,...cadences].map(item => <PrayerAction key={item ?? 'all'}
        selected={item===cadence} label={item ? t('goals.cadence.'+item) : t('goals.all')}
        onPress={() => {setPage(0);setCadence(item);}} />)}</View>
      {!data.history.length && <EmptyState message={t('goals.emptyHistory')} />}
      {data.history.slice(0,pageSize).map(item => <ProgressCard key={item.version.goalId+':'+item.period.start}
        item={item} t={t} locale={locale} onPress={() => open('detail',item.version.goalId)} />)}
      <View style={prayerStyles.wrap}>
        {page>0 && <PrayerAction label={t('prayer.previous')} onPress={() => setPage(page-1)} />}
        {data.history.length>pageSize && <PrayerAction label={t('prayer.next')} onPress={() => setPage(page+1)} />}
      </View>
    </>;
  }
  return <ScreenContainer standalone compact keyboard>
    <View style={prayerStyles.wrap}>
      <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/goals')} />
      <BodyText style={prayerStyles.title} accessibilityRole="header">{t(mode ? 'goals.'+mode : 'goals.title')}</BodyText>
    </View>
    {content()}
  </ScreenContainer>;
}

function GoalDetail({context,goal,edit}: {context:GoalContext;goal:GoalSnapshot;edit:()=>void}) {
  const {t,i18n} = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'id';
  const router = useRouter();
  const {version,pending,progress} = goal;
  const metric = definition(version.category,version.metric);
  const {db,user,today,week} = context;
  const lock = useRef(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState(false);
  const [expanded,setExpanded] = useState(false);
  async function apply(change: GoalChange) {
    if (!user || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await changeGoal(db,user,version.goalId,change,today,week);
      invalidateGoals();
    } catch { setError(true); }
    finally { lock.current=false;setBusy(false); }
  }
  function confirm(action: 'pause' | 'resume' | 'archive') {
    const date = progress?.period.end ?? makePeriod(version,today,week).end;
    Alert.alert(t('goals.'+action),t('goals.lifecycleHelp',{date:formatDate(date,locale)}),[
      {text:t('quran.cancel'),style:'cancel'}, {text:t('goals.'+action),onPress:() => void apply({action})},
    ]);
  }
  const next = pending?.state === 'ACTIVE' ? makePeriod(pending,pending.from,week) : null;
  function openTracker() {
    if (!metric) return;
    const { options } = context.data;
    if (version.category === 'SUNNAH' && options.sunnah.some(item => item.id === version.filter)) {
      router.push({pathname:'/sunnah',params:{activity:version.filter}});
    } else if (version.category === 'DHIKR') {
      const item = options.dhikr.find(row => row.id === version.filter && !row.archived);
      const collection = options.collection.find(row => 'collection:'+row.id === version.filter);
      if (item || collection) router.push({pathname:'/dhikr',params:{activity:version.filter}});
      else router.push(metric.route);
    } else router.push(metric.route);
  }
  const records = progress?.result.records ?? [];
  const byDate = new Map<string,number>();
  for (const record of records) byDate.set(record.date,(byDate.get(record.date) ?? 0)+1);
  return <>
    <PrayerPanel>
      <BodyText style={prayerStyles.title}>{version.name}</BodyText>
      <BodyText>{t('goals.categories.'+version.category)} · {t('goals.cadence.'+version.cadence)}</BodyText>
      {version.filter !== 'all' && <BodyText>{goalActivity(t,version,context.data.options)}</BodyText>}
      <BodyText>{t('goals.metrics.'+version.metric)} · {t('goals.status.'+version.state)}</BodyText>
      <BodyText>{t('goals.amount')} · {version.target} {t('goals.units.'+metric?.unit,{count:version.target})}</BodyText>
    </PrayerPanel>
    {progress && <ProgressCard t={t} locale={locale} item={progress} detail />}
    {pending && <PrayerPanel>
      <BodyText style={prayerStyles.section}>{t('goals.pending',{date:formatDate(pending.from,locale)})}</BodyText>
      <BodyText>{pending.name} · {t('goals.status.'+pending.state)}</BodyText>
      {next && <>
        <BodyText>{t('goals.metrics.'+pending.metric)} · {pending.target} {t('goals.units.'+definition(pending.category,pending.metric)?.unit,{count:pending.target})} · {t('goals.cadence.'+pending.cadence)}</BodyText>
        <BodyText>{t('goals.pendingRange',{start:formatDate(next.start,locale),end:formatDate(addDays(next.end,-1),locale)})}</BodyText>
      </>}
      <PrayerAction disabled={busy} label={t('goals.cancelPending')} onPress={() => void apply({action:'cancel'})} />
    </PrayerPanel>}
    {metric && <PrayerAction emphasis="primary" label={t('goals.tracker')} onPress={openTracker} />}
    {version.state !== 'ARCHIVED' && <View style={prayerStyles.wrap}>
      {version.state === 'ACTIVE' && <PrayerAction disabled={busy} label={t('goals.edit')} onPress={edit} />}
      {version.state === 'ACTIVE' && <PrayerAction disabled={busy} label={t('goals.pause')} onPress={() => confirm('pause')} />}
      {version.state === 'PAUSED' && <PrayerAction disabled={busy} label={t('goals.resume')} onPress={() => confirm('resume')} />}
      <PrayerAction disabled={busy} label={t('goals.archive')} onPress={() => confirm('archive')} />
    </View>}
    {error && <BodyText accessibilityLiveRegion="polite">{t('goals.error')}</BodyText>}
    {!!byDate.size && <PrayerPanel>
      <PrayerAction label={t('goals.records')+' · '+records.length} onPress={() => setExpanded(!expanded)} selected={expanded} />
      {expanded && [...byDate.entries()].sort((a,b) => b[0].localeCompare(a[0])).map(([date,count]) =>
        <BodyText key={date}>{formatDate(date,locale)} · {count}</BodyText>)}
    </PrayerPanel>}
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('goals.recent')}</BodyText>
    {context.data.history.length ? context.data.history.map(item => <ProgressCard key={item.period.start}
      item={item} t={t} locale={locale} />) : <EmptyState message={t('goals.emptyHistory')} />}
  </>;
}
