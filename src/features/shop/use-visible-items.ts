import { useMemo } from 'react';
import {
  CATEGORIES,
  type Category,
  getLineTotalInCents,
  type ListItem,
} from '@/features/shop/list-item';

export type SortOption =
  | 'recent'
  | 'oldest'
  | 'price-desc'
  | 'price-asc'
  | 'name'
  | 'category';

export interface SortOptionMeta {
  readonly id: SortOption;
  readonly label: string;
}

export const DEFAULT_SORT: SortOption = 'recent';

export const SORT_OPTIONS: readonly SortOptionMeta[] = [
  { id: 'recent', label: 'Mais recentes primeiro' },
  { id: 'oldest', label: 'Mais antigos primeiro' },
  { id: 'price-desc', label: 'Maior preço primeiro' },
  { id: 'price-asc', label: 'Menor preço primeiro' },
  { id: 'name', label: 'Nome (A-Z)' },
  { id: 'category', label: 'Por categoria' },
];

export function getSortLabel(sort: SortOption): string {
  return SORT_OPTIONS.find((option) => option.id === sort)?.label ?? '';
}

interface UseVisibleItemsParams {
  readonly items: readonly ListItem[];
  readonly search: string;
  readonly sort: SortOption;
}

const UNCATEGORIZED_ORDER = CATEGORIES.length;
const CATEGORY_ORDER = new Map<Category, number>(
  CATEGORIES.map((category, index) => [category, index]),
);

function getCategoryOrder(category: Category | null): number {
  if (category === null) return UNCATEGORIZED_ORDER;
  return CATEGORY_ORDER.get(category) ?? UNCATEGORIZED_ORDER;
}

function compareItems(
  first: ListItem,
  second: ListItem,
  sort: SortOption,
): number {
  if (sort === 'recent') return second.createdAt.localeCompare(first.createdAt);
  if (sort === 'price-desc') {
    return getLineTotalInCents(second) - getLineTotalInCents(first);
  }
  if (sort === 'price-asc') {
    return getLineTotalInCents(first) - getLineTotalInCents(second);
  }
  if (sort === 'name') return first.name.localeCompare(second.name, 'pt-BR');
  if (sort === 'category') {
    return getCategoryOrder(first.category) - getCategoryOrder(second.category);
  }
  return 0;
}

export function useVisibleItems({
  items,
  search,
  sort,
}: UseVisibleItemsParams): readonly ListItem[] {
  return useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered =
      query.length === 0
        ? items
        : items.filter((item) => item.name.toLowerCase().includes(query));
    if (sort === 'oldest') return filtered;
    return [...filtered].sort((first, second) =>
      compareItems(first, second, sort),
    );
  }, [items, search, sort]);
}
