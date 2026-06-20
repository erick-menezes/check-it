import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { DocumentContent } from '@/features/terms/components/document-content';
import { TermsHeader } from '@/features/terms/components/terms-header';
import { TERMS_TABS, type TermsTabId } from '@/features/terms/terms-content';

export default function TermsScreen() {
  const [activeTab, setActiveTab] = useState<TermsTabId>('terms');
  return (
    <View testID="terms-screen" className="flex-1 bg-white">
      <Stack.Screen
        options={{
          animation: 'simple_push',
          animationDuration: 240,
          gestureEnabled: true,
        }}
      />
      <TermsHeader />
      <View className="px-[22px] pb-4 pt-4">
        <SegmentedControl
          options={TERMS_TABS}
          selectedId={activeTab}
          onChange={setActiveTab}
          testID="terms-tabs"
        />
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-[22px] pb-10"
      >
        <DocumentContent key={activeTab} tab={activeTab} />
      </ScrollView>
    </View>
  );
}
