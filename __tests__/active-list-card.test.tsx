import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ActiveList } from '@/features/home/active-list';
import { ActiveListCard } from '@/features/home/components/active-list-card';

const SAMPLE_LIST: ActiveList = {
  id: '1',
  name: 'Compras da semana',
  itemCount: 8,
  createdAt: '2026-06-07T10:00:00.000Z',
  totalInCents: 7350,
  limitInCents: 20000,
  items: [],
};

describe('ActiveListCard', () => {
  it('renders the open badge, name, item count, total and limit', () => {
    render(<ActiveListCard list={SAMPLE_LIST} onOpen={jest.fn()} />);
    expect(screen.getByText('Em aberto')).toBeOnTheScreen();
    expect(screen.getByText('Compras da semana')).toBeOnTheScreen();
    expect(screen.getByText(/8 itens/)).toBeOnTheScreen();
    expect(screen.getByText(/R\$\s*73,50/)).toBeOnTheScreen();
    expect(screen.getByText(/de R\$\s*200,00/)).toBeOnTheScreen();
  });

  it('calls onOpen when the whole card is pressed', () => {
    const onOpen = jest.fn();
    render(<ActiveListCard list={SAMPLE_LIST} onOpen={onOpen} />);
    fireEvent.press(screen.getByTestId('active-list-card'));
    expect(onOpen).toHaveBeenCalled();
  });

  it('shows "Iniciada hoje" when the list was created today', () => {
    const todayList: ActiveList = {
      ...SAMPLE_LIST,
      createdAt: new Date().toISOString(),
    };
    render(<ActiveListCard list={todayList} onOpen={jest.fn()} />);
    expect(screen.getByText('Iniciada hoje')).toBeOnTheScreen();
  });
});
