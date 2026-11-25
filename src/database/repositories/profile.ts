import type { SQLiteDatabase } from 'expo-sqlite';
import { genders, isOwnedAvatar, validateProfile, type ProfileInput, type UserProfile } from '../../types/profile.ts';

const profileFields = 'id, display_name AS displayName, gender, avatar_uri AS avatarUri, created_at AS createdAt, updated_at AS updatedAt';

export async function readLocalProfile(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<UserProfile>(`SELECT ${profileFields} FROM user_profiles ORDER BY id LIMIT 2`);
  if (rows.length > 1) return { profile: null, conflict: true };
  const profile = rows[0] ?? null;
  if (profile) {
    if (!genders.includes(profile.gender)) throw new Error('Invalid stored gender');
    if (profile.avatarUri && !isOwnedAvatar(profile.avatarUri)) profile.avatarUri = null;
  }
  return { profile, conflict: false };
}

export async function saveLocalProfile(db: SQLiteDatabase, expectedId: string | null, input: ProfileInput) {
  const value = validateProfile(input);
  const { profile, conflict } = await readLocalProfile(db);
  if (conflict || (profile?.id ?? null) !== expectedId) throw new Error('Unexpected local profile state');
  const now = new Date().toISOString();
  const id = profile?.id ?? 'local';
  const createdAt = profile?.createdAt || now;
  if (profile) {
    await db.runAsync(
      'UPDATE user_profiles SET display_name = ?, gender = ?, avatar_uri = ?, created_at = ?, updated_at = ? WHERE id = ?',
      value.displayName, value.gender, value.avatarUri, createdAt, now, id,
    );
  } else {
    await db.runAsync(
      'INSERT INTO user_profiles (id, display_name, gender, avatar_uri, created_at, updated_at) SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_profiles)',
      id, value.displayName, value.gender, value.avatarUri, createdAt, now,
    );
  }
  const saved = await db.getFirstAsync<UserProfile>(`SELECT ${profileFields} FROM user_profiles WHERE id = ?`, id);
  if (!saved) throw new Error('Profile persistence failed');
  validateProfile(saved);
  return saved;
}
