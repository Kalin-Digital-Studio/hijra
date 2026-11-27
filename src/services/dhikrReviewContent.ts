import type { DhikrStep } from './dhikrRules.ts';

export type DhikrReviewDraft = { latin: string; meaning: string; english: string | null };

export function getDhikrReviewContent(_step: DhikrStep): DhikrReviewDraft | null {
  return null;
}
