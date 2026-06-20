import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import ShopScreen from '@/app/shop';
import SummaryScreen from '@/app/summary';
import { createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';

function seedList(limitInCents = 20000): void {
  act(() => {
    useActiveListStore.setState({
      activeList: createActiveList(limitInCents),
      hasHydrated: true,
    });
    useActiveListStore.getState().addItems([
      { name: 'Arroz', quantity: 1, unitPriceInCents: 500 },
      { name: 'Picanha', quantity: 1, unitPriceInCents: 6000 },
      { name: 'Feijão', quantity: 1, unitPriceInCents: 1000 },
    ]);
  });
}

function storedNames(): string[] {
  return (useActiveListStore.getState().activeList?.items ?? []).map(
    (item) => item.name,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  act(() => {
    useActiveListStore.setState({ activeList: null, hasHydrated: true });
  });
});

describe('Shop + Summary integration', () => {
  it('sorting reshapes the visible list without mutating the stored order', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.press(screen.getByTestId('shop-sort-button'));
    fireEvent.press(screen.getByTestId('sort-option-price-desc'));
    expect(storedNames()).toEqual(['Arroz', 'Picanha', 'Feijão']);
  });

  it('searching never touches the stored data', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.changeText(screen.getByTestId('shop-search-input'), 'arroz');
    expect(screen.queryByText('Picanha')).toBeNull();
    expect(storedNames()).toEqual(['Arroz', 'Picanha', 'Feijão']);
  });

  it('shows a no-results area without losing the list when nothing matches', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.changeText(screen.getByTestId('shop-search-input'), 'café');
    expect(screen.getByTestId('shop-no-results')).toBeOnTheScreen();
    expect(screen.queryByTestId('shop-empty-state')).toBeNull();
    expect(storedNames()).toEqual(['Arroz', 'Picanha', 'Feijão']);
  });

  it('recomputes the Summary from the persisted list after a mutation', () => {
    seedList();
    const { rerender } = render(<SummaryScreen />);
    expect(
      within(screen.getByTestId('summary-total-tile')).getByText('R$ 75,00'),
    ).toBeOnTheScreen();
    act(() => {
      const itemId =
        useActiveListStore.getState().activeList?.items[0]?.id ?? '';
      useActiveListStore.getState().updateItem(itemId, {
        unitPriceInCents: 2500,
      });
    });
    rerender(<SummaryScreen />);
    expect(
      within(screen.getByTestId('summary-total-tile')).getByText('R$ 95,00'),
    ).toBeOnTheScreen();
  });
});
