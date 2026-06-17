import { fireEvent, render, screen } from '@testing-library/react-native';
import { CircleHelp } from 'lucide-react-native';
import { NavigationRow } from '@/features/settings/components/navigation-row';

const LABEL = 'Central de ajuda';

describe('NavigationRow', () => {
  it('renders the label', () => {
    render(
      <NavigationRow
        Icon={CircleHelp}
        label={LABEL}
        onPress={() => {}}
        testID="row-help"
      />,
    );
    expect(screen.getByText(LABEL)).toBeOnTheScreen();
  });

  it('fires onPress when the full row is pressed', () => {
    const onPress = jest.fn();
    render(
      <NavigationRow
        Icon={CircleHelp}
        label={LABEL}
        onPress={onPress}
        testID="row-help"
      />,
    );
    fireEvent.press(screen.getByTestId('row-help'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes a PT-BR label with the button role', () => {
    render(
      <NavigationRow
        Icon={CircleHelp}
        label={LABEL}
        onPress={() => {}}
        testID="row-help"
      />,
    );
    const row = screen.getByRole('button', { name: LABEL });
    expect(row).toBeOnTheScreen();
  });
});
