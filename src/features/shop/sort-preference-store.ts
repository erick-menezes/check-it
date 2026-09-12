import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_SORT,
  isSortOption,
  type SortOption,
} from './use-visible-items';

interface SortPreferenceState {
  sort: SortOption;
  hasHydrated: boolean;
  setSort: (sort: SortOption) => void;
  setHasHydrated: (value: boolean) => void;
}

function mergeSortPreference(
  persisted: unknown,
  current: SortPreferenceState,
): SortPreferenceState {
  if (typeof persisted !== 'object' || persisted === null) return current;
  if (!('sort' in persisted)) return current;
  if (!isSortOption(persisted.sort)) return current;
  return { ...current, sort: persisted.sort };
}

export const useSortPreferenceStore = create<SortPreferenceState>()(
  persist(
    (set) => ({
      sort: DEFAULT_SORT,
      hasHydrated: false,
      setSort: (sort) => set({ sort }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'checkit:shop-sort',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ sort: state.sort }),
      merge: mergeSortPreference,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate sort-preference store:', error);
        }
        state?.setHasHydrated(true);
      },
      version: 0,
    },
  ),
);
