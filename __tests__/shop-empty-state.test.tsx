import { render, screen } from '@testing-library/react-native';
import { EmptyState } from '@/features/shop/components/empty-state';

describe('EmptyState', () => {
  it('renders the handoff copy', () => {
    render(<EmptyState />);
    expect(screen.getByText('Sua lista está vazia')).toBeOnTheScreen();
    expect(
      screen.getByText('Adicione um produto acima para começar.'),
    ).toBeOnTheScreen();
  });
});
