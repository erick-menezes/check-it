import { Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';

export function EditableTitle({
  name,
  onRename,
}: {
  name: string;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  function startEditing(): void {
    setDraft(name);
    setEditing(true);
  }
  function commit(): void {
    const next = draft.trim();
    onRename(next.length > 0 ? next : name);
    setEditing(false);
  }
  if (editing) {
    return (
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onBlur={commit}
        onSubmitEditing={commit}
        autoFocus
        returnKeyType="done"
        testID="shop-title-input"
        className="border-b-2 border-white/50 pb-0.5 text-[22px] font-bold tracking-tight text-white"
      />
    );
  }
  return (
    <Pressable
      onPress={startEditing}
      accessibilityRole="button"
      accessibilityLabel={`Editar nome da lista, ${name}`}
      testID="shop-title"
      className="flex-row items-center gap-2"
    >
      <Text className="text-[22px] font-bold leading-[26px] tracking-tight text-white">
        {name}
      </Text>
      <Pencil
        size={14}
        color="#ffffff"
        strokeWidth={2}
        className="opacity-70"
      />
    </Pressable>
  );
}
