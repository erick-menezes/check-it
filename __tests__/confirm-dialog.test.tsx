import { fireEvent, render, screen } from '@testing-library/react-native';
import { Trash2 } from 'lucide-react-native';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

function renderDialog(overrides?: {
  onConfirm?: () => void;
  onCancel?: () => void;
}): void {
  render(
    <ConfirmDialog
      visible
      icon={Trash2}
      tone="danger"
      title="Excluir esta lista?"
      message="Essa ação não pode ser desfeita."
      confirmLabel="Sim, excluir"
      cancelLabel="Cancelar"
      onConfirm={overrides?.onConfirm ?? jest.fn()}
      onCancel={overrides?.onCancel ?? jest.fn()}
      testID="confirm"
    />,
  );
}

describe('ConfirmDialog', () => {
  it('renders the title and message', () => {
    renderDialog();
    expect(screen.getByText('Excluir esta lista?')).toBeOnTheScreen();
    expect(
      screen.getByText('Essa ação não pode ser desfeita.'),
    ).toBeOnTheScreen();
  });

  it('invokes onConfirm when the confirm button is pressed', () => {
    const onConfirm = jest.fn();
    renderDialog({ onConfirm });
    fireEvent.press(screen.getByTestId('confirm-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('invokes onCancel when the cancel button is pressed', () => {
    const onCancel = jest.fn();
    renderDialog({ onCancel });
    fireEvent.press(screen.getByTestId('confirm-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('invokes onCancel when the backdrop is pressed', () => {
    const onCancel = jest.fn();
    renderDialog({ onCancel });
    fireEvent.press(screen.getByTestId('confirm-backdrop'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
