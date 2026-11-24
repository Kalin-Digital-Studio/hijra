import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../src/components/BackButton';
import { AppHeader, BodyText, Button, Card, EmptyState, ScreenContainer } from '../../src/components/ui';
import { licenseNotices } from '../../src/constants/licenseNotices';

const packages = Object.entries(licenseNotices);

export default function Licenses() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>();
  return (
    <ScreenContainer standalone>
      <BackButton fallback="/about" />
      <AppHeader title={t('settings.licenses')} />
      {packages.length ? packages.map(([name, notice]) => (
        <Card key={name}>
          <Button label={name} selected={selected === name} onPress={() => setSelected(selected === name ? undefined : name)} />
          {selected === name ? <BodyText selectable>{notice}</BodyText> : null}
        </Card>
      )) : <EmptyState message={t('licensesPending')} />}
    </ScreenContainer>
  );
}
