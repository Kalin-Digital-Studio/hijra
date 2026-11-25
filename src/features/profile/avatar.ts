import { Directory, File, Paths } from 'expo-file-system';
import type { ImagePickerAsset } from 'expo-image-picker';
import { isOwnedAvatar } from '../../types/profile';

export function avatarFile(reference: string | null) {
  return reference && isOwnedAvatar(reference) ? new File(Paths.document, reference) : null;
}

export function avatarSource(reference: string | null) {
  try {
    const file = avatarFile(reference);
    return file?.exists ? file.uri : undefined;
  } catch {
    return undefined;
  }
}

export function discardAvatar(reference: string | null) {
  try {
    const file = avatarFile(reference);
    if (file?.exists) file.delete();
  } catch {
    // A failed cleanup must not affect a committed profile.
  }
}

export async function prepareAvatar(asset: ImagePickerAsset) {
  const extension = asset.uri.match(/\.(jpe?g|png|webp|gif|heic|heif)$/i)?.[1]
    ?? asset.fileName?.match(/\.(jpe?g|png|webp|gif|heic|heif)$/i)?.[1]
    ?? /^image\/(jpeg|png|webp|gif|heic|heif)$/i.exec(asset.mimeType ?? '')?.[1];
  if (!extension || !asset.uri.startsWith('file://')) throw new Error('Unsupported image');
  const suffix = extension.toLowerCase().replace('jpeg', 'jpg');
  const directory = new Directory(Paths.document, 'profiles', 'avatars');
  directory.create({ intermediates: true, idempotent: true });
  const source = new File(asset.uri);
  const sourceSize = source.size;
  if (!source.exists || !sourceSize) throw new Error('Missing image');
  let reference: string;
  let destination: File;
  do {
    reference = `profiles/avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${suffix}`;
    destination = new File(Paths.document, reference);
  } while (destination.exists);
  try {
    await source.copy(destination);
    if (!destination.exists || destination.size !== sourceSize) throw new Error('Photo copy failed');
    return reference;
  } catch (error) {
    discardAvatar(reference);
    throw error;
  }
}
