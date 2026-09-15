import {
  applyItemChanges,
  createListItem,
  DEFAULT_WEIGHT_IN_GRAMS,
  getLineTotalInCents,
  getPartsCount,
  getPartsTotalInCents,
  hasParts,
  isKgItem,
  type ListItem,
  MAX_WEIGHT_IN_GRAMS,
  MIN_QUANTITY,
  MIN_WEIGHT_IN_GRAMS,
  type PricePart,
} from '@/features/shop/list-item';

const FIXED_DATE = new Date('2026-06-07T10:00:00.000Z');

function makePart(overrides: Partial<PricePart> = {}): PricePart {
  return {
    id: 'part-1',
    label: null,
    unitPriceInCents: 399,
    quantity: 1,
    ...overrides,
  };
}

describe('createListItem', () => {
  it('defaults to a simple, unit-priced item', () => {
    const item = createListItem({ name: 'Arroz' }, FIXED_DATE);
    expect(item.unit).toBe('unit');
    expect(item.quantity).toBe(MIN_QUANTITY);
    expect(item.parts).toBeNull();
    expect(item.unitPriceInCents).toBeNull();
    expect(item.checked).toBe(false);
  });

  it('truncates and floors a fractional or sub-minimum quantity', () => {
    expect(createListItem({ name: 'Arroz', quantity: 2.9 }).quantity).toBe(2);
    expect(createListItem({ name: 'Arroz', quantity: 0 }).quantity).toBe(
      MIN_QUANTITY,
    );
  });
});

function makeItem(overrides: Partial<ListItem> = {}): ListItem {
  return { ...createListItem({ name: 'Item' }, FIXED_DATE), ...overrides };
}

describe('applyItemChanges — unit switching', () => {
  it('defaults the weight to 1,000 kg when switching to kg without a quantity', () => {
    const item = makeItem({ unit: 'unit', quantity: 3 });
    const result = applyItemChanges(item, { unit: 'kg' });
    expect(result.unit).toBe('kg');
    expect(result.quantity).toBe(DEFAULT_WEIGHT_IN_GRAMS);
  });

  it('resets the quantity to 1 when switching back to unit', () => {
    const item = makeItem({ unit: 'kg', quantity: 830 });
    const result = applyItemChanges(item, { unit: 'unit' });
    expect(result.unit).toBe('unit');
    expect(result.quantity).toBe(MIN_QUANTITY);
  });

  it('keeps the current weight when re-selecting kg with no explicit quantity', () => {
    const item = makeItem({ unit: 'kg', quantity: 830 });
    const result = applyItemChanges(item, { unit: 'kg' });
    expect(result.quantity).toBe(830);
  });

  it('clamps an explicit weight to the valid range', () => {
    const item = makeItem({ unit: 'unit' });
    const result = applyItemChanges(item, { unit: 'kg', quantity: -5 });
    expect(result.quantity).toBe(MIN_WEIGHT_IN_GRAMS);
    const overResult = applyItemChanges(item, {
      unit: 'kg',
      quantity: MAX_WEIGHT_IN_GRAMS + 1,
    });
    expect(overResult.quantity).toBe(MAX_WEIGHT_IN_GRAMS);
  });

  it('preserves the price across a unit switch', () => {
    const item = makeItem({ unit: 'unit', unitPriceInCents: 2990 });
    const result = applyItemChanges(item, { unit: 'kg' });
    expect(result.unitPriceInCents).toBe(2990);
  });
});

describe('applyItemChanges — parts', () => {
  it('derives the price as the sum of the parts', () => {
    const item = makeItem();
    const parts = [
      makePart({ id: 'a', unitPriceInCents: 399, quantity: 1 }),
      makePart({ id: 'b', unitPriceInCents: 499, quantity: 2 }),
    ];
    const result = applyItemChanges(item, { parts });
    expect(result.unitPriceInCents).toBe(399 + 499 * 2);
    expect(result.unit).toBe('unit');
    expect(result.quantity).toBe(MIN_QUANTITY);
    expect(result.parts).toBe(parts);
  });

  it('ignores a conflicting unit, quantity or price in the same change', () => {
    const item = makeItem({ unit: 'kg', quantity: 830 });
    const parts = [makePart({ unitPriceInCents: 1000, quantity: 3 })];
    const result = applyItemChanges(item, {
      unit: 'kg',
      quantity: 500,
      unitPriceInCents: 1,
      parts,
    });
    expect(result.unit).toBe('unit');
    expect(result.quantity).toBe(MIN_QUANTITY);
    expect(result.unitPriceInCents).toBe(3000);
  });

  it('collapses back to a plain price when parts is cleared to null', () => {
    const item = makeItem({
      unit: 'unit',
      quantity: MIN_QUANTITY,
      unitPriceInCents: 1197,
      parts: [makePart({ unitPriceInCents: 1197, quantity: 1 })],
    });
    const result = applyItemChanges(item, {
      parts: null,
      unitPriceInCents: 1197,
    });
    expect(result.parts).toBeNull();
    expect(result.unitPriceInCents).toBe(1197);
  });
});

describe('getLineTotalInCents', () => {
  it('multiplies price by quantity for a unit item', () => {
    const item = makeItem({ unit: 'unit', unitPriceInCents: 500, quantity: 3 });
    expect(getLineTotalInCents(item)).toBe(1500);
  });

  it('is zero for a priceless item', () => {
    const item = makeItem({ unitPriceInCents: null });
    expect(getLineTotalInCents(item)).toBe(0);
  });

  it.each([
    [2990, 830, 2482],
    [1000, 500, 500],
    [1, 1, 0],
  ])('rounds a kg line total half-up: %i × %ig -> %i', (unitPriceInCents, grams, expected) => {
    const item = makeItem({
      unit: 'kg',
      unitPriceInCents,
      quantity: grams,
    });
    expect(getLineTotalInCents(item)).toBe(expected);
  });

  it('is zero for a priceless kg item', () => {
    const item = makeItem({
      unit: 'kg',
      unitPriceInCents: null,
      quantity: 830,
    });
    expect(getLineTotalInCents(item)).toBe(0);
  });
});

describe('parts helpers', () => {
  it('getPartsTotalInCents sums price times quantity across parts', () => {
    const parts = [
      makePart({ unitPriceInCents: 399, quantity: 2 }),
      makePart({ unitPriceInCents: 199, quantity: 1 }),
    ];
    expect(getPartsTotalInCents(parts)).toBe(399 * 2 + 199);
  });

  it('getPartsCount sums the quantities', () => {
    const parts = [makePart({ quantity: 2 }), makePart({ quantity: 3 })];
    expect(getPartsCount(parts)).toBe(5);
  });
});

describe('isKgItem and hasParts', () => {
  it('isKgItem reflects the unit', () => {
    expect(isKgItem(makeItem({ unit: 'kg' }))).toBe(true);
    expect(isKgItem(makeItem({ unit: 'unit' }))).toBe(false);
  });

  it('hasParts reflects a non-null parts list', () => {
    expect(hasParts(makeItem({ parts: null }))).toBe(false);
    expect(hasParts(makeItem({ parts: [makePart()] }))).toBe(true);
  });
});
