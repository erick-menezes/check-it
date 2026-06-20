import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import {
  type ActiveList,
  createActiveList,
  recomputeTotals,
} from '@/features/home/active-list';
import { ShopHeader } from '@/features/shop/components/shop-header';
import { createListItem, type ListItem } from '@/features/shop/list-item';

function buildList(
  limitInCents: number,
  items: readonly ListItem[],
): ActiveList {
  const base = createActiveList(limitInCents);
  return recomputeTotals({ ...base, name: 'Compra de Maio', items });
}

function checkedItem(unitPriceInCents: number, quantity = 1): ListItem {
  return {
    ...createListItem({ name: 'Item', unitPriceInCents, quantity }),
    checked: true,
  };
}

function pendingItem(unitPriceInCents: number | null): ListItem {
  return createListItem({ name: 'Pendente', unitPriceInCents });
}

describe('ShopHeader', () => {
  it('shows the over-budget status line when checked total exceeds the limit', () => {
    const list = buildList(10000, [checkedItem(12000)]);
    render(<ShopHeader list={list} onRename={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByTestId('shop-status-line')).toHaveTextContent(
      /^Excedeu em/,
    );
    expect(screen.getByTestId('shop-progress-overBudget')).toBeOnTheScreen();
  });

  it('shows the pending status line when priced items are still unchecked', () => {
    const list = buildList(10000, [pendingItem(3000)]);
    render(<ShopHeader list={list} onRename={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByTestId('shop-status-line')).toHaveTextContent(
      /Faltam 1 .* a comprar/,
    );
  });

  it('shows the remaining status line when nothing priced is pending', () => {
    const list = buildList(10000, [pendingItem(null)]);
    render(<ShopHeader list={list} onRename={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByTestId('shop-status-line')).toHaveTextContent(
      /^Ainda dá pra gastar/,
    );
    expect(screen.getByTestId('shop-progress-onTrack')).toBeOnTheScreen();
  });

  it('exposes an accessible budget summary on the chip', () => {
    const list = buildList(10000, [checkedItem(2500)]);
    render(<ShopHeader list={list} onRename={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByTestId('shop-budget-chip')).toBeOnTheScreen();
    expect(screen.getByText('No carrinho')).toBeOnTheScreen();
  });

  it('renames the list when the title is edited and submitted', () => {
    const onRename = jest.fn();
    const list = buildList(10000, []);
    render(<ShopHeader list={list} onRename={onRename} onClose={jest.fn()} />);
    fireEvent.press(screen.getByTestId('shop-title'));
    const input = screen.getByTestId('shop-title-input');
    fireEvent.changeText(input, 'Compra mensal');
    fireEvent(input, 'submitEditing');
    expect(onRename).toHaveBeenCalledWith('Compra mensal');
  });

  it('closes when the X is pressed', () => {
    const onClose = jest.fn();
    const list = buildList(10000, []);
    render(<ShopHeader list={list} onRename={jest.fn()} onClose={onClose} />);
    fireEvent.press(screen.getByTestId('shop-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
