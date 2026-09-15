import { act, renderHook } from '@testing-library/react-native';
import {
  digitsToInteger,
  integerToDigits,
  sanitizeDigits,
  useDigitsInput,
} from '@/lib/digits-input';

describe('sanitizeDigits', () => {
  it('strips non-digit characters', () => {
    expect(sanitizeDigits('6,90', 9)).toBe('690');
  });

  it('truncates at the given max length', () => {
    expect(sanitizeDigits('1234567899', 9)).toBe('123456789');
  });

  it('returns an empty string for input with no digits', () => {
    expect(sanitizeDigits('abc', 9)).toBe('');
  });
});

describe('digitsToInteger', () => {
  it('parses digits as a base-10 integer', () => {
    expect(digitsToInteger('690')).toBe(690);
  });

  it('returns 0 for an empty string', () => {
    expect(digitsToInteger('')).toBe(0);
  });
});

describe('integerToDigits', () => {
  it('stringifies a positive value', () => {
    expect(integerToDigits(690)).toBe('690');
  });

  it('returns an empty string for null', () => {
    expect(integerToDigits(null)).toBe('');
  });

  it('returns an empty string for zero or negative values', () => {
    expect(integerToDigits(0)).toBe('');
    expect(integerToDigits(-5)).toBe('');
  });
});

describe('useDigitsInput', () => {
  it('starts empty when there is no initial value', () => {
    const { result } = renderHook(() =>
      useDigitsInput({ initialValue: null, maxDigits: 9 }),
    );
    expect(result.current.value).toBe(0);
    expect(result.current.digits).toBe('');
    expect(result.current.hasValue).toBe(false);
  });

  it('seeds the digits from an initial value', () => {
    const { result } = renderHook(() =>
      useDigitsInput({ initialValue: 830, maxDigits: 6 }),
    );
    expect(result.current.value).toBe(830);
    expect(result.current.digits).toBe('830');
    expect(result.current.hasValue).toBe(true);
  });

  it('fills the value from typed digits', () => {
    const { result } = renderHook(() =>
      useDigitsInput({ initialValue: null, maxDigits: 6 }),
    );
    act(() => {
      result.current.setDigits('830');
    });
    expect(result.current.value).toBe(830);
    expect(result.current.hasValue).toBe(true);
  });

  it('respects a caller-provided max digit count', () => {
    const { result } = renderHook(() =>
      useDigitsInput({ initialValue: null, maxDigits: 6 }),
    );
    act(() => {
      result.current.setDigits('1234567');
    });
    expect(result.current.digits).toBe('123456');
  });

  it('clears back to no value when emptied', () => {
    const { result } = renderHook(() =>
      useDigitsInput({ initialValue: 830, maxDigits: 6 }),
    );
    act(() => {
      result.current.setDigits('');
    });
    expect(result.current.value).toBe(0);
    expect(result.current.hasValue).toBe(false);
  });
});
