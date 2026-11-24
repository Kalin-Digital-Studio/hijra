import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppHeader, BodyText, Button, ScreenContainer, SectionTitle } from '../../components/ui';
import { productName } from '../../constants/application';
import { categoryIds } from '../../database/seeds/master';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../stores/settings';
import { radius, space, typography } from '../../theme/tokens';
import { formatDate } from '../../utils/format';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const language = useSettings((state) => state.language);
  return (
    <ScreenContainer>
      <AppHeader title={productName} subtitle={formatDate(new Date(), language)} />
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={[styles.accent, { backgroundColor: colors.accent }]} />
        <BodyText accessibilityRole="header" style={[styles.greeting, { color: colors.onPrimary }]}>{t('greeting')}</BodyText>
        <BodyText style={{ color: colors.onPrimary }}>{t('tagline')}</BodyText>
      </View>
      <SectionTitle>{t('shortcuts')}</SectionTitle>
      <View style={styles.shortcuts}>
        {categoryIds.map((category) => (
          <View key={category} style={styles.tile}>
            <Button label={t(`categories.${category}`)} onPress={() => router.push({ pathname: '/ibadah/[category]', params: { category } })} />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { padding: space.lg, borderRadius: radius.lg, gap: space.sm },
  accent: { width: 36, height: 3, borderRadius: 2, marginBottom: space.xs },
  greeting: { fontSize: typography.hero, lineHeight: 43, fontWeight: '700' },
  shortcuts: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: { flexGrow: 1, flexBasis: 136 },
});
