import type { JSX } from 'react';
import { Text } from 'react-native';

interface WordmarkProps {
  size?: number;
  color?: string;
}

export function Wordmark({
  size = 22,
  color = 'inherit',
}: WordmarkProps): JSX.Element {
  return (
    <Text
      testID="wordmark"
      className="font-extrabold"
      style={{ fontSize: size, letterSpacing: -0.03 * size, color }}
    >
      {'Check'}
      <Text className="text-checkit-accent">{'.'}</Text>
      {'it'}
    </Text>
  );
}
