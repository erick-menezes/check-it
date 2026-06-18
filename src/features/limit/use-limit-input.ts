import { useState } from 'react';

const MAX_LIMIT_DIGITS = 9;
const DECIMAL_RADIX = 10;
const EMPTY_DIGITS = '';
const ZERO_CENTS = 0;

export interface LimitInput {
  readonly cents: number;
  readonly digits: string;
  readonly isValid: boolean;
  setDigits: (raw: string) => void;
  setPreset: (amountInCents: number) => void;
}

function sanitizeDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, MAX_LIMIT_DIGITS);
}

function digitsToCents(digits: string): number {
  if (digits === EMPTY_DIGITS) return ZERO_CENTS;
  return parseInt(digits, DECIMAL_RADIX);
}

export function useLimitInput(): LimitInput {
  const [digits, setStoredDigits] = useState(EMPTY_DIGITS);
  function setDigits(raw: string): void {
    setStoredDigits(sanitizeDigits(raw));
  }
  function setPreset(amountInCents: number): void {
    setStoredDigits(sanitizeDigits(String(amountInCents)));
  }
  const cents = digitsToCents(digits);
  return {
    cents,
    digits,
    isValid: cents > ZERO_CENTS,
    setDigits,
    setPreset,
  };
}
