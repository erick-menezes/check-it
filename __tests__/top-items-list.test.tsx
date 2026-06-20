import { render, screen, within } from '@testing-library/react-native';
import { createListItem, type ListItem } from '@/features/shop/list-item';
import { TopItemsList } from '@/features/summary/components/top-items-list';

function makeItem(
  name: string,
  unitPriceInCents: number,
  quantity = 1,
): ListItem {
  return createListItem({ name, unitPriceInCents, quantity });
}

describe('TopItemsList', () => {
  it('renders each item with its line total', () => {
    const items = [makeItem('Picanha', 5000, 2), makeItem('Arroz', 1000)];
    render(<TopItemsList items={items} />);
    const picanha = within(
      screen.getByTestId(`summary-top-item-${items[0].id}`),
    );
    expect(picanha.getByText('Picanha')).toBeOnTheScreen();
    expect(picanha.getByText('R$ 100,00')).toBeOnTheScreen();
  });

  it('renders nothing when there are no items', () => {
    render(<TopItemsList items={[]} />);
    expect(screen.queryByTestId(/^summary-top-item-/)).toBeNull();
  });
});
