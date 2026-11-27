import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../src/components/BackButton';
import { AppHeader, BodyText, Button, Card, EmptyState, ScreenContainer } from '../../src/components/ui';
import { licenseNotices } from '../../src/constants/licenseNotices';
import { dhikrNotice } from '../../src/constants/dhikrNotice';
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
  'Expo Location 58.0.23': "The MIT License (MIT)\n\nCopyright (c) 2015-present 650 Industries, Inc. (aka Expo)\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
  'Hadith API (Arabic Dhikr excerpts)': dhikrNotice,
  'Pickthall (1930) · English Quran meaning for Dhikr':
    'Marmaduke Pickthall, The Meaning of the Glorious Koran (1930), pp. 676–678. Public-domain original text. Scan: https://archive.org/details/in.ernet.dli.2015.216140/',
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
