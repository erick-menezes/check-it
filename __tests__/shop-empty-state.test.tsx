import { fireEvent, render, screen } from '@testing-library/react-native';
import { EmptyState } from '@/features/shop/components/empty-state';

describe('EmptyState', () => {
  it('renders the handoff copy', () => {
    render(<EmptyState onScanReceipt={jest.fn()} />);
    expect(screen.getByText('Sua lista está vazia')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Adicione um produto acima ou tire foto do seu cupom fiscal.',
      ),
    ).toBeOnTheScreen();
  });

  it('invokes onScanReceipt when the ghost CTA is pressed', () => {
    const onScanReceipt = jest.fn();
    render(<EmptyState onScanReceipt={onScanReceipt} />);
    fireEvent.press(screen.getByTestId('shop-scan-receipt'));
    expect(onScanReceipt).toHaveBeenCalledTimes(1);
  });
});
