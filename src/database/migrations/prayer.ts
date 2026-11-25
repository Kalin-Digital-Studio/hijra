export const prayerSchema = `
CREATE TABLE prayer_logs (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  ibadah_type_id TEXT NOT NULL REFERENCES ibadah_types(id) CHECK (ibadah_type_id IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  prayer_date TEXT NOT NULL CHECK (prayer_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  status TEXT NOT NULL DEFAULT 'NOT_LOGGED' CHECK (status IN ('NOT_LOGGED', 'COMPLETED', 'MISSED', 'EXEMPT')),
  is_on_time INTEGER CHECK (is_on_time IN (0, 1)),
  is_congregational INTEGER CHECK (is_congregational IN (0, 1)),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, ibadah_type_id, prayer_date),
  CHECK (status = 'COMPLETED' OR (is_on_time IS NULL AND is_congregational IS NULL))
);
CREATE INDEX idx_prayer_logs_user_date ON prayer_logs(user_id, prayer_date);
`;
