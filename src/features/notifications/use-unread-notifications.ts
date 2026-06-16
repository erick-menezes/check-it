import { useNotificationsStore } from './notifications-store';

export function useUnreadNotifications(): boolean {
  return useNotificationsStore((state) =>
    state.notifications.some((notification) => !notification.read),
  );
}
