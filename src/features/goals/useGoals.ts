import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { readActiveGoals, readGoalActivities, readGoalHistory, reconcileGoals } from '../../database/repositories/goals';
import type { Cadence, Category } from '../../services/goalRules';
import { invalidateGoals, useGoalRevision } from '../../stores/goalRevision';
import { useProfile } from '../../stores/profile';
import { useSettings } from '../../stores/settings';
import { useToday } from '../prayer/usePrayer';

export function GoalReconciliation() {
  const db = useSQLiteContext();
  const user = useProfile(state => state.profile?.id);
  const week = useSettings(state => state.week_start);
  const revision = useGoalRevision(state => state.revision);
  const today = useToday();
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state === 'active') invalidateGoals(); });
    return () => listener.remove();
  },[]);
  useEffect(() => {
    if (user) void reconcileGoals(db,user,today,week).catch(() => {
      // Target retries reconciliation on focus and can display a recoverable error.
    });
  },[db,user,today,week,revision]);
  return null;
}

type ViewOptions = { id?:string; history?:boolean; limit?:number; offset?:number; category?:Category; cadence?:Cadence };
export function useGoals({ id, history, limit, offset, category, cadence }: ViewOptions = {}) {
  const db = useSQLiteContext();
  const user = useProfile(state => state.profile?.id);
  const week = useSettings(state => state.week_start);
  const revision = useGoalRevision(state => state.revision);
  const today = useToday();
  const key = JSON.stringify([user,today,id,history,limit,offset,category,cadence]);
  const [result,setResult] = useState<{key:string;data: {
    goals:Awaited<ReturnType<typeof readActiveGoals>>; options:Awaited<ReturnType<typeof readGoalActivities>>;
    history:Awaited<ReturnType<typeof readGoalHistory>>;
  } | null}>();
  useFocusEffect(useCallback(() => {
    if (!user) return;
    let active = true;
    async function load(owner: string) {
      try {
        await reconcileGoals(db,owner,today,week);
        if (!active) return;
        const [goals,options,rows] = await Promise.all([
          readActiveGoals(db,owner,today),readGoalActivities(db,owner),
          history ? readGoalHistory(db,owner,today,{id,limit,offset,category,cadence}) : [],
        ]);
        if (active && useGoalRevision.getState().revision === revision) setResult({key,data:{goals,options,history:rows}});
      } catch {
        if (active && useGoalRevision.getState().revision === revision) setResult({key,data:null});
      }
    }
    void load(user);
    return () => { active = false; };
  },[db,user,today,week,id,history,limit,offset,category,cadence,key,revision]));
  return {db,user,today,week,data: result?.key === key ? result.data : undefined};
}
