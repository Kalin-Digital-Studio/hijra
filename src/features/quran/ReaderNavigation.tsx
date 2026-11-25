import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { nextPosition, type Catalog, type Position } from '../../services/quranRules';
import { PrayerAction } from '../prayer/PrayerUI';

export function ContinueReader({ catalog, bookmark }: { catalog: Catalog; bookmark: Position | null }) {
  const { t } = useTranslation();
  const router = useRouter();
  const next = bookmark && nextPosition(catalog, bookmark);
  const open = ({ surah, ayah }: Position) => router.push({
    pathname: '/quran/reader', params: { surah: String(surah), ayah: String(ayah) },
  });
  if (!next) return null;
  if (next === 'restart') return <PrayerAction label={t('quran.restart')} onPress={() =>
    Alert.alert(t('quran.restart'), t('quran.confirmRestart'), [
      { text: t('quran.cancel'), style: 'cancel' },
      { text: t('quran.restart'), onPress: () => open({ surah: 1, ayah: 1 }) },
    ])} />;
  return <PrayerAction label={t('quran.readContinue')} onPress={() => open(next)} />;
}
