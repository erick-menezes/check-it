import TextRecognition, {
  type TextRecognitionResult,
} from '@react-native-ml-kit/text-recognition';
import type { CameraView } from 'expo-camera';
import { File } from 'expo-file-system';
import { type RefObject, useCallback, useState } from 'react';
import type { NewItemInput } from './list-item';
import { type ParsedReceiptItem, parseReceiptLines } from './receipt-parser';

const CAPTURE_QUALITY = 0.7;

export type ReceiptScanState =
  | { readonly status: 'idle' }
  | { readonly status: 'capturing' }
  | { readonly status: 'processing' }
  | { readonly status: 'success'; readonly count: number }
  | { readonly status: 'error' };

interface UseReceiptScanParams {
  readonly cameraRef: RefObject<CameraView | null>;
  readonly onItemsParsed: (items: readonly NewItemInput[]) => void;
}

export interface ReceiptScan {
  readonly state: ReceiptScanState;
  scan: () => Promise<void>;
  reset: () => void;
}

function toRecognizedLines(result: TextRecognitionResult): string[] {
  const lines = result.blocks.flatMap((block) =>
    block.lines.map((line) => line.text),
  );
  if (lines.length > 0) return lines;
  return result.text.split('\n');
}

function toNewItems(parsed: readonly ParsedReceiptItem[]): NewItemInput[] {
  return parsed.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitPriceInCents: item.unitPriceInCents,
    category: null,
  }));
}

function deletePhoto(uri: string): void {
  try {
    new File(uri).delete();
  } catch (error) {
    console.warn('Failed to delete receipt photo:', error);
  }
}

export function useReceiptScan({
  cameraRef,
  onItemsParsed,
}: UseReceiptScanParams): ReceiptScan {
  const [state, setState] = useState<ReceiptScanState>({ status: 'idle' });
  const reset = useCallback(() => setState({ status: 'idle' }), []);
  const scan = useCallback(async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    setState({ status: 'capturing' });
    try {
      const photo = await camera.takePictureAsync({ quality: CAPTURE_QUALITY });
      if (!photo?.uri) throw new Error('Capture returned no photo');
      setState({ status: 'processing' });
      const result = await TextRecognition.recognize(photo.uri);
      deletePhoto(photo.uri);
      const items = toNewItems(parseReceiptLines(toRecognizedLines(result)));
      if (items.length === 0) {
        setState({ status: 'error' });
        return;
      }
      onItemsParsed(items);
      setState({ status: 'success', count: items.length });
    } catch (reason) {
      console.warn('Receipt scan failed:', reason);
      setState({ status: 'error' });
    }
  }, [cameraRef, onItemsParsed]);
  return { state, scan, reset };
}
