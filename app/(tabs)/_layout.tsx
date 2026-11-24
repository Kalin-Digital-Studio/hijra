import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { TabIcon, tabIcons } from '../../src/components/TabIcon';

const tabs = ['index', 'tracker', 'goals', 'reports', 'profile'] as const;

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      sceneStyle: { backgroundColor: colors.background },
    }}>
      {tabs.map((name) => (
        <Tabs.Screen key={name} name={name} options={{
          title: t(`tabs.${name === 'index' ? 'home' : name}`),
          tabBarIcon: ({ color }) => <TabIcon icon={tabIcons[name]} color={color} />,
        }} />
      ))}
    </Tabs>
  );
}
