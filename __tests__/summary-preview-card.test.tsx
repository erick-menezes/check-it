import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

import { router } from 'expo-router';
import {
  type ActiveList,
  createActiveList,
  recomputeTotals,
} from '@/features/home/active-list';
import { SummaryPreviewCard } from '@/features/shop/components/summary-preview-card';
import { createListItem, type ListItem } from '@/features/shop/list-item';

function checkedItem(unitPriceInCents: number, quantity = 1): ListItem {
  return {
    ...createListItem({ name: 'Item', unitPriceInCents, quantity }),
    checked: true,
  };
}

function buildList(
  limitInCents: number,
  items: readonly ListItem[],
): ActiveList {
  const base = createActiveList(limitInCents);
  return recomputeTotals({ ...base, items });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SummaryPreviewCard', () => {
  it('shows checked count, subtotal and limit', () => {
    const list = buildList(10000, [
      checkedItem(2000),
      createListItem({ name: 'Pendente', unitPriceInCents: 500 }),
    ]);
    render(<SummaryPreviewCard list={list} />);
    expect(screen.getByText('1 de 2')).toBeOnTheScreen();
    expect(screen.getByText('R$ 20,00')).toBeOnTheScreen();
    expect(screen.getByText('R$ 100,00')).toBeOnTheScreen();
  });

  it('shows the available difference when under budget', () => {
    const list = buildList(10000, [checkedItem(3000)]);
    render(<SummaryPreviewCard list={list} />);
    expect(screen.getByText('Disponível')).toBeOnTheScreen();
    expect(screen.getByTestId('shop-summary-difference')).toHaveTextContent(
      'R$ 70,00',
    );
  });

  it('shows the exceeded difference when over budget', () => {
    const list = buildList(10000, [checkedItem(12000)]);
    render(<SummaryPreviewCard list={list} />);
    expect(screen.getByText('Excedeu')).toBeOnTheScreen();
    expect(screen.getByTestId('shop-summary-difference')).toHaveTextContent(
      'R$ 20,00',
    );
  });

  it('navigates to the Summary screen from "Ver completo"', () => {
    const list = buildList(10000, [checkedItem(3000)]);
    render(<SummaryPreviewCard list={list} />);
    fireEvent.press(screen.getByTestId('shop-summary-open'));
    expect(router.push).toHaveBeenCalledWith('/summary');
  });
});
