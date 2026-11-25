import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Card, ScreenContainer } from '../../components/ui';
import { brandTagline, developerName, productName } from '../../constants/application';
import { useTheme } from '../../hooks/useTheme';
import { useProfile } from '../../stores/profile';
import { useSettings } from '../../stores/settings';
import { space, typography } from '../../theme/tokens';
import { avatarSource } from './avatar';
import { SavedPreference } from './Preferences';
import { ProfileAvatar } from './ProfileAvatar';

function ProfileRow({ label, value, onPress, expanded, divider }: {
  label: string; value?: string; onPress: () => void; expanded?: boolean; divider?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={onPress}
      style={({ pressed }) => [styles.row, {
        borderTopWidth: divider ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.border,
        backgroundColor: pressed ? colors.selected : 'transparent',
      }]}>
      <BodyText style={styles.rowLabel}>{label}</BodyText>
      {value && <BodyText style={[styles.value, { color: colors.muted }]}>{value}</BodyText>}
      <BodyText accessible={false} style={{ color: colors.primary }}>{expanded ? '⌄' : '›'}</BodyText>
    </Pressable>
  );
}

export default function Profile() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useProfile((state) => state.profile);
  const { colors } = useTheme();
  const language = useSettings((state) => state.language);
  const theme = useSettings((state) => state.theme);
  const weekday = useSettings((state) => state.week_start);
  const [expanded, setExpanded] = useState<'language' | 'theme'>();
  return (
    <ScreenContainer>
      <BodyText accessibilityRole="header" style={[styles.center, styles.eyebrow, { color: colors.muted }]}>{t('personal.profileSettings')}</BodyText>
      <View style={styles.identity}>
        <BodyText style={[styles.brand, { color: colors.primary }]}>{productName}.</BodyText>
        <ProfileAvatar name={profile?.displayName} uri={avatarSource(profile?.avatarUri ?? null)} />
        <BodyText style={[styles.name, styles.center]}>{profile?.displayName}</BodyText>
        <Pressable accessibilityRole="button" onPress={() => router.push('/profile/edit')} style={styles.edit}>
          <BodyText style={[styles.value, { color: colors.primary }]}>{t('personal.edit')} ›</BodyText>
        </Pressable>
      </View>
      <BodyText accessibilityRole="header" style={styles.section}>{t('personal.personalization')}</BodyText>
      <Card>
        <ProfileRow label={t('settings.language')} value={t(`settings.${language}`)} expanded={expanded === 'language'}
          onPress={() => setExpanded(expanded === 'language' ? undefined : 'language')} />
        {expanded === 'language' && <SavedPreference field="language" />}
        <ProfileRow label={t('settings.theme')} value={t(`settings.${theme}`)} expanded={expanded === 'theme'} divider
          onPress={() => setExpanded(expanded === 'theme' ? undefined : 'theme')} />
        {expanded === 'theme' && <SavedPreference field="theme" />}
        <ProfileRow label={t('personal.weekStart')} value={t(`weekdays.${weekday}`)} divider onPress={() => router.push('/settings/week-start')} />
      </Card>
      <BodyText accessibilityRole="header" style={styles.section}>{t('personal.information')}</BodyText>
      <Card>
        <ProfileRow label={t('personal.introduction')} onPress={() => router.push('/settings/introduction')} />
        <ProfileRow label={t('settings.about')} divider onPress={() => router.push('/about')} />
        <ProfileRow label={t('settings.licenses')} divider onPress={() => router.push('/about/licenses')} />
      </Card>
      <View style={styles.identity}>
        <BodyText style={[styles.value, styles.center, { color: colors.muted }]}>{brandTagline}</BodyText>
        <BodyText style={[styles.value, styles.center, { color: colors.muted }]}>
          {t('version', { version: Constants.expoConfig?.version })} · {developerName}
        </BodyText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  eyebrow: { fontSize: typography.small, lineHeight: 20 },
  identity: { alignItems: 'center', gap: space.xs },
  brand: { fontSize: 18, lineHeight: 24, fontWeight: '700', marginBottom: space.xs },
  name: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  section: { fontSize: typography.body, lineHeight: 22, fontWeight: '600' },
  edit: { minHeight: 44, paddingHorizontal: space.md, justifyContent: 'center' },
  row: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs },
  rowLabel: { flex: 1, fontSize: typography.small, lineHeight: 20 },
  value: { fontSize: typography.small, lineHeight: 20 },
});
