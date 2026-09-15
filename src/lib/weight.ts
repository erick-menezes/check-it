const GRAMS_PER_KG = 1000;
const WEIGHT_DECIMALS = 3;

const weightFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: WEIGHT_DECIMALS,
  maximumFractionDigits: WEIGHT_DECIMALS,
});

export function formatWeight(grams: number): string {
  return `${weightFormatter.format(grams / GRAMS_PER_KG)} kg`;
}

export function formatWeightForSpeech(grams: number): string {
  return `${weightFormatter.format(grams / GRAMS_PER_KG)} quilos`;
}
