import { fireEvent, render, screen } from '@testing-library/react-native';
import { SortSheet } from '@/features/shop/components/sort-sheet';

describe('SortSheet', () => {
  it('renders every sort option when visible', () => {
    render(
      <SortSheet
        visible
        current="recent"
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Mais recentes primeiro')).toBeOnTheScreen();
    expect(screen.getByText('Mais antigos primeiro')).toBeOnTheScreen();
    expect(screen.getByText('Maior preço primeiro')).toBeOnTheScreen();
    expect(screen.getByText('Menor preço primeiro')).toBeOnTheScreen();
    expect(screen.getByText('Nome (A-Z)')).toBeOnTheScreen();
    expect(screen.getByText('Por categoria')).toBeOnTheScreen();
  });

  it('marks the active option as selected', () => {
    render(
      <SortSheet
        visible
        current="name"
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(
      screen.getByTestId('sort-option-name').props.accessibilityState.selected,
    ).toBe(true);
    expect(
      screen.getByTestId('sort-option-recent').props.accessibilityState
        .selected,
    ).toBe(false);
  });

  it('applies the chosen option through onSelect', () => {
    const onSelect = jest.fn();
    render(
      <SortSheet
        visible
        current="recent"
        onSelect={onSelect}
        onClose={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId('sort-option-price-desc'));
    expect(onSelect).toHaveBeenCalledWith('price-desc');
  });
});
