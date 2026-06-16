import {
  type ActiveList,
  addItem,
  addItems,
  createActiveList,
  getBudgetRatio,
  getBudgetStatus,
  getCategoryBreakdown,
  getCheckedTotalInCents,
  getPendingSummary,
  getTopItems,
  recomputeTotals,
  removeItem,
  renameList,
  setAllChecked,
  toggleItem,
  updateItem,
} from '@/features/home/active-list';
import type { ListItem } from '@/features/shop/list-item';

function makeList(totalInCents: number, limitInCents: number): ActiveList {
  return {
    id: '1',
    name: 'Lista',
    itemCount: 1,
    createdAt: '2026-06-07T10:00:00.000Z',
    totalInCents,
    limitInCents,
    items: [],
  };
}

describe('getBudgetStatus', () => {
  it('returns onTrack below 85%', () => {
    expect(getBudgetStatus(makeList(8499, 10000))).toBe('onTrack');
  });

  it('returns warning at exactly 85%', () => {
    expect(getBudgetStatus(makeList(8500, 10000))).toBe('warning');
  });

  it('returns warning at exactly 100%', () => {
    expect(getBudgetStatus(makeList(10000, 10000))).toBe('warning');
  });

  it('returns overBudget above 100%', () => {
    expect(getBudgetStatus(makeList(10001, 10000))).toBe('overBudget');
  });

  it('treats a non-positive limit as onTrack', () => {
    expect(getBudgetStatus(makeList(5000, 0))).toBe('onTrack');
  });
});

describe('getBudgetRatio', () => {
  it('computes the ratio within range', () => {
    expect(getBudgetRatio(makeList(5000, 10000))).toBe(0.5);
  });

  it('clamps to 1 when over the limit', () => {
    expect(getBudgetRatio(makeList(15000, 10000))).toBe(1);
  });

  it('returns 0 for a non-positive limit', () => {
    expect(getBudgetRatio(makeList(5000, 0))).toBe(0);
  });
});

describe('createActiveList', () => {
  const FIXED_NOW = new Date('2026-06-07T10:00:00.000Z');

  it('builds a list carrying the given limit', () => {
    const list = createActiveList(50000, FIXED_NOW);
    expect(list.limitInCents).toBe(50000);
  });

  it('zeroes the item count and total', () => {
    const list = createActiveList(50000, FIXED_NOW);
    expect(list.itemCount).toBe(0);
    expect(list.totalInCents).toBe(0);
  });

  it('derives a date-based name from the injected now', () => {
    const list = createActiveList(50000, FIXED_NOW);
    expect(list.name).toBe('Lista de 07/06');
  });

  it('sets createdAt to the ISO string of the injected now', () => {
    const list = createActiveList(50000, FIXED_NOW);
    expect(list.createdAt).toBe('2026-06-07T10:00:00.000Z');
  });

  it('conforms to the ActiveList shape', () => {
    const list = createActiveList(50000, FIXED_NOW);
    expect(list).toEqual<ActiveList>({
      id: list.id,
      name: 'Lista de 07/06',
      itemCount: 0,
      createdAt: '2026-06-07T10:00:00.000Z',
      totalInCents: 0,
      limitInCents: 50000,
      items: [],
    });
  });

  it('generates a unique id on each call', () => {
    const first = createActiveList(50000, FIXED_NOW);
    const second = createActiveList(50000, FIXED_NOW);
    expect(first.id).not.toBe(second.id);
    expect(first.id).toHaveLength(36);
  });

  it('starts with an empty items array', () => {
    const list = createActiveList(50000, FIXED_NOW);
    expect(list.items).toEqual([]);
  });
});

const FIXED_DATE = new Date('2026-06-07T10:00:00.000Z');

function makeItem(overrides: Partial<ListItem> = {}): ListItem {
  return {
    id: 'item-1',
    name: 'Arroz',
    quantity: 1,
    unitPriceInCents: 1000,
    category: null,
    checked: false,
    createdAt: '2026-06-07T10:00:00.000Z',
    ...overrides,
  };
}

function makeListWithItems(items: readonly ListItem[]): ActiveList {
  return {
    id: 'list-1',
    name: 'Lista',
    itemCount: items.length,
    createdAt: '2026-06-07T10:00:00.000Z',
    totalInCents: 0,
    limitInCents: 50000,
    items,
  };
}

