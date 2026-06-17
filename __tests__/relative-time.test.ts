import { formatRelativeTime } from '@/features/notifications/relative-time';

const NOW = new Date('2026-06-10T12:00:00.000Z');
const MS_PER_SECOND = 1000;

function isoSecondsAgo(seconds: number): string {
  return new Date(NOW.getTime() - seconds * MS_PER_SECOND).toISOString();
}

describe('formatRelativeTime', () => {
  it('returns "agora" for less than 60 seconds', () => {
    expect(formatRelativeTime(isoSecondsAgo(0), NOW)).toBe('agora');
    expect(formatRelativeTime(isoSecondsAgo(59), NOW)).toBe('agora');
  });

  it('returns minutes from 60 seconds up to under an hour', () => {
    expect(formatRelativeTime(isoSecondsAgo(60), NOW)).toBe('1min');
    expect(formatRelativeTime(isoSecondsAgo(12 * 60), NOW)).toBe('12min');
    expect(formatRelativeTime(isoSecondsAgo(59 * 60), NOW)).toBe('59min');
  });

  it('returns hours from one hour up to under a day', () => {
    expect(formatRelativeTime(isoSecondsAgo(60 * 60), NOW)).toBe('1h');
    expect(formatRelativeTime(isoSecondsAgo(2 * 60 * 60), NOW)).toBe('2h');
    expect(formatRelativeTime(isoSecondsAgo(23 * 60 * 60 + 59 * 60), NOW)).toBe(
      '23h',
    );
  });

  it('returns days with singular and plural from one day up to under a week', () => {
    expect(formatRelativeTime(isoSecondsAgo(24 * 60 * 60), NOW)).toBe(
      'há 1 dia',
    );
    expect(formatRelativeTime(isoSecondsAgo(3 * 24 * 60 * 60), NOW)).toBe(
      'há 3 dias',
    );
    expect(
      formatRelativeTime(isoSecondsAgo(6 * 24 * 60 * 60 + 23 * 60 * 60), NOW),
    ).toBe('há 6 dias');
  });

  it('returns weeks from seven days onward', () => {
    expect(formatRelativeTime(isoSecondsAgo(7 * 24 * 60 * 60), NOW)).toBe(
      'há 1 sem',
    );
    expect(formatRelativeTime(isoSecondsAgo(14 * 24 * 60 * 60), NOW)).toBe(
      'há 2 sem',
    );
  });
});
