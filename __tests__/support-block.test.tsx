import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Linking } from 'react-native';
import { SupportBlock } from '@/features/help/components/support-block';

const SUPPORT_MAILTO = 'mailto:suporte@checkit.com';

describe('SupportBlock', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest
      .spyOn(Linking, 'canOpenURL')
      .mockImplementation(() => Promise.resolve(true));
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
  });

  it('renders the title, caption, and support button', () => {
    render(<SupportBlock />);
    expect(screen.getByText('Não achou sua dúvida?')).toBeOnTheScreen();
    expect(
      screen.getByText('Manda pra gente que respondemos assim que possível.'),
    ).toBeOnTheScreen();
    expect(screen.getByText('suporte@checkit.com')).toBeOnTheScreen();
  });

  it('opens the support email when the button is pressed', async () => {
    render(<SupportBlock />);
    fireEvent.press(screen.getByTestId('support-email-button'));
    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith(SUPPORT_MAILTO);
      expect(Linking.openURL).toHaveBeenCalledWith(SUPPORT_MAILTO);
    });
  });
});
