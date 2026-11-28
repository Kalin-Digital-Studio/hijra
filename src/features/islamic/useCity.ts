import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { create } from 'zustand';
import { readPrayerCity, savePrayerCity } from '../../database/repositories/islamic';
import type { City } from '../../services/islamic/rules';

const useCityRevision = create<{revision:number}>(() => ({revision:0}));

export function useCity() {
  const db=useSQLiteContext();
  const revision=useCityRevision(state=>state.revision);
  const [city,setCity]=useState<City|null>();
  const [failed,setFailed]=useState(false);
  useFocusEffect(useCallback(() => {
    let active=true;
    void readPrayerCity(db).then((result)=>{
      if (!active || useCityRevision.getState().revision!==revision) return;
      setCity(previous => previous && result && previous.id===result.id && previous.zone===result.zone && previous.name===result.name ? previous : result);
      setFailed(false);
    },()=>{if(active && useCityRevision.getState().revision===revision)setFailed(true);});
    return ()=>{active=false;};
  },[db,revision]));
  return { city,failed, save:async (next:City)=>{
    await savePrayerCity(db,next);
    useCityRevision.setState(state=>({revision:state.revision+1}));
    setCity(next);
  } };
}
