import { render, screen, within } from '@testing-library/react-native';
import type { CategoryBreakdownEntry } from '@/features/home/active-list';
import { StackedCategoryBar } from '@/features/summary/components/stacked-category-bar';

const ENTRIES: readonly CategoryBreakdownEntry[] = [
  { category: 'grocery', totalInCents: 6000 },
  { category: 'drinks', totalInCents: 3000 },
  { category: null, totalInCents: 1000 },
];

describe('StackedCategoryBar', () => {
  it('renders one legend row per category with its amount', () => {
    render(<StackedCategoryBar entries={ENTRIES} totalInCents={10000} />);
    expect(
      within(screen.getByTestId('summary-legend-grocery')).getByText(
        'Mercearia',
      ),
    ).toBeOnTheScreen();
    expect(
      within(screen.getByTestId('summary-legend-grocery')).getByText(
        'R$ 60,00',
      ),
    ).toBeOnTheScreen();
  });

  it('keeps the legend in the amount-descending order it receives', () => {
    render(<StackedCategoryBar entries={ENTRIES} totalInCents={10000} />);
    const legends = screen.getAllByTestId(/^summary-legend-/);
    expect(legends.map((node) => node.props.testID)).toEqual([
      'summary-legend-grocery',
      'summary-legend-drinks',
      'summary-legend-uncategorized',
    ]);
  });

  it('renders the uncategorized segment and its "Sem categoria" label', () => {
    render(<StackedCategoryBar entries={ENTRIES} totalInCents={10000} />);
    expect(
      screen.getByTestId('summary-bar-segment-uncategorized'),
    ).toBeOnTheScreen();
    expect(
      within(screen.getByTestId('summary-legend-uncategorized')).getByText(
        'Sem categoria',
      ),
    ).toBeOnTheScreen();
  });

  it('sizes each segment to its percentage of the total', () => {
    render(<StackedCategoryBar entries={ENTRIES} totalInCents={10000} />);
    expect(
      screen.getByTestId('summary-bar-segment-grocery').props.style,
    ).toEqual(expect.objectContaining({ width: '60%' }));
  });
});
