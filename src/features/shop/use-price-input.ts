import { useState } from 'react';

const MAX_PRICE_DIGITS = 9;
const DECIMAL_RADIX = 10;
const EMPTY_DIGITS = '';
const ZERO_CENTS = 0;

export interface PriceInput {
  readonly cents: number;
  readonly digits: string;
  readonly hasPrice: boolean;
  setDigits: (raw: string) => void;
}

function sanitizeDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, MAX_PRICE_DIGITS);
}

function digitsToCents(digits: string): number {
  if (digits === EMPTY_DIGITS) return ZERO_CENTS;
  return parseInt(digits, DECIMAL_RADIX);
}

function centsToDigits(cents: number | null): string {
  if (cents === null || cents <= ZERO_CENTS) return EMPTY_DIGITS;
  return String(cents);
}

export function usePriceInput(initialCents: number | null): PriceInput {
  const [digits, setStoredDigits] = useState(() => centsToDigits(initialCents));
  function setDigits(raw: string): void {
    setStoredDigits(sanitizeDigits(raw));
  }
  const cents = digitsToCents(digits);
  return {
    cents,
    digits,
    hasPrice: cents > ZERO_CENTS,
    setDigits,
  };
}
