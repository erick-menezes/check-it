import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';

describe('onboarding-store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useOnboardingStore.setState({
      hasSeenOnboarding: false,
      hasHydrated: false,
    });
  });

  it('starts with hasSeenOnboarding false', () => {
    const { result } = renderHook(() => useOnboardingStore());
    expect(result.current.hasSeenOnboarding).toBe(false);
  });

  it('markOnboardingSeen sets hasSeenOnboarding to true', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => {
      result.current.markOnboardingSeen();
    });
    expect(result.current.hasSeenOnboarding).toBe(true);
  });

  it('markOnboardingSeen writes to AsyncStorage', async () => {
    const { result } = renderHook(() => useOnboardingStore());
    await act(async () => {
      result.current.markOnboardingSeen();
    });
    const stored = await AsyncStorage.getItem('checkit:onboarding');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.hasSeenOnboarding).toBe(true);
  });

  it('partialize excludes hasHydrated from persisted state', async () => {
    const { result } = renderHook(() => useOnboardingStore());
    await act(async () => {
      result.current.markOnboardingSeen();
    });
    const stored = await AsyncStorage.getItem('checkit:onboarding');
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.hasHydrated).toBeUndefined();
  });

  it('setHasHydrated sets hasHydrated flag', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => {
      result.current.setHasHydrated(true);
    });
    expect(result.current.hasHydrated).toBe(true);
  });
});
