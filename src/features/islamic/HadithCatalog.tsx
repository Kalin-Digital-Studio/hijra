import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { narratorBooks, narratorHadith } from '../../services/islamic/myquran';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { IslamicScreen, RemoteState } from './IslamicUI';
import { useRemote } from './useRemote';

type Book = Awaited<ReturnType<typeof narratorBooks>>[number];
const featured = new Map([
  ['bukhari', 'Sahih Bukhari'], ['muslim', 'Sahih Muslim'],
  ['abu-dawud', 'Abu Dawud'], ['nasai', 'An-Nasa’i'],
]);
const nameOf = (book: Book) => featured.get(book.slug) ?? book.name;
const featuredSlugs = [...featured.keys()];
const rank = (slug: string) => featured.has(slug) ? featuredSlugs.indexOf(slug) : featured.size;
const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

export function HadithCatalog({renderCollections}: {renderCollections: (back: () => void) => ReactNode}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [query, setQuery] = useState('');
  const [book, setBook] = useState<Book>();
  const [collections, setCollections] = useState(false);
  const catalog = useRemote('narrator-books', narratorBooks);
  if (collections) return renderCollections(() => setCollections(false));
  if (book) return <HadithReader book={book} back={() => setBook(undefined)} />;
  const search = normalize(query);
  const books = [...(catalog.data ?? [])].sort((a, b) => rank(a.slug) - rank(b.slug))
    .filter(item => normalize(nameOf(item)).includes(search) || normalize(item.name).includes(search));
  return <IslamicScreen title={t('hub.hadithDigital')}>
    <Input placeholder={t('hub.searchHadithBooks')} accessibilityLabel={t('hub.searchHadithBooks')}
      value={query} onChangeText={setQuery} maxLength={80}/>
    {!catalog.data ? <RemoteState error={catalog.error} retry={catalog.retry}/> :
      books.length ? <View style={styles.list}>{books.map(item =>
        <Pressable key={item.slug} accessibilityRole="button" accessibilityLabel={nameOf(item)}
          onPress={() => setBook(item)} style={({pressed}) => [styles.book, {
            borderColor: colors.border, backgroundColor: pressed ? colors.selected : colors.surface,
          }]}>
          <BodyText style={{color: colors.primary}}>▣</BodyText>
          <BodyText style={styles.name}>{nameOf(item)}</BodyText>
          <BodyText style={{color: colors.primary}}>›</BodyText>
        </Pressable>)}</View> : <EmptyState message={t('hub.noResults')}/>}
    <PrayerAction label="HadeethEnc · Al-Arba’in" onPress={() => setCollections(true)}/>
  </IslamicScreen>;
}

function HadithReader({book, back}: {book: Book; back: () => void}) {
  const {t} = useTranslation();
  const [number, setNumber] = useState(1);
  const [input, setInput] = useState('1');
  const target = Number(input);
  const valid = /^\d+$/.test(input) && target >= 1 && target <= book.total;
  const load = useCallback((signal: AbortSignal) => narratorHadith(book.slug, number, signal), [book.slug, number]);
  const detail = useRemote(book.slug + ':' + number, load);
  function go(next: number) {
    setNumber(next);
    setInput(String(next));
  }
  return <IslamicScreen title={nameOf(book)} onBack={back}>
    <Input placeholder={t('hub.hadithNumber')} accessibilityLabel={t('hub.hadithNumber')}
      keyboardType="number-pad" value={input} onChangeText={setInput} maxLength={String(book.total).length}/>
    <PrayerAction label={t('hub.search')} disabled={!valid} onPress={() => go(target)}/>
    <BodyText>{t('hub.hadithPosition', {number, total: book.total})}</BodyText>
    {detail.data ? <PrayerPanel>
      <BodyText accessibilityLanguage="ar" style={styles.arabic}>{detail.data.arabic}</BodyText>
      <BodyText accessibilityLanguage="id">{detail.data.meaning}</BodyText>
    </PrayerPanel> : <RemoteState error={detail.error} retry={detail.retry}/>}
    <View style={prayerStyles.wrap}>
      <PrayerAction label={t('prayer.previous')} disabled={number <= 1} onPress={() => go(number - 1)}/>
      <PrayerAction label={t('prayer.next')} disabled={number >= book.total} onPress={() => go(number + 1)}/>
    </View>
  </IslamicScreen>;
}

const styles = StyleSheet.create({
  list: {gap: 8},
  book: {minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, borderRadius: 12},
  name: {flex: 1, fontWeight: '600'},
  arabic: {fontSize: 26, lineHeight: 46, textAlign: 'right', writingDirection: 'rtl'},
});
