import { Clock } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ContactFooter } from '@/features/terms/components/contact-footer';
import {
  LAST_UPDATED_LABEL,
  PRIVACY_SUMMARY,
  TERMS_SUMMARY,
  type TermsTabId,
} from '@/features/terms/terms-content';
import { PrivacySectionList } from './components/privacy-section-list';
import { TermsSectionList } from './components/terms-section-list';

interface DocumentContentProps {
  tab: TermsTabId;
}

export function DocumentContent({ tab }: DocumentContentProps) {
  const summary = tab === 'terms' ? TERMS_SUMMARY : PRIVACY_SUMMARY;
  const SummaryIcon = summary.Icon;
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      testID={`document-content-${tab}`}
    >
      <View className="mb-4 flex-row items-center">
        <Clock size={14} color="#8A8A8A" strokeWidth={2} />
        <Text className="ml-1.5 text-[12px] text-checkit-pebble-gray">
          {LAST_UPDATED_LABEL}
        </Text>
      </View>
      <View className="mb-6 flex-row items-start rounded-[14px] border border-checkit-mist-border bg-checkit-linen-cream p-4">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-[10px] bg-checkit-primary">
          <SummaryIcon size={18} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View className="flex-1">
          <Text className="text-[14px] font-bold text-checkit-charcoal-ink">
            {summary.heading}
          </Text>
          <Text className="mt-1 text-[13px] leading-5 text-checkit-slate-ink">
            {summary.copy}
          </Text>
        </View>
      </View>
      {tab === 'terms' ? <TermsSectionList /> : <PrivacySectionList />}
      <ContactFooter />
    </Animated.View>
  );
}
