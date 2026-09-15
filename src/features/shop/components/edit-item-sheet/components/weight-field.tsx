import { TextInput } from '@/components/ui/text';
import type { WeightInput } from '@/features/shop/use-weight-input';
import { formatWeightForSpeech } from '@/lib/weight';

interface WeightFieldProps {
  weight: WeightInput;
}

export function WeightField({ weight }: WeightFieldProps) {
  return (
    <TextInput
      value={weight.hasValue ? weight.formatted : ''}
      onChangeText={weight.setDigits}
      keyboardType="number-pad"
      placeholder="0,000 kg"
      placeholderTextColor="#8A8A8A"
      testID="edit-weight-input"
      accessibilityLabel="Peso"
      accessibilityValue={{ text: formatWeightForSpeech(weight.grams) }}
      className="w-28 text-right text-lg font-bold tabular-nums text-checkit-charcoal-ink"
    />
  );
}
