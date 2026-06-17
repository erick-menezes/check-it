import { render, screen } from '@testing-library/react-native';
import { NotificationsEmptyState } from '@/features/notifications/components/notifications-empty-state';

describe('NotificationsEmptyState', () => {
  it('renders the halo container and the "Tudo em dia" title', () => {
    render(<NotificationsEmptyState />);
    expect(screen.getByTestId('notifications-empty-state')).toBeOnTheScreen();
    expect(screen.getByText('Tudo em dia')).toBeOnTheScreen();
  });
});
