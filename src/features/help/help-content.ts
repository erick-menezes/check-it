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
          'Sim, abra a lista em "Listas" e edite cada item. Suas alterações ficam sincronizadas.',
      },
      {
        question: 'Como compartilhar com alguém?',
        answer:
          'Dentro da lista, toque no ícone de compartilhar para gerar um link ou convidar por e-mail.',
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
        question: 'Como ver gastos por mês?',
        answer:
          'Vá em "Resumo" para ver gráficos, médias e itens que mais subiram de preço.',
      },
      {
        question: 'O app guarda meus preços?',
        answer:
          'Sim. Comparamos preços entre listas, mostrando se um produto está mais caro.',
      },
    ],
  },
] as const;
