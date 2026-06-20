import { X } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  type ActiveList,
  getBudgetRatio,
  getBudgetStatus,
} from '@/features/home/active-list';
import { formatBRL } from '@/lib/currency';
import { BudgetBarFill } from './components/budget-bar-fill';
import { EditableTitle } from './components/editable-title';
import { buildStatusLine } from './helpers';

interface ShopHeaderProps {
  list: ActiveList;
  onRename: (name: string) => void;
  onClose: () => void;
}

export function ShopHeader({ list, onRename, onClose }: ShopHeaderProps) {
  const status = getBudgetStatus(list);
  const statusLine = useMemo(
    () => buildStatusLine(list, status),
    [list, status],
  );
  const fillPercent = Math.round(getBudgetRatio(list) * 100);
  return (
    <SafeAreaView edges={['top']} className="bg-checkit-primary">
      <View className="px-[22px] pb-[18px] pt-1">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          testID="shop-close"
          className="-ml-1 h-11 w-11 items-center justify-center rounded-full"
        >
          <X size={24} color="#ffffff" strokeWidth={2} />
        </Pressable>
        <View className="mt-2.5">
          <EditableTitle name={list.name} onRename={onRename} />
        </View>
        <View
          accessible
          accessibilityLabel={`No carrinho ${formatBRL(list.totalInCents)} de ${formatBRL(list.limitInCents)}`}
          testID="shop-budget-chip"
          className="mt-4 rounded-[14px] border border-white/[0.18] bg-white/[0.12] px-3.5 py-3"
        >
          <View className="flex-row items-baseline justify-between">
            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-[0.04em] text-white/85">
                No carrinho
              </Text>
              <Text className="mt-0.5 text-[22px] font-bold tabular-nums text-white">
                {formatBRL(list.totalInCents)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] font-semibold uppercase tracking-[0.04em] text-white/85">
                Limite
              </Text>
              <Text className="mt-0.5 text-sm font-semibold tabular-nums text-white">
                {formatBRL(list.limitInCents)}
              </Text>
            </View>
          </View>
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ now: fillPercent, min: 0, max: 100 }}
            testID={`shop-progress-${status}`}
            className="mt-2.5 h-[5px] w-full overflow-hidden rounded bg-white/[0.18]"
          >
            <BudgetBarFill fillPercent={fillPercent} status={status} />
          </View>
          <Text
            className="mt-2 text-xs text-white/90"
            testID="shop-status-line"
          >
            {statusLine}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
