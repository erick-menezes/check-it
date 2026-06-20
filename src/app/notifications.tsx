import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { NotificationCard } from '@/features/notifications/components/notification-card';
import { NotificationsEmptyState } from '@/features/notifications/components/notifications-empty-state';
import { NotificationsHeader } from '@/features/notifications/components/notifications-header';
import type { AppNotification } from '@/features/notifications/notification';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

const SCREEN_ANIMATION_DURATION = 240;

export default function NotificationsScreen() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const renderItem = useCallback(
    ({ item }: { item: AppNotification }) => (
      <NotificationCard notification={item} />
    ),
    [],
  );
  return (
    <View testID="notifications-screen" className="flex-1 bg-white">
      <Stack.Screen
        options={{
          animation: 'simple_push',
          animationDuration: SCREEN_ANIMATION_DURATION,
          gestureEnabled: true,
        }}
      />
      <NotificationsHeader />
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-24">
          <NotificationsEmptyState />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 p-[22px] pt-4 pb-[100px]"
        />
      )}
    </View>
  );
}
