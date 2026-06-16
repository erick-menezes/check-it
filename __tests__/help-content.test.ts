import { HELP_SECTIONS } from '@/features/help/help-content';

describe('help-content', () => {
  it('has exactly three sections in order Listas, Limites, Gastos', () => {
    expect(HELP_SECTIONS.map((section) => section.id)).toEqual([
      'listas',
      'limites',
      'gastos',
    ]);
    expect(HELP_SECTIONS.map((section) => section.label)).toEqual([
      'Listas',
      'Limites',
      'Gastos',
    ]);
  });

  it('has a leading icon for every section', () => {
    for (const section of HELP_SECTIONS) {
      expect(section.Icon).toBeDefined();
    }
  });

  it('has the exact item counts per section (3 / 2 / 2)', () => {
    expect(HELP_SECTIONS.map((section) => section.items.length)).toEqual([
      3, 2, 2,
    ]);
  });

  it('carries the verbatim PT-BR copy for Listas', () => {
    expect(HELP_SECTIONS[0].items).toEqual([
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
    ]);
  });

  it('carries the verbatim PT-BR copy for Limites', () => {
    expect(HELP_SECTIONS[1].items).toEqual([
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
    ]);
  });

  it('carries the verbatim PT-BR copy for Gastos', () => {
    expect(HELP_SECTIONS[2].items).toEqual([
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
    ]);
  });
});
