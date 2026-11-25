export const quranVerseSchema = `
CREATE TABLE quran_verses (
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(surah_number),
  ayah_number INTEGER NOT NULL CHECK (typeof(ayah_number) = 'integer' AND ayah_number > 0),
  arabic_text TEXT NOT NULL CHECK (length(arabic_text) > 0),
  PRIMARY KEY (surah_number, ayah_number)
);
`;
