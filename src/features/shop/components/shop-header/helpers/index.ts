import {
  type ActiveList,
  type BudgetStatus,
  getPendingPricedTotalInCents,
  getProjectedTotalInCents,
} from '@/features/home/active-list';
import { formatBRL } from '@/lib/currency';

export { getPendingPricedTotalInCents } from '@/features/home/active-list';

export function getPendingCount(list: ActiveList): number {
  return list.items.reduce(
    (count, item) => (item.checked ? count : count + 1),
    0,
  );
}

const PROJECTION_TEXT_CLASS: Readonly<Record<BudgetStatus, string>> = {
  onTrack: 'text-white/90',
  warning: 'text-checkit-accent',
  overBudget: 'text-checkit-danger',
};

export function getProjectionTextClass(status: BudgetStatus): string {
  return PROJECTION_TEXT_CLASS[status];
}

export function buildStatusLine(
  list: ActiveList,
  status: BudgetStatus,
): string {
  if (status === 'overBudget') {
    return `Excedeu em ${formatBRL(list.totalInCents - list.limitInCents)}`;
  }
  const projectedTotal = getProjectedTotalInCents(list);
  if (projectedTotal > list.limitInCents) {
    return `Previsto estoura em ${formatBRL(projectedTotal - list.limitInCents)}`;
  }
  const pendingTotal = getPendingPricedTotalInCents(list);
  if (pendingTotal > 0) {
    return `Faltam ${getPendingCount(list)} • ${formatBRL(pendingTotal)} a comprar`;
  }
  return `Ainda dá pra gastar ${formatBRL(list.limitInCents - list.totalInCents)}`;
}
