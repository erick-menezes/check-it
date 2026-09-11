import { render, screen } from '@testing-library/react-native';
import {
  MAX_FONT_SIZE_MULTIPLIER,
  Text,
  TextInput,
  withDefaultFont,
} from '@/components/ui/text';

describe('withDefaultFont', () => {
  it('adds font-sans when no font utility is present', () => {
    expect(withDefaultFont()).toContain('font-sans');
    expect(withDefaultFont('text-lg')).toContain('font-sans');
    expect(withDefaultFont('text-lg')).toContain('text-lg');
  });

  it('leaves the caller font utility untouched (no font-sans conflict)', () => {
    expect(withDefaultFont('font-bold')).toBe('font-bold');
    expect(withDefaultFont('font-medium text-xl')).toBe('font-medium text-xl');
    expect(withDefaultFont('text-base font-semibold')).not.toContain(
      'font-sans',
    );
  });
});

describe('Text', () => {
  it('renders its children', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  it('caps font scaling at the default multiplier', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello').props.maxFontSizeMultiplier).toBe(
      MAX_FONT_SIZE_MULTIPLIER,
    );
  });

  it('allows the multiplier to be overridden per instance', () => {
    render(<Text maxFontSizeMultiplier={1}>Hello</Text>);
    expect(screen.getByText('Hello').props.maxFontSizeMultiplier).toBe(1);
  });
});

describe('TextInput', () => {
  it('caps font scaling at the default multiplier', () => {
    render(<TextInput testID="input" />);
    expect(screen.getByTestId('input').props.maxFontSizeMultiplier).toBe(
      MAX_FONT_SIZE_MULTIPLIER,
    );
  });
});
