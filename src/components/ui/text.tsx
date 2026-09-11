import { forwardRef } from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextInput as RNTextInputType,
  type Text as RNTextType,
  type TextInputProps,
  type TextProps,
} from 'react-native';
import { cn } from '@/lib/utils';

export const MAX_FONT_SIZE_MULTIPLIER = 1.2;

export type Text = RNTextType;
export type TextInput = RNTextInputType;

const FONT_UTILITY_PATTERN =
  /\bfont-(sans|regular|medium|semibold|bold|extrabold)\b/;

export function withDefaultFont(className?: string): string {
  if (className && FONT_UTILITY_PATTERN.test(className)) return className;
  return cn('font-sans', className);
}

export const Text = forwardRef<RNTextType, TextProps>(function Text(
  { className, maxFontSizeMultiplier, ...rest },
  ref,
) {
  return (
    <RNText
      ref={ref}
      className={withDefaultFont(className)}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? MAX_FONT_SIZE_MULTIPLIER}
      {...rest}
    />
  );
});

export const TextInput = forwardRef<RNTextInputType, TextInputProps>(
  function TextInput({ className, maxFontSizeMultiplier, ...rest }, ref) {
    return (
      <RNTextInput
        ref={ref}
        className={withDefaultFont(className)}
        maxFontSizeMultiplier={
          maxFontSizeMultiplier ?? MAX_FONT_SIZE_MULTIPLIER
        }
        {...rest}
      />
    );
  },
);
