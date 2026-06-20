import { formatBRL } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { JSX } from "react";
import { Pressable, Text, View } from "react-native";
import { type ActiveList, getBudgetStatus } from "../active-list";
import { BudgetProgressBar } from "./budget-progress-bar";

function formatItemCount(count: number): string {
  const unit = count === 1 ? "item" : "itens";
  return `${count} ${unit}`;
}

function isSameDay(date: Date, reference: Date): boolean {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  if (isSameDay(date, new Date())) return "Iniciada hoje";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

interface ActiveListCardProps {
  list: ActiveList;
  onOpen: () => void;
}

export function ActiveListCard({
  list,
  onOpen,
}: ActiveListCardProps) {
  const isOverBudget = getBudgetStatus(list) === "overBudget";
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`Abrir lista ${list.name}`}
      testID="active-list-card"
      style={({ pressed }) => [
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
          elevation: 2,
        },
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      className="gap-3 rounded-2xl border-hairline border-checkit-mist-border bg-white p-4"
    >
      <View className="flex-row items-start justify-between gap-2.5">
        <View className="min-w-0 flex-1">
          <View className="mb-1 flex-row items-center gap-2">
            <View className="rounded-full bg-checkit-primary px-2 py-0.5">
              <Text className="text-[10px] font-bold text-white">
                Em aberto
              </Text>
            </View>
            <Text className="text-xs font-medium text-checkit-pebble-gray">
              {formatItemCount(list.itemCount)}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-[15px] font-bold tracking-tight text-checkit-charcoal-ink"
          >
            {list.name}
          </Text>
          <Text className="mt-0.5 text-xs font-medium text-checkit-pebble-gray">
            {formatDateLabel(list.createdAt)}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className={cn(
              "text-base font-bold tabular-nums tracking-tight",
              isOverBudget
                ? "text-checkit-danger"
                : "text-checkit-charcoal-ink",
            )}
          >
            {formatBRL(list.totalInCents)}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold tabular-nums text-checkit-pebble-gray">
            de {formatBRL(list.limitInCents)}
          </Text>
        </View>
      </View>
      <BudgetProgressBar list={list} />
    </Pressable>
  );
}
