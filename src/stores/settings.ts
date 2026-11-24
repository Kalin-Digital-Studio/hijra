import { create } from 'zustand';
import type { Settings } from '../types/settings';

export const useSettings = create<Settings>(() => ({ language: 'id', theme: 'system' }));
