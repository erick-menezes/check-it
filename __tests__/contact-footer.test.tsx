import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('@/lib/open-support-email', () => ({
  openSupportEmail: jest.fn(),
  SUPPORT_EMAIL: 'suporte@checkit.com',
}));

import { ContactFooter } from '@/features/terms/components/contact-footer';
import { openSupportEmail } from '@/lib/open-support-email';

describe('ContactFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title, supporting line, and support button label', () => {
    render(<ContactFooter />);
    expect(screen.getByText('Ficou com alguma dúvida?')).toBeOnTheScreen();
    expect(
      screen.getByText('Nosso time responde assim que possível.'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Falar com o suporte')).toBeOnTheScreen();
  });

  it('exposes a PT-BR accessibility label on the support button', () => {
    render(<ContactFooter />);
    expect(screen.getByLabelText('Falar com o suporte')).toBeOnTheScreen();
  });

  it('calls openSupportEmail once when the button is pressed', () => {
    render(<ContactFooter />);
    fireEvent.press(screen.getByTestId('terms-support-button'));
    expect(openSupportEmail).toHaveBeenCalledTimes(1);
  });
});
