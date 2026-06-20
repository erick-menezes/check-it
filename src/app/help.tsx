import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { FaqSection } from '@/features/help/components/faq-section';
import { HelpHeader } from '@/features/help/components/help-header';
import { SupportBlock } from '@/features/help/components/support-block';
import { HELP_SECTIONS } from '@/features/help/help-content';
import { useHelpAccordion } from '@/features/help/use-help-accordion';

const SCREEN_ANIMATION_DURATION = 240;

export default function HelpScreen() {
  const { openSectionId, toggleSection } = useHelpAccordion();
  return (
    <View testID="help-screen" className="flex-1 bg-white">
      <Stack.Screen
        options={{
          animation: 'simple_push',
          animationDuration: SCREEN_ANIMATION_DURATION,
          gestureEnabled: true,
        }}
      />
      <HelpHeader />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-[22px] pt-4 pb-10"
      >
        <View className="gap-2">
          {HELP_SECTIONS.map((section) => (
            <FaqSection
              key={section.id}
              section={section}
              isOpen={openSectionId === section.id}
              onToggle={toggleSection}
            />
          ))}
        </View>
        <SupportBlock />
      </ScrollView>
    </View>
  );
}
