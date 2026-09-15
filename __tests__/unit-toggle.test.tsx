import { fireEvent, render, screen } from '@testing-library/react-native';
import { UnitToggle } from '@/features/shop/components/edit-item-sheet/components/unit-toggle';

describe('UnitToggle', () => {
  it('marks the current unit as selected', () => {
    render(
      <UnitToggle unit="unit" disabled={false} onSelectUnit={jest.fn()} />,
    );
    expect(
      screen.getByTestId('edit-unit-unit').props.accessibilityState,
    ).toEqual(expect.objectContaining({ selected: true, disabled: false }));
    expect(screen.getByTestId('edit-unit-kg').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it('calls onSelectUnit with the pressed option', () => {
    const onSelectUnit = jest.fn();
    render(
      <UnitToggle unit="unit" disabled={false} onSelectUnit={onSelectUnit} />,
    );
    fireEvent.press(screen.getByTestId('edit-unit-kg'));
    expect(onSelectUnit).toHaveBeenCalledWith('kg');
  });

  it('disables both options while parts exist', () => {
    render(<UnitToggle unit="unit" disabled={true} onSelectUnit={jest.fn()} />);
    expect(screen.getByTestId('edit-unit-unit')).toBeDisabled();
    expect(screen.getByTestId('edit-unit-kg')).toBeDisabled();
  });

  it('exposes a radio role for each option', () => {
    render(<UnitToggle unit="kg" disabled={false} onSelectUnit={jest.fn()} />);
    expect(screen.getByTestId('edit-unit-unit').props.accessibilityRole).toBe(
      'radio',
    );
    expect(screen.getByTestId('edit-unit-kg').props.accessibilityRole).toBe(
      'radio',
    );
  });
});
