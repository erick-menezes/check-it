import type { JSX } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SettingsHeader(): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className="border-b-hairline border-b-checkit-mist-border bg-white px-[22px] pb-4"
    >
      <Text className="text-[28px] font-bold tracking-tight text-checkit-charcoal-ink">
        Ajustes
      </Text>
    </View>
  );
}
