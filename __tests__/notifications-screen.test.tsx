import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import NotificationsScreen from '@/app/notifications';
import type { AppNotification } from '@/features/notifications/notification';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

function buildNotification(
  overrides: Partial<AppNotification> = {},
): AppNotification {
  return {
    id: 'notif-1',
    type: 'budgetAlert',
    title: 'Compras de Maio passou do limite',
    body: 'Você gastou R$ 540,00 e o limite era R$ 500,00.',
    createdAt: '2026-06-10T11:00:00.000Z',
    read: false,
    ...overrides,
  };
}

const NEWER_NOTIFICATION = buildNotification({
  id: 'notif-newer',
  title: 'Compras de Junho chegou a 90% do limite',
  createdAt: '2026-06-10T11:30:00.000Z',
});

const OLDER_NOTIFICATION = buildNotification({
  id: 'notif-older',
  title: 'Compras de Maio passou do limite',
  createdAt: '2026-06-10T09:00:00.000Z',
});

function seed(notifications: AppNotification[]): void {
  useNotificationsStore.setState({
    notifications,
    budgetThresholdLatch: {},
    hasHydrated: true,
  });
}

describe('Notifications screen', () => {
  beforeEach(() => {
    useNotificationsStore.setState({
      notifications: [],
      budgetThresholdLatch: {},
      hasHydrated: false,
    });
  });

  it('renders the empty state when there are no notifications', () => {
    render(<NotificationsScreen />);
    expect(screen.getByTestId('notifications-empty-state')).toBeOnTheScreen();
    expect(screen.getByText('Tudo em dia')).toBeOnTheScreen();
  });

  it('renders the notification cards in store order, newest first', () => {
    seed([NEWER_NOTIFICATION, OLDER_NOTIFICATION]);
    render(<NotificationsScreen />);
    expect(
      screen.getByTestId('notification-card-notif-newer'),
    ).toBeOnTheScreen();
    expect(
      screen.getByTestId('notification-card-notif-older'),
    ).toBeOnTheScreen();
    expect(screen.queryByTestId('notifications-empty-state')).toBeNull();
  });

  it('marks a card read when it is tapped', () => {
    seed([buildNotification()]);
    render(<NotificationsScreen />);
    expect(screen.getByTestId('notification-unread-dot')).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId('notification-card-notif-1'));
    const [updated] = useNotificationsStore.getState().notifications;
    expect(updated.read).toBe(true);
  });

  it('marks all read via "Marcar todas" and hides the action afterwards', () => {
    seed([
      buildNotification({ id: 'a', title: 'A' }),
      buildNotification({ id: 'b', title: 'B' }),
    ]);
    render(<NotificationsScreen />);
    fireEvent.press(screen.getByTestId('notifications-mark-all'));
    const allRead = useNotificationsStore
      .getState()
      .notifications.every((notification) => notification.read);
    expect(allRead).toBe(true);
    expect(screen.queryByTestId('notifications-mark-all')).toBeNull();
  });
});
