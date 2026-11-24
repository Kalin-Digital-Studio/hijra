import { Text, type ColorValue } from 'react-native';

export const tabIcons = { index: '⌂', tracker: '✓', goals: '◎', reports: '▥', profile: '◉' } as const;

export function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return <Text accessible={false} importantForAccessibility="no" style={{ color, fontSize: 23 }}>{icon}</Text>;
}
