import {
  getCategoryBreakdown,
  getListTotalInCents,
  getTopItems,
} from "@/features/home/active-list";
import { useActiveListStore } from "@/features/home/active-list-store";
import { StackedCategoryBar } from "@/features/summary/components/stacked-category-bar";
import { SummaryTotalTile } from "@/features/summary/components/summary-total-tile";
import { TopItemsList } from "@/features/summary/components/top-items-list";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { JSX } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_ANIMATION_DURATION = 320;

export default function SummaryScreen() {
  const activeList = useActiveListStore((state) => state.activeList);
  if (!activeList) return null;
  const totalInCents = getListTotalInCents(activeList);
  const breakdown = getCategoryBreakdown(activeList);
  const topItems = getTopItems(activeList);
  return (
    <View testID="summary-screen" className="flex-1 bg-white">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          animationDuration: SCREEN_ANIMATION_DURATION,
        }}
      />
      <SafeAreaView edges={["top"]} className="bg-checkit-primary">
        <View className="flex-row items-center px-2.5 pb-3.5 pt-1">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            testID="summary-back"
            className="h-11 w-11 items-center justify-center rounded-full"
          >
            <ChevronLeft size={26} color="#ffffff" strokeWidth={2} />
          </Pressable>
          <Text className="text-lg font-bold tracking-tight text-white">
            Resumo da lista
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerClassName="px-[22px] pt-5 pb-[100px]"
        showsVerticalScrollIndicator={false}
      >
        <SummaryTotalTile
          totalInCents={totalInCents}
          limitInCents={activeList.limitInCents}
        />
        {breakdown.length > 0 && (
          <>
            <Text className="mb-3 mt-[26px] text-base font-bold tracking-tight text-checkit-charcoal-ink">
              Por categoria
            </Text>
            <StackedCategoryBar
              entries={breakdown}
              totalInCents={totalInCents}
            />
          </>
        )}
        {topItems.length > 0 && (
          <>
            <Text className="mb-3 mt-[26px] text-base font-bold tracking-tight text-checkit-charcoal-ink">
              Mais caros
            </Text>
            <TopItemsList items={topItems} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
