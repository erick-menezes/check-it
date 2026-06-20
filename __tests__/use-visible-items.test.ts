import { renderHook } from '@testing-library/react-native';
import {
  type Category,
  createListItem,
  type ListItem,
} from '@/features/shop/list-item';
import {
  getSortLabel,
  useVisibleItems,
} from '@/features/shop/use-visible-items';

function makeItem(
  name: string,
  unitPriceInCents: number | null = null,
  category: Category | null = null,
  quantity = 1,
): ListItem {
  return createListItem({ name, unitPriceInCents, category, quantity });
}

function visibleNames(
  items: readonly ListItem[],
  search: string,
  sort: Parameters<typeof useVisibleItems>[0]['sort'],
): string[] {
  const { result } = renderHook(() => useVisibleItems({ items, search, sort }));
  return result.current.map((item) => item.name);
}

describe('useVisibleItems', () => {
  it('filters by case-insensitive name substring', () => {
    const items = [
      makeItem('Arroz'),
      makeItem('Feijão'),
      makeItem('Arroz Doce'),
    ];
    expect(visibleNames(items, 'arroz', 'oldest')).toEqual([
      'Arroz',
      'Arroz Doce',
    ]);
  });

  it('restores the full list when the search is cleared', () => {
    const items = [makeItem('Arroz'), makeItem('Feijão')];
    expect(visibleNames(items, '   ', 'oldest')).toEqual(['Arroz', 'Feijão']);
  });

  it('returns no items when nothing matches the search', () => {
    const items = [makeItem('Arroz'), makeItem('Feijão')];
    expect(visibleNames(items, 'café', 'oldest')).toEqual([]);
  });

  it('keeps the stored insertion order under the oldest sort', () => {
    const items = [makeItem('Banana'), makeItem('Abacaxi'), makeItem('Cebola')];
    expect(visibleNames(items, '', 'oldest')).toEqual([
      'Banana',
      'Abacaxi',
      'Cebola',
    ]);
  });

  it('lists the most recently added items first under the recent sort', () => {
    const items = [
      createListItem({ name: 'Primeiro' }, new Date('2026-01-01T10:00:00Z')),
      createListItem({ name: 'Segundo' }, new Date('2026-01-01T11:00:00Z')),
      createListItem({ name: 'Terceiro' }, new Date('2026-01-01T12:00:00Z')),
    ];
    expect(visibleNames(items, '', 'recent')).toEqual([
      'Terceiro',
      'Segundo',
      'Primeiro',
    ]);
  });

  it('sorts by highest price first', () => {
    const items = [
      makeItem('A', 500),
      makeItem('B', 1500),
      makeItem('C', 1000),
    ];
    expect(visibleNames(items, '', 'price-desc')).toEqual(['B', 'C', 'A']);
  });

  it('sorts by line total, not unit price, when quantities differ', () => {
    const items = [
      makeItem('A', 500, null, 1),
      makeItem('B', 200, null, 5),
      makeItem('C', 400, null, 2),
    ];
    expect(visibleNames(items, '', 'price-desc')).toEqual(['B', 'C', 'A']);
    expect(visibleNames(items, '', 'price-asc')).toEqual(['A', 'C', 'B']);
  });

  it('sorts by lowest price first, treating priceless items as zero', () => {
    const items = [
      makeItem('A', 500),
      makeItem('B', null),
      makeItem('C', 1000),
    ];
    expect(visibleNames(items, '', 'price-asc')).toEqual(['B', 'A', 'C']);
  });

  it('sorts by name A-Z', () => {
    const items = [makeItem('Cebola'), makeItem('Abacaxi'), makeItem('Banana')];
    expect(visibleNames(items, '', 'name')).toEqual([
      'Abacaxi',
      'Banana',
      'Cebola',
    ]);
  });

  it('groups by category with uncategorized items last', () => {
    const items = [
      makeItem('Sem', 100, null),
      makeItem('Bebida', 100, 'drinks'),
      makeItem('Mercearia', 100, 'grocery'),
    ];
    expect(visibleNames(items, '', 'category')).toEqual([
      'Mercearia',
      'Bebida',
      'Sem',
    ]);
  });

  it('never mutates the stored order of the source array', () => {
    const items = [
      makeItem('A', 500),
      makeItem('B', 1500),
      makeItem('C', 1000),
    ];
    renderHook(() =>
      useVisibleItems({ items, search: '', sort: 'price-desc' }),
    );
    expect(items.map((item) => item.name)).toEqual(['A', 'B', 'C']);
  });

  it('exposes the human label for each sort option', () => {
    expect(getSortLabel('recent')).toBe('Mais recentes primeiro');
    expect(getSortLabel('oldest')).toBe('Mais antigos primeiro');
    expect(getSortLabel('price-desc')).toBe('Maior preço primeiro');
    expect(getSortLabel('category')).toBe('Por categoria');
  });
});
