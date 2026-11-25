import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input, LoadingState } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { searchSurahs, summarizeReading, type Catalog, type Position, type Session } from '../../services/quranRules';
import { light, space } from '../../theme/tokens';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';

export function QuranStatus({ failed, retry }: { failed: boolean; retry: () => void }) {
  const { t } = useTranslation();
  return failed ? <><EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={retry} /></> : <LoadingState />;
}

export function QuranSummary({ catalog, sessions, title, weekly }: { catalog: Catalog; sessions: Session[]; title: string; weekly?: boolean }) {
  const { t, i18n } = useTranslation();
  const totals = summarizeReading(catalog, sessions);
  const number = new Intl.NumberFormat(i18n.resolvedLanguage);
  return <PrayerPanel style={{ backgroundColor: light.primary, borderColor: light.primary }}>
    <BodyText style={prayerStyles.onGreen}>{title}</BodyText>
    <BodyText style={[prayerStyles.onGreen, prayerStyles.big]}>{t('quran.ayat', { value: number.format(totals.ayat) })}</BodyText>
    <BodyText style={prayerStyles.onGreen}>{t('quran.sessionsCount', { value: number.format(totals.sessions) })}</BodyText>
    {weekly && <BodyText style={prayerStyles.onGreen}>{t('quran.days', { value: number.format(totals.activeDays) })}</BodyText>}
    <BodyText style={prayerStyles.onGreen}>{totals.recordedMinutes === null ? t('quran.noDuration') :
      t('quran.recordedMinutes', { value: number.format(totals.recordedMinutes) })}</BodyText>
    {weekly && totals.sessions > 0 && <BodyText style={prayerStyles.onGreen}>{t('quran.durationCoverage', {
      with: number.format(totals.withDuration), without: number.format(totals.withoutDuration) })}</BodyText>}
  </PrayerPanel>;
}

export function SurahField({ catalog, value, label, change }: { catalog: Catalog; value: number; label: string; change: (number: number) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const selected = catalog.get(value);
  return <View style={styles.fields}>
    <BodyText style={prayerStyles.small}>{label}</BodyText>
    <PrayerAction label={selected?.latin ?? t('quran.chooseSurah')} onPress={() => { setQuery(''); setOpen(true); }} />
    <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
      <SafeAreaView style={[styles.picker, { backgroundColor: colors.background }]}>
        <View style={prayerStyles.line}>
          <BodyText accessibilityRole="header" style={prayerStyles.title}>{label}</BodyText>
          <PrayerAction label={t('back')} onPress={() => setOpen(false)} />
        </View>
        <Input value={query} onChangeText={setQuery} accessibilityLabel={t('quran.search')} placeholder={t('quran.search')} autoCorrect={false} />
        <FlatList keyboardShouldPersistTaps="handled" data={open ? searchSurahs(catalog, query) : []}
          keyExtractor={(item) => String(item.number)}
          ListEmptyComponent={<EmptyState message={t('quran.noSurahs')} />}
          renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityState={{ selected: item.number === value }}
            onPress={() => { change(item.number); setOpen(false); }}
            style={[styles.option, { borderBottomColor: colors.border }]}>
            <View style={styles.flex}>
              <BodyText style={prayerStyles.section}>{item.number}. {item.latin}</BodyText>
              <BodyText style={prayerStyles.small}>{t('quran.ayat', { value: item.verses })}</BodyText>
            </View>
            {item.arabic && <BodyText style={styles.arabic}>{item.arabic}</BodyText>}
          </Pressable>} />
      </SafeAreaView>
    </Modal>
  </View>;
}

export function AyahField({ label, value, limit, change }: { label: string; value: string; limit?: number; change: (value: string) => void }) {
  return <View style={styles.fields}>
    <BodyText style={prayerStyles.small}>{label}{limit ? ` · 1–${limit}` : ''}</BodyText>
    <Input accessibilityLabel={label} keyboardType="number-pad" value={value} onChangeText={change} maxLength={8} />
  </View>;
}

export function positionLabel(catalog: Catalog, position: Position) {
  return `${catalog.get(position.surah)?.latin ?? position.surah} ${position.ayah}`;
}

const styles = StyleSheet.create({
  fields: { gap: space.xs },
  picker: { flex: 1, gap: space.sm, padding: space.md },
  option: { minHeight: 58, paddingVertical: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  flex: { flex: 1 },
  arabic: { fontSize: 21, lineHeight: 33, writingDirection: 'rtl' },
});
