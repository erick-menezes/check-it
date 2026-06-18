import {
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react-native';
import { CurrencyHero } from '@/features/limit/components/currency-hero';
import { formatBRL } from '@/lib/currency';

function noop(): void {}

describe('CurrencyHero', () => {
  it('renders the R$ prefix and the formatted amount', () => {
    render(<CurrencyHero cents={0} digits="" onChangeDigits={noop} />);
    expect(screen.getByText('R$')).toBeOnTheScreen();
    expect(screen.getByText('0,00')).toBeOnTheScreen();
  });

  it('renders the muted treatment while the value is zero', () => {
    render(<CurrencyHero cents={0} digits="" onChangeDigits={noop} />);
    expect(screen.getByText('0,00').props.className).toContain('text-white/45');
    expect(screen.getByText('R$').props.className).toContain('opacity-55');
  });

  it('renders full-strength white once the value is filled', () => {
    render(<CurrencyHero cents={4050} digits="4050" onChangeDigits={noop} />);
    const value = screen.getByText('40,50');
    expect(value.props.className).toContain('text-white');
    expect(value.props.className).not.toContain('text-white/45');
    expect(screen.getByText('R$').props.className).toContain('opacity-90');
  });

  it('announces the formatted currency amount to assistive technology', () => {
    render(<CurrencyHero cents={4050} digits="4050" onChangeDigits={noop} />);
    const hero = screen.getByTestId('limit-currency-hero');
    expect(hero.props.accessibilityLabel).toContain(formatBRL(4050));
  });

  it('exposes a single tap target that includes the edit hint', () => {
    render(<CurrencyHero cents={0} digits="" onChangeDigits={noop} />);
    const hero = screen.getByTestId('limit-currency-hero');
    expect(within(hero).getByText('Toque para editar')).toBeOnTheScreen();
    expect(within(hero).getByText('0,00')).toBeOnTheScreen();
    expect(() => fireEvent.press(hero)).not.toThrow();
  });

  it('configures the hidden input for native numeric auto-focus entry', () => {
    render(<CurrencyHero cents={0} digits="" onChangeDigits={noop} />);
    const input = screen.getByTestId('limit-hidden-input');
    expect(input.props.autoFocus).toBe(true);
    expect(input.props.keyboardType).toBe('number-pad');
    expect(input.props.maxLength).toBe(9);
    expect(input.props.caretHidden).toBe(true);
    expect(input.props.contextMenuHidden).toBe(true);
  });

  it('reports typed digits through onChangeDigits', () => {
    const onChangeDigits = jest.fn();
    render(
      <CurrencyHero cents={0} digits="" onChangeDigits={onChangeDigits} />,
    );
    fireEvent.changeText(screen.getByTestId('limit-hidden-input'), '4050');
    expect(onChangeDigits).toHaveBeenCalledWith('4050');
  });
});
