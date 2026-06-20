import { router } from 'expo-router';
import { Bell, CircleHelp, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnreadNotifications } from '@/features/notifications/use-unread-notifications';
import { useGreeting } from '../use-greeting';
import { CreateListCta } from './create-list-cta';

interface HeaderActionProps {
  Icon: LucideIcon;
  label: string;
  testID: string;
  onPress: () => void;
}

function HeaderAction({
  Icon,
  label,
  testID,
  onPress,
}: HeaderActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
      className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.16]"
    >
      <Icon size={22} color="#ffffff" strokeWidth={2} />
    </Pressable>
  );
}

export function HomeHeader() {
  const insets = useSafeAreaInsets();
  const { greeting, subtitle } = useGreeting();
  const hasUnread = useUnreadNotifications();
  return (
    <View
      style={{ paddingTop: insets.top + 16 }}
      className="bg-checkit-primary px-[22px] pb-7"
    >
      <View className="flex-row items-center justify-end gap-2">
        <HeaderAction
          Icon={CircleHelp}
          label="Ajuda"
          testID="header-help"
          onPress={() => router.push('/help')}
        />
        <View>
          <HeaderAction
            Icon={Bell}
            label="Notificações"
            testID="header-notifications"
            onPress={() => router.push('/notifications')}
          />
          {hasUnread && (
            <View
              pointerEvents="none"
              testID="notifications-dot"
              className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border border-checkit-primary bg-checkit-accent"
            />
          )}
        </View>
      </View>
      <View className="mt-4">
        <Text className="text-[28px] font-bold tracking-tight text-white">
          {greeting}!
        </Text>
        <Text className="mt-1.5 text-[15px] font-medium text-white/90">
          {subtitle}
        </Text>
      </View>
      <View className="mt-5">
        <CreateListCta />
      </View>
    </View>
  );
}
