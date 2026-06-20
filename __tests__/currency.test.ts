import { formatBRL, formatBRLAmount } from '@/lib/currency';

function normalizeSpaces(value: string): string {
  return value.replace(/\s/g, ' ');
}

describe('formatBRL', () => {
  it('formats cents with comma decimals and dot thousands', () => {
    expect(normalizeSpaces(formatBRL(123456))).toBe('R$ 1.234,56');
  });

  it('formats zero cents', () => {
    expect(normalizeSpaces(formatBRL(0))).toBe('R$ 0,00');
  });

  it('formats a single-digit cents value', () => {
    expect(normalizeSpaces(formatBRL(5))).toBe('R$ 0,05');
  });
});

describe('formatBRLAmount', () => {
  it('formats zero cents without a prefix', () => {
    expect(formatBRLAmount(0)).toBe('0,00');
  });

  it('formats a cents-fill value into reais and cents', () => {
    expect(formatBRLAmount(1500)).toBe('15,00');
  });

  it('formats a partial cents-fill value', () => {
    expect(formatBRLAmount(4050)).toBe('40,50');
  });

  it('groups thousands with a dot separator', () => {
    expect(formatBRLAmount(123456)).toBe('1.234,56');
  });

  it('formats the 9-digit maximum value', () => {
    expect(formatBRLAmount(999999999)).toBe('9.999.999,99');
  });
});
