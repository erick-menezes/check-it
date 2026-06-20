import { CheckCircle2 } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import type { ReceiptScanState } from '@/features/shop/use-receipt-scan';

const OVERLAY_ICON_SIZE = 34;

export function ScanOverlay({ state }: { state: ReceiptScanState }) {
  if (state.status === 'capturing' || state.status === 'processing') {
    return (
      <View
        testID="receipt-processing"
        className="absolute inset-0 items-center justify-center bg-black/45"
      >
        <ActivityIndicator color="#ffffff" />
        <Text className="mt-2 text-[13px] font-semibold text-white">
          Lendo o cupom…
        </Text>
      </View>
    );
  }
  if (state.status === 'success') {
    return (
      <View
        testID="receipt-success"
        className="absolute inset-0 items-center justify-center bg-black/45"
      >
        <CheckCircle2
          size={OVERLAY_ICON_SIZE}
          color="#ffffff"
          strokeWidth={2}
        />
        <Text className="mt-2 text-[13px] font-semibold text-white">
          {state.count}{' '}
          {state.count === 1 ? 'item adicionado' : 'itens adicionados'}
        </Text>
      </View>
    );
  }
  if (state.status === 'error') {
    return (
      <View
        testID="receipt-error"
        className="absolute inset-0 items-center justify-center bg-black/45 px-6"
      >
        <Text className="text-center text-[13px] font-semibold text-white">
          Não consegui ler o cupom. Tente uma foto mais nítida.
        </Text>
      </View>
    );
  }
  return null;
}
