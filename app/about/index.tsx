import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../src/components/BackButton';
import { AppHeader, BodyText, Button, Card, ScreenContainer } from '../../src/components/ui';
import { brandTagline, developerName, productName } from '../../src/constants/application';

export default function About() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenContainer standalone>
      <BackButton fallback="/profile" />
      <AppHeader title={t('settings.about')} />
      <Card><BodyText>{productName}</BodyText><BodyText>{brandTagline}</BodyText><BodyText>{developerName}</BodyText><BodyText>{t('version', { version: Constants.expoConfig?.version ?? '1.0.0' })}</BodyText></Card>
      <Button label={t('settings.licenses')} onPress={() => router.push('/about/licenses')} />
    </ScreenContainer>
  );
}
