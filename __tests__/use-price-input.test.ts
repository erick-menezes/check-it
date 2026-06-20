import { act, renderHook } from '@testing-library/react-native';
import { usePriceInput } from '@/features/shop/use-price-input';

describe('usePriceInput', () => {
  it('starts empty when there is no initial price', () => {
    const { result } = renderHook(() => usePriceInput(null));
    expect(result.current.cents).toBe(0);
    expect(result.current.digits).toBe('');
    expect(result.current.hasPrice).toBe(false);
  });

  it('seeds the digits from an initial price', () => {
    const { result } = renderHook(() => usePriceInput(690));
    expect(result.current.cents).toBe(690);
    expect(result.current.digits).toBe('690');
    expect(result.current.hasPrice).toBe(true);
  });

  it('fills cents from the typed digits', () => {
    const { result } = renderHook(() => usePriceInput(null));
    act(() => {
      result.current.setDigits('690');
    });
    expect(result.current.cents).toBe(690);
    expect(result.current.hasPrice).toBe(true);
  });

  it('strips non-digit characters', () => {
    const { result } = renderHook(() => usePriceInput(null));
    act(() => {
      result.current.setDigits('6,90');
    });
    expect(result.current.digits).toBe('690');
    expect(result.current.cents).toBe(690);
  });

  it('clears back to no price when emptied', () => {
    const { result } = renderHook(() => usePriceInput(690));
    act(() => {
      result.current.setDigits('');
    });
    expect(result.current.cents).toBe(0);
    expect(result.current.hasPrice).toBe(false);
  });

  it('caps the input at nine digits', () => {
    const { result } = renderHook(() => usePriceInput(null));
    act(() => {
      result.current.setDigits('1234567899');
    });
    expect(result.current.digits).toBe('123456789');
  });
});
