import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  NewItemInput,
  UpdateItemChanges,
} from '@/features/shop/list-item';
import {
  type ActiveList,
  addItem,
  addItems,
  recomputeTotals,
  removeItem,
  renameList,
  setAllChecked,
  toggleItem,
  updateItem,
} from './active-list';

const PERSIST_VERSION = 1;

interface ActiveListStoreState {
  activeList: ActiveList | null;
  hasHydrated: boolean;
  setActiveList: (list: ActiveList | null) => void;
  setHasHydrated: (value: boolean) => void;
  addItem: (name: string) => void;
  addItems: (items: readonly NewItemInput[]) => void;
  toggleItem: (itemId: string) => void;
  setAllChecked: (checked: boolean) => void;
  updateItem: (itemId: string, changes: UpdateItemChanges) => void;
  removeItem: (itemId: string) => void;
  renameList: (name: string) => void;
  deleteList: () => void;
}

interface PersistedActiveListState {
  activeList: ActiveList | null;
}

function hasActiveListField(value: unknown): value is { activeList: unknown } {
  return typeof value === 'object' && value !== null && 'activeList' in value;
}

function isStoredListV0(value: unknown): value is Omit<ActiveList, 'items'> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'limitInCents' in value
  );
}

function migrateActiveList(persisted: unknown): PersistedActiveListState {
  try {
    if (!hasActiveListField(persisted)) return { activeList: null };
    const stored = persisted.activeList;
    if (!isStoredListV0(stored)) return { activeList: null };
    return { activeList: { ...stored, items: [] } };
  } catch (error) {
    console.warn('Failed to migrate active-list store:', error);
    return { activeList: null };
  }
}

export const useActiveListStore = create<ActiveListStoreState>()(
  persist(
    (set, get) => {
      const commit = (list: ActiveList): void => {
        set({ activeList: recomputeTotals(list) });
      };
      const mutate = (mutator: (list: ActiveList) => ActiveList): void => {
        const current = get().activeList;
        if (!current) return;
        commit(mutator(current));
      };
      return {
        activeList: null,
        hasHydrated: false,
        setActiveList: (list) => set({ activeList: list }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
        addItem: (name) => mutate((list) => addItem(list, name)),
        addItems: (items) => mutate((list) => addItems(list, items)),
        toggleItem: (itemId) => mutate((list) => toggleItem(list, itemId)),
        setAllChecked: (checked) =>
          mutate((list) => setAllChecked(list, checked)),
        updateItem: (itemId, changes) =>
          mutate((list) => updateItem(list, itemId, changes)),
        removeItem: (itemId) => mutate((list) => removeItem(list, itemId)),
        renameList: (name) => mutate((list) => renameList(list, name)),
        deleteList: () => set({ activeList: null }),
      };
    },
    {
      name: 'checkit:active-list',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ activeList: state.activeList }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate active-list store:', error);
        }
        state?.setHasHydrated(true);
      },
      version: PERSIST_VERSION,
      migrate: migrateActiveList,
    },
  ),
);
