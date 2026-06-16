import {
  CircleCheck,
  ListChecks,
  type LucideIcon,
  Wallet,
} from 'lucide-react-native';

export interface OnboardingStepContent {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly Icon: LucideIcon;
}

export const ONBOARDING_STEPS: readonly OnboardingStepContent[] = [
  {
    id: 'welcome',
    kicker: 'Olá, sou seu ajudante!',
    title: 'Suas compras, sob controle.',
    body: 'Seja bem-vindo ao Check.it — descomplique sua lista de compras e saiba exatamente quanto está gastando.',
    Icon: CircleCheck,
  },
  {
    id: 'limite',
    kicker: 'Mais praticidade',
    title: 'Defina um limite e relaxe.',
    body: 'Informe quanto pretende gastar e nós te avisamos antes de estourar o orçamento.',
    Icon: Wallet,
  },
  {
    id: 'listas',
    kicker: 'Tudo num lugar só',
    title: 'Igual fazer no papel,\nporém mais eficiente.',
    body: 'Adicione, marque e filtre produtos. Salve listas e acompanhe seus gastos ao longo do tempo.',
    Icon: ListChecks,
  },
] as const;

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
