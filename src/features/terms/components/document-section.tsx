import type { LucideIcon } from 'lucide-react-native';
import type { JSX } from 'react';
import { Text, View } from 'react-native';

interface NumberedSectionProps {
  readonly number: number;
  readonly title: string;
  readonly body: string;
  readonly Icon?: never;
}

interface IconSectionProps {
  readonly Icon: LucideIcon;
  readonly title: string;
  readonly body: string;
  readonly number?: never;
}

type DocumentSectionProps = NumberedSectionProps | IconSectionProps;

export function DocumentSection(props: DocumentSectionProps): JSX.Element {
  return (
    <View className="mb-5 flex-row">
      <View className="mr-3 h-7 w-7 items-center justify-center rounded-[8px] border border-checkit-mist-border bg-checkit-linen-cream">
        {props.Icon ? (
          <props.Icon size={14} color="#1B1B1B" strokeWidth={2} />
        ) : (
          <Text className="text-[13px] font-bold text-checkit-charcoal-ink">
            {props.number}
          </Text>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-bold text-checkit-charcoal-ink">
          {props.title}
        </Text>
        <Text className="mt-1 text-[13px] leading-5 text-checkit-slate-ink">
          {props.body}
        </Text>
      </View>
    </View>
  );
}
