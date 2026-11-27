import type { PropsWithChildren } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { canPreviewMyQuran, IslamicError } from '../../services/islamic/client';
import { PrayerAction, prayerStyles } from '../prayer/PrayerUI';

export function IslamicScreen({title,children,onBack}: PropsWithChildren<{title:string;onBack?:()=>void}>) {
  const {t}=useTranslation();
  const router=useRouter();
  return <ScreenContainer standalone compact keyboard>
    <View style={prayerStyles.wrap}>
      <PrayerAction icon="back" label={t('back')} onPress={onBack ?? (() => router.canGoBack()?router.back():router.replace('/tracker'))} />
      <BodyText accessibilityRole="header" style={prayerStyles.title}>{title}</BodyText>
    </View>
    {children}
  </ScreenContainer>;
}
export function RemoteState({error,retry}: {error?:Error;retry:()=>void}) {
  const {t}=useTranslation();
  if (!canPreviewMyQuran) return <EmptyState message={t('hub.blocked')} />;
  if (!error) return <LoadingState />;
  const reason = error instanceof IslamicError && error.status===429 ? 'limited' : 'remoteError';
  return <><EmptyState message={t('hub.'+reason)} /><PrayerAction label={t('retry')} onPress={retry} /></>;
}
