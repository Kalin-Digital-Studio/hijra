import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button, EmptyState, LoadingState, ScreenContainer } from '../src/components/ui';
import { BrandLogo } from '../src/components/BrandLogo';
import { databaseName } from '../src/constants/application';
import { initializeDatabase } from '../src/database/initialize';
import { readLocalProfile } from '../src/database/repositories/profile';
import { readSettings } from '../src/database/repositories/settings';
import { useTheme } from '../src/hooks/useTheme';
import i18n, { localizationReady } from '../src/services/i18n';
import { useProfile } from '../src/stores/profile';
import { useSettings } from '../src/stores/settings';
import { validDisplayName } from '../src/types/profile';

void SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [openFailed, setOpenFailed] = useState(false);
  const onOpenError = useCallback(() => setOpenFailed(true), []);
  return (
    <SafeAreaProvider>
      {openFailed ? <StartupFailure retry={() => setOpenFailed(false)} /> :
        <SQLiteProvider databaseName={databaseName} onError={onOpenError}>
          <Application />
        </SQLiteProvider>}
    </SafeAreaProvider>
  );
}

function StartupFailure({ retry, conflict }: { retry: () => void; conflict?: boolean }) {
  const { t } = useTranslation();
  useEffect(() => { SplashScreen.hide(); }, []);
  return (
    <ScreenContainer standalone>
      <EmptyState message={t(conflict ? 'personal.conflict' : 'loadError')} />
      <Button label={t('retry')} onPress={retry} />
    </ScreenContainer>
  );
}

function Application() {
  const db = useSQLiteContext();
  const { colors, isDark } = useTheme();
  const completed = useProfile((state) => state.completed);
  const conflict = useProfile((state) => state.conflict);
  const [recovering, setRecovering] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function boot() {
      try {
        await Promise.all([localizationReady, initializeDatabase(db)]);
        const [{ completed: savedCompletion, ...settings }, local] = await Promise.all([readSettings(db), readLocalProfile(db)]);
        if (!active) return;
        await i18n.changeLanguage(settings.language);
        if (!active) return;
        useSettings.setState(settings);
        setRecovering(savedCompletion || !!local.profile);
        useProfile.setState({ ...local, completed: savedCompletion && !!local.profile && validDisplayName(local.profile.displayName) });
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    }
    void boot();
    return () => { active = false; };
  }, [attempt, db]);

  useEffect(() => {
    if (status === 'ready') SplashScreen.hide();
  }, [status]);

  if (status === 'error' || (status === 'ready' && conflict)) {
    return <StartupFailure conflict={status === 'ready' && conflict} retry={() => {
      setStatus('loading');
      setAttempt((current) => current + 1);
    }} />;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {status === 'ready' ? (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Protected guard={completed}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="ibadah/[category]" />
            <Stack.Screen name="prayer/index" />
            <Stack.Screen name="prayer/history" />
            <Stack.Screen name="sunnah/index" />
            <Stack.Screen name="sunnah/history" />
            <Stack.Screen name="sunnah/manage" />
            <Stack.Screen name="quran/index" />
            <Stack.Screen name="dhikr/index" />
            <Stack.Screen name="dhikr/counter" />
            <Stack.Screen name="dhikr/history" />
            <Stack.Screen name="dhikr/manage" />
            <Stack.Screen name="islamic/schedule" />
            <Stack.Screen name="islamic/calendar" />
            <Stack.Screen name="islamic/qibla" />
            <Stack.Screen name="islamic/[resource]" />
            <Stack.Screen name="quran/reader" />
            <Stack.Screen name="quran/manual" />
            <Stack.Screen name="quran/history" />
            <Stack.Screen name="quran/bookmark" />
            <Stack.Screen name="about/index" />
            <Stack.Screen name="about/licenses" />
            <Stack.Screen name="settings/introduction" />
            <Stack.Screen name="settings/week-start" />
          </Stack.Protected>
          <Stack.Protected guard={!completed}>
            <Stack.Protected guard={!recovering}>
              <Stack.Screen name="welcome" />
            </Stack.Protected>
            <Stack.Screen name="setup-profile" options={{ gestureEnabled: false }} />
          </Stack.Protected>
        </Stack>
      ) : <ScreenContainer standalone><BrandLogo /><LoadingState /></ScreenContainer>}
    </>
  );
}
