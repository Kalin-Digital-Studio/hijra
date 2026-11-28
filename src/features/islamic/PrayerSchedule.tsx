import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { AppState, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input } from '../../components/ui';
import { canPreviewMyQuran, IslamicError } from '../../services/islamic/client';
import { scheduleMonth, searchCities } from '../../services/islamic/myquran';
import { monthShift, nextPrayer, prayerDate, prayerIds, zones, type City, type PrayerTimes, type Zone } from '../../services/islamic/rules';
import { light, radius, space } from '../../theme/tokens';
import { addDays } from '../../utils/localDate';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { IslamicScreen, RemoteState } from './IslamicUI';
import { useCity } from './useCity';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { useRemote } from './useRemote';

function useClock() {
  const [now,setNow]=useState(Date.now);
  useFocusEffect(useCallback(()=>{
    setNow(Date.now());
    const timer=setInterval(()=>setNow(Date.now()),1000);
    const subscription=AppState.addEventListener('change',state=>{if(state==='active')setNow(Date.now());});
    return ()=>{clearInterval(timer);subscription.remove();};
  },[]));
  return now;
}
function Times({row,active,green}: {row:PrayerTimes;active?:string;green?:boolean}) {
  const {t}=useTranslation();
  return <View style={prayerStyles.wrap}>
    {prayerIds.map((id)=><View key={id}>
      <BodyText style={[prayerStyles.small,green && prayerStyles.onGreen,active===id && {fontWeight:'700'}]}>{t('types.'+id)}</BodyText>
      <BodyText style={[green && prayerStyles.onGreen,active===id && {fontWeight:'700'}]}>{row[id]}</BodyText>
    </View>)}
  </View>;
}
function useMonth(city: City|null|undefined, month:string) {
  const load=useCallback((signal:AbortSignal)=>scheduleMonth(city!,month,signal),[city,month]);
  return useRemote(city ? city.id+'|'+city.zone+'|'+month : null,load);
}
export function PrayerHero({compact = false}: {compact?:boolean}) {
  const {t}=useTranslation();
  const router=useRouter();
  const {city,failed}=useCity();
  const now=useClock();
  const day=prayerDate(now,city?.zone??'Asia/Jakarta');
  const month=day.slice(0,7), tomorrow=addDays(day,1).slice(0,7);
  const current=useMonth(city,month);
  const following=useMonth(tomorrow!==month?city:null,tomorrow);
  const next=city && current.data ? nextPrayer(now,city.zone,{...current.data,...following.data}) : null;
  const duration=next && [Math.floor(next.seconds/3600),Math.floor(next.seconds/60)%60,next.seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
  const { fontScale, width } = useWindowDimensions();
  const showIllustration = fontScale <= 1.25 && width >= 330;
  const row = current.data?.[day];
  const fetching = !current.data || (tomorrow!==month && !following.data);
  const requestError = current.error ?? following.error;
  const limited = requestError instanceof IslamicError && requestError.status === 429;
  const status = failed ? 'hub.localError' : city === undefined ? 'loading' : !city ? 'hub.heroChooseCity' :
    !canPreviewMyQuran ? 'hub.blocked' : limited ? 'hub.limited' :
    requestError || !fetching ? 'hub.scheduleUnavailable' : 'loading';
  const openSchedule = () => router.push('/islamic/schedule');
  const location = city ? [city.name,compact && ['WIB','WITA','WIT'][zones.indexOf(city.zone)]].filter(Boolean).join(' · ') : t('hub.chooseCity');
  return <View style={heroStyles.card}>
    <Pressable accessibilityRole="button" accessibilityLabel={t('hub.chooseCity')}
      onPress={() => router.push({ pathname: '/islamic/schedule', params: { city: 'choose' } })}
      style={heroStyles.city}>
      <View style={heroStyles.cityDot} />
      <BodyText style={[heroStyles.light,heroStyles.cityName]}>{location}</BodyText>
      <BodyText style={heroStyles.light} aria-hidden>⌄</BodyText>
    </Pressable>
    <View style={heroStyles.main}>
      <View style={heroStyles.details}>
        <BodyText style={heroStyles.caption}>{t(next ? 'hub.nextPrayer' : 'hub.schedule')}</BodyText>
        {next ? <>
          <View style={heroStyles.prayerName}>
            {compact && <PrayerIcon kind={next.prayer} color={light.accent} background={light.primary} size={20} />}
            <BodyText style={heroStyles.prayer}>{t('types.' + next.prayer)}</BodyText>
          </View>
          <BodyText style={heroStyles.time}>{next.time}</BodyText>
          <BodyText style={heroStyles.countdown}>{t('hub.countdown', { duration })}</BodyText>
        </> : <BodyText style={heroStyles.light}>{t(status)}</BodyText>}
      </View>
      {showIllustration && <MosqueMark />}
    </View>
    {!compact && <View style={heroStyles.times}>
      {prayerIds.map((id) => {
        const active = next?.date === day && next.prayer === id;
        return <View key={id} style={[heroStyles.slot, fontScale > 1.25 && heroStyles.wideSlot, active && heroStyles.activeSlot]}>
          <PrayerIcon kind={id} color={active ? light.accent : heroStyles.caption.color}
            background={active ? heroStyles.activeSlot.backgroundColor : light.primary} size={20} />
          <BodyText style={[heroStyles.slotLabel, active && heroStyles.countdown]}>{t('types.' + id)}</BodyText>
          <BodyText style={[heroStyles.slotTime, active && heroStyles.countdown]}>{row?.[id] ?? '—'}</BodyText>
        </View>;
      })}
    </View>}
    {canPreviewMyQuran && city && !next && (requestError || !fetching) &&
      <Pressable accessibilityRole="button" onPress={() => {current.retry();if(tomorrow!==month)following.retry();}} style={heroStyles.footer}>
        <BodyText style={heroStyles.light}>{t('retry')}</BodyText>
      </Pressable>}
    <Pressable accessibilityRole="button" accessibilityLabel={t('hub.schedule')} onPress={openSchedule} style={heroStyles.footer}>
      <BodyText style={[heroStyles.light, heroStyles.details]}>{t(compact ? 'dashboard.fullSchedule' : 'hub.prayerSource')}</BodyText>
      <PrayerIcon kind="next" color={light.onPrimary} background={light.primary} size={18} />
    </Pressable>
  </View>;
}

function MosqueMark() {
  return <View accessible={false} importantForAccessibility="no-hide-descendants" style={heroStyles.mosque}>
    <View style={heroStyles.sun} />
    <View style={[heroStyles.minaret, { left: 5 }]} />
    <View style={[heroStyles.minaret, { right: 5 }]} />
    <View style={heroStyles.dome}><View style={heroStyles.door} /></View>
    <View style={heroStyles.base} />
  </View>;
}

const heroStyles = StyleSheet.create({
  card: { backgroundColor: light.primary, borderRadius: radius.lg, paddingHorizontal: space.md, paddingTop: space.xs },
  city: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: 48 },
  cityName: {flexShrink:1},
  cityDot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1, borderColor: light.accent },
  light: { color: light.onPrimary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  caption: { color: '#C9DDD3', fontSize: 12, lineHeight: 17 },
  main: { flexDirection: 'row', alignItems: 'center', paddingBottom: space.md, gap: space.sm },
  details: { flex: 1 },
  prayer: { color: light.onPrimary, fontWeight: '700', fontSize: 20, lineHeight: 27 },
  prayerName: {flexDirection:'row',alignItems:'center',gap:space.xs,flexWrap:'wrap'},
  time: { color: light.onPrimary, fontWeight: '800', fontSize: 34, lineHeight: 42, fontVariant: ['tabular-nums'] },
  countdown: { color: '#F2D297', fontSize: 12, lineHeight: 18 },
  times: { paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#628778', flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  slot: { flex: 1, alignItems: 'center', borderRadius: 8, paddingVertical: 6, minWidth: 46 },
  wideSlot: { flexBasis: '28%' },
  activeSlot: { backgroundColor: '#346452' },
  slotLabel: { color: light.onPrimary, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  slotTime: { color: light.onPrimary, fontSize: 12, lineHeight: 17, fontWeight: '700', fontVariant: ['tabular-nums'] },
  footer: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  mosque: { width: 86, height: 74 },
  sun: { position: 'absolute', top: 1, right: 14, width: 28, height: 28, borderRadius: 14, backgroundColor: light.accent },
  minaret: { position: 'absolute', bottom: 7, width: 8, height: 38, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: '#4D7867' },
  dome: { position: 'absolute', left: 23, bottom: 7, width: 40, height: 38, borderTopLeftRadius: 22, borderTopRightRadius: 22,
    backgroundColor: '#315D4E', borderColor: '#769B87', borderWidth: 1, alignItems: 'center', justifyContent: 'flex-end' },
  door: { width: 10, height: 18, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: light.accent },
  base: { position: 'absolute', bottom: 4, left: 1, right: 1, height: 4, borderRadius: 2, backgroundColor: '#4D7867' },
});

export default function PrayerSchedule() {
  const {t}=useTranslation();
  const {city,save,failed}=useCity();
  const now=useClock();
  const today=prayerDate(now,city?.zone??'Asia/Jakarta');
  const [selectedMonth,setMonth]=useState<string>();
  const month=selectedMonth??today.slice(0,7);
  const { city: cityAction } = useLocalSearchParams<{ city?: string }>();
  const [editing,setEditing]=useState(cityAction === 'choose');
  const [search,setSearch]=useState('');
  const [candidate,setCandidate]=useState<Omit<City,'zone'>>();
  const [zone,setZone]=useState<Zone>();
  const [error,setError]=useState(false);
  const [detail,setDetail]=useState<string>();
  const query=search.trim();
  const citySearch=useRemote(query.length>=2 && (editing || !city) ? query : null,
    useCallback((signal)=>searchCities(query,signal),[query]),350);
  const schedule=useMonth(editing?null:city,month);
  const choosing=editing||city===null;
  return <IslamicScreen title={t('hub.schedule')}>
    {(failed||error) && <EmptyState message={t('hub.localError')} />}
    {city && <PrayerAction label={city.name+' · '+t('hub.chooseCity')} onPress={()=>setEditing(!editing)} />}
    {choosing && canPreviewMyQuran && <PrayerPanel>
      <Input placeholder={t('hub.chooseCity')} accessibilityLabel={t('hub.chooseCity')} value={search} onChangeText={setSearch} maxLength={64} />
      {query.length>=2 && (!citySearch.data ? <RemoteState error={citySearch.error} retry={citySearch.retry}/> :
        citySearch.data.map((item)=><PrayerAction key={item.id} label={item.name} selected={candidate?.id===item.id}
          onPress={()=>{setCandidate(item);setZone(undefined);}} />))}
      {citySearch.data?.length===0 && <BodyText>{t('hub.noResults')}</BodyText>}
      {candidate && <>
        <BodyText>{t('hub.chooseZone')}</BodyText>
        <View style={prayerStyles.wrap}>{zones.map((name,index)=><PrayerAction key={name} label={['WIB','WITA','WIT'][index]} selected={zone===name} onPress={()=>setZone(name)} />)}</View>
        <PrayerAction emphasis="primary" label={t('dhikr.save')} disabled={!zone} onPress={()=>{
          if(zone) void save({...candidate,zone}).then(()=>{setEditing(false);setCandidate(undefined);setMonth(undefined);setError(false);},()=>setError(true));
        }} />
      </>}
    </PrayerPanel>}
    {!canPreviewMyQuran && <RemoteState retry={schedule.retry}/>}
    {city && !editing && canPreviewMyQuran && <>
      <View style={prayerStyles.wrap}>
        {[-12,-1,1,12].map(step=><PrayerAction key={step} label={t('hub.monthStep',{step:step>0?'+'+step:step})} onPress={()=>{setMonth(monthShift(month,step));setDetail(undefined);}}/>)}
      </View>
      <PrayerAction label={t('prayer.today')+' · '+month} onPress={()=>{setMonth(undefined);setDetail(undefined);}} />
      {!schedule.data ? <RemoteState error={schedule.error} retry={schedule.retry}/> : <>
        <PrayerAction label={t('hub.refresh')} onPress={schedule.retry} />
        <BodyText>{t('hub.prayerSource')}</BodyText>
        <BodyText>{t('hub.updated',{time:new Date(schedule.fetchedAt??now).toLocaleString()})}</BodyText>
        {Object.entries(schedule.data).map(([date,row])=><PrayerPanel key={date}>
          <PrayerAction label={date} selected={date===today || detail===date} onPress={()=>setDetail(detail===date?undefined:date)} />
          <Times row={row} />
          {detail===date && <BodyText>{[row.imsak && 'Imsak '+row.imsak,row.sunrise && t('hub.sunrise')+' '+row.sunrise,row.duha && t('types.duha')+' '+row.duha].filter(Boolean).join(' · ')}</BodyText>}
        </PrayerPanel>)}
      </>}
    </>}
  </IslamicScreen>;
}
