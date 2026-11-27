export const dhikrSchema = `
CREATE TABLE dhikr_items (
  id TEXT PRIMARY KEY NOT NULL, owner_user_id TEXT REFERENCES user_profiles(id),
  label TEXT NOT NULL, arabic_text TEXT, latin_text TEXT, meaning TEXT, notes TEXT, reference TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('COUNTER','CHECKLIST')),
  target INTEGER CHECK (target BETWEEN 1 AND 999999),
  archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0,1))
);
CREATE TABLE dhikr_collections (
  id TEXT PRIMARY KEY NOT NULL, category TEXT NOT NULL, version INTEGER NOT NULL, reference TEXT NOT NULL
);
CREATE TABLE dhikr_collection_items (
  collection_id TEXT NOT NULL REFERENCES dhikr_collections(id), position INTEGER NOT NULL,
  item_id TEXT NOT NULL REFERENCES dhikr_items(id), target INTEGER CHECK (target BETWEEN 1 AND 999999),
  required INTEGER NOT NULL CHECK (required IN (0,1)), PRIMARY KEY (collection_id,position)
);
CREATE TABLE user_dhikr_preferences (
  user_id TEXT NOT NULL REFERENCES user_profiles(id), item_id TEXT NOT NULL REFERENCES dhikr_items(id),
  favorite INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0,1)), sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id,item_id)
);
CREATE TABLE dhikr_collection_sessions (
  id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES user_profiles(id),
  date TEXT NOT NULL, collection_id TEXT NOT NULL REFERENCES dhikr_collections(id), context TEXT,
  status TEXT NOT NULL CHECK (status IN ('COMPLETE','INCOMPLETE')), snapshot TEXT NOT NULL
);
CREATE TABLE dhikr_logs (
  id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES user_profiles(id), date TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES dhikr_items(id), label TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('COUNTER','CHECKLIST')), count INTEGER NOT NULL CHECK (count BETWEEN 0 AND 999999),
  checked INTEGER NOT NULL CHECK (checked IN (0,1)), target INTEGER CHECK (target BETWEEN 1 AND 999999),
  collection_session_id TEXT REFERENCES dhikr_collection_sessions(id) ON DELETE CASCADE,
  context TEXT,
  CHECK ((mode='COUNTER' AND count>0 AND checked=0) OR (mode='CHECKLIST' AND count=0 AND checked=1))
);
CREATE INDEX idx_dhikr_logs_user_date ON dhikr_logs (user_id,date);
CREATE INDEX idx_dhikr_collection_user_date ON dhikr_collection_sessions (user_id,date);
CREATE TABLE dhikr_drafts (
  id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL REFERENCES user_profiles(id),
  date TEXT NOT NULL, collection_id TEXT REFERENCES dhikr_collections(id),
  snapshot TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dhikr_drafts_user ON dhikr_drafts (user_id,updated_at);
`;
