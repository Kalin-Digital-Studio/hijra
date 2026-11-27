import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { createDhikrDraft } from '../../database/repositories/dhikr';
import { parseLocalDate } from '../../utils/localDate';
import { PrayerDatePicker } from '../prayer/PrayerDatePicker';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { draftTitle, DhikrLoad, DhikrScreen, DhikrSummary } from './DhikrUI';
import { refreshDhikr, useDhikr } from './useDhikr';

const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export default function DhikrHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const today = useToday();
  const params = useLocalSearchParams<{ date?: string; prayer?: string }>();
  const routePrayer = prayers.find((id) => id === params.prayer);
  const initialDate = typeof params.date === 'string' && parseLocalDate(params.date) && params.date <= today ? params.date : today;
  const [selected, setSelected] = useState<string>();
  const [context, setContext] = useState<string | null>(routePrayer ?? null);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const date = selected ?? initialDate;
  const { db, user, data } = useDhikr(today);

  async function open(id: string, collection: boolean) {
    if (!user || busy) return;
    setBusy(true);
    setError(false);
    try {
      const draft = await createDhikrDraft(db, user, date, id, collection, id.startsWith('post-') ? context : null);
      refreshDhikr();
      router.push({ pathname: '/dhikr/counter', params: { id: draft.id } });
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return <DhikrScreen title={t('dhikr.title')}>
    {!data ? <DhikrLoad failed={data === null} /> : <>
      <DhikrSummary logs={data.logs} />
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('dhikr.history')} onPress={() => router.push('/dhikr/history')} />
        <PrayerAction label={t('dhikr.manage')} onPress={() => router.push('/dhikr/manage')} />
      </View>
      <PrayerAction label={t('dhikr.recordDate', { date })} onPress={() => setPicking(true)} />
      {error && <BodyText accessibilityLiveRegion="polite">{t('dhikr.error')}</BodyText>}
      {!!data.drafts.length && <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('dhikr.resume')}</BodyText>
        {data.drafts.map((draft) => <PrayerAction key={draft.id} label={`${draftTitle(t, draft)} · ${draft.date}`}
          onPress={() => router.push({ pathname: '/dhikr/counter', params: { id: draft.id } })} />)}
      </PrayerPanel>}
      <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('dhikr.collections')}</BodyText>
        <BodyText>{t('dhikr.collectionInfo')}</BodyText>
        {['morning','evening'].map((id) => <PrayerAction key={id} disabled={busy} label={t(`dhikr.catalog.${id}`)} onPress={() => void open(id, true)} />)}
      </PrayerPanel>
      <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('dhikr.post')}</BodyText>
        <View style={prayerStyles.wrap}>
          <PrayerAction label={t('dhikr.general')} selected={!context} onPress={() => setContext(null)} />
          {prayers.map((id) => <PrayerAction key={id} label={t(`types.${id}`)} selected={context === id} onPress={() => setContext(id)} />)}
        </View>
        {['post-591','post-34','post-33'].map((id) => <PrayerAction key={id} disabled={busy} label={t(`dhikr.catalog.${id}`)} onPress={() => void open(id, true)} />)}
      </PrayerPanel>
      <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('dhikr.daily')}</BodyText>
        {data.items.filter((item) => !item.archived && !item.owner && item.id !== 'closing' && !item.id.startsWith('guided-')).map((item) =>
          <PrayerAction key={item.id} label={item.owner ? item.label : t(item.label)} disabled={busy} onPress={() => void open(item.id, false)} />)}
      </PrayerPanel>
      <PrayerPanel>
        <BodyText style={prayerStyles.section}>{t('dhikr.personal')}</BodyText>
        {data.items.filter((item) => !item.archived && !!item.owner).map((item) =>
          <PrayerAction key={item.id} label={item.label} disabled={busy} onPress={() => void open(item.id, false)} />)}
        <PrayerAction label={t('dhikr.manage')} onPress={() => router.push('/dhikr/manage')} />
      </PrayerPanel>
    </>}
    {picking && <PrayerDatePicker date={date} today={today} choose={(day) => { setSelected(day); setPicking(false); }} dismiss={() => setPicking(false)} />}
  </DhikrScreen>;
}
