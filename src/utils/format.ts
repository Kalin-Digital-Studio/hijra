import type { Language } from '../types/settings';

export function formatDate(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'full' }).format(date);
}

export function formatNumber(value: number, language: Language) {
  return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US').format(value);
}
