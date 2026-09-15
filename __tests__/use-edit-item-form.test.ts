import { act, renderHook } from '@testing-library/react-native';
import { useEditItemForm } from '@/features/shop/components/edit-item-sheet/use-edit-item-form';
import { createListItem, type ListItem } from '@/features/shop/list-item';

function makeItem(overrides: Partial<ListItem> = {}): ListItem {
  return { ...createListItem({ name: 'Arroz' }), ...overrides };
}

describe('useEditItemForm', () => {
  it('seeds the draft from the item', () => {
    const item = makeItem({
      name: 'Arroz',
      quantity: 2,
      unitPriceInCents: 500,
      category: 'grocery',
    });
    const { result } = renderHook(() => useEditItemForm(item));
    expect(result.current.name).toBe('Arroz');
    expect(result.current.quantity).toBe(2);
    expect(result.current.category).toBe('grocery');
    expect(result.current.price.cents).toBe(500);
    expect(result.current.price.hasPrice).toBe(true);
  });

  it('computes the live total from price and quantity', () => {
    const item = makeItem({ quantity: 3, unitPriceInCents: 500 });
    const { result } = renderHook(() => useEditItemForm(item));
    expect(result.current.totalInCents).toBe(1500);
  });

  it('is zero total when the item has no price', () => {
    const item = makeItem({ unitPriceInCents: null });
    const { result } = renderHook(() => useEditItemForm(item));
    expect(result.current.totalInCents).toBe(0);
  });

  it('increments and decrements quantity with a floor of one', () => {
    const item = makeItem({ quantity: 1 });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.decrementQuantity();
    });
    expect(result.current.quantity).toBe(1);
    act(() => {
      result.current.incrementQuantity();
      result.current.incrementQuantity();
    });
    expect(result.current.quantity).toBe(3);
    act(() => {
      result.current.decrementQuantity();
    });
    expect(result.current.quantity).toBe(2);
  });

  it('toggles a category selection off when picking it again', () => {
    const item = makeItem({ category: null });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.selectCategory('grocery');
    });
    expect(result.current.category).toBe('grocery');
    act(() => {
      result.current.selectCategory('grocery');
    });
    expect(result.current.category).toBeNull();
  });

  it('can always save today', () => {
    const item = makeItem();
    const { result } = renderHook(() => useEditItemForm(item));
    expect(result.current.canSave).toBe(true);
    expect(result.current.saveHint).toBeNull();
  });

  describe('buildChanges', () => {
    it('builds changes from the current draft', () => {
      const item = makeItem({ name: 'Arroz', quantity: 1, category: null });
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.setName('Arroz Integral');
        result.current.price.setDigits('690');
        result.current.incrementQuantity();
        result.current.selectCategory('grocery');
      });
      expect(result.current.buildChanges()).toEqual({
        name: 'Arroz Integral',
        unitPriceInCents: 690,
        quantity: 2,
        category: 'grocery',
      });
    });

    it('falls back to the original name when the draft name is blank', () => {
      const item = makeItem({ name: 'Arroz' });
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.setName('   ');
      });
      expect(result.current.buildChanges().name).toBe('Arroz');
    });

    it('clears the price to null when the digits are emptied', () => {
      const item = makeItem({ unitPriceInCents: 500 });
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.price.setDigits('');
      });
      expect(result.current.buildChanges().unitPriceInCents).toBeNull();
    });
  });
});
