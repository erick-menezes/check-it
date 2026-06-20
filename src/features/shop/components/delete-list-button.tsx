import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface DeleteListButtonProps {
  listName: string;
  onDelete: () => void;
}

export function DeleteListButton({
  listName,
  onDelete,
}: DeleteListButtonProps) {
  const [confirming, setConfirming] = useState(false);
  function confirm(): void {
    setConfirming(false);
    onDelete();
  }
  return (
    <View className="px-[22px] pt-[22px]">
      <Pressable
        onPress={() => setConfirming(true)}
        accessibilityRole="button"
        accessibilityLabel="Excluir lista"
        testID="shop-delete-list"
        className="h-11 flex-row items-center justify-center gap-2 rounded-xl border-hairline border-checkit-danger"
      >
        <Trash2 size={16} color="#E13E3E" strokeWidth={2} />
        <Text className="text-[13px] font-bold text-checkit-danger">
          Excluir
        </Text>
      </Pressable>
      <ConfirmDialog
        visible={confirming}
        icon={Trash2}
        tone="danger"
        title="Excluir esta lista?"
        message={`“${listName}” será removida permanentemente. Você não poderá desfazer essa ação.`}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        onConfirm={confirm}
        onCancel={() => setConfirming(false)}
        testID="delete-list-dialog"
      />
    </View>
  );
}
