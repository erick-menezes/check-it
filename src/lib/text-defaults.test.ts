import { Text, TextInput } from 'react-native';
import { DEFAULT_FONT_FAMILY } from '@/lib/fonts';
import {
  applyGlobalTextDefaults,
  MAX_FONT_SIZE_MULTIPLIER,
} from '@/lib/text-defaults';

interface TextDefaultProps {
  style?: { fontFamily?: string };
  maxFontSizeMultiplier?: number;
}

function getDefaultProps(component: unknown): TextDefaultProps {
  return (component as { defaultProps?: TextDefaultProps }).defaultProps ?? {};
}

describe('applyGlobalTextDefaults', () => {
  beforeEach(() => {
    applyGlobalTextDefaults();
  });

  it('forces Plus Jakarta Sans as the default Text font family', () => {
    expect(getDefaultProps(Text).style?.fontFamily).toBe(DEFAULT_FONT_FAMILY);
    expect(getDefaultProps(TextInput).style?.fontFamily).toBe(
      DEFAULT_FONT_FAMILY,
    );
  });

  it('caps system font scaling on Text and TextInput', () => {
    expect(getDefaultProps(Text).maxFontSizeMultiplier).toBe(
      MAX_FONT_SIZE_MULTIPLIER,
    );
    expect(getDefaultProps(TextInput).maxFontSizeMultiplier).toBe(
      MAX_FONT_SIZE_MULTIPLIER,
    );
  });
});
