import { fireEvent, render, screen } from '@testing-library/react-native';
import { PricePartsEditor } from '@/features/shop/components/edit-item-sheet/components/price-parts-editor';
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

describe('PricePartsEditor', () => {
  it('renders one row per part', () => {
    const parts = [makePart({ id: 'a' }), makePart({ id: 'b' })];
    render(
      <PricePartsEditor
        parts={parts}
        totalInCents={0}
        canAddPart
        onUpdatePart={jest.fn()}
        onIncrementPartQuantity={jest.fn()}
        onDecrementPartQuantity={jest.fn()}
        onAddPart={jest.fn()}
        onRemovePart={jest.fn()}
        onDisableParts={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-part-row-a')).toBeOnTheScreen();
    expect(screen.getByTestId('edit-part-row-b')).toBeOnTheScreen();
  });

  it('shows the live total', () => {
    const parts = [makePart({ id: 'a', priceDigits: '399' })];
    render(
      <PricePartsEditor
        parts={parts}
        totalInCents={399}
        canAddPart
        onUpdatePart={jest.fn()}
        onIncrementPartQuantity={jest.fn()}
        onDecrementPartQuantity={jest.fn()}
        onAddPart={jest.fn()}
        onRemovePart={jest.fn()}
        onDisableParts={jest.fn()}
      />,
    );
    expect(screen.getByText('R$ 3,99')).toBeOnTheScreen();
  });

  it('calls onAddPart when adding a part and onDisableParts when reverting', () => {
    const onAddPart = jest.fn();
    const onDisableParts = jest.fn();
    render(
      <PricePartsEditor
        parts={[makePart()]}
        totalInCents={0}
        canAddPart
        onUpdatePart={jest.fn()}
        onIncrementPartQuantity={jest.fn()}
        onDecrementPartQuantity={jest.fn()}
        onAddPart={onAddPart}
        onRemovePart={jest.fn()}
        onDisableParts={onDisableParts}
      />,
    );
    fireEvent.press(screen.getByTestId('edit-part-add'));
    fireEvent.press(screen.getByTestId('edit-parts-disable'));
    expect(onAddPart).toHaveBeenCalledTimes(1);
    expect(onDisableParts).toHaveBeenCalledTimes(1);
  });

  it('disables adding a part when the cap is reached', () => {
    render(
      <PricePartsEditor
        parts={[makePart()]}
        totalInCents={0}
        canAddPart={false}
        onUpdatePart={jest.fn()}
        onIncrementPartQuantity={jest.fn()}
        onDecrementPartQuantity={jest.fn()}
        onAddPart={jest.fn()}
        onRemovePart={jest.fn()}
        onDisableParts={jest.fn()}
      />,
    );
    expect(screen.getByTestId('edit-part-add')).toBeDisabled();
  });

  it('routes each row callback with the right part id', () => {
    const onUpdatePart = jest.fn();
    const onRemovePart = jest.fn();
    render(
      <PricePartsEditor
        parts={[makePart({ id: 'a' }), makePart({ id: 'b' })]}
        totalInCents={0}
        canAddPart
        onUpdatePart={onUpdatePart}
        onIncrementPartQuantity={jest.fn()}
        onDecrementPartQuantity={jest.fn()}
        onAddPart={jest.fn()}
        onRemovePart={onRemovePart}
        onDisableParts={jest.fn()}
      />,
    );
    fireEvent.changeText(screen.getByTestId('edit-part-label-b'), 'Biscoito');
    expect(onUpdatePart).toHaveBeenCalledWith('b', { label: 'Biscoito' });
    fireEvent.press(screen.getByTestId('edit-part-remove-a'));
    expect(onRemovePart).toHaveBeenCalledWith('a');
  });
});
