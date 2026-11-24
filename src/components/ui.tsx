import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
  type TextInputProps, type TextProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { radius, space, typography } from '../theme/tokens';

export function ScreenContainer({ children, standalone }: PropsWithChildren<{ standalone?: boolean }>) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={standalone ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']} style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.column}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function BodyText({ style, ...props }: TextProps) {
  const { colors } = useTheme();
  return <Text {...props} style={[styles.body, { color: colors.text }, style]} />;
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      {subtitle ? <BodyText style={{ color: colors.muted }}>{subtitle}</BodyText> : null}
      <BodyText accessibilityRole="header" style={styles.title}>{title}</BodyText>
    </View>
  );
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <BodyText accessibilityRole="header" style={styles.section}>{children}</BodyText>;
}

export function Card({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>;
}

export function Button({ label, onPress, selected, disabled }: {
  label: string; onPress: () => void; selected?: boolean; disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected, disabled }} disabled={disabled}
      onPress={onPress} style={({ pressed }) => [styles.button, {
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected || pressed ? colors.selected : colors.surface,
        opacity: disabled ? 0.6 : 1,
      }]}>
      <BodyText style={styles.buttonLabel}>{label}</BodyText>
    </Pressable>
  );
}

export function Input({ style, ...props }: TextInputProps) {
  const { colors } = useTheme();
  return <TextInput {...props} placeholderTextColor={colors.muted}
    style={[styles.button, styles.body, { color: colors.text, borderColor: colors.border }, style]} />;
}

export function Checkbox({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (checked: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked }}
      onPress={() => onChange(!checked)} style={[styles.button, { borderColor: colors.border }]}>
      <BodyText>{checked ? '☑' : '☐'} {label}</BodyText>
    </Pressable>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const { colors } = useTheme();
  const progress = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: progress }}
      style={[styles.progress, { backgroundColor: colors.border }]}>
      <View style={{ width: `${progress}%`, height: '100%', backgroundColor: colors.primary }} />
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <Card><BodyText>{message}</BodyText></Card>;
}

export function LoadingState() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return <Card><ActivityIndicator color={colors.primary} /><BodyText accessibilityLiveRegion="polite">{t('loading')}</BodyText></Card>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg },
  column: { width: '100%', maxWidth: 680, alignSelf: 'center', gap: space.md },
  stack: { gap: space.xs },
  body: { fontSize: typography.body, lineHeight: 24 },
  title: { fontSize: typography.title, lineHeight: 39, fontWeight: '700' },
  section: { fontSize: typography.section, lineHeight: 28, fontWeight: '700' },
  card: { borderWidth: 1, padding: space.md, borderRadius: radius.lg, gap: space.sm },
  button: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, justifyContent: 'center', paddingVertical: space.sm, paddingHorizontal: space.md },
  buttonLabel: { fontWeight: '600' },
  progress: { height: 8, overflow: 'hidden', borderRadius: radius.md },
});
