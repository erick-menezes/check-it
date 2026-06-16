import { fireEvent, render, screen } from '@testing-library/react-native';
import type { AppNotification } from '@/features/notifications/notification';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

import { router } from 'expo-router';
import { HomeHeader } from '@/features/home/components/home-header';

const UNREAD_NOTIFICATION: AppNotification = {
  id: 'notif-1',
  type: 'budgetAlert',
  title: 'Compras da semana passou do limite',
  body: 'Você gastou R$ 210,00 e o limite era R$ 200,00.',
  createdAt: '2026-06-10T10:00:00.000Z',
  read: false,
};

beforeEach(() => {
  useNotificationsStore.setState({
    notifications: [],
    budgetThresholdLatch: {},
    hasHydrated: false,
  });
  jest.clearAllMocks();
});

describe('HomeHeader', () => {
  it('shows the subtitle without a user name', () => {
    render(<HomeHeader />);
    expect(screen.getByText('Pronto pra próxima compra?')).toBeOnTheScreen();
  });

  it('shows the accent indicator dot only when unread notifications exist', () => {
    useNotificationsStore.setState({ notifications: [UNREAD_NOTIFICATION] });
    render(<HomeHeader />);
    expect(screen.getByTestId('notifications-dot')).toBeOnTheScreen();
  });

  it('hides the accent indicator dot when there are no unread notifications', () => {
    render(<HomeHeader />);
    expect(screen.queryByTestId('notifications-dot')).toBeNull();
  });

  it('hides the accent indicator dot when every notification is read', () => {
    useNotificationsStore.setState({
      notifications: [{ ...UNREAD_NOTIFICATION, read: true }],
    });
    render(<HomeHeader />);
    expect(screen.queryByTestId('notifications-dot')).toBeNull();
  });

  it('navigates to /help when the help button is pressed', () => {
    render(<HomeHeader />);
    fireEvent.press(screen.getByTestId('header-help'));
    expect(router.push).toHaveBeenCalledWith('/help');
  });

  it('navigates to /notifications when the notifications button is pressed', () => {
    render(<HomeHeader />);
    fireEvent.press(screen.getByTestId('header-notifications'));
    expect(router.push).toHaveBeenCalledWith('/notifications');
  });

  it('navigates to /limit when the create-list CTA is pressed', () => {
    render(<HomeHeader />);
    fireEvent.press(screen.getByTestId('create-list-cta'));
    expect(router.push).toHaveBeenCalledWith('/limit');
  });
});
