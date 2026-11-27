import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { createDhikrDraft } from '../../database/repositories/dhikr';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { summarizeDhikr } from '../../services/dhikrRules';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { useDhikr } from './useDhikr';

export function TodayDhikrCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const today = useToday();
  const { db, user, data } = useDhikr(today);
  const busy = useRef(false);
  const [error, setError] = useState(false);

  async function openCounter() {
    if (!user || busy.current) return;
    busy.current = true;
    setError(false);
    try {
      const draft = await createDhikrDraft(db, user, today, 'free', false);
      router.push({ pathname: '/dhikr/counter', params: { id: draft.id } });
    } catch {
      setError(true);
    } finally {
      busy.current = false;
    }
  }
  const totals = data && summarizeDhikr(data.logs);
  return <PrayerPanel>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('dhikr.today')}</BodyText>
    {totals && <BodyText>{t('dhikr.repetitions', { value: totals.repetitions })} · {t('dhikr.stats', totals)}</BodyText>}
    {!!totals?.completedCollections && <BodyText>{t('dhikr.collectionTotals', totals)}</BodyText>}
    <PrayerAction label={t('dhikr.title')} onPress={() => router.push('/dhikr')} />
    <PrayerAction label={t('dhikr.catalog.free')} disabled={!user} onPress={() => void openCounter()} />
    {error && <BodyText accessibilityLiveRegion="polite">{t('dhikr.error')}</BodyText>}
    {data?.drafts[0] && <PrayerAction label={t('dhikr.resume')}
      onPress={() => router.push({ pathname: '/dhikr/counter', params: { id: data.drafts[0].id } })} />}
  </PrayerPanel>;
}
