import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { searchSurahs } from '../../services/quranRules';
import { space } from '../../theme/tokens';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { QuranStatus, QuranSummary, positionLabel } from './QuranUI';
import { ContinueReader } from './ReaderNavigation';
import { refreshQuran, useQuran } from './useQuran';

export default function QuranHome() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data } = useQuran(useToday());
  const [query, setQuery] = useState('');
  const surahs = data ? searchSurahs(data.catalog, query) : [];
  return <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
    <FlatList data={surahs} keyExtractor={(item) => String(item.number)} keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ListHeaderComponent={<View style={styles.header}>
        <View style={styles.heading}>
          <PrayerAction icon="back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/tracker')} />
          <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('quran.title')}</BodyText>
        </View>
        {!data ? <QuranStatus failed={data === null} retry={refreshQuran} /> : <>
          <QuranSummary catalog={data.catalog} sessions={data.sessions} title={t('quran.today')} />
          <PrayerPanel>
            <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.bookmark')}</BodyText>
            <BodyText>{data.bookmark ? positionLabel(data.catalog, data.bookmark) : t('quran.noBookmark')}</BodyText>
            <ContinueReader catalog={data.catalog} bookmark={data.bookmark} />
            <PrayerAction label={t(data.bookmark ? 'quran.editBookmark' : 'quran.setBookmark')} onPress={() => router.push('/quran/bookmark')} />
          </PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('quran.surahList')}</BodyText>
          <Input accessibilityLabel={t('quran.search')} placeholder={t('quran.search')} value={query} onChangeText={setQuery} autoCorrect={false} />
        </>}
      </View>}
      renderItem={({ item }) => <Pressable accessibilityRole="button" style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}
        onPress={() => router.push({ pathname: '/quran/reader', params: { surah: String(item.number) } })}>
        <BodyText style={{ color: colors.muted }}>{item.number}</BodyText>
        <View style={styles.name}>
          <BodyText style={prayerStyles.section}>{item.latin}</BodyText>
          <BodyText style={prayerStyles.small}>{t('quran.ayat', { value: item.verses })}</BodyText>
        </View>
        {item.arabic && <BodyText style={styles.arabic}>{item.arabic}</BodyText>}
        <BodyText aria-hidden>›</BodyText>
      </Pressable>}
      ListEmptyComponent={data ? <EmptyState message={t('quran.noSurahs')} /> : undefined}
    />
    <View style={styles.footer}>
      <View style={prayerStyles.wrap}>
        <PrayerAction label={t('quran.history')} onPress={() => router.push('/quran/history')} />
        <PrayerAction label={t('quran.manual')} onPress={() => router.push('/quran/manual')} />
      </View>
      <Pressable accessibilityRole="link" onPress={() => { void Linking.openURL('https://tanzil.net').catch(() => undefined); }}>
        <BodyText style={{ color: colors.muted, textDecorationLine: 'underline' }}>{t('quran.textCredit')}</BodyText>
      </Pressable>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: space.md },
  header: { gap: space.sm, paddingVertical: space.sm },
  footer: { width: '100%', maxWidth: 680, alignSelf: 'center', gap: space.xs, paddingHorizontal: space.md, paddingVertical: space.xs },
  heading: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.sm, minHeight: 58,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, marginBottom: space.xs },
  name: { flex: 1 }, arabic: { fontSize: 21, lineHeight: 33, writingDirection: 'rtl', flexShrink: 1 },
});
