import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import { router } from 'expo-router';
import { HelpHeader } from '@/features/help/components/help-header';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HelpHeader', () => {
  it('renders the title and the subtitle', () => {
    render(<HelpHeader />);
    expect(screen.getByText('Sobre o que você quer saber?')).toBeOnTheScreen();
    expect(
      screen.getByText('Selecione uma seção pra ver as principais dúvidas.'),
    ).toBeOnTheScreen();
  });

  it('exposes a PT-BR accessibility label on the close affordance', () => {
    render(<HelpHeader />);
    expect(screen.getByLabelText('Fechar')).toBeOnTheScreen();
  });

  it('navigates back when there is history', () => {
    (router.canGoBack as jest.Mock).mockReturnValue(true);
    render(<HelpHeader />);
    fireEvent.press(screen.getByTestId('help-close'));
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('falls back to Home when there is no history', () => {
    (router.canGoBack as jest.Mock).mockReturnValue(false);
    render(<HelpHeader />);
    fireEvent.press(screen.getByTestId('help-close'));
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    expect(router.back).not.toHaveBeenCalled();
  });
});
