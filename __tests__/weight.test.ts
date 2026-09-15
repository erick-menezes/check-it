import { formatWeight, formatWeightForSpeech } from '@/lib/weight';

describe('formatWeight', () => {
  it('formats grams as three-decimal kilograms', () => {
    expect(formatWeight(830)).toBe('0,830 kg');
  });

  it('formats a weight above one kilogram', () => {
    expect(formatWeight(1250)).toBe('1,250 kg');
  });

  it('formats zero grams', () => {
    expect(formatWeight(0)).toBe('0,000 kg');
  });
});

describe('formatWeightForSpeech', () => {
  it('reads the weight in words', () => {
    expect(formatWeightForSpeech(830)).toBe('0,830 quilos');
  });
});
