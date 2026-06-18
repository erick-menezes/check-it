import { fireEvent, render, screen } from '@testing-library/react-native';
import { PresetPills } from '@/features/limit/components/preset-pills';

describe('PresetPills', () => {
  it('renders the three preset labels', () => {
    render(<PresetPills onSelect={jest.fn()} />);
    expect(screen.getByText('R$ 200')).toBeOnTheScreen();
    expect(screen.getByText('R$ 500')).toBeOnTheScreen();
    expect(screen.getByText('R$ 1000')).toBeOnTheScreen();
  });

  it('exposes each pill as an accessible button', () => {
    render(<PresetPills onSelect={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'R$ 200' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'R$ 500' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'R$ 1000' })).toBeOnTheScreen();
  });

  it('selects the R$ 200 preset as 20000 cents', () => {
    const onSelect = jest.fn();
    render(<PresetPills onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('limit-preset-200'));
    expect(onSelect).toHaveBeenCalledWith(20000);
  });

  it('selects the R$ 500 preset as 50000 cents', () => {
    const onSelect = jest.fn();
    render(<PresetPills onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('limit-preset-500'));
    expect(onSelect).toHaveBeenCalledWith(50000);
  });

  it('selects the R$ 1000 preset as 100000 cents', () => {
    const onSelect = jest.fn();
    render(<PresetPills onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('limit-preset-1000'));
    expect(onSelect).toHaveBeenCalledWith(100000);
  });
});