describe('item mutations', () => {
  it('addItem appends an unchecked, priceless, uncategorized item', () => {
    const result = addItem(makeListWithItems([]), 'Feijão', FIXED_DATE);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual<ListItem>({
      id: result.items[0].id,
      name: 'Feijão',
      quantity: 1,
      unitPriceInCents: null,
      category: null,
      checked: false,
      createdAt: '2026-06-07T10:00:00.000Z',
    });
  });

  it('addItems appends every receipt input in order', () => {
    const result = addItems(
      makeListWithItems([]),
      [
        { name: 'Arroz', quantity: 2, unitPriceInCents: 2490 },
        { name: 'Tomate', quantity: 1, unitPriceInCents: 699 },
      ],
      FIXED_DATE,
    );
    expect(result.items.map((item) => item.name)).toEqual(['Arroz', 'Tomate']);
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[0].unitPriceInCents).toBe(2490);
    expect(result.items[0].category).toBeNull();
  });

  it('toggleItem flips only the targeted item', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', checked: false }),
      makeItem({ id: 'b', checked: false }),
    ]);
    const result = toggleItem(list, 'a');
    expect(result.items[0].checked).toBe(true);
    expect(result.items[1].checked).toBe(false);
  });

  it('setAllChecked marks every item with the given value', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', checked: false }),
      makeItem({ id: 'b', checked: true }),
    ]);
    expect(setAllChecked(list, true).items.every((item) => item.checked)).toBe(
      true,
    );
    expect(
      setAllChecked(list, false).items.every((item) => !item.checked),
    ).toBe(true);
  });

  it('updateItem applies partial changes and clears price to null', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', unitPriceInCents: 1000 }),
    ]);
    const result = updateItem(list, 'a', {
      name: 'Arroz Integral',
      quantity: 3,
      unitPriceInCents: null,
      category: 'grocery',
    });
    expect(result.items[0].name).toBe('Arroz Integral');
    expect(result.items[0].quantity).toBe(3);
    expect(result.items[0].unitPriceInCents).toBeNull();
    expect(result.items[0].category).toBe('grocery');
  });

  it('updateItem coerces a quantity below one up to one', () => {
    const list = makeListWithItems([makeItem({ id: 'a' })]);
    expect(updateItem(list, 'a', { quantity: 0 }).items[0].quantity).toBe(1);
  });

  it('removeItem drops the targeted item', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a' }),
      makeItem({ id: 'b' }),
    ]);
    const result = removeItem(list, 'a');
    expect(result.items.map((item) => item.id)).toEqual(['b']);
  });

  it('renameList replaces the name and keeps the items', () => {
    const list = makeListWithItems([makeItem({ id: 'a' })]);
    const result = renameList(list, 'Compra do mês');
    expect(result.name).toBe('Compra do mês');
    expect(result.items).toHaveLength(1);
  });
});

describe('total recomputation', () => {
  it('sums only checked items by line total', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', checked: true, unitPriceInCents: 1000, quantity: 2 }),
      makeItem({ id: 'b', checked: false, unitPriceInCents: 5000 }),
    ]);
    expect(getCheckedTotalInCents(list)).toBe(2000);
  });

  it('treats checked priceless items as zero', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', checked: true, unitPriceInCents: null, quantity: 3 }),
      makeItem({ id: 'b', checked: true, unitPriceInCents: 700, quantity: 2 }),
    ]);
    expect(getCheckedTotalInCents(list)).toBe(1400);
  });

  it('recomputeTotals keeps itemCount and totalInCents in sync', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', checked: true, unitPriceInCents: 1500 }),
      makeItem({ id: 'b', checked: false, unitPriceInCents: 999 }),
    ]);
    const result = recomputeTotals(list);
    expect(result.itemCount).toBe(2);
    expect(result.totalInCents).toBe(1500);
  });
});

describe('list selectors', () => {
  it('getPendingSummary counts checked and pending items', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', checked: true }),
      makeItem({ id: 'b', checked: false }),
      makeItem({ id: 'c', checked: false }),
    ]);
    expect(getPendingSummary(list)).toEqual({
      totalCount: 3,
      checkedCount: 1,
      pendingCount: 2,
    });
  });

  it('getCategoryBreakdown aggregates line totals and sorts descending', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', category: 'grocery', unitPriceInCents: 1000 }),
      makeItem({ id: 'b', category: 'grocery', unitPriceInCents: 500 }),
      makeItem({ id: 'c', category: 'produce', unitPriceInCents: 2000 }),
      makeItem({ id: 'd', category: null, unitPriceInCents: 300 }),
      makeItem({ id: 'e', category: 'drinks', unitPriceInCents: null }),
    ]);
    expect(getCategoryBreakdown(list)).toEqual([
      { category: 'produce', totalInCents: 2000 },
      { category: 'grocery', totalInCents: 1500 },
      { category: null, totalInCents: 300 },
    ]);
  });

  it('getTopItems returns priced items ordered by line total, capped', () => {
    const list = makeListWithItems([
      makeItem({ id: 'a', unitPriceInCents: 1000, quantity: 2 }),
      makeItem({ id: 'b', unitPriceInCents: 5000 }),
      makeItem({ id: 'c', unitPriceInCents: null }),
    ]);
    const top = getTopItems(list, 2);
    expect(top.map((item) => item.id)).toEqual(['b', 'a']);
  });
});
