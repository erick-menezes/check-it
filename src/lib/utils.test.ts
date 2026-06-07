import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('drops falsy conditional classes', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('lets the last conflicting Tailwind utility win (tailwind-merge)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });
});
