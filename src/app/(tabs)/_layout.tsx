import { BottomTabBar, VISIBLE_TABS } from "@/components/ui/bottom-tab-bar";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import type { JSX } from "react";

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList className="hidden">
        {VISIBLE_TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
        ))}
      </TabList>
      <BottomTabBar />
    </Tabs>
  );
}
