import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, ScreenContainer } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { summarizeDhikr } from '../../services/dhikrRules';
import { prayerSlots, summarizePrayers } from '../../services/prayerRules';
import { summarizeReading } from '../../services/quranRules';
import { summarizeSunnah } from '../../services/sunnahRules';
import { radius, space } from '../../theme/tokens';
import { useDhikr } from '../dhikr/useDhikr';
import { HijriSummary } from '../islamic/IslamicCalendar';
import { PrayerHero } from '../islamic/PrayerSchedule';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { prayerStyles } from '../prayer/PrayerUI';
import { usePrayerData, useToday } from '../prayer/usePrayer';
import { useQuran } from '../quran/useQuran';
import { useSunnahData } from '../sunnah/useSunnah';

type Tile = { key: string; path: Href; icon: Parameters<typeof PrayerIcon>[0]['kind']; summary?:string };
export default function Tracker() {
  const router=useRouter();
  const {t}=useTranslation();
  const {colors}=useTheme();
  const {width,fontScale}=useWindowDimensions();
  const today=useToday();
  const {data:prayer}=usePrayerData(today);
  const {data:sunnah}=useSunnahData(today,undefined,false);
  const {data:quran}=useQuran(today);
  const {data:dhikr}=useDhikr(today);
  const wajib=prayer? summarizePrayers(prayerSlots(prayer.ids,prayer.logs,today).map(({record})=>record)):null;
  const daily:Tile[]=[
    {key:'prayer',path:'/prayer',icon:'building',summary:wajib?t('hub.prayerDone',{count:wajib.completed,total:wajib.applicableSlots}):undefined},
    {key:'sunnah',path:'/sunnah',icon:'moon',summary:sunnah?t('quran.sessionsCount',{value:summarizeSunnah(sunnah.sessions).totalSessions}):undefined},
    {key:'quran',path:'/quran',icon:'asr',summary:quran?.catalog.size===114?t('quran.ayat',{value:summarizeReading(quran.catalog,quran.sessions).ayat}):undefined},
    {key:'dzikir',path:'/dhikr',icon:'heart',summary:dhikr?t('dhikr.repetitions',{value:summarizeDhikr(dhikr.logs).repetitions}):undefined},
  ];
  const tools:Tile[]=[
    {key:'qibla',path:'/islamic/qibla',icon:'droplet'},
    {key:'schedule',path:'/islamic/schedule',icon:'fajr'},
    {key:'calendar',path:'/islamic/calendar',icon:'moon'},
  ];
  const library:Tile[]=[
    {key:'hadith',path:{pathname:'/islamic/[resource]',params:{resource:'hadith'}},icon:'asr'},
    {key:'dua',path:{pathname:'/islamic/[resource]',params:{resource:'dua'}},icon:'heart'},
    {key:'husna',path:{pathname:'/islamic/[resource]',params:{resource:'husna'}},icon:'dhuhr'},
  ];
  const columns=(count:number)=>width<320||fontScale>1.35?1:count===3&&width<360?2:count;
  const grid=(heading:string,tiles:Tile[],count:number)=><View style={styles.section}>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{heading}</BodyText>
    <View style={styles.grid}>{tiles.map(({key,path,icon,summary})=><Pressable key={key} accessibilityRole="button" onPress={()=>router.push(path)}
      style={({pressed})=>[styles.tile,count===3 && styles.compactTile,{width:columns(count)===1?'100%':columns(count)===2?'48%':'31%',backgroundColor:pressed?colors.selected:colors.surface,borderColor:colors.border}]}>
      <View style={count===2 && styles.tileHeader}>
        <View style={[styles.icon, count===2 && {backgroundColor:colors.selected}]}>
          <PrayerIcon kind={icon} color={colors.primary} background={count===2?colors.selected:colors.surface} size={21}/>
        </View>
        {count===2 && <PrayerIcon kind="next" color={colors.muted} background={colors.surface} size={16}/>}
      </View>
      <BodyText style={[styles.name,count===3 && styles.centered]}>{t('hub.'+key)}</BodyText>
      {summary && <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{summary}</BodyText>}
    </Pressable>)}</View>
  </View>;
  return <ScreenContainer compact>
    <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('tabs.tracker')}</BodyText>
    <PrayerHero/>
    <HijriSummary date={today} compact/>
    {grid(t('hub.daily'),daily,2)}
    {grid(t('hub.tools'),tools,3)}
    {grid(t('hub.learn'),library,3)}
  </ScreenContainer>;
}
const styles=StyleSheet.create({
  section:{gap:space.sm},grid:{flexDirection:'row',flexWrap:'wrap',gap:space.xs},
  tile:{minHeight:76,borderWidth:StyleSheet.hairlineWidth,borderRadius:radius.md,padding:space.sm,gap:space.xs},
  icon:{width:32,height:32,borderRadius:9,alignItems:'center',justifyContent:'center'},
  compactTile:{alignItems:'center',justifyContent:'center',minHeight:62},
  tileHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  centered:{textAlign:'center'},
  name:{fontWeight:'700',fontSize:14,lineHeight:20},
});
