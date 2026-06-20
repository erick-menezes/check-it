import { getLineTotalInCents, type ListItem } from '@/features/shop/list-item';
import { formatBRL } from '@/lib/currency';

export function formatSubtitle(item: ListItem): string {
  if (item.unitPriceInCents === null) return `${item.quantity}× sem preço`;
  return `${item.quantity}× ${formatBRL(item.unitPriceInCents)}`;
}

export function formatLineTotal(item: ListItem): string {
  if (item.unitPriceInCents === null) return '—';
  return formatBRL(getLineTotalInCents(item));
}
