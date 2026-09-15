import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  ListItem,
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

const PERSIST_VERSION = 2;
const LEGACY_UNVERSIONED = 0;

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

function isStoredListV1(
  value: unknown,
): value is Omit<ActiveList, 'items'> & { items: readonly unknown[] } {
  if (typeof value !== 'object' || value === null) return false;
  if (!('id' in value) || !('limitInCents' in value)) return false;
  if (!('items' in value)) return false;
  return Array.isArray(value.items);
}

function isStoredListItemV1(
  value: unknown,
): value is Omit<ListItem, 'unit' | 'parts'> {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && 'unitPriceInCents' in value;
}

function migrateListShapeV0ToV1(stored: unknown): unknown {
  if (!isStoredListV0(stored)) return stored;
  return { ...stored, items: [] };
}

function migrateItemToV2(item: unknown): ListItem | null {
  if (!isStoredListItemV1(item)) return null;
  return { ...item, unit: 'unit', parts: null };
}

function migrateItemsToV2(
  items: readonly unknown[],
): readonly ListItem[] | null {
  const migrated: ListItem[] = [];
  for (const item of items) {
    const next = migrateItemToV2(item);
    if (next === null) return null;
    migrated.push(next);
  }
  return migrated;
}

function failMigration(
  version: number,
  reason: string,
): PersistedActiveListState {
  console.warn(
    `Failed to migrate active-list store from version ${version}: ${reason}`,
  );
  return { activeList: null };
}

function migrateActiveList(
  persisted: unknown,
  version: number,
): PersistedActiveListState {
  try {
    if (!hasActiveListField(persisted)) return { activeList: null };
    const shapeFixed =
      version === LEGACY_UNVERSIONED
        ? migrateListShapeV0ToV1(persisted.activeList)
        : persisted.activeList;
    if (!isStoredListV1(shapeFixed)) {
      return failMigration(version, 'unrecognized list shape');
    }
    const items = migrateItemsToV2(shapeFixed.items);
    if (items === null) {
      return failMigration(version, 'unrecognized item shape');
    }
    return { activeList: { ...shapeFixed, items } };
  } catch (error) {
    return failMigration(version, String(error));
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
