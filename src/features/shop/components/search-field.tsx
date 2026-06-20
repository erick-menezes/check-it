import { Search } from 'lucide-react-native';
import type { JSX } from 'react';
import { TextInput, View } from 'react-native';

const SEARCH_ICON_SIZE = 16;

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({
  value,
  onChange,
}: SearchFieldProps): JSX.Element {
  return (
    <View className="mt-2 h-[38px] flex-row items-center gap-2 rounded-[10px] bg-checkit-fog-gray px-3">
      <Search size={SEARCH_ICON_SIZE} color="#8A8A8A" strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Pesquisar produto"
        placeholderTextColor="#8A8A8A"
        testID="shop-search-input"
        accessibilityLabel="Pesquisar produto"
        className="flex-1 text-xs text-checkit-charcoal-ink"
      />
    </View>
  );
}
