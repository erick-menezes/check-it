import { Text, View } from 'react-native';
import { formatBRL } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface SummaryTotalTileProps {
  totalInCents: number;
  limitInCents: number;
}

export function SummaryTotalTile({
  totalInCents,
  limitInCents,
}: SummaryTotalTileProps) {
  const over = totalInCents > limitInCents;
  const difference = Math.abs(limitInCents - totalInCents);
  return (
    <View
      testID="summary-total-tile"
      className={cn(
        'rounded-[18px] border-hairline p-5',
        over
          ? 'border-checkit-danger bg-checkit-danger/10'
          : 'border-checkit-mist-border bg-checkit-linen-cream',
      )}
    >
      <Text className="text-[11px] font-semibold uppercase tracking-[0.06em] text-checkit-pebble-gray">
        Total da lista
      </Text>
      <Text
        className={`mt-1.5 text-[40px] font-extrabold tabular-nums tracking-tight ${over ? 'text-checkit-danger' : 'text-checkit-charcoal-ink'}`}
      >
        {formatBRL(totalInCents)}
      </Text>
      <Text className="mt-1.5 text-sm text-checkit-pebble-gray">
        Limite definido:{' '}
        <Text className="font-bold tabular-nums text-checkit-charcoal-ink">
          {formatBRL(limitInCents)}
        </Text>
      </Text>
      <View
        className={cn(
          'mt-3.5 flex-row items-center justify-between gap-3 rounded-xl px-4 py-3.5',
          over ? 'bg-checkit-danger' : 'bg-checkit-primary',
        )}
      >
        <View className="gap-0.5">
          <Text
            testID="summary-banner-label"
            className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/85"
          >
            {over ? 'Estourou em' : 'Você ainda tem'}
          </Text>
          <Text className="text-xs text-white/90">
            {over ? 'Reveja a lista pra ajustar' : 'pra gastar nesta lista'}
          </Text>
        </View>
        <Text
          testID="summary-banner-value"
          className="text-[22px] font-extrabold tabular-nums tracking-tight text-white"
        >
          {formatBRL(difference)}
        </Text>
      </View>
    </View>
  );
}
