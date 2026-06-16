import { useGreeting } from '@/features/home/use-greeting';

function dateAtHour(hour: number): Date {
  return new Date(2026, 5, 7, hour, 0, 0);
}

describe('useGreeting', () => {
  it('returns Bom dia before noon', () => {
    expect(useGreeting(dateAtHour(8)).greeting).toBe('Bom dia');
  });

  it('returns Boa tarde from noon until 18h', () => {
    expect(useGreeting(dateAtHour(12)).greeting).toBe('Boa tarde');
    expect(useGreeting(dateAtHour(17)).greeting).toBe('Boa tarde');
  });

  it('returns Boa noite from 18h onward', () => {
    expect(useGreeting(dateAtHour(18)).greeting).toBe('Boa noite');
    expect(useGreeting(dateAtHour(23)).greeting).toBe('Boa noite');
  });

  it('keeps a fixed subtitle without a user name', () => {
    expect(useGreeting(dateAtHour(9)).subtitle).toBe(
      'Pronto pra próxima compra?',
    );
  });
});
