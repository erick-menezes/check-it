import { Minus, Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import type { HelpSection, HelpSectionId } from '../help-content';
import { FaqTile } from './faq-tile';

interface FaqSectionProps {
  section: HelpSection;
  isOpen: boolean;
  onToggle: (id: HelpSectionId) => void;
}

export function FaqSection({
  section,
  isOpen,
  onToggle,
}: FaqSectionProps) {
  const contentColor = isOpen ? '#FFFFFF' : '#1B1B1B';
  const Indicator = isOpen ? Minus : Plus;
  const { Icon } = section;
  return (
    <Animated.View
      layout={LinearTransition.duration(200)}
      className={cn(
        'overflow-hidden rounded-[14px]',
        isOpen ? 'bg-checkit-primary' : 'bg-checkit-linen-cream',
      )}
    >
      <Pressable
        onPress={() => onToggle(section.id)}
        accessibilityRole="button"
        accessibilityLabel={section.label}
        accessibilityState={{ expanded: isOpen }}
        testID={`faq-section-${section.id}`}
        className="min-h-[52px] flex-row items-center gap-3 px-4"
      >
        <Icon size={20} color={contentColor} strokeWidth={2} />
        <Text
          className={cn(
            'flex-1 text-[13px] font-bold',
            isOpen ? 'text-white' : 'text-checkit-charcoal-ink',
          )}
        >
          {section.label}
        </Text>
        <Indicator size={18} color={contentColor} strokeWidth={2} />
      </Pressable>
      {isOpen && (
        <View className="gap-3 px-4 pb-4">
          {section.items.map((item) => (
            <FaqTile key={item.question} item={item} />
          ))}
        </View>
      )}
    </Animated.View>
  );
}
