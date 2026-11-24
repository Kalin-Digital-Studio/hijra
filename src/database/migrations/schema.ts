export const initialSchema = `
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  display_name TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS ibadah_categories (
  id TEXT PRIMARY KEY NOT NULL,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS ibadah_types (
  id TEXT PRIMARY KEY NOT NULL,
  category_id TEXT NOT NULL REFERENCES ibadah_categories(id),
  sort_order INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS ibadah_types_category_order ON ibadah_types(category_id, sort_order);
`;
