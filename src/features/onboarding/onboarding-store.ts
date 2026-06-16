import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  hasHydrated: boolean;
  markOnboardingSeen: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      hasHydrated: false,
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'checkit:onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate onboarding store:', error);
        }
        state?.setHasHydrated(true);
      },
      version: 0,
    },
  ),
);
