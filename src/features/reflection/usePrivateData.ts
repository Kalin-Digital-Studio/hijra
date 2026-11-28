import { useFocusEffect } from 'expo-router';
import { useSQLiteContext,type SQLiteDatabase } from 'expo-sqlite';
import { useCallback,useState } from 'react';
import { useGoalRevision,invalidateGoals } from '../../stores/goalRevision';
import { useProfile } from '../../stores/profile';

export function usePrivateData<T>(key:string,load:(db:SQLiteDatabase,user:string)=>Promise<T>) {
  const db=useSQLiteContext();
  const user=useProfile(state=>state.profile?.id);
  const revision=useGoalRevision(state=>state.revision);
  const identity=JSON.stringify([user,key]);
  const [result,setResult]=useState<{identity:string;data:T|null}>();
  useFocusEffect(useCallback(()=>{
    if(!user)return;
    let active=true;
    void load(db,user).then(data=>{
      if(active&&useGoalRevision.getState().revision===revision)setResult({identity,data});
    },()=>{
      if(active&&useGoalRevision.getState().revision===revision)setResult(previous=>
        previous?.identity===identity&&previous.data!==null?previous:{identity,data:null});
    });
    return ()=>{active=false;};
  },[db,user,identity,revision,load,setResult]));
  return {db,user,data:result?.identity===identity?result.data:undefined,retry:invalidateGoals};
}
