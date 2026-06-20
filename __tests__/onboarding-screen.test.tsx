import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock(
  'expo-glass-effect',
  () => require('../test-utils/mocks').glassEffectMock,
);
jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);
jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

const mockMarkOnboardingSeen = jest.fn();
jest.mock('@/features/onboarding/onboarding-store', () => ({
  useOnboardingStore: jest.fn(
    (selector: (s: { markOnboardingSeen: () => void }) => unknown) =>
      selector({ markOnboardingSeen: mockMarkOnboardingSeen }),
  ),
}));

import { router } from 'expo-router';
import OnboardingScreen from '@/app/onboarding';

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows step 1 content on mount', () => {
    render(<OnboardingScreen />);
    expect(screen.getByText('Suas compras, sob controle.')).toBeOnTheScreen();
  });

  it('shows Próximo button on the first step', () => {
    render(<OnboardingScreen />);
    expect(screen.getByRole('button', { name: 'Próximo' })).toBeOnTheScreen();
  });

  it('shows Pular button on the first step', () => {
    render(<OnboardingScreen />);
    expect(screen.getByRole('button', { name: 'Pular' })).toBeOnTheScreen();
  });

  it('shows Pular on step 2', () => {
    render(<OnboardingScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.getByRole('button', { name: 'Pular' })).toBeOnTheScreen();
  });

  it('does not show Pular on the last step', () => {
    render(<OnboardingScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.queryByRole('button', { name: 'Pular' })).toBeNull();
  });

  it('shows Vamos lá! on the last step', () => {
    render(<OnboardingScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.getByRole('button', { name: 'Vamos lá!' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Próximo' })).toBeNull();
  });

  it('does not show Voltar button at any step', () => {
    render(<OnboardingScreen />);
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
  });

  it('Pular calls markOnboardingSeen and router.replace', () => {
    render(<OnboardingScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Pular' }));
    expect(mockMarkOnboardingSeen).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/home');
  });

  it('Vamos lá! calls markOnboardingSeen and router.replace', () => {
    render(<OnboardingScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    fireEvent.press(screen.getByRole('button', { name: 'Próximo' }));
    fireEvent.press(screen.getByRole('button', { name: 'Vamos lá!' }));
    expect(mockMarkOnboardingSeen).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/home');
  });

  it('shows wordmark logo on screen', () => {
    render(<OnboardingScreen />);
    expect(screen.getByTestId('wordmark')).toBeOnTheScreen();
  });
});
