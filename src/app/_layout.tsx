import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useActiveListStore } from '@/features/home/active-list-store';
import { startBudgetAlertTracking } from '@/features/notifications/budget-alerts';
import { useNotificationsStore } from '@/features/notifications/notifications-store';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';
import { useSettingsStore } from '@/features/settings/settings-store';
import { useAppFonts } from '@/lib/fonts';
import { applyGlobalTextDefaults } from '@/lib/text-defaults';

SplashScreen.preventAutoHideAsync();
applyGlobalTextDefaults();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { fontsLoaded } = useAppFonts();
  const onboardingHydrated = useOnboardingStore((s) => s.hasHydrated);
  const activeListHydrated = useActiveListStore((s) => s.hasHydrated);
  const settingsHydrated = useSettingsStore((s) => s.hasHydrated);
  const notificationsHydrated = useNotificationsStore((s) => s.hasHydrated);
  const isReady =
    fontsLoaded &&
    onboardingHydrated &&
    activeListHydrated &&
    settingsHydrated &&
    notificationsHydrated;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;
    return startBudgetAlertTracking();
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </GestureHandlerRootView>
  );
}
