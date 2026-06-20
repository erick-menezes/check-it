import { Toggle } from "@/components/ui/toggle";
import { Bell } from "lucide-react-native";
import type { JSX } from "react";
import { Text, View } from "react-native";
import { useSettingsStore } from "../settings-store";
import { SettingIconTile } from "./setting-icon-tile";

export function NotificationRow() {
  const budgetAlertsEnabled = useSettingsStore(
    (state) => state.budgetAlertsEnabled,
  );
  const setBudgetAlertsEnabled = useSettingsStore(
    (state) => state.setBudgetAlertsEnabled,
  );
  return (
    <View className="min-h-[44px] flex-row items-center gap-3 px-4 py-3">
      <SettingIconTile Icon={Bell} />
      <View className="flex-1">
        <Text className="text-[14px] font-bold text-checkit-charcoal-ink">
          Alertas de orçamento
        </Text>
        <Text className="mt-0.5 text-[12px] font-medium text-checkit-pebble-gray">
          Quando ultrapassar 80% do limite
        </Text>
      </View>
      <Toggle
        value={budgetAlertsEnabled}
        onValueChange={setBudgetAlertsEnabled}
        accessibilityLabel="Alertas de orçamento"
        testID="budget-alerts-toggle"
      />
    </View>
  );
}
