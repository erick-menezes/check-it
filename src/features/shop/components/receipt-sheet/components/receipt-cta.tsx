import { Camera, RotateCcw } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import type { ReceiptScanState } from '@/features/shop/use-receipt-scan';

const CTA_ICON_SIZE = 18;

interface ReceiptCtaProps {
  granted: boolean;
  cameraReady: boolean;
  busy: boolean;
  state: ReceiptScanState;
  onScan: () => void;
  onReset: () => void;
  onDone: () => void;
}

export function ReceiptCta({
  granted,
  cameraReady,
  busy,
  state,
  onScan,
  onReset,
  onDone,
}: ReceiptCtaProps) {
  if (!granted) return null;
  if (state.status === 'success') {
    return (
      <Pressable
        onPress={onDone}
        accessibilityRole="button"
        accessibilityLabel="Concluir"
        testID="receipt-done"
        className="mt-4 h-[52px] items-center justify-center rounded-xl bg-checkit-primary"
      >
        <Text className="text-[15px] font-bold text-white">Concluir</Text>
      </Pressable>
    );
  }
  if (state.status === 'error') {
    return (
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Tentar de novo"
        testID="receipt-retry"
        className="mt-4 h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-checkit-primary"
      >
        <RotateCcw size={CTA_ICON_SIZE} color="#ffffff" strokeWidth={2} />
        <Text className="text-[15px] font-bold text-white">Tentar de novo</Text>
      </Pressable>
    );
  }
  const disabled = busy || !cameraReady;
  return (
    <Pressable
      onPress={onScan}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Tirar foto do cupom"
      accessibilityState={{ disabled }}
      testID="receipt-capture"
      className="mt-4 h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-checkit-primary disabled:opacity-50"
    >
      {busy ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Camera size={CTA_ICON_SIZE} color="#ffffff" strokeWidth={2} />
      )}
      <Text className="text-[15px] font-bold text-white">
        {busy ? 'Processando…' : 'Tirar foto'}
      </Text>
    </Pressable>
  );
}
