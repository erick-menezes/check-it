import { renderHook } from '@testing-library/react-native';
import {
  type EmitterSubscription,
  Keyboard,
  type KeyboardEvent,
} from 'react-native';
import { useKeyboardHeight } from '@/lib/use-keyboard-height';

type KeyboardListener = (event: KeyboardEvent) => void;

const handlers = new Map<string, KeyboardListener>();

function getHandler(needle: string): KeyboardListener {
  for (const [event, handler] of handlers) {
    if (event.includes(needle)) return handler;
  }
  throw new Error(`No keyboard listener registered for "${needle}"`);
}

function emitKeyboardEvent(height: number, duration: number): KeyboardEvent {
  return { endCoordinates: { height }, duration } as unknown as KeyboardEvent;
}

describe('useKeyboardHeight', () => {
  beforeEach(() => {
    handlers.clear();
    jest
      .spyOn(Keyboard, 'addListener')
      .mockImplementation((event: string, handler: KeyboardListener) => {
        handlers.set(event, handler);
        return { remove: jest.fn() } as unknown as EmitterSubscription;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts at zero', () => {
    const { result } = renderHook(() => useKeyboardHeight());
    expect(result.current.value).toBe(0);
  });

  it('tracks the keyboard height when it shows and resets when it hides', () => {
    const { result } = renderHook(() => useKeyboardHeight());
    getHandler('Show')(emitKeyboardEvent(320, 250));
    expect(result.current.value).toBe(320);
    getHandler('Hide')(emitKeyboardEvent(0, 250));
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
