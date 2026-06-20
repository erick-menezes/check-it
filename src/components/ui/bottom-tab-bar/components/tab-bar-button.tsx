import type { TabTriggerSlotProps } from 'expo-router/ui';
import type { LucideIcon } from 'lucide-react-native';
import { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface TabBarButtonProps extends TabTriggerSlotProps {
  icon: LucideIcon;
  label: string;
  testID: string;
}

export function TabBarButton({
  icon: Icon,
  label,
  testID,
  isFocused,
  ...rest
}: TabBarButtonProps) {
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
