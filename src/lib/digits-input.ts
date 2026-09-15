import { useState } from 'react';

const DECIMAL_RADIX = 10;
const EMPTY_DIGITS = '';
const ZERO_VALUE = 0;

export interface DigitsInput {
  readonly value: number;
  readonly digits: string;
  readonly hasValue: boolean;
  setDigits: (raw: string) => void;
}

export interface DigitsInputOptions {
  readonly initialValue: number | null;
  readonly maxDigits: number;
}

export function sanitizeDigits(raw: string, maxDigits: number): string {
  return raw.replace(/\D/g, '').slice(0, maxDigits);
}

export function digitsToInteger(digits: string): number {
  if (digits === EMPTY_DIGITS) return ZERO_VALUE;
  return parseInt(digits, DECIMAL_RADIX);
}

export function integerToDigits(value: number | null): string {
  if (value === null || value <= ZERO_VALUE) return EMPTY_DIGITS;
  return String(value);
}

export function useDigitsInput({
  initialValue,
  maxDigits,
}: DigitsInputOptions): DigitsInput {
  const [digits, setStoredDigits] = useState(() =>
    integerToDigits(initialValue),
  );
  function setDigits(raw: string): void {
    setStoredDigits(sanitizeDigits(raw, maxDigits));
  }
  const value = digitsToInteger(digits);
  return {
    value,
    digits,
    hasValue: value > ZERO_VALUE,
    setDigits,
  };
}
