import { fireEvent, render, screen } from '@testing-library/react-native';
import { Toggle } from '@/components/ui/toggle';

const LABEL = 'Alertas de orçamento';

describe('Toggle', () => {
  it('exposes the switch accessibility role', () => {
    render(
      <Toggle
        value={true}
        onValueChange={() => {}}
        accessibilityLabel={LABEL}
      />,
    );
    expect(screen.getByRole('switch')).toBeOnTheScreen();
  });

  it('reports accessibilityState.checked reflecting value when on', () => {
    render(
      <Toggle
        value={true}
        onValueChange={() => {}}
        accessibilityLabel={LABEL}
      />,
    );
    expect(screen.getByRole('switch').props.accessibilityState.checked).toBe(
      true,
    );
  });

  it('reports accessibilityState.checked reflecting value when off', () => {
    render(
      <Toggle
        value={false}
        onValueChange={() => {}}
        accessibilityLabel={LABEL}
      />,
    );
    expect(screen.getByRole('switch').props.accessibilityState.checked).toBe(
      false,
    );
  });

  it('calls onValueChange with the negated value on press', () => {
    const onValueChange = jest.fn();
    render(
      <Toggle
        value={true}
        onValueChange={onValueChange}
        accessibilityLabel={LABEL}
      />,
    );
    fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('honors the accessibility label', () => {
    render(
      <Toggle
        value={false}
        onValueChange={() => {}}
        accessibilityLabel={LABEL}
      />,
    );
    expect(screen.getByLabelText(LABEL)).toBeOnTheScreen();
  });

  it('provides a touch target of at least 44 px', () => {
    render(
      <Toggle
        value={false}
        onValueChange={() => {}}
        accessibilityLabel={LABEL}
      />,
    );
    const { className } = screen.getByRole('switch').props;
    expect(className).toContain('min-w-[44px]');
    expect(className).toContain('min-h-[44px]');
  });
});
