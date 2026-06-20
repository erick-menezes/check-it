import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';

describe('BottomSheet', () => {
  it('renders its children while visible', () => {
    render(
      <BottomSheet visible onClose={jest.fn()} testID="sheet">
        <Text>Conteúdo da folha</Text>
      </BottomSheet>,
    );
    expect(screen.getByText('Conteúdo da folha')).toBeOnTheScreen();
  });

  it('dismisses when the backdrop is pressed', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet visible onClose={onClose} testID="sheet">
        <Text>Conteúdo da folha</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not surface its children while hidden', () => {
    render(
      <BottomSheet visible={false} onClose={jest.fn()} testID="sheet">
        <Text>Conteúdo da folha</Text>
      </BottomSheet>,
    );
    expect(screen.queryByText('Conteúdo da folha')).toBeNull();
  });
});
