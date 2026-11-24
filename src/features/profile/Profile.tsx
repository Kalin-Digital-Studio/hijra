import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader, Button, Card, EmptyState, ScreenContainer, SectionTitle } from '../../components/ui';
import { writeSetting } from '../../database/repositories/settings';
import { useSettings } from '../../stores/settings';
import { languages, themes, type Settings } from '../../types/settings';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const settings = useSettings();
  const saving = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    if (saving.current || settings[key] === value) return;
    saving.current = true;
    setBusy(true);
    setError(false);
    try {
      await writeSetting(db, key, value);
      if (key === 'language') await i18n.changeLanguage(value);
      useSettings.setState((previous) => ({ ...previous, [key]: value }));
    } catch {
      setError(true);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return (
    <ScreenContainer>
      <AppHeader title={t('tabs.profile')} />
      {error ? <EmptyState message={t('settings.saveError')} /> : null}
      <Card>
        <SectionTitle>{t('settings.language')}</SectionTitle>
        {languages.map((language) => <Button key={language} label={t(`settings.${language}`)} selected={settings.language === language} disabled={busy} onPress={() => void update('language', language)} />)}
      </Card>
      <Card>
        <SectionTitle>{t('settings.theme')}</SectionTitle>
        {themes.map((theme) => <Button key={theme} label={t(`settings.${theme}`)} selected={settings.theme === theme} disabled={busy} onPress={() => void update('theme', theme)} />)}
      </Card>
      <Button label={t('settings.about')} onPress={() => router.push('/about')} />
    </ScreenContainer>
  );
}
