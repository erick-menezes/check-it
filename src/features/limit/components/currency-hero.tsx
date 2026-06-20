import { formatBRL, formatBRLAmount } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const MAX_LIMIT_DIGITS = 9;

interface CurrencyHeroProps {
  cents: number;
  digits: string;
  onChangeDigits: (raw: string) => void;
}

export function CurrencyHero({
  cents,
  digits,
  onChangeDigits,
}: CurrencyHeroProps) {
  const inputRef = useRef<TextInput>(null);
  const isFilled = cents > 0;

  function focusInput(): void {
    inputRef.current?.focus();
  }

  return (
    <Pressable
      onPress={focusInput}
      accessibilityRole="button"
      accessibilityLabel={`Valor limite ${formatBRL(cents)}, toque para editar`}
      testID="limit-currency-hero"
    >
      <View className="flex-row items-baseline gap-2.5">
        <Text
          className={cn(
            "text-[28px] font-bold text-white",
            isFilled ? "opacity-90" : "opacity-55",
          )}
        >
          R$
        </Text>
        <Text
          className={cn(
            "text-[56px] font-extrabold tabular-nums leading-[56px] tracking-[-2.24px]",
            isFilled ? "text-white" : "text-white/45",
          )}
        >
          {formatBRLAmount(cents)}
        </Text>
        <TextInput
          ref={inputRef}
          value={digits}
          onChangeText={onChangeDigits}
          keyboardType="number-pad"
          autoFocus
          caretHidden
          contextMenuHidden
          maxLength={MAX_LIMIT_DIGITS}
          accessibilityLabel="Editar valor limite"
          testID="limit-hidden-input"
          className="absolute inset-0 p-0 opacity-0"
        />
      </View>
      <View className="mt-1.5 flex-row items-center gap-1.5 opacity-70">
        <Pencil size={12} color="#ffffff" strokeWidth={2} />
        <Text className="text-xs text-white">Toque para editar</Text>
      </View>
    </Pressable>
  );
}
