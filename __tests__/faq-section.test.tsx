import { fireEvent, render, screen } from '@testing-library/react-native';
import { FaqSection } from '@/features/help/components/faq-section';
import { HELP_SECTIONS } from '@/features/help/help-content';

const section = HELP_SECTIONS[0];

describe('FaqSection', () => {
  it('renders the label and no tiles when collapsed', () => {
    render(
      <FaqSection section={section} isOpen={false} onToggle={jest.fn()} />,
    );
    expect(screen.getByText(section.label)).toBeOnTheScreen();
    expect(screen.queryByText(section.items[0].question)).toBeNull();
  });

  it('renders every FAQ tile when open', () => {
    render(<FaqSection section={section} isOpen onToggle={jest.fn()} />);
    for (const item of section.items) {
      expect(screen.getByText(item.question)).toBeOnTheScreen();
      expect(screen.getByText(item.answer)).toBeOnTheScreen();
    }
  });

  it('reflects the collapsed state via accessibilityState', () => {
    render(
      <FaqSection section={section} isOpen={false} onToggle={jest.fn()} />,
    );
    const header = screen.getByTestId(`faq-section-${section.id}`);
    expect(header.props.accessibilityState.expanded).toBe(false);
  });

  it('reflects the expanded state via accessibilityState', () => {
    render(<FaqSection section={section} isOpen onToggle={jest.fn()} />);
    const header = screen.getByTestId(`faq-section-${section.id}`);
    expect(header.props.accessibilityState.expanded).toBe(true);
  });

  it('calls onToggle with the section id when pressed', () => {
    const onToggle = jest.fn();
    render(<FaqSection section={section} isOpen={false} onToggle={onToggle} />);
    fireEvent.press(screen.getByTestId(`faq-section-${section.id}`));
    expect(onToggle).toHaveBeenCalledWith(section.id);
  });

  it('keeps a touch target of at least 44px', () => {
    render(
      <FaqSection section={section} isOpen={false} onToggle={jest.fn()} />,
    );
    const header = screen.getByTestId(`faq-section-${section.id}`);
    expect(header.props.className).toContain('min-h-[52px]');
  });
});
