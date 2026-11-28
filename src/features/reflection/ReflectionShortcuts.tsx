import { useRouter } from 'expo-router';
import type { SQLiteDatabase } from 'expo-sqlite';
import { useCallback } from 'react';
import { Pressable,StyleSheet,View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { readReflectionShortcut } from '../../database/repositories/reflections';
import { useTheme } from '../../hooks/useTheme';
import { reflectionWeek } from '../../services/reflectionRules';
import { useSettings } from '../../stores/settings';
import { light,radius,space } from '../../theme/tokens';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { PrayerAction,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { usePrivateData } from './usePrivateData';

export function ReflectionShortcuts() {
  const {t}=useTranslation();
  const router=useRouter();
  const {colors}=useTheme();
  const today=useToday();
  const preference=useSettings(state=>state.week_start);
  const load=useCallback((db:SQLiteDatabase,user:string)=>readReflectionShortcut(db,user,reflectionWeek(today,preference),today)
    .then(row=>({id:row?.id})),[today,preference]);
  const {data}=usePrivateData(JSON.stringify([today,preference]),load);
  return <View style={styles.section}>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('reflection.section')}</BodyText>
    <PrayerPanel style={{backgroundColor:light.primary,borderColor:light.primary}}>
      <PrayerIcon kind="book" color={light.accent} background={light.primary} size={22}/>
      <BodyText style={[prayerStyles.section,{color:light.onPrimary}]}>{t('reflection.title')}</BodyText>
      <BodyText style={prayerStyles.onGreen}>{t('reflection.intro')}</BodyText>
      {!!data&&<BodyText style={prayerStyles.onGreen}>{t(data.id?'reflection.hasReflection':'reflection.noReflection')}</BodyText>}
      <PrayerAction label={t(data?.id?'reflection.view':'reflection.start')} onPress={()=>{
        if(data?.id)router.push({pathname:'/reports/reflection/[view]',params:{view:'detail',id:data.id}});
        else router.push('/reports/reflection/home');
      }}/>
    </PrayerPanel>
    <PrayerPanel>
      {([
        {label:'worship',icon:'target',route:'/reports/worship-history/home'},
        {label:'history',icon:'book',route:'/reports/reflection/history'},
      ] as const).map(item=><Pressable key={item.label} accessibilityRole="button" onPress={()=>router.push(item.route)}
        style={({pressed})=>[styles.row,pressed&&{backgroundColor:colors.selected}]}>
        <View style={[styles.badge,{backgroundColor:colors.selected}]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <PrayerIcon kind={item.icon} color={colors.primary} background={colors.selected} size={20}/>
        </View>
        <BodyText style={styles.text}>{t('reflection.'+item.label)}</BodyText>
        <PrayerIcon kind="next" color={colors.primary} background={colors.surface} size={18}/>
      </Pressable>)}
    </PrayerPanel>
  </View>;
}
const styles=StyleSheet.create({
  section:{gap:space.sm},row:{flexDirection:'row',alignItems:'center',minHeight:48,gap:space.sm},
  text:{flex:1,fontWeight:'700'},badge:{width:34,height:34,borderRadius:radius.md,alignItems:'center',justifyContent:'center'},
});
