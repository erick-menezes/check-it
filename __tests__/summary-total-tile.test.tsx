import { render, screen } from '@testing-library/react-native';
import { SummaryTotalTile } from '@/features/summary/components/summary-total-tile';

describe('SummaryTotalTile', () => {
  it('shows the remaining banner when under budget', () => {
    render(<SummaryTotalTile totalInCents={7000} limitInCents={10000} />);
    expect(screen.getByText('R$ 70,00')).toBeOnTheScreen();
    expect(screen.getByTestId('summary-banner-label')).toHaveTextContent(
      'Você ainda tem',
    );
    expect(screen.getByTestId('summary-banner-value')).toHaveTextContent(
      'R$ 30,00',
    );
  });

  it('shows the over-budget banner with the absolute difference', () => {
    render(<SummaryTotalTile totalInCents={12000} limitInCents={10000} />);
    expect(screen.getByTestId('summary-banner-label')).toHaveTextContent(
      'Estourou em',
    );
    expect(screen.getByTestId('summary-banner-value')).toHaveTextContent(
      'R$ 20,00',
    );
  });

  it('always shows the configured limit', () => {
    render(<SummaryTotalTile totalInCents={5000} limitInCents={10000} />);
    expect(screen.getByText('R$ 100,00')).toBeOnTheScreen();
  });
});
