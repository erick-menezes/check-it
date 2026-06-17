import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import type { AddNotificationInput } from '@/features/notifications/notifications-store';
import {
  MAX_STORED_NOTIFICATIONS,
  useNotificationsStore,
} from '@/features/notifications/notifications-store';

const SAMPLE_INPUT: AddNotificationInput = {
  type: 'budgetAlert',
  title: 'Compras da semana passou do limite',
  body: 'Você gastou R$ 210,00 e o limite era R$ 200,00.',
};

beforeEach(async () => {
  await AsyncStorage.clear();
  useNotificationsStore.setState({
    notifications: [],
    budgetThresholdLatch: {},
    hasHydrated: false,
  });
});

describe('notifications-store', () => {
  it('starts with no notifications and an empty latch', () => {
    const { result } = renderHook(() => useNotificationsStore());
    expect(result.current.notifications).toEqual([]);
    expect(result.current.budgetThresholdLatch).toEqual({});
  });

  it('addNotification assigns id, createdAt and read:false', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.addNotification(SAMPLE_INPUT);
    });
    const [notification] = result.current.notifications;
    expect(notification.id).toEqual(expect.any(String));
    expect(notification.createdAt).toEqual(expect.any(String));
    expect(notification.read).toBe(false);
    expect(notification.title).toBe(SAMPLE_INPUT.title);
  });

  it('addNotification prepends newest-first', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.addNotification({ ...SAMPLE_INPUT, title: 'First' });
      result.current.addNotification({ ...SAMPLE_INPUT, title: 'Second' });
    });
    expect(result.current.notifications.map((item) => item.title)).toEqual([
      'Second',
      'First',
    ]);
  });

  it('caps the list at MAX_STORED_NOTIFICATIONS pruning the oldest', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      for (let index = 0; index < MAX_STORED_NOTIFICATIONS + 1; index += 1) {
        result.current.addNotification({
          ...SAMPLE_INPUT,
          title: `Notification ${index}`,
        });
      }
    });
    expect(result.current.notifications).toHaveLength(MAX_STORED_NOTIFICATIONS);
    const titles = result.current.notifications.map((item) => item.title);
    expect(titles).toContain('Notification 1');
    expect(titles).not.toContain('Notification 0');
  });

  it('markAsRead flips a single notification', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.addNotification({ ...SAMPLE_INPUT, title: 'A' });
      result.current.addNotification({ ...SAMPLE_INPUT, title: 'B' });
    });
    const target = result.current.notifications[0];
    act(() => {
      result.current.markAsRead(target.id);
    });
    const updated = result.current.notifications.find(
      (item) => item.id === target.id,
    );
    const other = result.current.notifications.find(
      (item) => item.id !== target.id,
    );
    expect(updated?.read).toBe(true);
    expect(other?.read).toBe(false);
  });

  it('markAllAsRead flips every notification', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.addNotification({ ...SAMPLE_INPUT, title: 'A' });
      result.current.addNotification({ ...SAMPLE_INPUT, title: 'B' });
    });
    act(() => {
      result.current.markAllAsRead();
    });
    expect(result.current.notifications.every((item) => item.read)).toBe(true);
  });

  it('setBudgetThresholdLatch stores the band per list id', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.setBudgetThresholdLatch('list-1', 'warning');
      result.current.setBudgetThresholdLatch('list-2', 'overBudget');
    });
    expect(result.current.budgetThresholdLatch).toEqual({
      'list-1': 'warning',
      'list-2': 'overBudget',
    });
  });

  it('writes notifications and latch through to AsyncStorage', async () => {
    const { result } = renderHook(() => useNotificationsStore());
    await act(async () => {
      result.current.addNotification(SAMPLE_INPUT);
      result.current.setBudgetThresholdLatch('list-1', 'warning');
    });
    const stored = await AsyncStorage.getItem('checkit:notifications');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.notifications).toHaveLength(1);
    expect(parsed.state.budgetThresholdLatch).toEqual({ 'list-1': 'warning' });
  });

  it('partialize excludes hasHydrated from persisted state', async () => {
    const { result } = renderHook(() => useNotificationsStore());
    await act(async () => {
      result.current.addNotification(SAMPLE_INPUT);
    });
    const stored = await AsyncStorage.getItem('checkit:notifications');
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.hasHydrated).toBeUndefined();
  });

  it('setHasHydrated sets the flag', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.setHasHydrated(true);
    });
    expect(result.current.hasHydrated).toBe(true);
  });
});
