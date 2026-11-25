import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { localDate, parseLocalDate } from '../../utils/localDate';
import { PrayerAction, PrayerModal, prayerStyles } from './PrayerUI';

export function PrayerDatePicker({ date, today, choose, dismiss }: {
  date: string; today: string; choose: (date: string) => void; dismiss: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [month, setMonth] = useState(() => parseLocalDate(date)!);
  const anchor = new Date(month);
  anchor.setDate(1);
  const after = new Date(anchor);
  after.setMonth(after.getMonth() + 1);
  const last = new Date(after);
  last.setDate(0);
  const label = new Intl.DateTimeFormat(i18n.resolvedLanguage, { month: 'long', year: 'numeric' }).format(anchor);
  const firstColumn = (anchor.getDay() + 6) % 7;
  function move(offset: number) {
    const target = new Date(anchor);
    target.setMonth(target.getMonth() + offset);
    setMonth(target);
  }
  return (
    <PrayerModal dismiss={dismiss}>
      <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('prayer.pickDate')}</BodyText>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('prayer.previous')} onPress={() => move(-1)} disabled={localDate(anchor) === '0001-01-01'} />
        <BodyText style={prayerStyles.small}>{label}</BodyText>
        <PrayerAction icon="next" label={t('prayer.next')} onPress={() => move(1)} disabled={localDate(after) > today} />
      </View>
      <ScrollView horizontal>
      <View style={styles.days}>
        {Array.from({ length: firstColumn + last.getDate() }, (_, index) => {
          const day = index - firstColumn + 1;
          const candidate = new Date(anchor);
          candidate.setDate(day);
          const code = localDate(candidate);
          return <View key={index} style={styles.cell}>
            {day > 0 && <PrayerAction label={String(day)} selected={code === date} disabled={code > today} onPress={() => choose(code)} />}
          </View>;
        })}
      </View>
      </ScrollView>
      <PrayerAction label={t('prayer.cancel')} onPress={dismiss} />
    </PrayerModal>
  );
}
const styles = StyleSheet.create({
  days: { width: 336, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 48, minHeight: 48 },
});
