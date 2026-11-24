import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../src/components/BackButton';
import { AppHeader, BodyText, Button, Card, EmptyState, LoadingState, ScreenContainer } from '../../src/components/ui';
import { readTypes } from '../../src/database/repositories/master';
import { categoryIds } from '../../src/database/seeds/master';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const selected = categoryIds.find((id) => id === category);
  const db = useSQLiteContext();
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ category: string; rows: { id: string }[] | null }>();
  useEffect(() => {
    if (!selected) return;
    let active = true;
    void readTypes(db, selected).then(
      (rows) => { if (active) setResult({ category: selected, rows }); },
      () => { if (active) setResult({ category: selected, rows: null }); },
    );
    return () => { active = false; };
  }, [attempt, db, selected]);

  return (
    <ScreenContainer standalone>
      <BackButton fallback="/" />
      {selected ? <AppHeader title={t(`categories.${selected}`)} /> : null}
      {!selected ? <EmptyState message={t('loadError')} /> :
        !result || result.category !== selected ? <LoadingState /> :
        result.rows ? <Card>{result.rows.map(({ id }) => <BodyText key={id}>{t(`types.${id}`)}</BodyText>)}</Card> :
        <><EmptyState message={t('loadError')} /><Button label={t('retry')} onPress={() => { setResult(undefined); setAttempt(attempt + 1); }} /></>}
    </ScreenContainer>
  );
}
