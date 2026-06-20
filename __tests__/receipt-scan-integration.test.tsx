import TextRecognition from '@react-native-ml-kit/text-recognition';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { createActiveList } from '@/features/home/active-list';
import { useActiveListStore } from '@/features/home/active-list-store';
import { ActiveListCard } from '@/features/home/components/active-list-card';
import { ReceiptSheet } from '@/features/shop/components/receipt-sheet';

const recognizeMock = TextRecognition.recognize as jest.Mock;

function recognizedReceipt(lines: readonly string[]) {
  return {
    text: lines.join('\n'),
    blocks: [
      {
        text: lines.join('\n'),
        recognizedLanguages: [],
        lines: lines.map((text) => ({
          text,
          elements: [],
          recognizedLanguages: [],
        })),
      },
    ],
  };
}

function ScanHarness() {
  const addItems = useActiveListStore((state) => state.addItems);
  return <ReceiptSheet visible onClose={jest.fn()} onAddItems={addItems} />;
}

beforeEach(() => {
  recognizeMock.mockReset();
  useActiveListStore.setState({
    activeList: createActiveList(20000),
    hasHydrated: true,
  });
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Receipt scan integration', () => {
  it('appends scanned items to the store and the Home card reflects them', async () => {
    recognizeMock.mockResolvedValueOnce(
      recognizedReceipt([
        '001 ARROZ TIPO1 5KG 1 UN x 6,90 6,90',
        '002 FEIJAO PRETO 1KG 2 UN x 8,50 17,00',
        'TOTAL 23,90',
      ]),
    );
    render(<ScanHarness />);
    fireEvent.press(screen.getByTestId('receipt-capture'));
    await waitFor(() =>
      expect(useActiveListStore.getState().activeList?.itemCount).toBe(2),
    );
    const list = useActiveListStore.getState().activeList;
    expect(list?.items.map((item) => item.name)).toEqual([
      'ARROZ TIPO1 5KG',
      'FEIJAO PRETO 1KG',
    ]);
    expect(list?.items.every((item) => item.category === null)).toBe(true);
    expect(list?.items.every((item) => !item.checked)).toBe(true);
    expect(screen.getByText('2 itens adicionados')).toBeOnTheScreen();
    if (!list) throw new Error('expected an active list');
    render(<ActiveListCard list={list} onOpen={jest.fn()} />);
    expect(screen.getByText(/2 itens/)).toBeOnTheScreen();
  });

  it('leaves the store untouched when recognition fails', async () => {
    recognizeMock.mockRejectedValueOnce(new Error('ocr failed'));
    render(<ScanHarness />);
    fireEvent.press(screen.getByTestId('receipt-capture'));
    await waitFor(() =>
      expect(screen.getByTestId('receipt-error')).toBeOnTheScreen(),
    );
    const list = useActiveListStore.getState().activeList;
    expect(list?.itemCount).toBe(0);
    expect(list?.items).toHaveLength(0);
  });
});
