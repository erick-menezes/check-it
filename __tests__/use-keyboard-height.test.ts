import { renderHook } from '@testing-library/react-native';
import { type EmitterSubscription, Keyboard } from 'react-native';
import { useKeyboardHeight } from '@/lib/use-keyboard-height';

type Handler = (event: {
  endCoordinates: { height: number };
  duration?: number;
}) => void;

const handlers = new Map<string, Handler>();

function getHandler(needle: string): Handler {
  for (const [event, handler] of handlers) {
    if (event.includes(needle)) return handler;
  }
  throw new Error(`No keyboard listener registered for "${needle}"`);
}

beforeEach(() => {
  handlers.clear();
  jest
    .spyOn(Keyboard, 'addListener')
    .mockImplementation((event: string, handler: Handler) => {
      handlers.set(event, handler);
      return { remove: jest.fn() } as unknown as EmitterSubscription;
    });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useKeyboardHeight', () => {
  it('starts at zero', () => {
    const { result } = renderHook(() => useKeyboardHeight());
    expect(result.current.value).toBe(0);
  });

  it('tracks the keyboard height when it shows and resets when it hides', () => {
    const { result } = renderHook(() => useKeyboardHeight());
    getHandler('Show')({ endCoordinates: { height: 320 }, duration: 250 });
    expect(result.current.value).toBe(320);
    getHandler('Hide')({ endCoordinates: { height: 0 }, duration: 250 });
    expect(result.current.value).toBe(0);
  });

  it('removes both listeners on unmount', () => {
    const removers: jest.Mock[] = [];
    jest.spyOn(Keyboard, 'addListener').mockImplementation(() => {
      const remove = jest.fn();
      removers.push(remove);
      return { remove } as unknown as EmitterSubscription;
    });
    const { unmount } = renderHook(() => useKeyboardHeight());
    unmount();
    expect(removers).toHaveLength(2);
    for (const remove of removers) {
      expect(remove).toHaveBeenCalledTimes(1);
    }
  });
});
