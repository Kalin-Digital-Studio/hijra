import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { readDashboard, type DashboardSummary } from '../../database/repositories/dashboard';
import { reconcileGoals } from '../../database/repositories/goals';
import { invalidateGoals, useGoalRevision } from '../../stores/goalRevision';
import { useProfile } from '../../stores/profile';
import { useSettings } from '../../stores/settings';
import { useToday } from '../prayer/usePrayer';

export function useDashboard() {
  const db = useSQLiteContext();
  const today = useToday();
  const week = useSettings(state => state.week_start);
  const user = useProfile(state => state.profile?.id);
  const revision = useGoalRevision(state => state.revision);
  const key = JSON.stringify([user,today]);
  const [result,setResult] = useState<{key:string;data?:DashboardSummary;failed?:boolean}>();
  useFocusEffect(useCallback(() => {
    if (!user) return;
    let active = true;
    async function load(owner: string) {
      try {
        await reconcileGoals(db,owner,today,week);
        if (!active) return;
        const data = await readDashboard(db,owner,today);
        if (active && useGoalRevision.getState().revision === revision) setResult({key,data});
      } catch {
        if (active && useGoalRevision.getState().revision === revision) {
          setResult(previous => ({key,data:previous?.key === key ? previous.data : undefined,failed:true}));
        }
      }
    }
    void load(user);
    return () => { active = false; };
  },[db,key,revision,today,user,week]));
  const current = result?.key === key ? result : undefined;
  return {today,data:current?.data,failed:current?.failed,retry:invalidateGoals};
}
