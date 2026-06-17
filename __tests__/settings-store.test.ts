import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { useSettingsStore } from '@/features/settings/settings-store';

beforeEach(async () => {
  await AsyncStorage.clear();
  useSettingsStore.setState({
    budgetAlertsEnabled: true,
    hasHydrated: false,
  });
});

describe('settings-store', () => {
  it('defaults budgetAlertsEnabled to true', () => {
    const { result } = renderHook(() => useSettingsStore());
    expect(result.current.budgetAlertsEnabled).toBe(true);
  });

  it('setBudgetAlertsEnabled(false) updates the state', () => {
    const { result } = renderHook(() => useSettingsStore());
    act(() => {
      result.current.setBudgetAlertsEnabled(false);
    });
    expect(result.current.budgetAlertsEnabled).toBe(false);
  });

  it('persists budgetAlertsEnabled to AsyncStorage', async () => {
    const { result } = renderHook(() => useSettingsStore());
    await act(async () => {
      result.current.setBudgetAlertsEnabled(false);
    });
    const stored = await AsyncStorage.getItem('checkit:settings');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.budgetAlertsEnabled).toBe(false);
  });

  it('partialize excludes hasHydrated from persisted state', async () => {
    const { result } = renderHook(() => useSettingsStore());
    await act(async () => {
      result.current.setBudgetAlertsEnabled(false);
    });
    const stored = await AsyncStorage.getItem('checkit:settings');
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.hasHydrated).toBeUndefined();
  });

  it('restores the persisted value on a simulated rehydrate', async () => {
    await AsyncStorage.setItem(
      'checkit:settings',
      JSON.stringify({ state: { budgetAlertsEnabled: false }, version: 0 }),
    );
    await act(async () => {
      await useSettingsStore.persist.rehydrate();
    });
    expect(useSettingsStore.getState().budgetAlertsEnabled).toBe(false);
    expect(useSettingsStore.getState().hasHydrated).toBe(true);
  });

  it('setHasHydrated sets the hasHydrated flag', () => {
    const { result } = renderHook(() => useSettingsStore());
    act(() => {
      result.current.setHasHydrated(true);
    });
    expect(result.current.hasHydrated).toBe(true);
  });
});
