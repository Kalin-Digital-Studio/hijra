import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button, EmptyState, LoadingState, ScreenContainer } from '../src/components/ui';
import { databaseName } from '../src/constants/application';
import { initializeDatabase } from '../src/database/initialize';
import { readSettings } from '../src/database/repositories/settings';
import { useTheme } from '../src/hooks/useTheme';
import i18n, { localizationReady } from '../src/services/i18n';
import { useSettings } from '../src/stores/settings';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName={databaseName}>
        <Application />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}

function Application() {
  const db = useSQLiteContext();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function boot() {
      try {
        await Promise.all([localizationReady, initializeDatabase(db)]);
        const settings = await readSettings(db);
        if (!active) return;
        await i18n.changeLanguage(settings.language);
        if (!active) return;
        useSettings.setState(settings);
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    }
    void boot();
    return () => { active = false; };
  }, [attempt, db]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {status === 'ready' ? (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      ) : (
        <ScreenContainer standalone>
          {status === 'loading' ? <LoadingState /> : <>
            <EmptyState message={t('loadError')} />
            <Button label={t('retry')} onPress={() => { setStatus('loading'); setAttempt(attempt + 1); }} />
          </>}
        </ScreenContainer>
      )}
    </>
  );
}
