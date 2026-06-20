import type { JSX } from 'react';
import { Text } from 'react-native';

interface SectionLabelProps {
  children: string;
}

export function SectionLabel({ children }: SectionLabelProps): JSX.Element {
  return (
    <Text className="text-[11px] font-semibold uppercase tracking-[0.88px] text-checkit-pebble-gray">
      {children}
    </Text>
  );
}
