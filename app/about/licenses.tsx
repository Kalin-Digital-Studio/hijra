import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../src/components/BackButton';
import { AppHeader, BodyText, Button, Card, EmptyState, ScreenContainer } from '../../src/components/ui';
import { licenseNotices } from '../../src/constants/licenseNotices';
import tanzilText from '../../assets/data/quran/tanzil-uthmani.json';

const quranNotice = [
  'Tanzil Quran Metadata v1.0',
  'Copyright (C) 2008-2009 Tanzil.info',
  'Source: https://tanzil.net/docs/Quran_Metadata',
  'Original XML: https://tanzil.net/res/text/metadata/quran-data.xml',
  'Creative Commons Attribution 3.0 Unported (CC BY 3.0)',
  'https://creativecommons.org/licenses/by/3.0/',
  'Hijra: XML to JSON and SQLite. Retains surah number, Latin name, Arabic name, and ayah count.',
].join('\n');

const textNotice = tanzilText.raw.split(/\r?\n/).filter((line) => line.startsWith('#')).join('\n');

const packages = Object.entries({
  ...licenseNotices,
  'Tanzil Quran Metadata': quranNotice,
  'Tanzil Quran Text (Uthmani v1.1)': textNotice,
});

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
