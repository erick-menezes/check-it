import { getSuggestions } from '@/features/shop/suggestions';

describe('getSuggestions', () => {
  it('returns a non-empty curated list of product names', () => {
    const suggestions = getSuggestions();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.every((name) => name.trim().length > 0)).toBe(true);
  });

  it('returns a fixed number of unique suggestions', () => {
    const suggestions = getSuggestions();
    expect(suggestions).toHaveLength(5);
    expect(new Set(suggestions).size).toBe(suggestions.length);
  });
});
