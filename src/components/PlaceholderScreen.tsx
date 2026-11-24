import { useTranslation } from 'react-i18next';
import { AppHeader, EmptyState, ScreenContainer } from './ui';

export function PlaceholderScreen({ feature }: { feature: 'tracker' | 'goals' | 'reports' }) {
  const { t } = useTranslation();
  return <ScreenContainer><AppHeader title={t(`tabs.${feature}`)} /><EmptyState message={t(`placeholder.${feature}`)} /></ScreenContainer>;
}
