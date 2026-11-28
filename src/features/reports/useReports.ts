import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback,useState } from 'react';
import { readReport,type ReportData } from '../../database/repositories/reports';
import { reconcileGoals } from '../../database/repositories/goals';
import type { ReportSelection } from '../../services/reportDates';
import { useGoalRevision,invalidateGoals } from '../../stores/goalRevision';
import { useProfile } from '../../stores/profile';
import { useSettings } from '../../stores/settings';

export function useReports(selection:ReportSelection,today:string,calendarOnly:boolean) {
  const db=useSQLiteContext();
  const user=useProfile(state=>state.profile?.id);
  const week=useSettings(state=>state.week_start);
  const revision=useGoalRevision(state=>state.revision);
  const key=JSON.stringify(selection);
  const [result,setResult]=useState<{key:string;value:ReportData|null}>();
  const identity=JSON.stringify([key,user,today,week,calendarOnly]);
  useFocusEffect(useCallback(()=>{
    if(!user)return;
    let active=true;
    async function reload(owner:string) {
      try {
        if(!calendarOnly)await reconcileGoals(db,owner,today,week);
        if(!active)return;
        const chosen=JSON.parse(key) as ReportSelection;
        const value=await readReport(db,owner,chosen,today,week,calendarOnly);
        if(active&&useGoalRevision.getState().revision===revision)setResult({key:identity,value});
      }catch {
        if(active&&useGoalRevision.getState().revision===revision)setResult({key:identity,value:null});
      }
    }
    void reload(user);
    return ()=>{active=false;};
  },[db,user,today,week,revision,key,identity,calendarOnly,setResult]));
  return {week,data:result?.key===identity?result.value:undefined,retry:invalidateGoals};
}
