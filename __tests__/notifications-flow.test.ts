import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import type { ActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';
import { startBudgetAlertTracking } from '@/features/notifications/budget-alerts';
import { useNotificationsStore } from '@/features/notifications/notifications-store';
import { useUnreadNotifications } from '@/features/notifications/use-unread-notifications';
import { useSettingsStore } from '@/features/settings/settings-store';

const BASE_LIST: ActiveList = {
  id: 'list-1',
  name: 'Compra de Maio',
  itemCount: 5,
  createdAt: '2026-06-07T10:00:00.000Z',
  totalInCents: 30000,
  limitInCents: 60000,
  items: [],
};

function makeList(overrides: Partial<ActiveList>): ActiveList {
  return { ...BASE_LIST, ...overrides };
}

function setActiveList(list: ActiveList | null): void {
  useActiveListStore.getState().setActiveList(list);
}

describe('notifications flow', () => {
  let stopTracking: () => void = () => {};

  beforeEach(async () => {
    await AsyncStorage.clear();
    useActiveListStore.setState({ activeList: null, hasHydrated: false });
    useNotificationsStore.setState({
      notifications: [],
      budgetThresholdLatch: {},
      hasHydrated: false,
    });
    useSettingsStore.setState({ budgetAlertsEnabled: true, hasHydrated: false });
    stopTracking = startBudgetAlertTracking();
  });

  afterEach(() => {
    stopTracking();
  });

  it('raises an unread alert when the active list crosses 85% and clears it on mark-all', () => {
    const { result } = renderHook(() => useUnreadNotifications());
    act(() => {
      setActiveList(makeList({ totalInCents: 30000 }));
    });
    expect(useNotificationsStore.getState().notifications).toHaveLength(0);
    expect(result.current).toBe(false);
    act(() => {
      setActiveList(makeList({ totalInCents: 54000 }));
    });
    const notifications = useNotificationsStore.getState().notifications;
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toMatch(/chegou a 90% do limite/);
    expect(notifications[0].read).toBe(false);
    expect(result.current).toBe(true);
    act(() => {
      useNotificationsStore.getState().markAllAsRead();
    });
    expect(result.current).toBe(false);
  });
});
