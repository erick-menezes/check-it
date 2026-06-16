import { Redirect } from 'expo-router';
import type { JSX } from 'react';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';

export default function Index(): JSX.Element {
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <Redirect href="/onboarding" />;
  }

  if (hasSeenOnboarding) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/onboarding" />;
}
