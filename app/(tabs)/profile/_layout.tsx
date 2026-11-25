import { Stack } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';

export default function ProfileLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
