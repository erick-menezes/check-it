import type { Href } from 'expo-router';
import { TabTrigger } from 'expo-router/ui';
import { Home, type LucideIcon, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarButton } from './components/tab-bar-button';

interface TabDefinition {
  readonly name: string;
  readonly href: Href;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly testID: string;
}

export const VISIBLE_TABS: readonly TabDefinition[] = [
  {
    name: 'home',
    href: '/home',
    label: 'Início',
    icon: Home,
    testID: 'tab-home',
  },
  {
    name: 'settings',
    href: '/settings',
    label: 'Ajustes',
    icon: Settings,
    testID: 'tab-settings',
  },
];

export function BottomTabBar() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingBottom: insets.bottom }}
      className="flex-row border-t-hairline border-t-checkit-mist-border bg-white"
    >
      {VISIBLE_TABS.map((tab) => (
        <TabTrigger key={tab.name} name={tab.name} asChild>
          <TabBarButton icon={tab.icon} label={tab.label} testID={tab.testID} />
        </TabTrigger>
      ))}
    </View>
  );
}
