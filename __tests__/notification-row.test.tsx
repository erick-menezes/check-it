import { fireEvent, render, screen } from '@testing-library/react-native';
import { NotificationRow } from '@/features/settings/components/notification-row';
import { useSettingsStore } from '@/features/settings/settings-store';

describe('NotificationRow', () => {
  beforeEach(() => {
    useSettingsStore.setState({ budgetAlertsEnabled: true, hasHydrated: true });
  });

  it('renders the title and the caption', () => {
    render(<NotificationRow />);
    expect(screen.getByText('Alertas de orçamento')).toBeOnTheScreen();
    expect(
      screen.getByText('Quando ultrapassar 80% do limite'),
    ).toBeOnTheScreen();
  });

  it('reflects the store value in the toggle', () => {
    useSettingsStore.setState({ budgetAlertsEnabled: false });
    render(<NotificationRow />);
    expect(screen.getByRole('switch').props.accessibilityState.checked).toBe(
      false,
    );
  });

  it('writes the negated value to the store on toggle', () => {
    render(<NotificationRow />);
    fireEvent.press(screen.getByRole('switch'));
    expect(useSettingsStore.getState().budgetAlertsEnabled).toBe(false);
  });
});
