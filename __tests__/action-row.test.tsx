import { fireEvent, render, screen } from '@testing-library/react-native';
import { ActionRow } from '@/features/shop/components/action-row';

describe('ActionRow', () => {
  it('shows the current sort label', () => {
    render(
      <ActionRow
        sort="price-desc"
        onOpenSort={jest.fn()}
        onOpenReceipt={jest.fn()}
      />,
    );
    expect(screen.getByText('Maior preço primeiro')).toBeOnTheScreen();
  });

  it('opens the sort sheet when the sort button is pressed', () => {
    const onOpenSort = jest.fn();
    render(
      <ActionRow
        sort="recent"
        onOpenSort={onOpenSort}
        onOpenReceipt={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByTestId('shop-sort-button'));
    expect(onOpenSort).toHaveBeenCalledTimes(1);
  });

  it('opens the receipt sheet from the camera shortcut', () => {
    const onOpenReceipt = jest.fn();
    render(
      <ActionRow
        sort="recent"
        onOpenSort={jest.fn()}
        onOpenReceipt={onOpenReceipt}
      />,
    );
    fireEvent.press(screen.getByTestId('shop-camera-shortcut'));
    expect(onOpenReceipt).toHaveBeenCalledTimes(1);
  });
});
