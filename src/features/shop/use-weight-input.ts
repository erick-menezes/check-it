import { useDigitsInput } from '@/lib/digits-input';
import { formatWeight } from '@/lib/weight';

const MAX_WEIGHT_DIGITS = 6;

export interface WeightInput {
  readonly grams: number;
  readonly digits: string;
  readonly hasValue: boolean;
  readonly formatted: string;
  setDigits: (raw: string) => void;
}

export function useWeightInput(initialGrams: number | null): WeightInput {
  const input = useDigitsInput({
    initialValue: initialGrams,
    maxDigits: MAX_WEIGHT_DIGITS,
  });
  return {
    grams: input.value,
    digits: input.digits,
    hasValue: input.hasValue,
    formatted: formatWeight(input.value),
    setDigits: input.setDigits,
  };
}
