import { View } from 'react-native';
import { DocumentSection } from '@/features/terms/components/document-section';
import { TERMS_SECTIONS } from '@/features/terms/terms-content';

export function TermsSectionList() {
  return (
    <View>
      {TERMS_SECTIONS.map((section, index) => (
        <DocumentSection
          key={section.title}
          number={index + 1}
          title={section.title}
          body={section.body}
        />
      ))}
    </View>
  );
}
