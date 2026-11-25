import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import type { Language } from '../../types/settings';

export function ProfileAvatar({ uri, name, language }: { uri?: string; name?: string; language?: Language }) {
  const [failed, setFailed] = useState<string>();
  const { colors } = useTheme();
  const { t } = useTranslation(undefined, { lng: language });
  if (uri && failed !== uri) return <Image accessibilityLabel={t('personal.avatar')} source={{ uri }} onError={() => setFailed(uri)} style={styles.avatar} />;
  return (
    <View accessible accessibilityLabel={t('personal.defaultAvatar')} style={[styles.avatar, { backgroundColor: colors.selected }]}>
      <BodyText style={{ color: colors.primary, fontSize: 23, lineHeight: 30 }}>{Array.from(name?.trim() ?? '')[0]?.toUpperCase() || '○'}</BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
});
