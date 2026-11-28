import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, LoadingState, ScreenContainer } from '../../components/ui';
import { BrandLogo } from '../../components/BrandLogo';
import { brandTagline, productName } from '../../constants/application';
import { useTheme } from '../../hooks/useTheme';
import { useProfile } from '../../stores/profile';
import { space } from '../../theme/tokens';
import { formatDate } from '../goals/GoalUI';
import { PrayerHero } from '../islamic/PrayerSchedule';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { ProfileAvatar } from '../profile/ProfileAvatar';
import { avatarSource } from '../profile/avatar';
import { DashboardGoals, DashboardReading, DashboardRecent, DashboardTrend, DailyWorship } from './DashboardSections';
import { useDashboard } from './useDashboard';

export default function Dashboard() {
  const {t,i18n}=useTranslation();
  const {colors}=useTheme();
  const router=useRouter();
  const profile=useProfile(state=>state.profile);
  const {today,data,failed,retry}=useDashboard();
  const name=profile?.displayName.trim();
  const locale=i18n.resolvedLanguage ?? 'id';
  return <ScreenContainer compact>
    <View style={styles.header}>
      <View style={prayerStyles.line}>
        <View style={styles.brand}>
          <BrandLogo compact />
          <BodyText style={prayerStyles.title}>{productName}</BodyText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('tabs.profile')} onPress={() => router.push('/profile')}
          style={styles.avatar}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <ProfileAvatar name={name} uri={avatarSource(profile?.avatarUri ?? null)} size={44} />
          </View>
        </Pressable>
      </View>
      <BodyText accessibilityRole="header" style={styles.greeting}>
        {t(name ? 'personal.greeting' : 'dashboard.greeting',{name})}
      </BodyText>
      <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{formatDate(today,locale)}</BodyText>
    </View>
    <PrayerHero compact />
    {failed && <><EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={retry} /></>}
    {!data && !failed && <LoadingState />}
    {data && <>
      <DailyWorship data={data} />
      <DashboardReading reading={data.reading} />
      <DashboardGoals goals={data.goals} />
      <DashboardTrend trend={data.trend} />
      <DashboardRecent recent={data.recent} catalog={data.reading.catalog} />
    </>}
    <PrayerPanel style={{backgroundColor:colors.selected}}>
      <BodyText style={[prayerStyles.section,{color:colors.primary}]}>{t('dashboard.footer')}</BodyText>
      <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{brandTagline}</BodyText>
    </PrayerPanel>
  </ScreenContainer>;
}
const styles=StyleSheet.create({
  header:{gap:space.xs},
  brand:{flexDirection:'row',alignItems:'center',gap:space.sm,flexShrink:1},
  avatar:{width:48,height:48,justifyContent:'center',alignItems:'center'},
  greeting:{fontSize:23,lineHeight:31,fontWeight:'700'},
});
