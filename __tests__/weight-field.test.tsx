import { fireEvent, render, screen } from '@testing-library/react-native';
import { WeightField } from '@/features/shop/components/edit-item-sheet/components/weight-field';
import { useWeightInput } from '@/features/shop/use-weight-input';

function Wrapper({ initialGrams }: { initialGrams: number | null }) {
  const weight = useWeightInput(initialGrams);
  return <WeightField weight={weight} />;
}

describe('WeightField', () => {
  it('shows an empty value with a placeholder when there is no weight yet', () => {
    render(<Wrapper initialGrams={null} />);
    expect(screen.getByTestId('edit-weight-input').props.value).toBe('');
    expect(screen.getByTestId('edit-weight-input').props.placeholder).toBe(
      '0,000 kg',
    );
  });

  it('displays the formatted weight once digits are typed', () => {
    render(<Wrapper initialGrams={null} />);
    fireEvent.changeText(screen.getByTestId('edit-weight-input'), '830');
    expect(screen.getByTestId('edit-weight-input').props.value).toBe(
      '0,830 kg',
    );
  });

  it('exposes the weight in words for screen readers', () => {
    render(<Wrapper initialGrams={830} />);
    expect(
      screen.getByTestId('edit-weight-input').props.accessibilityValue,
    ).toEqual({ text: '0,830 quilos' });
  });

  it('seeds the field from an initial weight in grams', () => {
    render(<Wrapper initialGrams={1250} />);
    expect(screen.getByTestId('edit-weight-input').props.value).toBe(
      '1,250 kg',
    );
  });
});
