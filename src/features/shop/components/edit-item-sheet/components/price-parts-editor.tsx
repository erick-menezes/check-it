import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatBRL } from '@/lib/currency';
import type {
  PricePartDraft,
  PricePartDraftChanges,
} from '../use-edit-item-form';
import { PricePartRow } from './price-part-row';

interface PricePartsEditorProps {
  parts: readonly PricePartDraft[];
  totalInCents: number;
  canAddPart: boolean;
  onUpdatePart: (partId: string, changes: PricePartDraftChanges) => void;
  onIncrementPartQuantity: (partId: string) => void;
  onDecrementPartQuantity: (partId: string) => void;
  onAddPart: () => void;
  onRemovePart: (partId: string) => void;
  onDisableParts: () => void;
}

export function PricePartsEditor({
  parts,
  totalInCents,
  canAddPart,
  onUpdatePart,
  onIncrementPartQuantity,
  onDecrementPartQuantity,
  onAddPart,
  onRemovePart,
  onDisableParts,
}: PricePartsEditorProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold uppercase tracking-[0.06em] text-checkit-pebble-gray">
          Somando várias partes
        </Text>
        <Pressable
          onPress={onDisableParts}
          accessibilityRole="button"
          accessibilityLabel="Voltar a preço único"
          testID="edit-parts-disable"
          className="h-11 items-center justify-center px-1"
        >
          <Text className="text-xs font-bold text-checkit-primary">
            Voltar a preço único
          </Text>
        </Pressable>
      </View>
      {parts.map((part) => (
        <PricePartRow
          key={part.id}
          part={part}
          onChangeLabel={(label) => onUpdatePart(part.id, { label })}
          onChangePriceDigits={(priceDigits) =>
            onUpdatePart(part.id, { priceDigits })
          }
          onIncrementQuantity={() => onIncrementPartQuantity(part.id)}
          onDecrementQuantity={() => onDecrementPartQuantity(part.id)}
          onRemove={() => onRemovePart(part.id)}
        />
      ))}
      <Pressable
        onPress={onAddPart}
        disabled={!canAddPart}
        accessibilityRole="button"
        accessibilityLabel="Adicionar parte"
        accessibilityState={{ disabled: !canAddPart }}
        testID="edit-part-add"
        className="mt-2.5 h-11 flex-row items-center justify-center gap-1.5 rounded-[10px] border-hairline border-checkit-mist-border"
      >
        <Plus size={16} color="#58AB6A" strokeWidth={2} />
        <Text className="text-xs font-bold text-checkit-primary">
          Adicionar parte
        </Text>
      </Pressable>
      <Text className="mt-2.5 text-xs text-checkit-pebble-gray">
        Total:{' '}
        <Text className="font-bold tabular-nums text-checkit-charcoal-ink">
          {formatBRL(totalInCents)}
        </Text>
      </Text>
    </View>
  );
}
