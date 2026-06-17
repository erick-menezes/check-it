import { render, screen } from '@testing-library/react-native';
import { Tag } from 'lucide-react-native';
import { VersionRow } from '@/features/settings/components/version-row';

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { version: '2.0.0' } },
}));

const LABEL = 'Versão';

describe('VersionRow', () => {
  it('renders the label and the version value', () => {
    render(<VersionRow Icon={Tag} label={LABEL} />);
    expect(screen.getByText(LABEL)).toBeOnTheScreen();
    expect(screen.getByText('2.0.0')).toBeOnTheScreen();
  });

  it('is not pressable and exposes no button role', () => {
    render(<VersionRow Icon={Tag} label={LABEL} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
