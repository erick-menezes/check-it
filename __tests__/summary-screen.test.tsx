import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import { router } from 'expo-router';
import SummaryScreen from '@/app/summary';
import { createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';

function seedList(limitInCents = 10000): void {
  useActiveListStore.setState({
    activeList: createActiveList(limitInCents),
    hasHydrated: true,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  useActiveListStore.setState({ activeList: null, hasHydrated: true });
});

describe('Summary screen', () => {
  it('renders nothing when there is no active list', () => {
    render(<SummaryScreen />);
    expect(screen.queryByTestId('summary-screen')).toBeNull();
  });

  it('renders the total tile, category breakdown and top items', () => {
    seedList(10000);
    useActiveListStore.getState().addItems([
      {
        name: 'Picanha',
        quantity: 1,
        unitPriceInCents: 6000,
        category: 'butcher',
      },
      {
        name: 'Refrigerante',
        quantity: 1,
        unitPriceInCents: 3000,
        category: 'drinks',
      },
    ]);
    render(<SummaryScreen />);
    expect(screen.getByTestId('summary-total-tile')).toBeOnTheScreen();
    expect(screen.getByTestId('summary-stacked-bar')).toBeOnTheScreen();
    expect(screen.getByText('Picanha')).toBeOnTheScreen();
    expect(screen.getByText('R$ 90,00')).toBeOnTheScreen();
  });

  it('returns to the shop list from the back affordance', () => {
    seedList();
    useActiveListStore.getState().addItem('Arroz');
    render(<SummaryScreen />);
    fireEvent.press(screen.getByTestId('summary-back'));
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
