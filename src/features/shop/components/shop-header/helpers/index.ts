import type { ActiveList, BudgetStatus } from '@/features/home/active-list';
import { getLineTotalInCents } from '@/features/shop/list-item';
import { formatBRL } from '@/lib/currency';

export function getPendingPricedTotalInCents(list: ActiveList): number {
  return list.items.reduce((total, item) => {
    if (item.checked) return total;
    return total + getLineTotalInCents(item);
  }, 0);
}

export function getPendingCount(list: ActiveList): number {
  return list.items.reduce(
    (count, item) => (item.checked ? count : count + 1),
    0,
  );
}

export function buildStatusLine(
  list: ActiveList,
  status: BudgetStatus,
): string {
  if (status === 'overBudget') {
    return `Excedeu em ${formatBRL(list.totalInCents - list.limitInCents)}`;
  }
  const pendingTotal = getPendingPricedTotalInCents(list);
  if (pendingTotal > 0) {
    return `Faltam ${getPendingCount(list)} • ${formatBRL(pendingTotal)} a comprar`;
  }
  return `Ainda dá pra gastar ${formatBRL(list.limitInCents - list.totalInCents)}`;
}
