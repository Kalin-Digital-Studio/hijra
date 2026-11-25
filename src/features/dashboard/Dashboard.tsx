import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppHeader, BodyText, Button, ScreenContainer, SectionTitle } from '../../components/ui';
import { BrandLogo } from '../../components/BrandLogo';
import { productName } from '../../constants/application';
import { categoryIds } from '../../database/seeds/master';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../stores/settings';
import { useProfile } from '../../stores/profile';
import { radius, space, typography } from '../../theme/tokens';
import { formatDate } from '../../utils/format';
import { TodayPrayerCard } from '../prayer/TodayPrayerCard';
import { TodaySunnahCard } from '../sunnah/TodaySunnahCard';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const language = useSettings((state) => state.language);
  const name = useProfile((state) => state.profile?.displayName);
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <BodyText style={{ color: colors.muted }}>{formatDate(new Date(), language)}</BodyText>
        <View style={styles.brand}>
          <BrandLogo compact />
          <AppHeader title={productName} />
        </View>
      </View>
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={[styles.accent, { backgroundColor: colors.accent }]} />
        <BodyText accessibilityRole="header" textBreakStrategy="simple" style={[styles.greeting, { color: colors.onPrimary }]}>{t('personal.greeting', { name })}</BodyText>
        <BodyText style={{ color: colors.onPrimary }}>{t('personal.dashboard')}</BodyText>
      </View>
      <TodayPrayerCard />
      <TodaySunnahCard />
      <SectionTitle>{t('shortcuts')}</SectionTitle>
      <View style={styles.shortcuts}>
        {categoryIds.filter((category) => category !== 'prayer' && category !== 'sunnah').map((category) => (
          <View key={category} style={styles.tile}>
            <Button label={t(`categories.${category}`)} onPress={() => router.push({ pathname: '/ibadah/[category]', params: { category } })} />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.xs },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  hero: { padding: space.lg, borderRadius: radius.lg, gap: space.sm },
  accent: { width: 36, height: 3, borderRadius: 2, marginBottom: space.xs },
  greeting: { fontSize: typography.section, lineHeight: 29, fontWeight: '700' },
  shortcuts: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: { flexGrow: 1, flexBasis: 136 },
});
