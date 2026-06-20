import type { JSX } from 'react';
import { Text, View } from 'react-native';
import {
  getCategoryBackgroundClass,
  getLineTotalInCents,
  type ListItem,
} from '@/features/shop/list-item';
import { formatBRL } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface TopItemsListProps {
  items: readonly ListItem[];
}

export function TopItemsList({ items }: TopItemsListProps): JSX.Element {
  return (
    <View testID="summary-top-items" className="gap-2">
      {items.map((item) => (
        <View
          key={item.id}
          testID={`summary-top-item-${item.id}`}
          className="flex-row items-center gap-2.5 rounded-[10px] bg-checkit-linen-cream px-3 py-2.5"
        >
          <View
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              getCategoryBackgroundClass(item.category),
            )}
          />
          <Text
            numberOfLines={1}
            className="flex-1 text-[13px] font-semibold text-checkit-charcoal-ink"
          >
            {item.name}
          </Text>
          <Text className="text-[13px] font-bold tabular-nums text-checkit-charcoal-ink">
            {formatBRL(getLineTotalInCents(item))}
          </Text>
        </View>
      ))}
    </View>
  );
}
