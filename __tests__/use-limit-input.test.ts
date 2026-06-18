import { act, renderHook } from '@testing-library/react-native';
import { useLimitInput } from '@/features/limit/use-limit-input';

describe('useLimitInput', () => {
  it('starts empty, at zero cents and invalid', () => {
    const { result } = renderHook(() => useLimitInput());
    expect(result.current.cents).toBe(0);
    expect(result.current.digits).toBe('');
    expect(result.current.isValid).toBe(false);
  });

  it('fills cents from the typed digits', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setDigits('4050');
    });
    expect(result.current.cents).toBe(4050);
    expect(result.current.digits).toBe('4050');
  });

  it('strips non-digit characters', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setDigits('4a0b5');
    });
    expect(result.current.digits).toBe('405');
    expect(result.current.cents).toBe(405);
  });

  it('caps the input at nine digits', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setDigits('1234567899');
    });
    expect(result.current.digits).toBe('123456789');
    expect(result.current.cents).toBe(123456789);
  });

  it('shrinks the value when a backspace removes the last digit', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setDigits('4050');
    });
    act(() => {
      result.current.setDigits('405');
    });
    expect(result.current.cents).toBe(405);
  });

  it('overwrites any typed value when a preset is selected', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setDigits('4050');
    });
    act(() => {
      result.current.setPreset(50000);
    });
    expect(result.current.cents).toBe(50000);
    expect(result.current.digits).toBe('50000');
  });

  it('keeps editing from the preset value when typing afterwards', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setPreset(50000);
    });
    act(() => {
      result.current.setDigits('500005');
    });
    expect(result.current.cents).toBe(500005);
  });

  it('is invalid only at exactly zero', () => {
    const { result } = renderHook(() => useLimitInput());
    act(() => {
      result.current.setDigits('0');
    });
    expect(result.current.isValid).toBe(false);
    act(() => {
      result.current.setDigits('1');
    });
    expect(result.current.isValid).toBe(true);
    act(() => {
      result.current.setDigits('');
    });
    expect(result.current.isValid).toBe(false);
  });
});
