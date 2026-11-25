export function newReadingSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `quran-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type Surah = {
  number: number; arabic: string | null; latin: string; id: string | null; en: string | null; verses: number;
};
export type Position = { surah: number; ayah: number };
export type Reading = {
  date: string; start: Position; end: Position; duration: number | null; notes: string | null;
};
export type Session = Reading & { id: string };
export type Catalog = ReadonlyMap<number, Surah>;

export function validPosition(catalog: Catalog, position: Position) {
  const surah = catalog.get(position.surah);
  return !!surah && Number.isInteger(position.ayah) && position.ayah >= 1 && position.ayah <= surah.verses;
}

export function countAyat(catalog: Catalog, start: Position, end: Position): number | null {
  if (!validPosition(catalog, start) || !validPosition(catalog, end) || start.surah > end.surah) return null;
  if (start.surah === end.surah) return end.ayah >= start.ayah ? end.ayah - start.ayah + 1 : null;
  let total = catalog.get(start.surah)!.verses - start.ayah + 1 + end.ayah;
  for (let number = start.surah + 1; number < end.surah; number++) {
    const surah = catalog.get(number);
    if (!surah) return null;
    total += surah.verses;
  }
  return total;
}

export function nextPosition(catalog: Catalog, position: Position): Position | 'restart' | null {
  if (!validPosition(catalog, position)) return null;
  if (position.ayah < catalog.get(position.surah)!.verses) return { ...position, ayah: position.ayah + 1 };
  if (position.surah === 114) return 'restart';
  return catalog.has(position.surah + 1) ? { surah: position.surah + 1, ayah: 1 } : null;
}

export function summarizeReading(catalog: Catalog, sessions: readonly Reading[]) {
  const days = new Set<string>();
  let ayat = 0;
  let recordedMinutes: number | null = null;
  let withDuration = 0;
  for (const session of sessions) {
    const count = countAyat(catalog, session.start, session.end);
    if (count === null) throw new Error('Invalid stored reading range');
    days.add(session.date);
    ayat += count;
    if (session.duration !== null) {
      recordedMinutes = (recordedMinutes ?? 0) + session.duration;
      withDuration++;
    }
  }
  return { ayat, sessions: sessions.length, activeDays: days.size, recordedMinutes, withDuration, withoutDuration: sessions.length - withDuration };
}

function searchKey(value: string) {
  return value.normalize('NFKD').toLowerCase().replace(/[\p{M}\p{P}\sـ]/gu, '');
}

export function searchSurahs(catalog: Catalog, query: string) {
  const key = searchKey(query);
  return [...catalog.values()].filter((surah) => !key || (/^\d+$/.test(key)
    ? surah.number === Number(key)
    : [surah.arabic, surah.latin, surah.id, surah.en].some((value) => value !== null && searchKey(value).includes(key))));
}
