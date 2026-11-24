import { useColorScheme } from 'react-native';
import { useSettings } from '../stores/settings';
import { dark, light } from '../theme/tokens';

export function useTheme() {
  const system = useColorScheme();
  const preference = useSettings((state) => state.theme);
  const isDark = preference === 'dark' || (preference === 'system' && system === 'dark');
  return { colors: isDark ? dark : light, isDark };
}
