import { fireEvent, render, screen } from '@testing-library/react-native';
import { Mail } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders the accent variant with the correct label', () => {
    render(<Button variant="accent" label="Vamos lá!" />);

    const btn = screen.getByRole('button', { name: 'Vamos lá!' });
    expect(btn).toBeOnTheScreen();
  });

  it('renders the onPrimary variant with the correct label', () => {
    render(<Button variant="onPrimary" label="Próximo" />);

    const btn = screen.getByRole('button', { name: 'Próximo' });
    expect(btn).toBeOnTheScreen();
  });

  it('renders the ghost variant with the correct label', () => {
    render(<Button variant="ghost" label="Pular" />);

    const btn = screen.getByRole('button', { name: 'Pular' });
    expect(btn).toBeOnTheScreen();
  });

  it('defaults to the accent variant when no variant is specified', () => {
    render(<Button label="Default" />);

    const btn = screen.getByRole('button', { name: 'Default' });
    expect(btn).toBeOnTheScreen();
  });

  it('exposes an accessible label on all variants', () => {
    const { rerender } = render(<Button variant="accent" label="Vamos lá!" />);
    expect(screen.getByLabelText('Vamos lá!')).toBeOnTheScreen();

    rerender(<Button variant="onPrimary" label="Próximo" />);
    expect(screen.getByLabelText('Próximo')).toBeOnTheScreen();

    rerender(<Button variant="ghost" label="Pular" />);
    expect(screen.getByLabelText('Pular')).toBeOnTheScreen();
  });

  it('renders the label text visibly', () => {
    render(<Button variant="accent" label="Criar lista" />);

    expect(screen.getByText('Criar lista')).toBeOnTheScreen();
  });

  it('renders the soft variant with the correct label', () => {
    render(<Button variant="soft" label="Falar com o suporte" />);

    const btn = screen.getByRole('button', { name: 'Falar com o suporte' });
    expect(btn).toBeOnTheScreen();
    expect(screen.getByText('Falar com o suporte')).toBeOnTheScreen();
  });

  it('renders a leading icon when iconLeft is provided', () => {
    const { UNSAFE_root } = render(
      <Button variant="soft" label="Falar com o suporte" iconLeft={Mail} />,
    );

    expect(UNSAFE_root.findAllByType(Mail)).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Falar com o suporte' }),
    ).toBeOnTheScreen();
  });

  it('does not render a leading icon when iconLeft is omitted', () => {
    const { UNSAFE_root } = render(<Button variant="soft" label="Sem ícone" />);

    expect(UNSAFE_root.findAllByType(Mail)).toHaveLength(0);
  });

  it('blocks onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <Button
        variant="accent"
        label="Criar lista"
        disabled
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Criar lista' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes the disabled state to assistive technology', () => {
    render(<Button variant="accent" label="Criar lista" disabled />);

    const btn = screen.getByRole('button', { name: 'Criar lista' });
    expect(btn).toBeDisabled();
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('applies a distinct visual treatment when disabled', () => {
    render(<Button variant="accent" label="Criar lista" disabled />);

    const btn = screen.getByRole('button', { name: 'Criar lista' });
    expect(btn.props.className).toContain('opacity-40');
  });

  it('fires onPress and omits the disabled visual treatment when enabled', () => {
    const onPress = jest.fn();
    render(<Button variant="accent" label="Criar lista" onPress={onPress} />);

    const btn = screen.getByRole('button', { name: 'Criar lista' });
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(btn.props.className).not.toContain('opacity-40');
  });
});
