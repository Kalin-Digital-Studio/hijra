import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, EmptyState, SectionTitle } from '../../components/ui';
import { writeSetting } from '../../database/repositories/settings';
import { useSettings } from '../../stores/settings';
import { languages, themes, weekdays, type Language, type Settings } from '../../types/settings';

const options: { [K in keyof Settings]: readonly Settings[K][] } = {
  language: languages, theme: themes, week_start: weekdays,
};
const headings = { language: 'settings.language', theme: 'settings.theme', week_start: 'personal.weekStart' } as const;

export function PreferenceOptions<K extends keyof Settings>({ field, value, onChange, disabled, language }: {
  field: K; value: Settings[K]; onChange: (value: Settings[K]) => void; disabled?: boolean; language?: Language;
}) {
  const { t } = useTranslation(undefined, { lng: language });
  const heading: string = headings[field];
  return (
    <Card>
      <SectionTitle>{t(heading)}</SectionTitle>
      {options[field].map((choice) => {
        const label: string = field === 'week_start' ? `weekdays.${choice}` : `settings.${choice}`;
        return <Button key={choice} label={t(label)} selected={choice === value} disabled={disabled} onPress={() => onChange(choice)} />;
      })}
    </Card>
  );
}

export function SavedPreference<K extends keyof Settings>({ field }: { field: K }) {
  const db = useSQLiteContext();
  const value = useSettings((state) => state[field]);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const { t, i18n } = useTranslation();
  async function update(next: Settings[K]) {
    if (lock.current || value === next) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await writeSetting(db, field, next);
      if (field === 'language') await i18n.changeLanguage(next);
      useSettings.setState((previous) => ({ ...previous, [field]: next }));
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      {error && <EmptyState message={t('settings.saveError')} />}
      <PreferenceOptions field={field} value={value} onChange={(next) => void update(next)} disabled={busy} />
    </>
  );
}
