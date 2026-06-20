import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

jest.mock('@/features/shop/suggestions', () => ({
  getSuggestions: () => [
    'Arroz 5kg',
    'Feijão preto',
    'Leite integral',
    'Pão de forma',
    'Café 500g',
  ],
}));

import { router } from 'expo-router';
import ShopScreen from '@/app/shop';
import { createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';

function seedList(limitInCents = 10000): void {
  useActiveListStore.setState({
    activeList: createActiveList(limitInCents),
    hasHydrated: true,
  });
}

describe('Shop screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useActiveListStore.setState({ activeList: null, hasHydrated: true });
  });

  it('renders the empty state when the list has no items', () => {
    seedList();
    render(<ShopScreen />);
    expect(screen.getByTestId('shop-screen')).toBeOnTheScreen();
    expect(screen.getByTestId('shop-empty-state')).toBeOnTheScreen();
  });

  it('adds a product through the input and persists it to the store', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.changeText(screen.getByTestId('shop-add-input'), 'Arroz');
    fireEvent.press(screen.getByTestId('shop-add-confirm'));
    const items = useActiveListStore.getState().activeList?.items ?? [];
    expect(items).toHaveLength(1);
    expect(items[0]?.name).toBe('Arroz');
    expect(screen.queryByTestId('shop-empty-state')).toBeNull();
    expect(screen.getByText('Arroz')).toBeOnTheScreen();
  });

  it('adds a product directly from a suggestion chip', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent(screen.getByTestId('shop-add-input'), 'focus');
    fireEvent.press(screen.getByText('Feijão preto'));
    const items = useActiveListStore.getState().activeList?.items ?? [];
    expect(items.map((item) => item.name)).toContain('Feijão preto');
  });

  it('checks an item and reflects its total in the budget chip', () => {
    seedList();
    useActiveListStore.getState().addItem('Café');
    const itemId = useActiveListStore.getState().activeList?.items[0]?.id ?? '';
    useActiveListStore
      .getState()
      .updateItem(itemId, { unitPriceInCents: 1500 });
    render(<ShopScreen />);
    fireEvent.press(screen.getByTestId(`shop-item-checkbox-${itemId}`));
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(1500);
    expect(screen.getByText('No carrinho')).toBeOnTheScreen();
  });

  it('opens the receipt sheet shell from the empty state CTA', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.press(screen.getByTestId('shop-scan-receipt'));
    expect(screen.getByText('Escanear cupom fiscal')).toBeOnTheScreen();
  });

  it('closes back to the previous screen from the header', () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.press(screen.getByTestId('shop-close'));
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
