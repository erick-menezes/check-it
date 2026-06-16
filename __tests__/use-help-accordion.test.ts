import { act, renderHook } from '@testing-library/react-native';
import { useHelpAccordion } from '@/features/help/use-help-accordion';

describe('useHelpAccordion', () => {
  it('opens the Listas section by default', () => {
    const { result } = renderHook(() => useHelpAccordion());
    expect(result.current.openSectionId).toBe('listas');
  });

  it('opens another section and closes the previous one (single-open)', () => {
    const { result } = renderHook(() => useHelpAccordion());
    act(() => {
      result.current.toggleSection('limites');
    });
    expect(result.current.openSectionId).toBe('limites');
    act(() => {
      result.current.toggleSection('gastos');
    });
    expect(result.current.openSectionId).toBe('gastos');
  });

  it('collapses to none when the open section is toggled again', () => {
    const { result } = renderHook(() => useHelpAccordion());
    act(() => {
      result.current.toggleSection('listas');
    });
    expect(result.current.openSectionId).toBeNull();
  });
});
