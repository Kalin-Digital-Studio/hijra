import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Input } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { angle, compassDelta, qiblaBearing } from '../../services/islamic/rules';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { IslamicScreen } from './IslamicUI';
import { QiblaDial } from './QiblaDial';

export default function Qibla() {
  const {t}=useTranslation();
  const {colors}=useTheme();
  const [lat,setLat]=useState('');
  const [lon,setLon]=useState('');
  const [location,setLocation]=useState<{lat:number;lon:number}>();
  const [heading,setHeading]=useState<{value:number;trueNorth:boolean;accuracy:number}>();
  const [enabled,setEnabled]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState<string>();
  const bearing=location ? qiblaBearing(location.lat,location.lon) : null;
  useFocusEffect(useCallback(()=>{
    if(!enabled) return;
    let alive=true;
    let generation=0;
    let subscription:Location.LocationSubscription|undefined;
    function stop(){generation++;subscription?.remove();subscription=undefined;}
    async function start(){
      const attempt=++generation;
      try{
        const next=await Location.watchHeadingAsync((event)=>{
          if(!alive || attempt!==generation) return;
          const trueNorth=event.trueHeading>=0;
          const value=trueNorth?event.trueHeading:event.magHeading;
          if(!Number.isFinite(value) || value<0) return;
          setHeading(current=>({
            value:current?.trueNorth===trueNorth ? angle(current.value+compassDelta(current.value,value)*0.35) : value,
            trueNorth,accuracy:event.accuracy,
          }));
        });
        if(!alive || attempt!==generation)next.remove();
        else subscription=next;
      }catch{if(alive && attempt===generation)setHeading(undefined);}
    }
    if(AppState.currentState==='active')void start();
    const appState=AppState.addEventListener('change',state=>{stop();setHeading(undefined);if(state==='active')void start();});
    return ()=>{alive=false;stop();appState.remove();};
  },[enabled]));
  async function gps() {
    setBusy(true);setMessage(undefined);
    try {
      const permission=await Location.requestForegroundPermissionsAsync();
      if(!permission.granted){setMessage('denied');return;}
      const point=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});
      setLocation({lat:point.coords.latitude,lon:point.coords.longitude});setEnabled(true);
    }catch{setMessage('locationError');}
    finally{setBusy(false);}
  }
  function manual(){
    const coords={lat:Number(lat.replace(',','.')),lon:Number(lon.replace(',','.'))};
    if(!lat.trim() || !lon.trim() || qiblaBearing(coords.lat,coords.lon)===null){setMessage('invalidCoordinates');return;}
    setMessage(undefined);setLocation(coords);
  }
  return <IslamicScreen title={t('hub.qibla')}>
    <PrayerPanel style={{ backgroundColor: colors.background, alignItems: 'center', gap: 14 }}>
      <QiblaDial bearing={bearing} heading={heading?.value} />
      {bearing !== null && <BodyText style={[prayerStyles.section, { color: colors.primary }]}>{Math.round(bearing) % 360}°</BodyText>}
      <BodyText style={[prayerStyles.small, { color: colors.muted, textAlign: 'center' }]}>
        {t(bearing === null ? 'hub.qiblaSetup' : heading ? 'hub.qiblaAlign' : 'hub.trueNorth')}
      </BodyText>
    </PrayerPanel>
    <PrayerPanel>
      <BodyText>{t('hub.gpsPurpose')}</BodyText>
      <PrayerAction label={t('hub.gps')} disabled={busy} onPress={()=>void gps()} />
      <Input value={lat} onChangeText={setLat} accessibilityLabel={t('hub.latitude')} placeholder={t('hub.latitude')} keyboardType="numbers-and-punctuation"/>
      <Input value={lon} onChangeText={setLon} accessibilityLabel={t('hub.longitude')} placeholder={t('hub.longitude')} keyboardType="numbers-and-punctuation"/>
      <PrayerAction label={t('hub.manualCoordinates')} onPress={manual} />
      {message && <BodyText accessibilityLiveRegion="polite">{t('hub.'+message)}</BodyText>}
    </PrayerPanel>
    {bearing!==null && <PrayerPanel>
      <BodyText style={prayerStyles.small}>{t(heading?.trueNorth ? 'hub.trueHeading' : heading ? 'hub.approximate' : 'hub.noHeading')}</BodyText>
      {heading && <BodyText>{t('hub.accuracy',{value:heading.accuracy})}</BodyText>}
      <BodyText>{t('hub.calibrate')}</BodyText>
    </PrayerPanel>}
  </IslamicScreen>;
}