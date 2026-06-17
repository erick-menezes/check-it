import { CircleHelp, Info, type LucideIcon, Tag } from 'lucide-react-native';

export type AboutRowKind = 'navigation' | 'version';

interface BaseAboutRow {
  readonly id: string;
  readonly label: string;
  readonly Icon: LucideIcon;
}

interface NavigationAboutRow extends BaseAboutRow {
  readonly kind: 'navigation';
  readonly route: '/help' | '/terms';
}

interface VersionAboutRow extends BaseAboutRow {
  readonly kind: 'version';
}

export type AboutRow = NavigationAboutRow | VersionAboutRow;

export const SETTINGS_ABOUT_ROWS: readonly AboutRow[] = [
  {
    id: 'help',
    kind: 'navigation',
    label: 'Central de ajuda',
    Icon: CircleHelp,
    route: '/help',
  },
  {
    id: 'terms',
    kind: 'navigation',
    label: 'Termos e privacidade',
    Icon: Info,
    route: '/terms',
  },
  {
    id: 'version',
    kind: 'version',
    label: 'Versão',
    Icon: Tag,
  },
] as const;
