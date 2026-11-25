export const sunnahSchema = `
ALTER TABLE ibadah_types ADD COLUMN is_custom INTEGER NOT NULL DEFAULT 0 CHECK (is_custom IN (0, 1));
ALTER TABLE ibadah_types ADD COLUMN owner_user_id TEXT REFERENCES user_profiles(id);
ALTER TABLE ibadah_types ADD COLUMN custom_name TEXT;
ALTER TABLE ibadah_types ADD COLUMN custom_description TEXT;
CREATE TABLE user_sunnah_preferences (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  ibadah_type_id TEXT NOT NULL REFERENCES ibadah_types(id),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  default_rakaat INTEGER CHECK (default_rakaat IS NULL OR (typeof(default_rakaat) = 'integer' AND default_rakaat > 0)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, ibadah_type_id)
);
CREATE TABLE sunnah_prayer_logs (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  ibadah_type_id TEXT NOT NULL REFERENCES ibadah_types(id),
  prayer_date TEXT NOT NULL CHECK (prayer_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  prayer_time TEXT CHECK (prayer_time IS NULL OR (prayer_time GLOB '[0-2][0-9]:[0-5][0-9]' AND prayer_time < '24:00')),
  rakaat INTEGER CHECK (rakaat IS NULL OR (typeof(rakaat) = 'integer' AND rakaat > 0)),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sunnah_logs_user_date ON sunnah_prayer_logs(user_id, prayer_date);
CREATE INDEX idx_sunnah_logs_user_type_date ON sunnah_prayer_logs(user_id, ibadah_type_id, prayer_date);
`;
