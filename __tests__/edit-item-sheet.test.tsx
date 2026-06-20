import { fireEvent, render, screen } from '@testing-library/react-native';
import { EditItemSheet } from '@/features/shop/components/edit-item-sheet';
import { createListItem, type ListItem } from '@/features/shop/list-item';

function makeItem(overrides: Partial<ListItem> = {}): ListItem {
  return {
    ...createListItem({ name: 'Arroz' }),
    ...overrides,
  };
}

describe('EditItemSheet', () => {
  it('pre-fills the sheet with the item values', () => {
    const item = makeItem({ quantity: 2, unitPriceInCents: 690 });
    render(
      <EditItemSheet
        item={item}
        onClose={jest.fn()}
        onSave={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-name-input').props.value).toBe('Arroz');
    expect(screen.getByTestId('edit-price-input').props.value).toBe('6,90');
    expect(screen.getByTestId('edit-qty-value')).toHaveTextContent('2');
  });

  it('saves edited name, price and quantity then closes', () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const item = makeItem({ quantity: 1, unitPriceInCents: null });
    render(
      <EditItemSheet
        item={item}
        onClose={onClose}
        onSave={onSave}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.changeText(
      screen.getByTestId('edit-name-input'),
      'Arroz Integral',
    );
    fireEvent.changeText(screen.getByTestId('edit-price-input'), '690');
    fireEvent.press(screen.getByTestId('edit-qty-increment'));
    fireEvent.press(screen.getByTestId('edit-save'));
    expect(onSave).toHaveBeenCalledWith(item.id, {
      name: 'Arroz Integral',
      unitPriceInCents: 690,
      quantity: 2,
      category: null,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows the live total when a price is present', () => {
    const item = makeItem({ quantity: 2, unitPriceInCents: 500 });
    render(
      <EditItemSheet
        item={item}
        onClose={jest.fn()}
        onSave={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-total')).toHaveTextContent(/R\$ 10,00/);
  });

  it('never lets the quantity drop below one', () => {
    const item = makeItem({ quantity: 1 });
    render(
      <EditItemSheet
        item={item}
        onClose={jest.fn()}
        onSave={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-qty-decrement'));
    expect(screen.getByTestId('edit-qty-value')).toHaveTextContent('1');
  });

  it('selects a category and saves it', () => {
    const onSave = jest.fn();
    const item = makeItem({ category: null });
    render(
      <EditItemSheet
        item={item}
        onClose={jest.fn()}
        onSave={onSave}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-category-grocery'));
    fireEvent.press(screen.getByTestId('edit-save'));
    expect(onSave).toHaveBeenCalledWith(
      item.id,
      expect.objectContaining({ category: 'grocery' }),
    );
  });

  it('clears the category when the selected chip is tapped again', () => {
    const onSave = jest.fn();
    const item = makeItem({ category: 'grocery' });
    render(
      <EditItemSheet
        item={item}
        onClose={jest.fn()}
        onSave={onSave}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-category-grocery'));
    fireEvent.press(screen.getByTestId('edit-save'));
    expect(onSave).toHaveBeenCalledWith(
      item.id,
      expect.objectContaining({ category: null }),
    );
  });

  it('discards changes when closed without saving', () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const item = makeItem();
    render(
      <EditItemSheet
        item={item}
        onClose={onClose}
        onSave={onSave}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.changeText(screen.getByTestId('edit-name-input'), 'Outro nome');
    fireEvent.press(screen.getByTestId('edit-close'));
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('removes the item only after confirming the dialog', () => {
    const onRemove = jest.fn();
    const onClose = jest.fn();
    const item = makeItem({ name: 'Café' });
    render(
      <EditItemSheet
        item={item}
        onClose={onClose}
        onSave={jest.fn()}
        onRemove={onRemove}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-remove'));
    expect(screen.getByText('Remover “Café”?')).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId('edit-remove-dialog-confirm'));
    expect(onRemove).toHaveBeenCalledWith(item.id);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
