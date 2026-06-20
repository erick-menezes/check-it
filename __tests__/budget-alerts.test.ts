import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ActiveList, createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';
import { startBudgetAlertTracking } from '@/features/notifications/budget-alerts';
import { useNotificationsStore } from '@/features/notifications/notifications-store';
import { useSettingsStore } from '@/features/settings/settings-store';

const BASE_LIST: ActiveList = {
  id: 'list-1',
  name: 'Compra de Maio',
  itemCount: 5,
  createdAt: '2026-06-07T10:00:00.000Z',
  totalInCents: 0,
  limitInCents: 60000,
  items: [],
};

function makeList(overrides: Partial<ActiveList>): ActiveList {
  return { ...BASE_LIST, ...overrides };
}

const ON_TRACK_LIST = makeList({ totalInCents: 30000 });
const WARNING_LIST = makeList({ totalInCents: 54000 });
const OVER_BUDGET_LIST = makeList({ totalInCents: 66000 });

function setActiveList(list: ActiveList | null): void {
  useActiveListStore.getState().setActiveList(list);
}

function getNotifications() {
  return useNotificationsStore.getState().notifications;
}

describe('budget-alerts engine', () => {
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

  it('fires one warning when crossing into the warning band', () => {
    setActiveList(WARNING_LIST);
    const notifications = getNotifications();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toMatch(
      /Compra de Maio chegou a 90% do limite/,
    );
    expect(notifications[0].body).toMatch(/R\$\s?540,00/);
    expect(notifications[0].body).toMatch(/R\$\s?600,00/);
  });

  it('does not re-fire while staying in the warning band', () => {
    setActiveList(WARNING_LIST);
    setActiveList(makeList({ totalInCents: 55000 }));
    expect(getNotifications()).toHaveLength(1);
  });

  it('re-arms the warning after a downward crossing', () => {
    setActiveList(WARNING_LIST);
    setActiveList(ON_TRACK_LIST);
    setActiveList(WARNING_LIST);
    expect(getNotifications()).toHaveLength(2);
  });

  it('fires only the exceeded alert on a direct onTrack to overBudget jump', () => {
    setActiveList(OVER_BUDGET_LIST);
    const notifications = getNotifications();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toMatch(/Compra de Maio passou do limite/);
    expect(notifications[0].body).toMatch(/R\$\s?660,00/);
    expect(notifications[0].body).toMatch(/R\$\s?600,00/);
  });

  it('fires the exceeded alert when crossing warning to overBudget', () => {
    setActiveList(WARNING_LIST);
    setActiveList(OVER_BUDGET_LIST);
    const notifications = getNotifications();
    expect(notifications).toHaveLength(2);
    expect(notifications[0].title).toMatch(/passou do limite/);
  });

  it('suppresses the notification but still latches when alerts are disabled', () => {
    useSettingsStore.setState({ budgetAlertsEnabled: false });
    setActiveList(WARNING_LIST);
    expect(getNotifications()).toHaveLength(0);
    expect(
      useNotificationsStore.getState().budgetThresholdLatch['list-1'],
    ).toBe('warning');
  });

  it('treats an unknown list id as starting on track', () => {
    setActiveList(makeList({ id: 'fresh-list', totalInCents: 54000 }));
    expect(getNotifications()).toHaveLength(1);
  });

  it('does not duplicate when a rehydrated latch already matches the band', () => {
    useNotificationsStore.setState({
      budgetThresholdLatch: { 'list-1': 'warning' },
    });
    setActiveList(WARNING_LIST);
    expect(getNotifications()).toHaveLength(0);
  });

  it('stops emitting after unsubscribe', () => {
    stopTracking();
    setActiveList(WARNING_LIST);
    expect(getNotifications()).toHaveLength(0);
  });

  it('is a no-op for a null active list and leaves the latch untouched', () => {
    setActiveList(WARNING_LIST);
    setActiveList(null);
    expect(getNotifications()).toHaveLength(1);
    expect(
      useNotificationsStore.getState().budgetThresholdLatch['list-1'],
    ).toBe('warning');
  });

  it('is a no-op when the limit is zero or negative', () => {
    setActiveList(makeList({ limitInCents: 0, totalInCents: 10000 }));
    expect(getNotifications()).toHaveLength(0);
    expect(
      useNotificationsStore.getState().budgetThresholdLatch['list-1'],
    ).toBeUndefined();
  });

  it('fires warning then exceeded as checked item totals cross the bands', () => {
    useActiveListStore.getState().setActiveList(createActiveList(10000));
    useActiveListStore.getState().addItems([
      { name: 'Item A', quantity: 1, unitPriceInCents: 9000 },
      { name: 'Item B', quantity: 1, unitPriceInCents: 2000 },
    ]);
    const firstId = useActiveListStore.getState().activeList?.items[0].id ?? '';
    useActiveListStore.getState().toggleItem(firstId);
    expect(getNotifications()).toHaveLength(1);
    expect(getNotifications()[0].title).toMatch(/chegou a 90% do limite/);
    const secondId =
      useActiveListStore.getState().activeList?.items[1].id ?? '';
    useActiveListStore.getState().toggleItem(secondId);
    expect(getNotifications()).toHaveLength(2);
    expect(getNotifications()[0].title).toMatch(/passou do limite/);
  });
});
