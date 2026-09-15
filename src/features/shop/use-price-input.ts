import { useDigitsInput } from '@/lib/digits-input';

const MAX_PRICE_DIGITS = 9;

export interface PriceInput {
  readonly cents: number;
  readonly digits: string;
  readonly hasPrice: boolean;
  setDigits: (raw: string) => void;
}

export function usePriceInput(initialCents: number | null): PriceInput {
  const input = useDigitsInput({
    initialValue: initialCents,
    maxDigits: MAX_PRICE_DIGITS,
  });
  return {
    cents: input.value,
    digits: input.digits,
    hasPrice: input.hasValue,
    setDigits: input.setDigits,
  };
}
