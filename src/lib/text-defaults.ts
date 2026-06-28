import { Text, TextInput, type TextStyle } from 'react-native';
import { DEFAULT_FONT_FAMILY } from '@/lib/fonts';

export const MAX_FONT_SIZE_MULTIPLIER = 1.2;

interface TextDefaultProps {
  style?: TextStyle;
  maxFontSizeMultiplier?: number;
}

interface WithDefaultProps {
  defaultProps?: TextDefaultProps;
}

export function applyGlobalTextDefaults(): void {
  const text = Text as unknown as WithDefaultProps;
  text.defaultProps = {
    ...text.defaultProps,
    style: { fontFamily: DEFAULT_FONT_FAMILY },
    maxFontSizeMultiplier: MAX_FONT_SIZE_MULTIPLIER,
  };
  const textInput = TextInput as unknown as WithDefaultProps;
  textInput.defaultProps = {
    ...textInput.defaultProps,
    style: { fontFamily: DEFAULT_FONT_FAMILY },
    maxFontSizeMultiplier: MAX_FONT_SIZE_MULTIPLIER,
  };
}
