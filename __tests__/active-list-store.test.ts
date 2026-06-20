import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { type ActiveList, createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';

const SAMPLE_LIST: ActiveList = {
  id: '1',
  name: 'Compras da semana',
  itemCount: 8,
  createdAt: '2026-06-07T10:00:00.000Z',
  totalInCents: 7350,
  limitInCents: 20000,
  items: [],
};

describe('active-list-store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useActiveListStore.setState({ activeList: null, hasHydrated: false });
  });

  it('starts with no active list', () => {
    const { result } = renderHook(() => useActiveListStore());
    expect(result.current.activeList).toBeNull();
  });

  it('setActiveList updates the state', () => {
    const { result } = renderHook(() => useActiveListStore());
    act(() => {
      result.current.setActiveList(SAMPLE_LIST);
    });
    expect(result.current.activeList).toEqual(SAMPLE_LIST);
  });

  it('setActiveList writes through to AsyncStorage', async () => {
    const { result } = renderHook(() => useActiveListStore());
    await act(async () => {
      result.current.setActiveList(SAMPLE_LIST);
    });
    const stored = await AsyncStorage.getItem('checkit:active-list');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.activeList.id).toBe(SAMPLE_LIST.id);
  });

  it('partialize excludes hasHydrated from persisted state', async () => {
    const { result } = renderHook(() => useActiveListStore());
    await act(async () => {
      result.current.setActiveList(SAMPLE_LIST);
    });
    const stored = await AsyncStorage.getItem('checkit:active-list');
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.hasHydrated).toBeUndefined();
  });

  it('setHasHydrated sets the flag', () => {
    const { result } = renderHook(() => useActiveListStore());
    act(() => {
      result.current.setHasHydrated(true);
    });
    expect(result.current.hasHydrated).toBe(true);
  });

  it('persists a created list so its limit survives rehydration', async () => {
    const created = createActiveList(50000);
    await AsyncStorage.setItem(
      'checkit:active-list',
      JSON.stringify({ state: { activeList: created }, version: 0 }),
    );
    const { result } = renderHook(() => useActiveListStore());
    await act(async () => {
      await useActiveListStore.persist.rehydrate();
    });
    expect(result.current.activeList).toEqual(created);
    expect(result.current.activeList?.limitInCents).toBe(50000);
  });

  it('replaces a pre-existing active list with the newly created one', async () => {
    const { result } = renderHook(() => useActiveListStore());
    await act(async () => {
      result.current.setActiveList(SAMPLE_LIST);
    });
    const replacement = createActiveList(30000);
    await act(async () => {
      result.current.setActiveList(replacement);
    });
    expect(result.current.activeList).toEqual(replacement);
    const stored = await AsyncStorage.getItem('checkit:active-list');
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.activeList.id).toBe(replacement.id);
    expect(parsed.state.activeList.id).not.toBe(SAMPLE_LIST.id);
  });
});

function seedActiveList(): void {
  useActiveListStore.getState().setActiveList(createActiveList(50000));
}

function getItems() {
  return useActiveListStore.getState().activeList?.items ?? [];
}

