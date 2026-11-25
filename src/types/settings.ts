export const languages = ['id', 'en'] as const;
export const themes = ['system', 'light', 'dark'] as const;
export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type Language = (typeof languages)[number];
export type ThemePreference = (typeof themes)[number];
export type Weekday = (typeof weekdays)[number];
export type Settings = { language: Language; theme: ThemePreference; week_start: Weekday };
export type OnboardingSettings = {
  onboarding_completed: 'true' | 'false';
  onboarding_completed_at: string;
  onboarding_version: '1';
};
