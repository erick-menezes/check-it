const CENTS_PER_UNIT = 100;

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const brlAmountFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBRL(cents: number): string {
  return brlFormatter.format(cents / CENTS_PER_UNIT);
}

export function formatBRLAmount(cents: number): string {
  return brlAmountFormatter.format(cents / CENTS_PER_UNIT);
}
