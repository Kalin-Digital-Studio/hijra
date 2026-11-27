export type DhikrMode = 'COUNTER' | 'CHECKLIST';
export type DhikrItem = {
  id: string; label: string; arabic: string | null; latin: string | null; meaning: string | null;
  notes: string | null; reference: string | null; mode: DhikrMode; target: number | null;
  owner: string | null; archived: number; favorite: number; sort: number;
};
export type DhikrStep = Pick<DhikrItem, 'id' | 'label' | 'arabic' | 'latin' | 'meaning' | 'reference' | 'mode' | 'target'> & { required: boolean };
export type Progress = { count: number; checked: boolean };
export type Draft = {
  id: string; userId: string; date: string; collection: string | null; context: string | null;
  version?: number; steps: DhikrStep[]; progress: Progress[]; current: number;
};
export type DhikrLog = { id: string; itemId: string; date: string; label: string; mode: DhikrMode; count: number; checked: number; target: number | null; collectionSession: string | null; collection: string | null; status: 'COMPLETE' | 'INCOMPLETE' | null; context: string | null };

export const maxCount = 999999;
export const emptyProgress: Progress = { count: 0, checked: false };

export function completeStep(step: DhikrStep, progress: Progress) {
  return step.mode === 'CHECKLIST' ? progress.checked
    : Number.isInteger(step.target) && step.target! > 0 && progress.count >= step.target!;
}

export function collectionStatus(steps: readonly DhikrStep[], progress: readonly Progress[]) {
  const required = steps.flatMap((step, index) => step.required ? [index] : []);
  const completed = required.filter((index) => completeStep(steps[index], progress[index] ?? emptyProgress)).length;
  return { required: required.length, completed, complete: required.length > 0 && completed === required.length };
}

export function summarizeDhikr(logs: readonly DhikrLog[]) {
  return {
    repetitions: logs.reduce((sum, entry) => sum + (entry.mode === 'COUNTER' ? entry.count : 0), 0),
    checks: logs.filter((entry) => entry.mode === 'CHECKLIST' && entry.checked).length,
    sessions: logs.length,
    activities: new Set(logs.map((entry) => entry.itemId)).size,
    days: new Set(logs.map((entry) => entry.date)).size,
    completedCollections: new Set(logs.filter((entry) => entry.status === 'COMPLETE').map((entry) => entry.collectionSession)).size,
    partialCollections: new Set(logs.filter((entry) => entry.status === 'INCOMPLETE').map((entry) => entry.collectionSession)).size,
  };
}

export function newDhikrId() {
  return globalThis.crypto?.randomUUID?.() ?? `dhikr-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
