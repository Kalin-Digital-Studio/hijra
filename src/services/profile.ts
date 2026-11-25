import type { SQLiteDatabase } from 'expo-sqlite';
import { readLocalProfile, saveLocalProfile } from '../database/repositories/profile.ts';
import { readSettings, writeSetting } from '../database/repositories/settings.ts';
import { validDisplayName, validateProfile, type ProfileInput, type UserProfile } from '../types/profile.ts';
import type { Settings } from '../types/settings';

export async function persistProfile(
  db: SQLiteDatabase, expectedId: string | null, input: ProfileInput, preferences?: Settings,
) {
  const clean = validateProfile(input);
  let result: { profile: UserProfile; settings: Awaited<ReturnType<typeof readSettings>> } | undefined;
  await db.withExclusiveTransactionAsync(async (tx) => {
    if (preferences) {
      const { completed } = await readSettings(tx);
      const { profile } = await readLocalProfile(tx);
      if (completed && profile && validDisplayName(profile.displayName)) throw new Error('Onboarding already completed');
    }
    const profile = await saveLocalProfile(tx, expectedId, clean);
    if (preferences) {
      await writeSetting(tx, 'language', preferences.language);
      await writeSetting(tx, 'theme', preferences.theme);
      await writeSetting(tx, 'week_start', preferences.week_start);
      await writeSetting(tx, 'onboarding_completed_at', profile.updatedAt);
      await writeSetting(tx, 'onboarding_version', '1');
      await writeSetting(tx, 'onboarding_completed', 'true');
    }
    result = { profile, settings: await readSettings(tx) };
  });
  if (!result) throw new Error('Profile transaction did not finish');
  return result;
}
