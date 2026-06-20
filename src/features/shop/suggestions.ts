const SUGGESTIONS_POOL: readonly string[] = [
  'Arroz 5kg',
  'Feijão preto',
  'Leite integral',
  'Pão de forma',
  'Café 500g',
  'Açúcar refinado',
  'Óleo de soja',
  'Macarrão',
  'Molho de tomate',
  'Ovos dúzia',
  'Manteiga',
  'Queijo mussarela',
  'Presunto',
  'Banana',
  'Maçã',
  'Tomate',
  'Cebola',
  'Batata',
  'Papel higiênico',
  'Detergente',
  'Sabão em pó',
  'Refrigerante 2L',
];

const SUGGESTIONS_PER_VIEW = 5;

export function getSuggestions(): readonly string[] {
  const shuffled = [...SUGGESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, SUGGESTIONS_PER_VIEW);
}
