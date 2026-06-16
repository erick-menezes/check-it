import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ActiveList } from '@/features/home/active-list';
import type { AppNotification } from '@/features/notifications/notification';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

let mockActiveList: ActiveList | null = null;

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);
jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);
jest.mock('@/features/home/active-list-store', () => ({
  useActiveListStore: (
    selector: (state: { activeList: ActiveList | null }) => unknown,
  ) => selector({ activeList: mockActiveList }),
}));

import { router } from 'expo-router';
import HomeScreen from '@/app/(tabs)/home';

const SAMPLE_LIST: ActiveList = {
  id: '1',
  name: 'Compras da semana',
  itemCount: 8,
  createdAt: '2026-06-07T10:00:00.000Z',
  totalInCents: 7350,
  limitInCents: 20000,
  items: [],
};

const UNREAD_NOTIFICATION: AppNotification = {
  id: 'notif-1',
  type: 'budgetAlert',
  title: 'Compras da semana passou do limite',
  body: 'Você gastou R$ 210,00 e o limite era R$ 200,00.',
  createdAt: '2026-06-10T10:00:00.000Z',
  read: false,
};

describe('Home screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockActiveList = null;
    useNotificationsStore.setState({
      notifications: [],
      budgetThresholdLatch: {},
      hasHydrated: false,
    });
  });

  it('shows the empty state and not the Lista atual section when no list exists', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('home-empty-state')).toBeOnTheScreen();
    expect(screen.queryByText('Lista atual')).toBeNull();
  });

  it('shows the Lista atual section and card when a list exists', () => {
    mockActiveList = SAMPLE_LIST;
    render(<HomeScreen />);
    expect(screen.getByText('Lista atual')).toBeOnTheScreen();
    expect(screen.getByTestId('active-list-card')).toBeOnTheScreen();
    expect(screen.getByText('Compras da semana')).toBeOnTheScreen();
    expect(screen.queryByTestId('home-empty-state')).toBeNull();
  });

  it('keeps the create CTA available in both states', () => {
    const { rerender } = render(<HomeScreen />);
    expect(screen.getByTestId('create-list-cta')).toBeOnTheScreen();
    mockActiveList = SAMPLE_LIST;
    rerender(<HomeScreen />);
    expect(screen.getByTestId('create-list-cta')).toBeOnTheScreen();
  });

  it('routes the CTA to the limit screen', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('create-list-cta'));
    expect(router.push).toHaveBeenCalledWith('/limit');
  });

  it('routes the card to the shop screen', () => {
    mockActiveList = SAMPLE_LIST;
    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('active-list-card'));
    expect(router.push).toHaveBeenCalledWith('/shop');
  });

  it('routes the header actions to their screens', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId('header-help'));
    fireEvent.press(screen.getByTestId('header-notifications'));
    expect(router.push).toHaveBeenCalledWith('/help');
    expect(router.push).toHaveBeenCalledWith('/notifications');
  });

  it('hides the notifications dot when nothing is unread', () => {
    render(<HomeScreen />);
    expect(screen.queryByTestId('notifications-dot')).toBeNull();
  });

  it('shows the notifications dot when an unread notification exists', () => {
    useNotificationsStore.setState({ notifications: [UNREAD_NOTIFICATION] });
    render(<HomeScreen />);
    expect(screen.getByTestId('notifications-dot')).toBeOnTheScreen();
  });
});
