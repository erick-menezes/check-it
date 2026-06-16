import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/features/onboarding/onboarding-store', () => ({
  useOnboardingStore: jest.fn(
    (selector: (s: { markOnboardingSeen: () => void }) => unknown) =>
      selector({ markOnboardingSeen: jest.fn() }),
  ),
}));

import { TOTAL_STEPS } from '@/features/onboarding/onboarding-steps';
import { useOnboardingFlow } from '@/features/onboarding/use-onboarding-flow';

describe('useOnboardingFlow', () => {
  it('starts on step 0', () => {
    const onExit = jest.fn();
    const { result } = renderHook(() => useOnboardingFlow(onExit));
    expect(result.current.currentStep).toBe(0);
  });

  it('isFirstStep is true on step 0', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    expect(result.current.isFirstStep).toBe(true);
  });

  it('isLastStep is false on step 0', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    expect(result.current.isLastStep).toBe(false);
  });

  it('goNext advances from step 0 to step 1', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    act(() => {
      result.current.goNext();
    });
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isFirstStep).toBe(false);
  });

  it('goBack clamps at first step (no-op from step 0)', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    act(() => {
      result.current.goBack();
    });
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
  });

  it('goNext clamps at last step', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    for (let i = 0; i < TOTAL_STEPS + 5; i++) {
      act(() => {
        result.current.goNext();
      });
    }
    expect(result.current.currentStep).toBe(TOTAL_STEPS - 1);
    expect(result.current.isLastStep).toBe(true);
  });

  it('goBack returns to previous step', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(2);
    act(() => result.current.goBack());
    expect(result.current.currentStep).toBe(1);
  });

  it('isLastStep is true on the final step', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    for (let i = 0; i < TOTAL_STEPS - 1; i++) {
      act(() => result.current.goNext());
    }
    expect(result.current.isLastStep).toBe(true);
  });

  it('finish calls onExit', () => {
    const onExit = jest.fn();
    const { result } = renderHook(() => useOnboardingFlow(onExit));
    act(() => {
      result.current.finish();
    });
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('jumpToStep navigates to the given index', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    act(() => {
      result.current.jumpToStep(2);
    });
    expect(result.current.currentStep).toBe(2);
    expect(result.current.isLastStep).toBe(true);
  });

  it('jumpToStep clamps below FIRST_STEP', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    act(() => {
      result.current.jumpToStep(-5);
    });
    expect(result.current.currentStep).toBe(0);
  });

  it('jumpToStep clamps above LAST_STEP', () => {
    const { result } = renderHook(() => useOnboardingFlow(jest.fn()));
    act(() => {
      result.current.jumpToStep(99);
    });
    expect(result.current.currentStep).toBe(TOTAL_STEPS - 1);
  });
});
