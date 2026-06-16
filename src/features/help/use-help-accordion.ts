import { useCallback, useState } from 'react';
import { HELP_SECTIONS, type HelpSectionId } from './help-content';

const FIRST_SECTION_ID = HELP_SECTIONS[0].id;

export interface HelpAccordion {
  readonly openSectionId: HelpSectionId | null;
  toggleSection: (id: HelpSectionId) => void;
}

export function useHelpAccordion(): HelpAccordion {
  const [openSectionId, setOpenSectionId] = useState<HelpSectionId | null>(
    FIRST_SECTION_ID,
  );
  const toggleSection = useCallback((id: HelpSectionId) => {
    setOpenSectionId((current) => (current === id ? null : id));
  }, []);
  return { openSectionId, toggleSection };
}
