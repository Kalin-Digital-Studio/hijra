export function splitIntroductoryBasmalah(surah: number, firstAyah: string, numberedBasmalah: string) {
  if (surah === 1 || surah === 9 || !numberedBasmalah) return null;
  // Tanzil uses a shadda on the initial ba in At-Tin and Al-Qadr.
  const prefix = surah === 95 || surah === 97
    ? numberedBasmalah[0] + '\u0651' + numberedBasmalah.slice(1)
    : numberedBasmalah;
  const boundary = prefix + ' ';
  if (!firstAyah.startsWith(boundary) || firstAyah.length === boundary.length) return null;
  return { introduction: firstAyah.slice(0, prefix.length), firstAyah: firstAyah.slice(boundary.length) };
}
