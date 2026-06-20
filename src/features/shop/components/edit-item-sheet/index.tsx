import { BottomSheet } from '@/components/ui/bottom-sheet';
import type { ListItem, UpdateItemChanges } from '@/features/shop/list-item';
import { EditItemForm } from './components/edit-item-form';

interface EditItemSheetProps {
  item: ListItem | null;
  onClose: () => void;
  onSave: (itemId: string, changes: UpdateItemChanges) => void;
  onRemove: (itemId: string) => void;
}

export function EditItemSheet({
  item,
  onClose,
  onSave,
  onRemove,
}: EditItemSheetProps) {
  return (
    <BottomSheet
      visible={item !== null}
      onClose={onClose}
      testID="edit-item-sheet"
      accessibilityLabel="Editar item"
    >
      {item && (
        <EditItemForm
          key={item.id}
          item={item}
          onClose={onClose}
          onSave={onSave}
          onRemove={onRemove}
        />
      )}
    </BottomSheet>
  );
}
