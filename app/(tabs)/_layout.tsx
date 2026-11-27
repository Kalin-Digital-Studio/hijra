import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
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
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPill, focused && { backgroundColor: colors.selected }]}>
              <TabIcon icon={tabIcons[name]} color={color} />
            </View>
          ),
          tabBarLabel: ({ color, focused, children }) => (
            <Text numberOfLines={1} style={[styles.label, { color }, focused && styles.activeLabel]}>
              {children}
            </Text>
          ),
        }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPill: { width: 46, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, textAlign: 'center' },
  activeLabel: { fontWeight: '700' },
});
