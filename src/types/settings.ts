export const languages = ['id', 'en'] as const;
export const themes = ['system', 'light', 'dark'] as const;
export type Language = (typeof languages)[number];
export type ThemePreference = (typeof themes)[number];
export type Settings = { language: Language; theme: ThemePreference };
