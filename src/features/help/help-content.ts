import {
  ListChecks,
  type LucideIcon,
  Receipt,
  Wallet,
} from 'lucide-react-native';

export type HelpSectionId = 'listas' | 'limites' | 'gastos';

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface HelpSection {
  readonly id: HelpSectionId;
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly items: readonly FaqItem[];
}

export const HELP_SECTIONS: readonly HelpSection[] = [
  {
    id: 'listas',
    label: 'Listas',
    Icon: ListChecks,
    items: [
      {
        question: 'Como crio uma lista?',
        answer:
          'No início, toque em "Criar lista de compras" e defina um limite de gastos.',
      },
      {
        question: 'Posso editar uma lista salva?',
        answer:
          'Sim, abra a lista em "Listas" e edite cada item quando quiser.',
      },
      {
        question: 'Como compartilhar com alguém?',
        answer:
          'O compartilhamento de listas está a caminho. Por enquanto, suas listas ficam salvas no seu aparelho.',
      },
    ],
  },
  {
    id: 'limites',
    label: 'Limites',
    Icon: Wallet,
    items: [
      {
        question: 'Como definir um limite?',
        answer:
          'Ao criar uma lista, informe quanto pretende gastar no máximo. Te avisamos quando passar.',
      },
      {
        question: 'E se eu ultrapassar?',
        answer:
          'A barra fica vermelha e o app calcula quanto você passou do orçamento.',
      },
    ],
  },
  {
    id: 'gastos',
    label: 'Gastos',
    Icon: Receipt,
    items: [
      {
        question: 'Como vejo o resumo de uma lista?',
        answer:
          'Toque em "Resumo" para ver o total, a divisão por categoria e os itens mais caros.',
      },
      {
        question: 'O app guarda meus preços?',
        answer:
          'Sim. Os preços ficam salvos em cada lista, e o resumo destaca os itens mais caros.',
      },
    ],
  },
] as const;
