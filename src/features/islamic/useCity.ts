import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { readPrayerCity, savePrayerCity } from '../../database/repositories/islamic';
import type { City } from '../../services/islamic/rules';

export function useCity() {
  const db=useSQLiteContext();
  const [city,setCity]=useState<City|null>();
  const [failed,setFailed]=useState(false);
  useFocusEffect(useCallback(() => {
    let active=true;
    void readPrayerCity(db).then((result)=>{if(active)setCity(result);},()=>{if(active)setFailed(true);});
    return ()=>{active=false;};
  },[db]));
  return { city,failed, save:async (next:City)=>{await savePrayerCity(db,next);setCity(next);} };
}
