import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';

export default function Index() {
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
