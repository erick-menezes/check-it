import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import {
  type ActiveList,
  getPendingSummary,
} from '@/features/home/active-list';
import { formatBRL } from '@/lib/currency';

interface SummaryPreviewCardProps {
  list: ActiveList;
}

interface PreviewRowProps {
  label: string;
  value: string;
}

function PreviewRow({ label, value }: PreviewRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-checkit-pebble-gray">{label}</Text>
      <Text className="text-xs font-semibold tabular-nums text-checkit-charcoal-ink">
        {value}
      </Text>
    </View>
  );
}

export function SummaryPreviewCard({
  list,
}: SummaryPreviewCardProps) {
  const summary = getPendingSummary(list);
  const over = list.totalInCents > list.limitInCents;
  const difference = Math.abs(list.limitInCents - list.totalInCents);
  return (
    <View
      testID="shop-summary-preview"
      className="mt-[22px] rounded-2xl border-hairline border-checkit-mist-border bg-checkit-linen-cream p-4"
    >
      <View className="mb-2.5 flex-row items-baseline justify-between">
        <Text className="text-base font-bold tracking-tight text-checkit-charcoal-ink">
          Resumo
        </Text>
        <Pressable
          onPress={() => router.push('/summary')}
          accessibilityRole="button"
          accessibilityLabel="Ver resumo completo"
          testID="shop-summary-open"
          className="h-9 justify-center"
        >
          <Text className="text-[13px] font-bold text-checkit-primary">
            Ver completo
          </Text>
        </Pressable>
      </View>
      <View className="gap-2">
        <PreviewRow
          label="Itens marcados"
          value={`${summary.checkedCount} de ${summary.totalCount}`}
        />
        <PreviewRow label="Subtotal" value={formatBRL(list.totalInCents)} />
        <PreviewRow label="Limite" value={formatBRL(list.limitInCents)} />
        <View className="my-1 h-px bg-checkit-mist-border" />
        <View className="flex-row items-center justify-between">
          <Text className="text-[13px] font-bold text-checkit-charcoal-ink">
            {over ? 'Excedeu' : 'Disponível'}
          </Text>
          <Text
            testID="shop-summary-difference"
            className={`text-sm font-bold tabular-nums ${over ? 'text-checkit-danger' : 'text-checkit-primary'}`}
          >
            {formatBRL(difference)}
          </Text>
        </View>
      </View>
    </View>
  );
}
