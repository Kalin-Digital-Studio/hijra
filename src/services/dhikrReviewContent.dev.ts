import draftFile from '../../assets/data/dhikr/review-drafts.dev.json' with { type: 'json' };
import type { DhikrReviewDraft } from './dhikrReviewContent.ts';
import type { DhikrStep } from './dhikrRules.ts';

type ReviewRecord = DhikrReviewDraft & { arabic: string; reference: string };
const items: Readonly<Partial<Record<string, ReviewRecord>>> = draftFile.items;

export function getDhikrReviewContent(step: DhikrStep): DhikrReviewDraft | null {
  const item = items[step.id];
  if (draftFile.status !== 'REVIEW_REQUIRED' || !item ||
    item.arabic !== step.arabic || item.reference !== step.reference) return null;
  return { latin: item.latin, meaning: item.meaning, english: item.english };
}
