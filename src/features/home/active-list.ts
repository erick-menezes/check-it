import {
  applyItemChanges,
  type Category,
  createListItem,
  getLineTotalInCents,
  type ListItem,
  type NewItemInput,
  type UpdateItemChanges,
} from '@/features/shop/list-item';
import { createId } from '@/lib/id';

export interface ActiveList {
  readonly id: string;
  readonly name: string;
  readonly itemCount: number;
  readonly createdAt: string;
  readonly totalInCents: number;
  readonly limitInCents: number;
  readonly items: readonly ListItem[];
}

export type BudgetStatus = 'onTrack' | 'warning' | 'overBudget';

export interface PendingSummary {
  readonly totalCount: number;
  readonly checkedCount: number;
  readonly pendingCount: number;
}

export interface CategoryBreakdownEntry {
  readonly category: Category | null;
  readonly totalInCents: number;
}

const listNameFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

function buildDefaultName(date: Date): string {
  return `Lista de ${listNameFormatter.format(date)}`;
}

export function createActiveList(
  limitInCents: number,
  now: Date = new Date(),
): ActiveList {
  return {
    id: createId(),
    name: buildDefaultName(now),
    itemCount: 0,
    totalInCents: 0,
    createdAt: now.toISOString(),
    limitInCents,
    items: [],
  };
}

export function getCheckedTotalInCents(list: ActiveList): number {
  return list.items.reduce((total, item) => {
    if (!item.checked) return total;
    return total + getLineTotalInCents(item);
  }, 0);
}

export function getListTotalInCents(list: ActiveList): number {
  return list.items.reduce(
    (total, item) => total + getLineTotalInCents(item),
    0,
  );
}

export function recomputeTotals(list: ActiveList): ActiveList {
  return {
    ...list,
    itemCount: list.items.length,
    totalInCents: getCheckedTotalInCents(list),
  };
}

export function addItem(
  list: ActiveList,
  name: string,
  now: Date = new Date(),
): ActiveList {
  return { ...list, items: [...list.items, createListItem({ name }, now)] };
}

export function addItems(
  list: ActiveList,
  inputs: readonly NewItemInput[],
  now: Date = new Date(),
): ActiveList {
  const created = inputs.map((input) => createListItem(input, now));
  return { ...list, items: [...list.items, ...created] };
}

export function toggleItem(list: ActiveList, itemId: string): ActiveList {
  const items = list.items.map((item) =>
    item.id === itemId ? { ...item, checked: !item.checked } : item,
  );
  return { ...list, items };
}

export function setAllChecked(list: ActiveList, checked: boolean): ActiveList {
  const items = list.items.map((item) =>
    item.checked === checked ? item : { ...item, checked },
  );
  return { ...list, items };
}

export function updateItem(
  list: ActiveList,
  itemId: string,
  changes: UpdateItemChanges,
): ActiveList {
  const items = list.items.map((item) =>
    item.id === itemId ? applyItemChanges(item, changes) : item,
  );
  return { ...list, items };
}

export function removeItem(list: ActiveList, itemId: string): ActiveList {
  const items = list.items.filter((item) => item.id !== itemId);
  return { ...list, items };
}

export function renameList(list: ActiveList, name: string): ActiveList {
  return { ...list, name };
}

export function getPendingSummary(list: ActiveList): PendingSummary {
  const checkedCount = list.items.reduce(
    (count, item) => (item.checked ? count + 1 : count),
    0,
  );
  return {
    totalCount: list.items.length,
    checkedCount,
    pendingCount: list.items.length - checkedCount,
  };
}

export function getCategoryBreakdown(
  list: ActiveList,
): readonly CategoryBreakdownEntry[] {
  const totals = new Map<Category | null, number>();
  for (const item of list.items) {
    const lineTotal = getLineTotalInCents(item);
    if (lineTotal === 0) continue;
    totals.set(item.category, (totals.get(item.category) ?? 0) + lineTotal);
  }
  return [...totals.entries()]
    .map(([category, totalInCents]) => ({ category, totalInCents }))
    .sort((first, second) => second.totalInCents - first.totalInCents);
}

const DEFAULT_TOP_ITEMS = 5;

export function getTopItems(
  list: ActiveList,
  limit: number = DEFAULT_TOP_ITEMS,
): readonly ListItem[] {
  return list.items
    .filter((item) => getLineTotalInCents(item) > 0)
    .sort(
      (first, second) =>
        getLineTotalInCents(second) - getLineTotalInCents(first),
    )
    .slice(0, limit);
}

const WARNING_RATIO = 0.85;
const OVER_RATIO = 1;
const MIN_RATIO = 0;
const MAX_RATIO = 1;

function computeRatio(list: ActiveList): number {
  if (list.limitInCents <= 0) return MIN_RATIO;
  return list.totalInCents / list.limitInCents;
}

export function getBudgetStatus(list: ActiveList): BudgetStatus {
  const ratio = computeRatio(list);
  if (ratio > OVER_RATIO) return 'overBudget';
  if (ratio >= WARNING_RATIO) return 'warning';
  return 'onTrack';
}

export function getBudgetRatio(list: ActiveList): number {
  const ratio = computeRatio(list);
  if (ratio < MIN_RATIO) return MIN_RATIO;
  if (ratio > MAX_RATIO) return MAX_RATIO;
  return ratio;
}
