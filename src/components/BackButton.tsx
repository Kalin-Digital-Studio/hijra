import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from './ui';

export function BackButton({ fallback }: { fallback: '/' | '/profile' | '/about' }) {
  const router = useRouter();
  const { t } = useTranslation();
  return <Button label={t('back')} onPress={() => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  }} />;
}
