import { fireEvent, render, screen } from '@testing-library/react-native';
import { QuantityStepper } from '@/features/shop/components/edit-item-sheet/components/quantity-stepper';

describe('QuantityStepper', () => {
  it('shows the current quantity', () => {
    render(
      <QuantityStepper
        quantity={3}
        onDecrement={jest.fn()}
        onIncrement={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-qty-value')).toHaveTextContent('3');
  });

  it('calls onIncrement when the plus button is pressed', () => {
    const onIncrement = jest.fn();
    render(
      <QuantityStepper
        quantity={1}
        onDecrement={jest.fn()}
        onIncrement={onIncrement}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-qty-increment'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrement when the minus button is pressed above the minimum', () => {
    const onDecrement = jest.fn();
    render(
      <QuantityStepper
        quantity={2}
        onDecrement={onDecrement}
        onIncrement={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-qty-decrement'));
    expect(onDecrement).toHaveBeenCalledTimes(1);
  });

  it('disables the minus button at the minimum quantity', () => {
    render(
      <QuantityStepper
        quantity={1}
        onDecrement={jest.fn()}
        onIncrement={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-qty-decrement')).toBeDisabled();
  });
});
