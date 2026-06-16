import { render, screen } from '@testing-library/react-native';
import type { ActiveList } from '@/features/home/active-list';
import { BudgetProgressBar } from '@/features/home/components/budget-progress-bar';

function makeList(totalInCents: number, limitInCents: number): ActiveList {
  return {
    id: '1',
    name: 'Lista',
    itemCount: 1,
    createdAt: '2026-06-07T10:00:00.000Z',
    totalInCents,
    limitInCents,
    items: [],
  };
}

describe('BudgetProgressBar', () => {
  it('uses the green fill when on track', () => {
    render(<BudgetProgressBar list={makeList(5000, 20000)} />);
    expect(screen.getByTestId('budget-fill-onTrack').props.className).toContain(
      'bg-checkit-primary',
    );
  });

  it('uses the accent fill at the warning threshold', () => {
    render(<BudgetProgressBar list={makeList(17000, 20000)} />);
    expect(screen.getByTestId('budget-fill-warning').props.className).toContain(
      'bg-checkit-accent',
    );
  });

  it('uses the danger fill and a non-color label when over budget', () => {
    render(<BudgetProgressBar list={makeList(25000, 20000)} />);
    expect(
      screen.getByTestId('budget-fill-overBudget').props.className,
    ).toContain('bg-checkit-danger');
    expect(screen.getByLabelText('Acima do limite')).toBeOnTheScreen();
  });
});
