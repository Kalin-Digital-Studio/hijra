import pickthall from '../../assets/data/dhikr/pickthall-1930.json' with { type: 'json' };
import type { DhikrStep } from './dhikrRules.ts';

const passages: Readonly<Partial<Record<string, readonly string[]>>> = pickthall.passages;

export function getDhikrReadingHelp(step: DhikrStep, personal: boolean, language: string) {
  if (personal) return { latin: step.latin, meaning: step.meaning, english: null };
  const lines = passages[step.id];
  const number = step.id.replace('guided-surah-', '');
  const matches = lines && step.reference === `Quran ${number} · Abu Dawud 5082 · Tanzil Uthmani v1.1`
    && step.arabic?.split('\n').length === lines.length;
  const english = matches && language === 'en' ? { source: pickthall.source, basmalah: pickthall.basmalah, lines } : null;
  return { latin: null, meaning: null, english };
}
