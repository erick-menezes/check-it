import { fireEvent, render, screen } from '@testing-library/react-native';
import { SearchField } from '@/features/shop/components/search-field';

describe('SearchField', () => {
  it('renders the current search value', () => {
    render(<SearchField value="arroz" onChange={jest.fn()} />);
    expect(screen.getByTestId('shop-search-input').props.value).toBe('arroz');
  });

  it('reports typed text through onChange', () => {
    const onChange = jest.fn();
    render(<SearchField value="" onChange={onChange} />);
    fireEvent.changeText(screen.getByTestId('shop-search-input'), 'feijão');
    expect(onChange).toHaveBeenCalledWith('feijão');
  });
});
