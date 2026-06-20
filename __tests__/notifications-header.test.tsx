import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import { router } from 'expo-router';
import { NotificationsHeader } from '@/features/notifications/components/notifications-header';
import type { AppNotification } from '@/features/notifications/notification';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

const UNREAD_NOTIFICATION: AppNotification = {
  id: 'n1',
  type: 'budgetAlert',
  title: 'Compras passou do limite',
  body: 'Você gastou R$ 210,00 e o limite era R$ 200,00.',
  createdAt: '2026-06-10T10:00:00.000Z',
  read: false,
};

function seedUnread(): void {
  useNotificationsStore.setState({
    notifications: [UNREAD_NOTIFICATION],
    budgetThresholdLatch: {},
    hasHydrated: true,
  });
}

describe('NotificationsHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNotificationsStore.setState({
      notifications: [],
      budgetThresholdLatch: {},
      hasHydrated: false,
    });
  });

  it('renders the title', () => {
    render(<NotificationsHeader />);
    expect(screen.getByText('Notificações')).toBeOnTheScreen();
  });

  it('navigates back when there is history', () => {
    (router.canGoBack as jest.Mock).mockReturnValue(true);
    render(<NotificationsHeader />);
    fireEvent.press(screen.getByTestId('notifications-close'));
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('falls back to Home when there is no history', () => {
    (router.canGoBack as jest.Mock).mockReturnValue(false);
    render(<NotificationsHeader />);
    fireEvent.press(screen.getByTestId('notifications-close'));
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    expect(router.back).not.toHaveBeenCalled();
  });

  it('hides "Marcar todas" when there are no unread notifications', () => {
    render(<NotificationsHeader />);
    expect(screen.queryByTestId('notifications-mark-all')).toBeNull();
  });

  it('shows "Marcar todas" and marks all read when there are unread notifications', () => {
    seedUnread();
    render(<NotificationsHeader />);
    fireEvent.press(screen.getByTestId('notifications-mark-all'));
    const allRead = useNotificationsStore
      .getState()
      .notifications.every((notification) => notification.read);
    expect(allRead).toBe(true);
  });
});
