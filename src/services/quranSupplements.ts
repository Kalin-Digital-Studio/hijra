export type QuranSupplementProvider = {
  kind: 'translation' | 'transliteration';
  language: string;
  load: (surah: number, start: number, end: number, signal: AbortSignal) => Promise<ReadonlyMap<number, string>>;
};
