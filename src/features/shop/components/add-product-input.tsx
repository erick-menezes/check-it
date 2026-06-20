import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react-native";
import { type JSX, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SuggestionsBox } from "./suggestions-box";

const CONFIRM_HIT_SLOP = 3;

interface AddProductInputProps {
  onAdd: (name: string) => void;
}

export function AddProductInput({ onAdd }: AddProductInputProps): JSX.Element {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const trimmed = text.trim();
  const canAdd = trimmed.length > 0;
  const showSuggestions = focused && trimmed.length === 0;
  function confirm(): void {
    if (!canAdd) return;
    onAdd(trimmed);
    setText("");
  }
  function selectSuggestion(name: string): void {
    onAdd(name);
    setText("");
  }
  return (
    <View>
      <View className="flex-row items-center gap-1.5 rounded-[14px] border-hairline border-checkit-mist-border bg-white p-1.5">
        <View className="h-9 w-9 items-center justify-center">
          <Plus size={18} color="#8A8A8A" strokeWidth={2} />
        </View>
        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={confirm}
          returnKeyType="done"
          placeholder="Adicionar produto"
          placeholderTextColor="#8A8A8A"
          testID="shop-add-input"
          accessibilityLabel="Adicionar produto"
          className="min-w-0 flex-1 text-sm font-medium text-checkit-charcoal-ink"
        />
        <Pressable
          onPress={confirm}
          disabled={!canAdd}
          accessibilityRole="button"
          accessibilityLabel="Confirmar produto"
          accessibilityState={{ disabled: !canAdd }}
          hitSlop={CONFIRM_HIT_SLOP}
          testID="shop-add-confirm"
          className={cn(
            "h-[38px] w-[38px] items-center justify-center rounded-[10px]",
            canAdd ? "bg-checkit-primary" : "bg-checkit-fog-gray",
          )}
        >
          <Check
            size={18}
            color={canAdd ? "#ffffff" : "#8A8A8A"}
            strokeWidth={2.5}
          />
        </Pressable>
      </View>
      {showSuggestions && <SuggestionsBox onSelect={selectSuggestion} />}
    </View>
  );
}
