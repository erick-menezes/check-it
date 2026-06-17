import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  budgetAlertsEnabled: boolean;
  hasHydrated: boolean;
  setBudgetAlertsEnabled: (enabled: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      budgetAlertsEnabled: true,
      hasHydrated: false,
      setBudgetAlertsEnabled: (enabled) =>
        set({ budgetAlertsEnabled: enabled }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'checkit:settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        budgetAlertsEnabled: state.budgetAlertsEnabled,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate settings store:', error);
        }
        state?.setHasHydrated(true);
      },
      version: 0,
    },
  ),
);
