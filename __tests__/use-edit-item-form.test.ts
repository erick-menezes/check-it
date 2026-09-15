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

  it('can select the unit while the item has no parts', () => {
    const item = makeItem({ parts: null });
    const { result } = renderHook(() => useEditItemForm(item));
    expect(result.current.canSelectUnit).toBe(true);
  });

  it('defaults the weight to 1,000 kg when switching to kg with no weight yet', () => {
    const item = makeItem({ unit: 'unit', quantity: 3 });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.selectUnit('kg');
    });
    expect(result.current.unit).toBe('kg');
    expect(result.current.weight.grams).toBe(1000);
  });

  it('keeps an already-typed weight when re-selecting kg', () => {
    const item = makeItem({ unit: 'unit' });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.selectUnit('kg');
    });
    act(() => {
      result.current.weight.setDigits('830');
    });
    act(() => {
      result.current.selectUnit('unit');
    });
    act(() => {
      result.current.selectUnit('kg');
    });
    expect(result.current.weight.grams).toBe(830);
  });

  it('resets the quantity to one when switching back to unit', () => {
    const item = makeItem({ unit: 'kg', quantity: 830 });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.selectUnit('unit');
    });
    expect(result.current.quantity).toBe(1);
  });

  it('preserves the price across a unit switch', () => {
    const item = makeItem({ unit: 'unit', unitPriceInCents: 2990 });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.selectUnit('kg');
    });
    expect(result.current.price.cents).toBe(2990);
  });

  it('computes the kg line total with the same rounding as the domain', () => {
    const item = makeItem({
      unit: 'kg',
      quantity: 830,
      unitPriceInCents: 2990,
    });
    const { result } = renderHook(() => useEditItemForm(item));
    expect(result.current.totalInCents).toBe(2482);
  });

  it('buildChanges includes unit and the grams-as-quantity for a kg item', () => {
    const item = makeItem({
      unit: 'unit',
      quantity: 1,
      unitPriceInCents: null,
    });
    const { result } = renderHook(() => useEditItemForm(item));
    act(() => {
      result.current.selectUnit('kg');
      result.current.weight.setDigits('830');
      result.current.price.setDigits('2990');
    });
    expect(result.current.buildChanges()).toEqual(
      expect.objectContaining({
        unit: 'kg',
        unitPriceInCents: 2990,
        quantity: 830,
      }),
    );
  });

  describe('parts', () => {
    it('starts simple, with no parts editor engaged', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      expect(result.current.parts).toBeNull();
    });

    it('pre-fills the first part with the current price and adds one empty row', () => {
      const item = makeItem({ unitPriceInCents: 690 });
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      expect(result.current.parts).toHaveLength(2);
      expect(result.current.parts?.[0].priceDigits).toBe('690');
      expect(result.current.parts?.[1].priceDigits).toBe('');
    });

    it('starts with two empty rows when the item had no price', () => {
      const item = makeItem({ unitPriceInCents: null });
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      expect(result.current.parts).toEqual([
        expect.objectContaining({ priceDigits: '' }),
        expect.objectContaining({ priceDigits: '' }),
      ]);
    });

    it('disables the unit toggle while parts exist', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      expect(result.current.canSelectUnit).toBe(true);
      act(() => {
        result.current.enableParts();
      });
      expect(result.current.canSelectUnit).toBe(false);
    });

    it('adds a part, up to the cap', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.addPart();
      });
      expect(result.current.parts).toHaveLength(3);
      expect(result.current.canAddPart).toBe(true);
    });

    it('stops allowing new parts at MAX_PRICE_PARTS', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      for (let index = 0; index < 15; index += 1) {
        act(() => {
          result.current.addPart();
        });
      }
      expect(result.current.parts).toHaveLength(12);
      expect(result.current.canAddPart).toBe(false);
    });

    it('removes a part by id', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      const [first, second] = result.current.parts ?? [];
      act(() => {
        result.current.removePart(first.id);
      });
      expect(result.current.parts).toEqual([
        expect.objectContaining({ id: second.id }),
      ]);
    });

    it('updates a part label and price digits', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      const [first] = result.current.parts ?? [];
      act(() => {
        result.current.updatePart(first.id, { label: 'Biscoito' });
      });
      act(() => {
        result.current.updatePart(first.id, { priceDigits: '399' });
      });
      expect(result.current.parts?.[0]).toEqual(
        expect.objectContaining({ label: 'Biscoito', priceDigits: '399' }),
      );
    });

    it('increments and decrements a part quantity with a floor of one', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      const [first] = result.current.parts ?? [];
      act(() => {
        result.current.decrementPartQuantity(first.id);
      });
      expect(result.current.parts?.[0].quantity).toBe(1);
      act(() => {
        result.current.incrementPartQuantity(first.id);
      });
      expect(result.current.parts?.[0].quantity).toBe(2);
    });

    it('cannot save while a part lacks a price, and shows a hint', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[0].id ?? '', {
          label: 'Biscoito',
        });
      });
      expect(result.current.canSave).toBe(false);
      expect(result.current.saveHint).not.toBeNull();
    });

    it('can save once every meaningful part has a price', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[0].id ?? '', {
          priceDigits: '399',
        });
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[1].id ?? '', {
          priceDigits: '399',
        });
      });
      expect(result.current.canSave).toBe(true);
      expect(result.current.saveHint).toBeNull();
    });

    it('drops a blank row (no label, no price) from buildChanges silently', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[0].id ?? '', {
          priceDigits: '399',
        });
      });
      const changes = result.current.buildChanges();
      expect(changes.parts).toHaveLength(1);
    });

    it('computes the live total as the sum of price times quantity', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[0].id ?? '', {
          priceDigits: '399',
          quantity: 2,
        });
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[1].id ?? '', {
          priceDigits: '399',
        });
      });
      expect(result.current.totalInCents).toBe(399 * 2 + 399);
    });

    it('buildChanges emits the sum as parts, quantity 1, unit unit', () => {
      const item = makeItem({ unit: 'unit', quantity: 1 });
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[0].id ?? '', {
          priceDigits: '399',
        });
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[1].id ?? '', {
          priceDigits: '399',
        });
      });
      const changes = result.current.buildChanges();
      expect(changes.parts).toEqual([
        expect.objectContaining({ unitPriceInCents: 399 }),
        expect.objectContaining({ unitPriceInCents: 399 }),
      ]);
      expect(changes.name).toBe('Arroz');
      expect(changes.category).toBeNull();
    });

    it('keeps the sum as a plain price when disabling parts', () => {
      const item = makeItem();
      const { result } = renderHook(() => useEditItemForm(item));
      act(() => {
        result.current.enableParts();
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[0].id ?? '', {
          priceDigits: '399',
        });
      });
      act(() => {
        result.current.updatePart(result.current.parts?.[1].id ?? '', {
          priceDigits: '798',
        });
      });
      act(() => {
        result.current.disableParts();
      });
      expect(result.current.parts).toBeNull();
      expect(result.current.canSelectUnit).toBe(true);
      expect(result.current.price.cents).toBe(1197);
      expect(result.current.buildChanges()).toEqual(
        expect.objectContaining({ unitPriceInCents: 1197 }),
      );
    });
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
        unit: 'unit',
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
