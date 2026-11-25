export const genders = ['MALE', 'FEMALE', null] as const;
export type Gender = (typeof genders)[number];
export type ProfileInput = { displayName: string; gender: Gender; avatarUri: string | null };
export type UserProfile = ProfileInput & { id: string; createdAt: string; updatedAt: string };

export const maxDisplayNameLength = 60;

export function validDisplayName(name: string) {
  const trimmed = name.trim();
  return trimmed.length > 0 && Array.from(trimmed).length <= maxDisplayNameLength;
}

export function validateProfile(input: ProfileInput): ProfileInput {
  if (!validDisplayName(input.displayName) || !genders.includes(input.gender)) {
    throw new Error('Invalid profile input');
  }
  if (input.avatarUri !== null && !isOwnedAvatar(input.avatarUri)) {
    throw new Error('Invalid avatar reference');
  }
  return { ...input, displayName: input.displayName.trim() };
}

export function isOwnedAvatar(reference: string) {
  return /^profiles\/avatars\/[a-z0-9-]+\.(jpg|png|webp|gif|heic|heif)$/i.test(reference);
}
