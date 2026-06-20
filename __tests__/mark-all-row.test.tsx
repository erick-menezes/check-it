import { fireEvent, render, screen } from '@testing-library/react-native';
import { MarkAllRow } from '@/features/shop/components/mark-all-row';

describe('MarkAllRow', () => {
  it('shows the checked/total counter', () => {
    render(<MarkAllRow checkedCount={1} totalCount={3} onToggle={jest.fn()} />);
    expect(screen.getByText('Marcar todos (1/3)')).toBeOnTheScreen();
  });

  it('is unchecked while some items remain unchecked', () => {
    render(<MarkAllRow checkedCount={2} totalCount={3} onToggle={jest.fn()} />);
    expect(screen.getByTestId('shop-mark-all')).not.toBeChecked();
  });

  it('is checked only when every item is checked', () => {
    render(<MarkAllRow checkedCount={3} totalCount={3} onToggle={jest.fn()} />);
    expect(screen.getByTestId('shop-mark-all')).toBeChecked();
  });

  it('marks all when toggled from a partial state', () => {
    const onToggle = jest.fn();
    render(<MarkAllRow checkedCount={1} totalCount={3} onToggle={onToggle} />);
    fireEvent.press(screen.getByTestId('shop-mark-all'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('unmarks all when toggled from a fully checked state', () => {
    const onToggle = jest.fn();
    render(<MarkAllRow checkedCount={3} totalCount={3} onToggle={onToggle} />);
    fireEvent.press(screen.getByTestId('shop-mark-all'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
