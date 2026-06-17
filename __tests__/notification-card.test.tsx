import { fireEvent, render, screen } from '@testing-library/react-native';
import { NotificationCard } from '@/features/notifications/components/notification-card';
import type {
  AppNotification,
  NotificationType,
} from '@/features/notifications/notification';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

const NOW = new Date('2026-06-10T12:00:00.000Z');

function buildNotification(
  overrides: Partial<AppNotification> = {},
): AppNotification {
  return {
    id: 'notif-1',
    type: 'budgetAlert',
    title: 'Compras de Maio passou do limite',
    body: 'Você gastou R$ 540,00 dos R$ 600,00 definidos.',
    createdAt: '2026-06-10T10:00:00.000Z',
    read: false,
    ...overrides,
  };
}

beforeEach(() => {
  useNotificationsStore.setState({
    notifications: [],
    budgetThresholdLatch: {},
    hasHydrated: false,
  });
});

describe('NotificationCard', () => {
  it('renders the title, body and relative time', () => {
    const notification = buildNotification();
    render(<NotificationCard notification={notification} now={NOW} />);
    expect(screen.getByText(notification.title)).toBeOnTheScreen();
    expect(screen.getByText(notification.body)).toBeOnTheScreen();
    expect(screen.getByText('2h')).toBeOnTheScreen();
  });

  it('renders every catalog type', () => {
    const types: NotificationType[] = [
      'budgetAlert',
      'priceChange',
      'goalAchieved',
      'collaboration',
    ];
    types.forEach((type) => {
      const { unmount } = render(
        <NotificationCard
          notification={buildNotification({ id: `card-${type}`, type })}
          now={NOW}
        />,
      );
      expect(
        screen.getByTestId(`notification-card-card-${type}`),
      ).toBeOnTheScreen();
      unmount();
    });
  });

  it('marks itself read when pressed', () => {
    const notification = buildNotification();
    useNotificationsStore.setState({ notifications: [notification] });
    render(<NotificationCard notification={notification} now={NOW} />);
    fireEvent.press(screen.getByTestId('notification-card-notif-1'));
    const [updated] = useNotificationsStore.getState().notifications;
    expect(updated.read).toBe(true);
  });

  it('exposes an accessibility label including the unread state', () => {
    render(<NotificationCard notification={buildNotification()} now={NOW} />);
    expect(screen.getByLabelText(/não lida/)).toBeOnTheScreen();
  });

  it('announces the read state for read notifications', () => {
    render(
      <NotificationCard
        notification={buildNotification({ read: true })}
        now={NOW}
      />,
    );
    expect(screen.getByLabelText(/Notificação lida/)).toBeOnTheScreen();
  });

  it('shows the unread indicator only for unread notifications', () => {
    const { rerender } = render(
      <NotificationCard notification={buildNotification()} now={NOW} />,
    );
    expect(screen.getByTestId('notification-unread-dot')).toBeOnTheScreen();
    rerender(
      <NotificationCard
        notification={buildNotification({ read: true })}
        now={NOW}
      />,
    );
    expect(screen.queryByTestId('notification-unread-dot')).toBeNull();
  });
});
