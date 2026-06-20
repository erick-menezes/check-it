import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  SegmentedControl,
  type SegmentOption,
} from '@/components/ui/segmented-control';

type TabId = 'terms' | 'privacy';

const OPTIONS: readonly SegmentOption<TabId>[] = [
  { id: 'terms', label: 'Termos de uso' },
  { id: 'privacy', label: 'Privacidade' },
];

const TEST_ID = 'terms-tabs';
const MIN_TOUCH_SIZE = 44;
const SEGMENT_HEIGHT = 34;

describe('SegmentedControl', () => {
  it('renders every option label', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="terms"
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Termos de uso')).toBeOnTheScreen();
    expect(screen.getByText('Privacidade')).toBeOnTheScreen();
  });

  it('exposes each segment with the tab accessibility role', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="terms"
        onChange={() => {}}
      />,
    );
    expect(screen.getAllByRole('tab')).toHaveLength(OPTIONS.length);
  });

  it('marks only the selected segment as selected', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="privacy"
        onChange={() => {}}
      />,
    );
    const [terms, privacy] = screen.getAllByRole('tab');
    expect(terms.props.accessibilityState.selected).toBe(false);
    expect(privacy.props.accessibilityState.selected).toBe(true);
  });

  it('fires onChange with the tapped option id', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="terms"
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByText('Privacidade'));
    expect(onChange).toHaveBeenCalledWith('privacy');
  });

  it('does not manage its own selection state', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="terms"
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByText('Privacidade'));
    const [terms, privacy] = screen.getAllByRole('tab');
    expect(terms.props.accessibilityState.selected).toBe(true);
    expect(privacy.props.accessibilityState.selected).toBe(false);
  });

  it('derives per-segment styling hooks from the testID', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="terms"
        onChange={() => {}}
        testID={TEST_ID}
      />,
    );
    expect(screen.getByTestId(`${TEST_ID}-segment-terms`)).toBeOnTheScreen();
    expect(screen.getByTestId(`${TEST_ID}-segment-privacy`)).toBeOnTheScreen();
  });

  it('extends each segment to a comfortable touch target via hitSlop', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        selectedId="terms"
        onChange={() => {}}
      />,
    );
    const [terms] = screen.getAllByRole('tab');
    const effectiveHeight = SEGMENT_HEIGHT + terms.props.hitSlop * 2;
    expect(effectiveHeight).toBeGreaterThanOrEqual(MIN_TOUCH_SIZE);
  });
});
