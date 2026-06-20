import { View } from 'react-native';
import { DocumentSection } from '@/features/terms/components/document-section';
import { PRIVACY_SECTIONS } from '@/features/terms/terms-content';

export function PrivacySectionList() {
  return (
    <View>
      {PRIVACY_SECTIONS.map((section) => (
        <DocumentSection
          key={section.title}
          Icon={section.Icon}
          title={section.title}
          body={section.body}
        />
      ))}
    </View>
  );
}
