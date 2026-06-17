import { Bell } from 'lucide-react-native';
import type { JSX } from 'react';
import { Text, View } from 'react-native';

export function NotificationsEmptyState(): JSX.Element {
  return (
    <View
      testID="notifications-empty-state"
      className="items-center px-6 py-10"
    >
      <View className="h-[80px] w-[80px] items-center justify-center rounded-full bg-checkit-pebble-gray/[0.12]">
        <Bell size={36} color="#8A8A8A" strokeWidth={1.75} />
      </View>
      <Text className="mt-4 text-base font-bold tracking-tight text-checkit-charcoal-ink">
        Tudo em dia
      </Text>
      <Text className="mt-1 text-center text-sm font-medium text-checkit-pebble-gray">
        Quando algo importante acontecer, você verá por aqui.
      </Text>
    </View>
  );
}
