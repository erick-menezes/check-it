import type { JSX } from 'react';
import { Text, View } from 'react-native';
import type { CategoryBreakdownEntry } from '@/features/home/active-list';
import {
  getCategoryBackgroundClass,
  getCategoryLabel,
} from '@/features/shop/list-item';
import { formatBRL } from '@/lib/currency';
import { cn } from '@/lib/utils';

const PERCENT = 100;

interface StackedCategoryBarProps {
  entries: readonly CategoryBreakdownEntry[];
  totalInCents: number;
}

function getSegmentKey(entry: CategoryBreakdownEntry): string {
  return entry.category ?? 'uncategorized';
}

function getPercent(amountInCents: number, totalInCents: number): number {
  if (totalInCents <= 0) return 0;
  return (amountInCents / totalInCents) * PERCENT;
}

export function StackedCategoryBar({
  entries,
  totalInCents,
}: StackedCategoryBarProps): JSX.Element {
  return (
    <View testID="summary-stacked-bar">
      <View className="h-3 w-full flex-row overflow-hidden rounded-full bg-checkit-fog-gray">
        {entries.map((entry) => (
          <View
            key={getSegmentKey(entry)}
            testID={`summary-bar-segment-${getSegmentKey(entry)}`}
            style={{
              width: `${getPercent(entry.totalInCents, totalInCents)}%`,
            }}
            className={cn('h-3', getCategoryBackgroundClass(entry.category))}
          />
        ))}
      </View>
      <View className="mt-3.5 gap-2.5">
        {entries.map((entry) => (
          <View
            key={getSegmentKey(entry)}
            testID={`summary-legend-${getSegmentKey(entry)}`}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2.5">
              <View
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  getCategoryBackgroundClass(entry.category),
                )}
              />
              <Text className="text-[13px] font-semibold text-checkit-charcoal-ink">
                {getCategoryLabel(entry.category)}
              </Text>
              <Text className="text-[11px] text-checkit-pebble-gray">
                {Math.round(getPercent(entry.totalInCents, totalInCents))}%
              </Text>
            </View>
            <Text className="text-[13px] font-bold tabular-nums text-checkit-charcoal-ink">
              {formatBRL(entry.totalInCents)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
