import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import type { Language } from '../../types/settings';

export function ProfileAvatar({ uri, name, language, size = 72 }: { uri?: string; name?: string; language?: Language; size?: number }) {
  const [failed, setFailed] = useState<string>();
  const { colors } = useTheme();
  const { t } = useTranslation(undefined, { lng: language });
  const dimensions = { width: size, height: size, borderRadius: size / 2 };
  if (uri && failed !== uri) return <Image accessibilityLabel={t('personal.avatar')} source={{ uri }} onError={() => setFailed(uri)} style={[styles.avatar, dimensions]} />;
  return (
    <View accessible accessibilityLabel={t('personal.defaultAvatar')} style={[styles.avatar, dimensions, { backgroundColor: colors.selected }]}>
      <BodyText style={{ color: colors.primary, fontSize: 23, lineHeight: 30 }}>{Array.from(name?.trim() ?? '')[0]?.toUpperCase() || '○'}</BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
});
