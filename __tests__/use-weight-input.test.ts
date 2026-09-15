import { act, renderHook } from '@testing-library/react-native';
import { useWeightInput } from '@/features/shop/use-weight-input';

describe('useWeightInput', () => {
  it('starts empty when there is no initial weight', () => {
    const { result } = renderHook(() => useWeightInput(null));
    expect(result.current.grams).toBe(0);
    expect(result.current.hasValue).toBe(false);
  });

  it('formats typed digits as three-decimal kilograms', () => {
    const { result } = renderHook(() => useWeightInput(null));
    act(() => {
      result.current.setDigits('830');
    });
    expect(result.current.grams).toBe(830);
    expect(result.current.formatted).toBe('0,830 kg');
  });

  it('formats a weight above one kilogram', () => {
    const { result } = renderHook(() => useWeightInput(null));
    act(() => {
      result.current.setDigits('1250');
    });
    expect(result.current.grams).toBe(1250);
    expect(result.current.formatted).toBe('1,250 kg');
  });

  it('truncates input beyond six digits', () => {
    const { result } = renderHook(() => useWeightInput(null));
    act(() => {
      result.current.setDigits('1234567');
    });
    expect(result.current.digits).toBe('123456');
  });

  it('clears back to no value when emptied', () => {
    const { result } = renderHook(() => useWeightInput(830));
    act(() => {
      result.current.setDigits('');
    });
    expect(result.current.grams).toBe(0);
    expect(result.current.hasValue).toBe(false);
  });
});
