import { fireEvent, render, screen } from '@testing-library/react-native';
import { AddProductInput } from '@/features/shop/components/add-product-input';

jest.mock('@/features/shop/suggestions', () => ({
  getSuggestions: () => [
    'Arroz 5kg',
    'Feijão preto',
    'Leite integral',
    'Pão de forma',
    'Café 500g',
  ],
}));

describe('AddProductInput', () => {
  it('disables the confirm button while the input is empty', () => {
    render(<AddProductInput onAdd={jest.fn()} />);
    expect(screen.getByTestId('shop-add-confirm')).toBeDisabled();
  });

  it('keeps the confirm button disabled for whitespace-only input', () => {
    render(<AddProductInput onAdd={jest.fn()} />);
    fireEvent.changeText(screen.getByTestId('shop-add-input'), '   ');
    expect(screen.getByTestId('shop-add-confirm')).toBeDisabled();
  });

  it('adds the trimmed product and clears the field on confirm', () => {
    const onAdd = jest.fn();
    render(<AddProductInput onAdd={onAdd} />);
    const input = screen.getByTestId('shop-add-input');
    fireEvent.changeText(input, '  Arroz  ');
    fireEvent.press(screen.getByTestId('shop-add-confirm'));
    expect(onAdd).toHaveBeenCalledWith('Arroz');
    expect(input.props.value).toBe('');
  });

  it('shows the suggestions box only while the empty input is focused', () => {
    render(<AddProductInput onAdd={jest.fn()} />);
    const input = screen.getByTestId('shop-add-input');
    expect(screen.queryByTestId('shop-suggestions')).toBeNull();
    fireEvent(input, 'focus');
    expect(screen.getByTestId('shop-suggestions')).toBeOnTheScreen();
    fireEvent.changeText(input, 'Leite');
    expect(screen.queryByTestId('shop-suggestions')).toBeNull();
  });

  it('hides the suggestions box on blur', () => {
    render(<AddProductInput onAdd={jest.fn()} />);
    const input = screen.getByTestId('shop-add-input');
    fireEvent(input, 'focus');
    expect(screen.getByTestId('shop-suggestions')).toBeOnTheScreen();
    fireEvent(input, 'blur');
    expect(screen.queryByTestId('shop-suggestions')).toBeNull();
  });

  it('adds a product directly when a suggestion chip is tapped', () => {
    const onAdd = jest.fn();
    render(<AddProductInput onAdd={onAdd} />);
    fireEvent(screen.getByTestId('shop-add-input'), 'focus');
    fireEvent.press(screen.getByText('Café 500g'));
    expect(onAdd).toHaveBeenCalledWith('Café 500g');
  });
});
