import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';

jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);

jest.mock('react-native-safe-area-context', () =>
  require('../test-utils/mocks').createSafeAreaContextMock(),
);

import HelpScreen from '@/app/help';
import { HELP_SECTIONS } from '@/features/help/help-content';

const LISTAS = HELP_SECTIONS[0];
const LIMITES = HELP_SECTIONS[1];
const GASTOS = HELP_SECTIONS[2];

describe('HelpScreen integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(Linking, 'canOpenURL')
      .mockImplementation(() => Promise.resolve(true));
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
  });

  it('renders the three accordion section headers in order', () => {
    render(<HelpScreen />);
    expect(screen.getByTestId(`faq-section-${LISTAS.id}`)).toBeOnTheScreen();
    expect(screen.getByTestId(`faq-section-${LIMITES.id}`)).toBeOnTheScreen();
    expect(screen.getByTestId(`faq-section-${GASTOS.id}`)).toBeOnTheScreen();
  });

  it('shows the Listas content open by default on mount', () => {
    render(<HelpScreen />);
    for (const item of LISTAS.items) {
      expect(screen.getByText(item.question)).toBeOnTheScreen();
      expect(screen.getByText(item.answer)).toBeOnTheScreen();
    }
    expect(screen.queryByText(LIMITES.items[0].question)).toBeNull();
  });

  it('collapses Listas and reveals Limites when its header is tapped', () => {
    render(<HelpScreen />);
    fireEvent.press(screen.getByTestId(`faq-section-${LIMITES.id}`));
    for (const item of LIMITES.items) {
      expect(screen.getByText(item.question)).toBeOnTheScreen();
      expect(screen.getByText(item.answer)).toBeOnTheScreen();
    }
    expect(screen.queryByText(LISTAS.items[0].question)).toBeNull();
  });
});
