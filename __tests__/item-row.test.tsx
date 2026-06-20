import { fireEvent, render, screen } from '@testing-library/react-native';
import { ItemRow } from '@/features/shop/components/item-row';
import { createListItem, type ListItem } from '@/features/shop/list-item';

function makeItem(overrides: Partial<ListItem> = {}): ListItem {
  return {
    ...createListItem({ name: 'Arroz' }),
    ...overrides,
  };
}

describe('ItemRow', () => {
  it('renders the priced subtitle and line total', () => {
    const item = makeItem({ quantity: 2, unitPriceInCents: 500 });
    render(
      <ItemRow
        item={item}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByText('2× R$ 5,00')).toBeOnTheScreen();
    expect(screen.getByText('R$ 10,00')).toBeOnTheScreen();
  });

  it('renders the priceless subtitle and an em dash total', () => {
    const item = makeItem({ quantity: 3, unitPriceInCents: null });
    render(
      <ItemRow
        item={item}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByText('3× sem preço')).toBeOnTheScreen();
    expect(screen.getByText('—')).toBeOnTheScreen();
  });

  it('toggles the item when the checkbox is pressed', () => {
    const onToggle = jest.fn();
    const item = makeItem();
    render(
      <ItemRow
        item={item}
        onToggle={onToggle}
        onEdit={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId(`shop-item-checkbox-${item.id}`));
    expect(onToggle).toHaveBeenCalledWith(item.id);
  });

  it('exposes the checked state through accessibility', () => {
    const item = makeItem({ checked: true });
    render(
      <ItemRow
        item={item}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByTestId(`shop-item-checkbox-${item.id}`)).toBeChecked();
  });

  it('opens the editor from the row body and the edit button', () => {
    const onEdit = jest.fn();
    const item = makeItem();
    render(
      <ItemRow
        item={item}
        onToggle={jest.fn()}
        onEdit={onEdit}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId(`shop-item-${item.id}`));
    fireEvent.press(screen.getByTestId(`shop-item-edit-${item.id}`));
    expect(onEdit).toHaveBeenCalledTimes(2);
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it('removes the item after confirming the swipe-to-delete dialog', () => {
    const onRemove = jest.fn();
    const item = makeItem();
    render(
      <ItemRow
        item={item}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onRemove={onRemove}
      />,
    );
    fireEvent(
      screen.getByTestId(`shop-item-row-${item.id}`),
      'accessibilityAction',
      {
        nativeEvent: { actionName: 'delete' },
      },
    );
    fireEvent.press(
      screen.getByTestId(`shop-item-delete-dialog-${item.id}-confirm`),
    );
    expect(onRemove).toHaveBeenCalledWith(item.id);
  });

  it('keeps the item when the delete dialog is cancelled', () => {
    const onRemove = jest.fn();
    const item = makeItem();
    render(
      <ItemRow
        item={item}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onRemove={onRemove}
      />,
    );
    fireEvent(
      screen.getByTestId(`shop-item-row-${item.id}`),
      'accessibilityAction',
      {
        nativeEvent: { actionName: 'delete' },
      },
    );
    fireEvent.press(
      screen.getByTestId(`shop-item-delete-dialog-${item.id}-cancel`),
    );
    expect(onRemove).not.toHaveBeenCalled();
  });
});
