import { Check, Pencil, Trash2 } from 'lucide-react-native';
import { memo, useCallback, useState } from 'react';
import {
  type AccessibilityActionEvent,
  Dimensions,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  getCategoryTile,
  getCategoryTintClass,
  type ListItem,
} from '@/features/shop/list-item';
import { cn } from '@/lib/utils';
import { formatLineTotal, formatSubtitle } from './helpers';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DELETE_THRESHOLD = SCREEN_WIDTH * 0.45;
const REVEAL_REST = 96;
const HORIZONTAL_ACTIVATION = 15;
const VERTICAL_FAIL = 10;
const SETTLE_DURATION = 160;
const DELETE_ACTION = 'delete';

interface ItemRowProps {
  item: ListItem;
  onToggle: (itemId: string) => void;
  onEdit: (item: ListItem) => void;
  onRemove: (itemId: string) => void;
}

function ItemRowComponent({ item, onToggle, onEdit, onRemove }: ItemRowProps) {
  const tile = getCategoryTile(item.category);
  const TileIcon = tile.icon;
  const isPriceless = item.unitPriceInCents === null;
  const [confirming, setConfirming] = useState(false);
  const translateX = useSharedValue(0);
  const openConfirm = useCallback(() => setConfirming(true), []);
  const settleClosed = useCallback(() => {
    translateX.value = withTiming(0, { duration: SETTLE_DURATION });
  }, [translateX]);
  const panGesture = Gesture.Pan()
    .activeOffsetX([-HORIZONTAL_ACTIVATION, HORIZONTAL_ACTIVATION])
    .failOffsetY([-VERTICAL_FAIL, VERTICAL_FAIL])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (-event.translationX > DELETE_THRESHOLD) {
        translateX.value = withTiming(-REVEAL_REST, {
          duration: SETTLE_DURATION,
        });
        runOnJS(openConfirm)();
        return;
      }
      translateX.value = withTiming(0, { duration: SETTLE_DURATION });
    });
  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const actionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
  }));
  function cancelDelete(): void {
    setConfirming(false);
    settleClosed();
  }
  function confirmDelete(): void {
    setConfirming(false);
    onRemove(item.id);
  }
  function handleAccessibilityAction(event: AccessibilityActionEvent): void {
    if (event.nativeEvent.actionName === DELETE_ACTION) openConfirm();
  }
  return (
    <View className="px-[22px] pt-2">
      <View className="overflow-hidden rounded-[14px]">
        <Animated.View
          style={actionStyle}
          className="absolute inset-0 flex-row items-center justify-end gap-1.5 rounded-[14px] bg-checkit-danger pr-5"
        >
          <Trash2 size={18} color="#ffffff" strokeWidth={2} />
          <Text className="text-xs font-bold text-white">Excluir</Text>
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={rowStyle}
            testID={`shop-item-row-${item.id}`}
            accessibilityActions={[{ name: DELETE_ACTION, label: 'Excluir' }]}
            onAccessibilityAction={handleAccessibilityAction}
          >
            <View className="flex-row items-center gap-3 rounded-[14px] border-hairline border-checkit-mist-border bg-white p-3">
              <Pressable
                onPress={() => onToggle(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.checked }}
                accessibilityLabel={`Marcar ${item.name}`}
                hitSlop={8}
                testID={`shop-item-checkbox-${item.id}`}
                className={`h-[22px] w-[22px] items-center justify-center rounded-md border-2 ${item.checked ? 'border-checkit-primary bg-checkit-primary' : 'border-checkit-mist-border'}`}
              >
                {item.checked && (
                  <Check size={14} color="#ffffff" strokeWidth={3} />
                )}
              </Pressable>
              <Pressable
                onPress={() => onEdit(item)}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${item.name}`}
                testID={`shop-item-${item.id}`}
                className="min-w-0 flex-1 flex-row items-center gap-2.5"
              >
                <View
                  className={cn(
                    'h-8 w-8 items-center justify-center rounded-[9px]',
                    getCategoryTintClass(item.category),
                  )}
                >
                  <TileIcon size={16} color={tile.colorHex} strokeWidth={2} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text
                    numberOfLines={1}
                    className={`text-sm font-bold ${item.checked ? 'text-checkit-pebble-gray line-through opacity-55' : 'text-checkit-charcoal-ink'}`}
                  >
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-[11px] tabular-nums text-checkit-pebble-gray">
                    {formatSubtitle(item)}
                  </Text>
                </View>
                <Text
                  className={`text-sm font-bold tabular-nums ${isPriceless ? 'text-checkit-pebble-gray' : 'text-checkit-charcoal-ink'}`}
                >
                  {formatLineTotal(item)}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onEdit(item)}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${item.name}`}
                testID={`shop-item-edit-${item.id}`}
                className="h-8 w-8 items-center justify-center rounded-[9px] bg-checkit-fog-gray"
              >
                <Pencil size={15} color="#8A8A8A" strokeWidth={2} />
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
      <ConfirmDialog
        visible={confirming}
        icon={Trash2}
        tone="danger"
        title="Excluir item?"
        message={`“${item.name}” será removido da lista.`}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        testID={`shop-item-delete-dialog-${item.id}`}
      />
    </View>
  );
}

export const ItemRow = memo(ItemRowComponent);
