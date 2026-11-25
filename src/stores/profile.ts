import { create } from 'zustand';
import type { UserProfile } from '../types/profile';

export const useProfile = create<{ profile: UserProfile | null; completed: boolean; conflict: boolean }>(
  () => ({ profile: null, completed: false, conflict: false }),
);
