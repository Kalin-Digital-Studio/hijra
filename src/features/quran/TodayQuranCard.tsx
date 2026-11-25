import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { summarizeReading } from '../../services/quranRules';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { positionLabel } from './QuranUI';
import { useQuran } from './useQuran';
import { ContinueReader } from './ReaderNavigation';

export function TodayQuranCard() {
  const { data } = useQuran(useToday());
  const { t } = useTranslation();
  const router = useRouter();
  const ready = data?.catalog.size === 114;
  const totals = ready ? summarizeReading(data.catalog, data.sessions) : null;
  return <PrayerPanel>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.today')}</BodyText>
    {totals && ready && <>
      <BodyText>{t('quran.ayat', { value: totals.ayat })} · {t('quran.sessionsCount', { value: totals.sessions })}</BodyText>
      {data.bookmark && <BodyText>{t('quran.dashboardPosition', { position: positionLabel(data.catalog, data.bookmark) })}</BodyText>}
      <ContinueReader catalog={data.catalog} bookmark={data.bookmark} />
    </>}
    <PrayerAction label={t('quran.title')} onPress={() => router.push('/quran')} />
  </PrayerPanel>;
}
