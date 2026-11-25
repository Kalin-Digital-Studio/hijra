function quranTables(optionalName: string) {
  return `
CREATE TABLE quran_surahs (
  surah_number INTEGER PRIMARY KEY CHECK (surah_number BETWEEN 1 AND 114),
  name_arabic ${optionalName},
  name_transliteration TEXT NOT NULL,
  name_id ${optionalName},
  name_en ${optionalName},
  verse_count INTEGER NOT NULL CHECK (typeof(verse_count) = 'integer' AND verse_count > 0)
);
CREATE TABLE quran_reading_logs (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  reading_date TEXT NOT NULL,
  start_surah INTEGER NOT NULL REFERENCES quran_surahs(surah_number),
  start_ayah INTEGER NOT NULL CHECK (typeof(start_ayah) = 'integer' AND start_ayah > 0),
  end_surah INTEGER NOT NULL REFERENCES quran_surahs(surah_number),
  end_ayah INTEGER NOT NULL CHECK (typeof(end_ayah) = 'integer' AND end_ayah > 0),
  duration_minutes INTEGER CHECK (duration_minutes IS NULL OR (typeof(duration_minutes) = 'integer' AND duration_minutes > 0)),
  notes TEXT CHECK (notes IS NULL OR length(notes) <= 500),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_surah > start_surah OR (end_surah = start_surah AND end_ayah >= start_ayah))
);
CREATE INDEX idx_quran_logs_user_date ON quran_reading_logs (user_id, reading_date);
CREATE TABLE quran_bookmarks (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL UNIQUE REFERENCES user_profiles(id),
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(surah_number),
  ayah_number INTEGER NOT NULL CHECK (typeof(ayah_number) = 'integer' AND ayah_number > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;
}

export const quranSchema = quranTables('TEXT NOT NULL');

export const quranCatalogSchema = `
ALTER TABLE quran_reading_logs RENAME TO quran_reading_logs_v6;
ALTER TABLE quran_bookmarks RENAME TO quran_bookmarks_v6;
ALTER TABLE quran_surahs RENAME TO quran_surahs_v6;
DROP INDEX idx_quran_logs_user_date;
${quranTables('TEXT')}
INSERT INTO quran_surahs SELECT * FROM quran_surahs_v6;
INSERT INTO quran_reading_logs SELECT * FROM quran_reading_logs_v6;
INSERT INTO quran_bookmarks SELECT * FROM quran_bookmarks_v6;
DROP TABLE quran_reading_logs_v6;
DROP TABLE quran_bookmarks_v6;
DROP TABLE quran_surahs_v6;
`;
