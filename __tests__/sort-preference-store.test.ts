import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { useSortPreferenceStore } from '@/features/shop/sort-preference-store';
import { DEFAULT_SORT } from '@/features/shop/use-visible-items';

const STORAGE_KEY = 'checkit:shop-sort';

beforeEach(async () => {
  await AsyncStorage.clear();
  useSortPreferenceStore.setState({
    sort: DEFAULT_SORT,
    hasHydrated: false,
  });
});

describe('sort-preference-store', () => {
  it('defaults the sort to DEFAULT_SORT', () => {
    const { result } = renderHook(() => useSortPreferenceStore());
    expect(result.current.sort).toBe(DEFAULT_SORT);
  });

  it('setSort updates the state', () => {
    const { result } = renderHook(() => useSortPreferenceStore());
    act(() => {
      result.current.setSort('name');
    });
    expect(result.current.sort).toBe('name');
  });

  it('persists the chosen sort to AsyncStorage', async () => {
    const { result } = renderHook(() => useSortPreferenceStore());
    await act(async () => {
      result.current.setSort('price-desc');
    });
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.sort).toBe('price-desc');
  });

  it('partialize excludes hasHydrated from persisted state', async () => {
    const { result } = renderHook(() => useSortPreferenceStore());
    await act(async () => {
      result.current.setSort('category');
    });
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.hasHydrated).toBeUndefined();
  });

  it('restores the persisted sort on a simulated rehydrate', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { sort: 'name' }, version: 0 }),
    );
    await act(async () => {
      await useSortPreferenceStore.persist.rehydrate();
    });
    expect(useSortPreferenceStore.getState().sort).toBe('name');
    expect(useSortPreferenceStore.getState().hasHydrated).toBe(true);
  });

  it('falls back to DEFAULT_SORT when the persisted sort is unknown', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { sort: 'by-vibes' }, version: 0 }),
    );
    await act(async () => {
      await useSortPreferenceStore.persist.rehydrate();
    });
    expect(useSortPreferenceStore.getState().sort).toBe(DEFAULT_SORT);
    expect(useSortPreferenceStore.getState().hasHydrated).toBe(true);
  });

  it('falls back to DEFAULT_SORT when the persisted state is malformed', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: null, version: 0 }),
    );
    await act(async () => {
      await useSortPreferenceStore.persist.rehydrate();
    });
    expect(useSortPreferenceStore.getState().sort).toBe(DEFAULT_SORT);
  });

  it('setHasHydrated sets the hasHydrated flag', () => {
    const { result } = renderHook(() => useSortPreferenceStore());
    act(() => {
      result.current.setHasHydrated(true);
    });
    expect(result.current.hasHydrated).toBe(true);
  });
});
