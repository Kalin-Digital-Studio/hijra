import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BodyText, Button, ScreenContainer } from '../../components/ui';
import { categoryIds } from '../../database/seeds/master';
import { prayerStyles } from '../prayer/PrayerUI';

export default function Tracker() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenContainer compact>
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('tabs.tracker')}</BodyText>
      {categoryIds.map((category) => <Button key={category} label={t(`categories.${category}`)} onPress={() => {
        if (category === 'prayer') router.push('/prayer');
        else if (category === 'sunnah') router.push('/sunnah');
        else if (category === 'quran') router.push('/quran');
        else router.push({ pathname: '/ibadah/[category]', params: { category } });
      }} />)}
    </ScreenContainer>
  );
}
