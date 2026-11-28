import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, Input } from '../../components/ui';
import { changeGoal, createGoals, DuplicateGoalError, type GoalSnapshot } from '../../database/repositories/goals';
import { definition, filters, goalMetrics, maximum, validateGoal, type Cadence, type Category, type Config } from '../../services/goalRules';
import { newReadingSessionId } from '../../services/quranRules';
import { invalidateGoals } from '../../stores/goalRevision';
import { PrayerAction, PrayerModal, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { activityLabel, CadencePicker, goalActivity, goalCategories } from './GoalUI';
import { templates } from './goalTemplates';
import type { useGoals } from './useGoals';

export type GoalContext = ReturnType<typeof useGoals> & {data:NonNullable<ReturnType<typeof useGoals>['data']>};
function useSaveGoal(context: GoalContext) {
  const router = useRouter();
  const {t} = useTranslation();
  const lock = useRef(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState(false);
  async function run(work: (allow: boolean) => Promise<void>, allow = false) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await work(allow);
      invalidateGoals();
      if (router.canGoBack()) router.back();
      else router.replace('/goals');
    } catch (cause) {
      if (cause instanceof DuplicateGoalError) Alert.alert(t('goals.duplicate'),t('goals.duplicateBody'),[
        {text:t('quran.cancel'),style:'cancel'}, {text:t('goals.duplicateConfirm'),onPress:() => void run(work,true)},
      ]);
      else setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function save(entries: {id:string;config:Config}[], editing?: GoalSnapshot) {
    const {db,user,today,week} = context;
    if (!user) return;
    void run(allow => editing ? changeGoal(db,user,editing.version.goalId,{action:'edit',config:entries[0].config},today,week) :
      createGoals(db,user,entries,today,week,allow));
  }
  return {busy,error,save};
}
function parsedAmount(value: string) {
  return /^\d+$/.test(value.trim()) ? Number(value) : 0;
}
export function GoalEditor({context,editing}: {context:GoalContext;editing?:GoalSnapshot}) {
  const {t} = useTranslation();
  const router = useRouter();
  const current = editing?.pending?.state === 'ACTIVE' ? editing.pending : editing?.version;
  const [category,setCategory] = useState<Category>(current?.category ?? 'QURAN');
  const [metric,setMetric] = useState<string>(current?.metric ?? 'AYAH_COUNT');
  const [filter,setFilter] = useState(current?.filter ?? 'all');
  const [cadence,setCadence] = useState<Cadence>(current?.cadence ?? 'DAILY');
  const [name,setName] = useState(current?.name ?? '');
  const [amount,setAmount] = useState(current ? String(current.target) : '');
  const [picker,setPicker] = useState(false);
  const [id] = useState(newReadingSessionId);
  const {busy,error,save} = useSaveGoal(context);
  const options = context.data.options;
  const metricDef = definition(category,metric)!;
  const choices = filters(metricDef.filter,options).filter(item => !item.archived || item.id === current?.filter);
  const max = maximum(cadence,metricDef.capacity);
  const activity = choices.find(item => item.id === filter);
  const config = {category,metric,filter,cadence,target:parsedAmount(amount),
    name:name.trim() || (activity && filter !== 'all' ? activityLabel(t,activity.label) : t('goals.categories.'+category))} as Config;
  const valid = validateGoal(config,options,current?.filter);
  function choose(nextCategory: Category,nextMetric: string) {
    const kind = definition(nextCategory,nextMetric)!.filter;
    const possible = filters(kind,options).filter(item => !item.archived || item.id === current?.filter);
    setCategory(nextCategory);
    setMetric(nextMetric);
    setFilter(possible.some(item => item.id === filter) ? filter : possible[0]?.id ?? '');
  }
  return <>
    <BodyText>{t('goals.existing')}</BodyText>
    {!editing && <PrayerPanel>
      <BodyText style={prayerStyles.section}>{t('goals.category')}</BodyText>
      <View style={prayerStyles.wrap}>{goalCategories.map(item => <PrayerAction key={item}
        label={t('goals.categories.'+item)} selected={item===category}
        onPress={() => choose(item,Object.keys(goalMetrics[item])[0])} />)}</View>
    </PrayerPanel>}
    <PrayerPanel>
      <BodyText style={prayerStyles.section}>{t('goals.metric')}</BodyText>
      <View style={prayerStyles.wrap}>{Object.keys(goalMetrics[category]).map(item => <PrayerAction key={item}
        label={t('goals.metrics.'+item)} selected={item===metric} onPress={() => choose(category,item)} />)}</View>
      {metricDef.filter !== 'none' && <>
        <BodyText style={prayerStyles.section}>{t('goals.activity')}</BodyText>
        <PrayerAction label={activity ? activityLabel(t,activity.label) : t('goals.activity')} onPress={() => setPicker(true)} />
      </>}
    </PrayerPanel>
    <PrayerPanel>
      <Input value={name} onChangeText={setName} maxLength={80} placeholder={t('goals.name')} accessibilityLabel={t('goals.name')} />
      <BodyText style={prayerStyles.section}>{t('goals.period')}</BodyText>
      <CadencePicker t={t} value={cadence} onChange={setCadence} />
      <Input value={amount} onChangeText={setAmount} keyboardType="number-pad" maxLength={7}
        placeholder={t('goals.amount')} accessibilityLabel={t('goals.amount')} />
      <BodyText style={prayerStyles.small}>{t('goals.maximum',{max})}</BodyText>
    </PrayerPanel>
    {valid && <PrayerPanel>
      <BodyText style={prayerStyles.section}>{t('goals.preview')}</BodyText>
      <BodyText>{config.name}</BodyText>
      <BodyText>{config.target} {t('goals.units.'+metricDef.unit,{count:config.target})} · {t('goals.cadence.'+cadence)}</BodyText>
    </PrayerPanel>}
    {error && <BodyText accessibilityLiveRegion="polite">{t('goals.error')}</BodyText>}
    <PrayerAction emphasis="primary" label={t('quran.save')} disabled={!valid || busy} onPress={() => save([{id,config}],editing)} />
    <PrayerAction label={t('quran.cancel')} disabled={busy} onPress={() => router.canGoBack() ? router.back() : router.replace('/goals')} />
    {picker && <PrayerModal dismiss={() => setPicker(false)}>
      <BodyText style={prayerStyles.section}>{t('goals.activity')}</BodyText>
      <ScrollView style={{maxHeight:360}} contentContainerStyle={{gap:8}}>
        {choices.map(item => <PrayerAction key={item.id} label={activityLabel(t,item.label)} selected={item.id===filter}
          onPress={() => {setFilter(item.id);setPicker(false);}} />)}
      </ScrollView>
      <PrayerAction label={t('quran.cancel')} onPress={() => setPicker(false)} />
    </PrayerModal>}
  </>;
}
type TemplateKey = keyof typeof templates;
export function GoalTemplates({context}: {context:GoalContext}) {
  const {t} = useTranslation();
  const router = useRouter();
  const [group,setGroup] = useState<TemplateKey>('start');
  const [selected,setSelected] = useState<Record<number,{id:string;amount:string;cadence:Cadence}>>({});
  const [review,setReview] = useState(false);
  const {busy,error,save} = useSaveGoal(context);
  const rows = templates[group].map(seed => {
    const snapshot = {...seed,name:''} as Config;
    const activity = goalActivity(t,snapshot,context.data.options);
    return {...snapshot,name:seed.filter==='all' ? t('goals.metrics.'+seed.metric) : activity};
  });
  const choices = rows.map((config,index) => ({config,index})).filter(({config}) => validateGoal(config,context.data.options));
  const entries = choices.flatMap(({config,index}) => {
    const row = selected[index];
    return row ? [{id:row.id,config:{...config,target:parsedAmount(row.amount),cadence:row.cadence} as Config}] : [];
  });
  const valid = entries.length > 0 && entries.every(({config}) => validateGoal(config,context.data.options));
  function select(index: number, checked: boolean) {
    const initial = {id:newReadingSessionId(),amount:String(rows[index].target),cadence:rows[index].cadence};
    setSelected(old => {
      const next = {...old};
      if (checked) next[index] ??= initial;
      else delete next[index];
      return next;
    });
  }
  return <>
    <BodyText>{t('goals.goalTemplateHelp')}</BodyText>
    <View style={prayerStyles.wrap}>{(Object.keys(templates) as TemplateKey[]).map(item => <PrayerAction key={item}
      selected={group===item} label={t('goals.'+item)} disabled={busy}
      onPress={() => {setGroup(item);setSelected({});setReview(false);}} />)}</View>
    {!review && <Checkbox label={t('goals.selectGroup')} checked={choices.length>0 && entries.length===choices.length}
      onChange={checked => choices.forEach(({index}) => select(index,checked))} />}
    {review && <BodyText style={prayerStyles.section}>{t('goals.review')}</BodyText>}
    {choices.map(({config,index}) => {
      const row = selected[index];
      if (review && !row) return null;
      const max = maximum(row?.cadence ?? config.cadence, definition(config.category,config.metric)?.capacity);
      const amount = parsedAmount(row?.amount ?? String(config.target));
      return <PrayerPanel key={index}>
        <BodyText style={prayerStyles.small}>{t('goals.categories.'+config.category)} · {t('goals.metrics.'+config.metric)}</BodyText>
        {review ? <BodyText style={prayerStyles.section}>{config.name}</BodyText> :
          <Checkbox label={config.name} checked={!!row} onChange={checked => select(index,checked)} />}
        <BodyText>{amount} {t('goals.units.'+definition(config.category,config.metric)?.unit,{count:amount})} · {t('goals.cadence.'+(row?.cadence ?? config.cadence))}</BodyText>
        {row && !review && <>
          <CadencePicker t={t} value={row.cadence}
            onChange={cadence => setSelected(old => ({...old,[index]:{...row,cadence}}))} />
          <Input value={row.amount} onChangeText={amount => setSelected(old => ({...old,[index]:{...row,amount}}))}
            keyboardType="number-pad" maxLength={7} accessibilityLabel={t('goals.amount') + ' · ' + config.name} />
          <BodyText style={prayerStyles.small}>{t('goals.maximum',{max})}</BodyText>
        </>}
      </PrayerPanel>;
    })}
    <BodyText>{t('goals.selected',{count:entries.length})}</BodyText>
    {error && <BodyText accessibilityLiveRegion="polite">{t('goals.error')}</BodyText>}
    <PrayerAction emphasis="primary" label={t(review ? 'goals.saveGroup' : 'goals.review')} disabled={!valid || busy}
      onPress={() => review ? save(entries) : setReview(true)} />
    <PrayerAction label={t(review ? 'back' : 'quran.cancel')} disabled={busy}
      onPress={() => review ? setReview(false) : router.canGoBack() ? router.back() : router.replace('/goals')} />
  </>;
}
