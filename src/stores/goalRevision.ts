import { create } from 'zustand';

export const useGoalRevision = create<{revision:number}>(() => ({revision:0}));
export function invalidateGoals() {
  useGoalRevision.setState(state => ({revision:state.revision+1}));
}