describe('active-list-store item actions', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useActiveListStore.setState({ activeList: null, hasHydrated: false });
  });

  it('addItem appends a priceless unchecked item', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItem('Arroz');
    });
    expect(getItems()).toHaveLength(1);
    expect(getItems()[0].name).toBe('Arroz');
    expect(getItems()[0].unitPriceInCents).toBeNull();
  });

  it('addItems imports every receipt item at once', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItems([
        { name: 'Arroz', quantity: 1, unitPriceInCents: 2490 },
        { name: 'Feijão', quantity: 2, unitPriceInCents: 850 },
      ]);
    });
    expect(getItems().map((item) => item.name)).toEqual(['Arroz', 'Feijão']);
  });

  it('recomputes totals to the checked line totals on each mutation', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItems([
        { name: 'Arroz', quantity: 2, unitPriceInCents: 1000 },
        { name: 'Feijão', quantity: 1, unitPriceInCents: 5000 },
      ]);
    });
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(0);
    expect(useActiveListStore.getState().activeList?.itemCount).toBe(2);
    const firstId = getItems()[0].id;
    act(() => {
      useActiveListStore.getState().toggleItem(firstId);
    });
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(2000);
  });

  it('setAllChecked recomputes the total across every item', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItems([
        { name: 'Arroz', quantity: 1, unitPriceInCents: 1000 },
        { name: 'Feijão', quantity: 1, unitPriceInCents: 2000 },
      ]);
      useActiveListStore.getState().setAllChecked(true);
    });
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(3000);
    act(() => {
      useActiveListStore.getState().setAllChecked(false);
    });
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(0);
  });

  it('updateItem recomputes the total from the new price and quantity', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItem('Arroz');
    });
    const itemId = getItems()[0].id;
    act(() => {
      useActiveListStore.getState().toggleItem(itemId);
      useActiveListStore
        .getState()
        .updateItem(itemId, { quantity: 3, unitPriceInCents: 1000 });
    });
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(3000);
  });

  it('removeItem drops the item and recomputes the total', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItems([
        { name: 'Arroz', quantity: 1, unitPriceInCents: 1000 },
        { name: 'Feijão', quantity: 1, unitPriceInCents: 2000 },
      ]);
      useActiveListStore.getState().setAllChecked(true);
    });
    const itemId = getItems()[0].id;
    act(() => {
      useActiveListStore.getState().removeItem(itemId);
    });
    expect(getItems()).toHaveLength(1);
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(2000);
  });

  it('renameList changes the name without touching the items', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().addItem('Arroz');
      useActiveListStore.getState().renameList('Compra do mês');
    });
    expect(useActiveListStore.getState().activeList?.name).toBe(
      'Compra do mês',
    );
    expect(getItems()).toHaveLength(1);
  });

  it('deleteList clears the active list', () => {
    seedActiveList();
    act(() => {
      useActiveListStore.getState().deleteList();
    });
    expect(useActiveListStore.getState().activeList).toBeNull();
  });

  it('ignores item actions when there is no active list', () => {
    act(() => {
      useActiveListStore.getState().addItem('Arroz');
    });
    expect(useActiveListStore.getState().activeList).toBeNull();
  });

  it('persists item mutations through to AsyncStorage', async () => {
    seedActiveList();
    await act(async () => {
      useActiveListStore.getState().addItem('Arroz');
    });
    const stored = await AsyncStorage.getItem('checkit:active-list');
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.activeList.items).toHaveLength(1);
    expect(parsed.version).toBe(1);
  });
});

describe('active-list-store migration', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useActiveListStore.setState({ activeList: null, hasHydrated: false });
  });

  it('adds an empty items array to a stored v0 list', async () => {
    const v0List = {
      id: 'legacy-1',
      name: 'Lista antiga',
      itemCount: 0,
      createdAt: '2026-06-07T10:00:00.000Z',
      totalInCents: 0,
      limitInCents: 40000,
    };
    await AsyncStorage.setItem(
      'checkit:active-list',
      JSON.stringify({ state: { activeList: v0List }, version: 0 }),
    );
    await act(async () => {
      await useActiveListStore.persist.rehydrate();
    });
    expect(useActiveListStore.getState().activeList).toEqual({
      ...v0List,
      items: [],
    });
  });

  it('falls back to a null list when the stored payload is corrupted', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await AsyncStorage.setItem(
      'checkit:active-list',
      JSON.stringify({ state: { activeList: 42 }, version: 0 }),
    );
    await act(async () => {
      await useActiveListStore.persist.rehydrate();
    });
    expect(useActiveListStore.getState().activeList).toBeNull();
    warnSpy.mockRestore();
  });
});
