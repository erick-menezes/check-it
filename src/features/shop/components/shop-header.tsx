import {
  type ActiveList,
  type BudgetStatus,
  getBudgetRatio,
  getBudgetStatus,
} from "@/features/home/active-list";
import { getLineTotalInCents } from "@/features/shop/list-item";
import { formatBRL } from "@/lib/currency";
import { Pencil, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const CLOSE_ICON_SIZE = 24;
const TITLE_EDIT_ICON_SIZE = 14;
const PERCENT = 100;
const BAR_ANIMATION_DURATION = 300;

const STATUS_FILL_COLOR: Record<BudgetStatus, string> = {
  onTrack: "#ffffff",
  warning: "#F2B807",
  overBudget: "#E13E3E",
};

const STATUS_INDEX: Record<BudgetStatus, number> = {
  onTrack: 0,
  warning: 1,
  overBudget: 2,
};

const STATUS_COLOR_RANGE = [
  STATUS_FILL_COLOR.onTrack,
  STATUS_FILL_COLOR.warning,
  STATUS_FILL_COLOR.overBudget,
];

function BudgetBarFill({
  fillPercent,
  status,
}: {
  fillPercent: number;
  status: BudgetStatus;
}) {
  const width = useSharedValue(fillPercent);
  const colorDriver = useSharedValue(STATUS_INDEX[status]);
  useEffect(() => {
    width.value = withTiming(fillPercent, {
      duration: BAR_ANIMATION_DURATION,
    });
  }, [fillPercent, width]);
  useEffect(() => {
    colorDriver.value = withTiming(STATUS_INDEX[status], {
      duration: BAR_ANIMATION_DURATION,
    });
  }, [status, colorDriver]);
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: interpolateColor(
      colorDriver.value,
      [0, 1, 2],
      STATUS_COLOR_RANGE,
    ),
  }));
  return (
    <Animated.View
      testID={`shop-progress-fill-${status}`}
      style={animatedStyle}
      className="h-[5px] rounded"
    />
  );
}

interface ShopHeaderProps {
  list: ActiveList;
  onRename: (name: string) => void;
  onClose: () => void;
}

function getPendingPricedTotalInCents(list: ActiveList): number {
  return list.items.reduce((total, item) => {
    if (item.checked) return total;
    return total + getLineTotalInCents(item);
  }, 0);
}

function getPendingCount(list: ActiveList): number {
  return list.items.reduce(
    (count, item) => (item.checked ? count : count + 1),
    0,
  );
}

function buildStatusLine(list: ActiveList, status: BudgetStatus): string {
  if (status === "overBudget") {
    return `Excedeu em ${formatBRL(list.totalInCents - list.limitInCents)}`;
  }
  const pendingTotal = getPendingPricedTotalInCents(list);
  if (pendingTotal > 0) {
    return `Faltam ${getPendingCount(list)} • ${formatBRL(pendingTotal)} a comprar`;
  }
  return `Ainda dá pra gastar ${formatBRL(list.limitInCents - list.totalInCents)}`;
}

function EditableTitle({
  name,
  onRename,
}: {
  name: string;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  function startEditing(): void {
    setDraft(name);
    setEditing(true);
  }
  function commit(): void {
    const next = draft.trim();
    onRename(next.length > 0 ? next : name);
    setEditing(false);
  }
  if (editing) {
    return (
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onBlur={commit}
        onSubmitEditing={commit}
        autoFocus
        returnKeyType="done"
        testID="shop-title-input"
        className="border-b-2 border-white/50 pb-0.5 text-[22px] font-bold tracking-tight text-white"
      />
    );
  }
  return (
    <Pressable
      onPress={startEditing}
      accessibilityRole="button"
      accessibilityLabel={`Editar nome da lista, ${name}`}
      testID="shop-title"
      className="flex-row items-center gap-2"
    >
      <Text className="text-[22px] font-bold leading-[26px] tracking-tight text-white">
        {name}
      </Text>
      <Pencil
        size={TITLE_EDIT_ICON_SIZE}
        color="#ffffff"
        strokeWidth={2}
        className="opacity-70"
      />
    </Pressable>
  );
}

export function ShopHeader({
  list,
  onRename,
  onClose,
}: ShopHeaderProps) {
  const status = getBudgetStatus(list);
  const statusLine = useMemo(
    () => buildStatusLine(list, status),
    [list, status],
  );
  const fillPercent = Math.round(getBudgetRatio(list) * PERCENT);
  return (
    <SafeAreaView edges={["top"]} className="bg-checkit-primary">
      <View className="px-[22px] pb-[18px] pt-1">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          testID="shop-close"
          className="-ml-1 h-11 w-11 items-center justify-center rounded-full"
        >
          <X size={CLOSE_ICON_SIZE} color="#ffffff" strokeWidth={2} />
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
            accessibilityValue={{ now: fillPercent, min: 0, max: PERCENT }}
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
