import type { CategoryBreakdownEntry } from '@/features/home/active-list';

const PERCENT = 100;

export function getSegmentKey(entry: CategoryBreakdownEntry): string {
  return entry.category ?? 'uncategorized';
}

export function getPercent(
  amountInCents: number,
  totalInCents: number,
): number {
  if (totalInCents <= 0) return 0;
  return (amountInCents / totalInCents) * PERCENT;
}
