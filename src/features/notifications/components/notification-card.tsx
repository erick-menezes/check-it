import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/utils';
import {
  type AppNotification,
  NOTIFICATION_TYPE_CATALOG,
} from '../notification';
import { useNotificationsStore } from '../notifications-store';
import { formatRelativeTime } from '../relative-time';

interface NotificationCardProps {
  notification: AppNotification;
  now?: Date;
}

export function NotificationCard({
  notification,
  now = new Date(),
}: NotificationCardProps) {
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const meta = NOTIFICATION_TYPE_CATALOG[notification.type];
  const relativeTime = formatRelativeTime(notification.createdAt, now);
  const readStateLabel = notification.read ? 'lida' : 'não lida';
  const TypeIcon = meta.Icon;
  return (
    <Pressable
      onPress={() => markAsRead(notification.id)}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.body}. ${relativeTime}. Notificação ${readStateLabel}.`}
      testID={`notification-card-${notification.id}`}
      className="flex-row items-start gap-3 rounded-[14px] border-hairline border-checkit-mist-border bg-white px-4 py-3.5"
    >
      <View
        className={cn(
          'h-[44px] w-[44px] items-center justify-center rounded-[12px]',
          meta.tintClass,
        )}
      >
        <TypeIcon size={22} color={meta.color} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[13px] font-bold tracking-tight text-checkit-charcoal-ink">
            {notification.title}
          </Text>
          <Text className="text-[11px] font-medium text-checkit-pebble-gray">
            {relativeTime}
          </Text>
        </View>
        <Text className="mt-1 text-[12px] leading-[18px] text-checkit-slate-ink">
          {notification.body}
        </Text>
      </View>
      {!notification.read && (
        <View
          pointerEvents="none"
          testID="notification-unread-dot"
          className="mt-1 h-2 w-2 rounded-full bg-checkit-accent"
        />
      )}
    </Pressable>
  );
}
