export const profileSchema = `
ALTER TABLE user_profiles ADD COLUMN gender TEXT CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE'));
ALTER TABLE user_profiles ADD COLUMN avatar_uri TEXT;
ALTER TABLE user_profiles ADD COLUMN created_at TEXT NOT NULL DEFAULT '';
ALTER TABLE user_profiles ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';
`;
