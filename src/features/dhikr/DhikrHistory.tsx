import { useLocalSearchParams,useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input, ProgressBar } from '../../components/ui';
import { deleteDhikrLog, editDhikrLog } from '../../database/repositories/dhikr';
import { maxCount, summarizeDhikr, type DhikrLog } from '../../services/dhikrRules';
import { useSettings } from '../../stores/settings';
import { addDays, parseLocalDate, weekDates } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { DhikrLoad, DhikrScreen, DhikrSummary } from './DhikrUI';
import { refreshDhikr, useDhikr } from './useDhikr';

export default function DhikrHistory() {
  const { t } = useTranslation();
  const router = useRouter();
  const today = useToday();
  const {date:initialDate}=useLocalSearchParams<{date?:string}>();
  const weekStart = useSettings((state) => state.week_start);
  const [anchor, setAnchor] = useState<string|undefined>(()=>
    typeof initialDate==='string'&&parseLocalDate(initialDate)&&initialDate<=today?initialDate:undefined);
  const [editing, setEditing] = useState<DhikrLog>();
  const [count, setCount] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const days = weekDates(anchor ?? today, weekStart);
  const first = days[0], last = days[6];
  const { db, user, data } = useDhikr(first, last < today ? last : today);
  const byActivity = new Map<string, { label: string; repetitions: number }>();
  for (const entry of data?.logs ?? []) {
    const activity = byActivity.get(entry.itemId) ?? { label: entry.label, repetitions: 0 };
    activity.repetitions += entry.count;
    byActivity.set(entry.itemId, activity);
  }
  const collectionCounts = ['morning', 'evening', 'post'].map((category) => ({
    category,
    count: new Set(data?.logs.filter((entry) => entry.status === 'COMPLETE' &&
      (category === 'post' ? entry.collection?.startsWith('post-') : entry.collection === category))
      .map((entry) => entry.collectionSession)).size,
  }));
  const maximum = Math.max(1, ...days.map((day) => summarizeDhikr(data?.logs.filter((log) => log.date === day) ?? []).repetitions));

  async function run(work: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      await work();
      setEditing(undefined);
      refreshDhikr();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return <DhikrScreen title={t('dhikr.history')}>
    <View style={prayerStyles.wrap}>
      <PrayerAction icon="back" label={t('prayer.previous')} disabled={first <= '0001-01-07'} onPress={() => setAnchor(addDays(first, -7))} />
      <BodyText>{first} – {last}</BodyText>
      <PrayerAction icon="next" label={t('prayer.next')} disabled={last >= today} onPress={() => setAnchor(addDays(first, 7))} />
    </View>
    <PrayerAction label={t('prayer.thisWeek')} onPress={() => setAnchor(undefined)} />
    <PrayerAction label={t('dhikr.manual')} onPress={() => router.push({ pathname: '/dhikr', params: { date: first } })} />
    {error && <BodyText accessibilityLiveRegion="polite">{t('dhikr.error')}</BodyText>}
    {!data || !user ? <DhikrLoad failed={data === null} /> : <>
      <DhikrSummary logs={data.logs} weekly />
      <PrayerPanel>
        {days.filter((day) => day <= today).map((day) => {
          const total = summarizeDhikr(data.logs.filter((entry) => entry.date === day));
          return <View key={day}>
            <BodyText>{day} · {t('dhikr.repetitions', { value: total.repetitions })}</BodyText>
            <ProgressBar label={day} value={total.repetitions / maximum * 100} />
          </View>;
        })}
      </PrayerPanel>
      {!!data.logs.length && <PrayerPanel>
        {collectionCounts.map(({ category, count }) => <BodyText key={category}>
          {t(category === 'post' ? 'dhikr.post' : `dhikr.catalog.${category}`)} · {count}
        </BodyText>)}
        {[...byActivity].map(([id, activity]) => <BodyText key={id}>
          {t(activity.label)} · {t('dhikr.repetitions', { value: activity.repetitions })}
        </BodyText>)}
      </PrayerPanel>}
      {!data.logs.length && <EmptyState message={t('dhikr.empty')} />}
      {editing && <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('dhikr.edit')}</BodyText>
        <Input accessibilityLabel={t('dhikr.date')} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" maxLength={10} />
        {editing.mode === 'COUNTER' && <Input accessibilityLabel={t('dhikr.actualCount')} value={count} onChangeText={setCount}
          maxLength={6} keyboardType="number-pad" />}
        <PrayerAction emphasis="primary" label={t('dhikr.save')} disabled={busy || !parseLocalDate(date) || date > today ||
          (editing.mode === 'COUNTER' && (!/^\d+$/.test(count) || Number(count) < 1 || Number(count) > maxCount))}
          onPress={() => void run(() => editDhikrLog(db, user, editing.id, date, Number(count)))} />
        <PrayerAction label={t('quran.cancel')} onPress={() => setEditing(undefined)} />
      </PrayerPanel>}
      {data.logs.map((entry) => <PrayerPanel key={entry.id}>
        <BodyText>{t(entry.label)} · {entry.date}</BodyText>
        {entry.status && <BodyText>{t(`dhikr.catalog.${entry.collection}`)} · {t(`dhikr.${entry.status}`)}
          {entry.context ? ` · ${t(`types.${entry.context}`)}` : ''}</BodyText>}
        <BodyText>{entry.mode === 'COUNTER' ? t('dhikr.repetitions', { value: entry.count }) : t('dhikr.checked')}</BodyText>
        {!entry.collectionSession && <PrayerAction label={t('dhikr.edit')} onPress={() => {
          setEditing(entry); setDate(entry.date); setCount(String(entry.count));
        }} />}
        {(!entry.collectionSession || data.logs.find((item) => item.collectionSession === entry.collectionSession)?.id === entry.id) &&
          <PrayerAction label={t(entry.collectionSession ? 'dhikr.deleteCollection' : 'dhikr.delete')} emphasis="danger" disabled={busy}
            onPress={() => Alert.alert(t('dhikr.delete'), t('dhikr.deleteHint'), [
              { text: t('quran.cancel'), style: 'cancel' },
              { text: t('dhikr.delete'), style: 'destructive', onPress: () =>
                void run(() => deleteDhikrLog(db, user, entry.collectionSession ?? entry.id, !!entry.collectionSession)) },
            ])} />}
      </PrayerPanel>)}
    </>}
  </DhikrScreen>;
}
