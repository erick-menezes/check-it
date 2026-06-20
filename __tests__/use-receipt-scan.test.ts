import TextRecognition from '@react-native-ml-kit/text-recognition';
import { act, renderHook } from '@testing-library/react-native';
import type { CameraView } from 'expo-camera';
import type { RefObject } from 'react';
import type { NewItemInput } from '@/features/shop/list-item';
import { useReceiptScan } from '@/features/shop/use-receipt-scan';

const recognizeMock = TextRecognition.recognize as jest.Mock;

function makeCameraRef(
  takePictureAsync: jest.Mock,
): RefObject<CameraView | null> {
  return {
    current: { takePictureAsync },
  } as unknown as RefObject<CameraView | null>;
}

function recognizedSingleLine(text: string) {
  return {
    text,
    blocks: [
      {
        text,
        recognizedLanguages: [],
        lines: [{ text, elements: [], recognizedLanguages: [] }],
      },
    ],
  };
}

describe('useReceiptScan', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    recognizeMock.mockReset();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('parses recognized lines and reports the items-added count on success', async () => {
    const take = jest.fn().mockResolvedValue({ uri: 'file:///receipt.jpg' });
    recognizeMock.mockResolvedValueOnce(
      recognizedSingleLine('001 ARROZ 5KG 1 UN x 6,90 6,90'),
    );
    const onItemsParsed = jest.fn<void, [readonly NewItemInput[]]>();
    const { result } = renderHook(() =>
      useReceiptScan({ cameraRef: makeCameraRef(take), onItemsParsed }),
    );
    await act(async () => {
      await result.current.scan();
    });
    expect(onItemsParsed).toHaveBeenCalledWith([
      { name: 'ARROZ 5KG', quantity: 1, unitPriceInCents: 690, category: null },
    ]);
    expect(result.current.state).toEqual({ status: 'success', count: 1 });
  });

  it('transitions to error and leaves the store untouched when OCR throws', async () => {
    const take = jest.fn().mockResolvedValue({ uri: 'file:///receipt.jpg' });
    recognizeMock.mockRejectedValueOnce(new Error('ocr failed'));
    const onItemsParsed = jest.fn();
    const { result } = renderHook(() =>
      useReceiptScan({ cameraRef: makeCameraRef(take), onItemsParsed }),
    );
    await act(async () => {
      await result.current.scan();
    });
    expect(result.current.state).toEqual({ status: 'error' });
    expect(onItemsParsed).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      'Receipt scan failed:',
      expect.any(Error),
    );
  });

  it('transitions to error when the parse yields no purchasable lines', async () => {
    const take = jest.fn().mockResolvedValue({ uri: 'file:///receipt.jpg' });
    recognizeMock.mockResolvedValueOnce(recognizedSingleLine('TOTAL 10,00'));
    const onItemsParsed = jest.fn();
    const { result } = renderHook(() =>
      useReceiptScan({ cameraRef: makeCameraRef(take), onItemsParsed }),
    );
    await act(async () => {
      await result.current.scan();
    });
    expect(result.current.state).toEqual({ status: 'error' });
    expect(onItemsParsed).not.toHaveBeenCalled();
  });

  it('stays idle when there is no camera to capture from', async () => {
    const onItemsParsed = jest.fn();
    const { result } = renderHook(() =>
      useReceiptScan({ cameraRef: { current: null }, onItemsParsed }),
    );
    await act(async () => {
      await result.current.scan();
    });
    expect(result.current.state).toEqual({ status: 'idle' });
    expect(recognizeMock).not.toHaveBeenCalled();
  });

  it('resets back to idle for a retry', async () => {
    const take = jest.fn().mockResolvedValue({ uri: 'file:///receipt.jpg' });
    recognizeMock.mockRejectedValueOnce(new Error('ocr failed'));
    const { result } = renderHook(() =>
      useReceiptScan({
        cameraRef: makeCameraRef(take),
        onItemsParsed: jest.fn(),
      }),
    );
    await act(async () => {
      await result.current.scan();
    });
    expect(result.current.state.status).toBe('error');
    act(() => {
      result.current.reset();
    });
    expect(result.current.state).toEqual({ status: 'idle' });
  });
});
