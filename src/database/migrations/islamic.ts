export const islamicSchema = `
CREATE TABLE islamic_content_bookmarks (
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('hadith','dua','husna')),
  provider TEXT NOT NULL,
  content_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id,content_type,provider,content_key)
);`;
