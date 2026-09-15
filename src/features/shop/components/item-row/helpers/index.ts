import { getLineTotalInCents, type ListItem } from '@/features/shop/list-item';
import { formatBRL } from '@/lib/currency';
import { formatWeight } from '@/lib/weight';

function formatKgSubtitle(item: ListItem): string {
  const weight = formatWeight(item.quantity);
  if (item.unitPriceInCents === null) return `${weight} × sem preço`;
  return `${weight} × ${formatBRL(item.unitPriceInCents)}/kg`;
}

export function formatSubtitle(item: ListItem): string {
  if (item.unit === 'kg') return formatKgSubtitle(item);
  if (item.unitPriceInCents === null) return `${item.quantity}× sem preço`;
  return `${item.quantity}× ${formatBRL(item.unitPriceInCents)}`;
}

export function formatLineTotal(item: ListItem): string {
  if (item.unitPriceInCents === null) return '—';
  return formatBRL(getLineTotalInCents(item));
}
