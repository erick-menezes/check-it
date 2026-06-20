import type { Href } from 'expo-router';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Home, type LucideIcon, Settings } from 'lucide-react-native';
import { type JSX, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

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

interface TabBarButtonProps extends TabTriggerSlotProps {
  icon: LucideIcon;
  label: string;
  testID: string;
}

function TabBarButton({
  icon: Icon,
  label,
  testID,
  isFocused,
  ...rest
}: TabBarButtonProps): JSX.Element {
  const color = isFocused ? '#58AB6A' : '#8A8A8A';
  const scale = useRef(new Animated.Value(1)).current;
  const animateScaleTo = (toValue: number, duration: number): void => {
    Animated.timing(scale, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      {...rest}
      onPressIn={() => animateScaleTo(0.88, 90)}
      onPressOut={() => animateScaleTo(1, 160)}
      accessibilityRole="tab"
      accessibilityState={{ selected: Boolean(isFocused) }}
      accessibilityLabel={label}
      testID={testID}
      className="h-16 flex-1"
    >
      <Animated.View
        className="flex-1 flex-col items-center justify-center gap-1"
        style={{ transform: [{ scale }] }}
      >
        <Icon size={22} color={color} fill="transparent" strokeWidth={2} />
        <Text
          className={cn(
            'text-[11px] font-semibold',
            isFocused ? 'text-checkit-primary' : 'text-checkit-pebble-gray',
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function BottomTabBar(): JSX.Element {
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
