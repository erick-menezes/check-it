import { fireEvent, render, screen } from '@testing-library/react-native';
import { ActionRow } from '@/features/shop/components/action-row';

describe('ActionRow', () => {
  it('shows the current sort label', () => {
    render(<ActionRow sort="price-desc" onOpenSort={jest.fn()} />);
    expect(screen.getByText('Maior preço primeiro')).toBeOnTheScreen();
  });

  it('opens the sort sheet when the sort button is pressed', () => {
    const onOpenSort = jest.fn();
    render(<ActionRow sort="recent" onOpenSort={onOpenSort} />);
    fireEvent.press(screen.getByTestId('shop-sort-button'));
    expect(onOpenSort).toHaveBeenCalledTimes(1);
  });
});
