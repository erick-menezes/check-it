import { fireEvent, render, screen } from '@testing-library/react-native';
import { DeleteListButton } from '@/features/shop/components/delete-list-button';

describe('DeleteListButton', () => {
  it('opens the confirmation dialog naming the list', () => {
    render(<DeleteListButton listName="Compra mensal" onDelete={jest.fn()} />);
    fireEvent.press(screen.getByTestId('shop-delete-list'));
    expect(screen.getByText('Excluir esta lista?')).toBeOnTheScreen();
    expect(screen.getByText(/Compra mensal/)).toBeOnTheScreen();
  });

  it('deletes only after confirming', () => {
    const onDelete = jest.fn();
    render(<DeleteListButton listName="Compra mensal" onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('shop-delete-list'));
    fireEvent.press(screen.getByTestId('delete-list-dialog-confirm'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('keeps the list when cancelling', () => {
    const onDelete = jest.fn();
    render(<DeleteListButton listName="Compra mensal" onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('shop-delete-list'));
    fireEvent.press(screen.getByTestId('delete-list-dialog-cancel'));
    expect(onDelete).not.toHaveBeenCalled();
  });
});
