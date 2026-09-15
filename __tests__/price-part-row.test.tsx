import { fireEvent, render, screen } from '@testing-library/react-native';
import { PricePartRow } from '@/features/shop/components/edit-item-sheet/components/price-part-row';
import type { PricePartDraft } from '@/features/shop/components/edit-item-sheet/use-edit-item-form';

function makePart(overrides: Partial<PricePartDraft> = {}): PricePartDraft {
  return {
    id: 'part-1',
    label: '',
    priceDigits: '',
    quantity: 1,
    ...overrides,
  };
}

describe('PricePartRow', () => {
  it('shows the formatted price once digits are present', () => {
    const part = makePart({ priceDigits: '399' });
    render(
      <PricePartRow
        part={part}
        onChangeLabel={jest.fn()}
        onChangePriceDigits={jest.fn()}
        onIncrementQuantity={jest.fn()}
        onDecrementQuantity={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-part-price-part-1').props.value).toBe(
      '3,99',
    );
  });

  it('shows an empty price field with no digits', () => {
    const part = makePart();
    render(
      <PricePartRow
        part={part}
        onChangeLabel={jest.fn()}
        onChangePriceDigits={jest.fn()}
        onIncrementQuantity={jest.fn()}
        onDecrementQuantity={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-part-price-part-1').props.value).toBe('');
  });

  it('calls onChangeLabel and onChangePriceDigits when typed', () => {
    const onChangeLabel = jest.fn();
    const onChangePriceDigits = jest.fn();
    const part = makePart();
    render(
      <PricePartRow
        part={part}
        onChangeLabel={onChangeLabel}
        onChangePriceDigits={onChangePriceDigits}
        onIncrementQuantity={jest.fn()}
        onDecrementQuantity={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    fireEvent.changeText(
      screen.getByTestId('edit-part-label-part-1'),
      'Biscoito',
    );
    expect(onChangeLabel).toHaveBeenCalledWith('Biscoito');
    fireEvent.changeText(screen.getByTestId('edit-part-price-part-1'), '399');
    expect(onChangePriceDigits).toHaveBeenCalledWith('399');
  });

  it('calls the quantity and remove callbacks', () => {
    const onIncrementQuantity = jest.fn();
    const onDecrementQuantity = jest.fn();
    const onRemove = jest.fn();
    const part = makePart({ quantity: 2 });
    render(
      <PricePartRow
        part={part}
        onChangeLabel={jest.fn()}
        onChangePriceDigits={jest.fn()}
        onIncrementQuantity={onIncrementQuantity}
        onDecrementQuantity={onDecrementQuantity}
        onRemove={onRemove}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-part-qty-increment-part-1'));
    fireEvent.press(screen.getByTestId('edit-part-qty-decrement-part-1'));
    fireEvent.press(screen.getByTestId('edit-part-remove-part-1'));
    expect(onIncrementQuantity).toHaveBeenCalledTimes(1);
    expect(onDecrementQuantity).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables the decrement button at the minimum quantity', () => {
    const part = makePart({ quantity: 1 });
    render(
      <PricePartRow
        part={part}
        onChangeLabel={jest.fn()}
        onChangePriceDigits={jest.fn()}
        onIncrementQuantity={jest.fn()}
        onDecrementQuantity={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-part-qty-decrement-part-1')).toBeDisabled();
  });
});
