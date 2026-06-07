import { render, screen } from '@testing-library/react-native';
import Index from '@/app/index';

describe('Home screen', () => {
  it('mounts and shows the app name', () => {
    render(<Index />);

    expect(screen.getByTestId('home-screen')).toBeOnTheScreen();
    expect(screen.getByText('Check.it')).toBeOnTheScreen();
  });
});
