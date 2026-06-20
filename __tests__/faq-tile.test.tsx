import { render, screen } from '@testing-library/react-native';
import { FaqTile } from '@/features/help/components/faq-tile';

describe('FaqTile', () => {
  const item = {
    question: 'Como crio uma lista?',
    answer: 'No início, toque em "Criar lista de compras".',
  };

  it('renders the question and the answer', () => {
    render(<FaqTile item={item} />);
    expect(screen.getByText(item.question)).toBeOnTheScreen();
    expect(screen.getByText(item.answer)).toBeOnTheScreen();
  });
});
