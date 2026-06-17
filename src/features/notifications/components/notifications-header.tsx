import { router } from "expo-router";
import { X } from "lucide-react-native";
import type { JSX } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotificationsStore } from "../notifications-store";
import { useUnreadNotifications } from "../use-unread-notifications";

function handleClose(): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/(tabs)/home");
}

export function NotificationsHeader(): JSX.Element {
  const insets = useSafeAreaInsets();
  const hasUnread = useUnreadNotifications();
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className="border-b-hairline border-b-checkit-mist-border bg-white px-[22px] pb-4"
    >
      <Pressable
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        testID="notifications-close"
        className="-ml-2 h-11 w-11 items-center justify-center rounded-full"
      >
        <X size={24} color="#1B1B1B" strokeWidth={2} />
      </Pressable>
      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-[28px] font-bold tracking-tight text-checkit-charcoal-ink">
          Notificações
        </Text>
        {hasUnread && (
          <Pressable
            onPress={markAllAsRead}
            accessibilityRole="button"
            accessibilityLabel="Marcar todas como lidas"
            testID="notifications-mark-all"
            className="-mr-2 h-11 justify-center px-2"
          >
            <Text className="text-[13px] font-bold text-checkit-primary">
              Marcar todas
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
