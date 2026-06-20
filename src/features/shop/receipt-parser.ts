const CENTS_PER_UNIT = 100;
const MIN_QUANTITY = 1;
const PRICE_SEGMENT = /(\d+(?:,\d+)?)\s*(?:UN|KG|LT|PC)?\s*[xX]\s*(\d+,\d{2})/;
const LETTER_PATTERN = /[A-Za-zÀ-ÿ]/;
const LEADING_CODE_TOKEN = /^\d+$/;
const WHITESPACE_RUN = /\s+/;

const FOOTER_FENCES: readonly string[] = [
  'TOTAL',
  'SUBTOTAL',
  'TROCO',
  'DINHEIRO',
  'CARTAO',
  'CARTÃO',
  'PAGAMENTO',
  'VALOR PAGO',
  'VALOR RECEBIDO',
  'DESCONTO',
  'ACRESCIMO',
  'ACRÉSCIMO',
  'TRIBUTOS',
  'ITENS',
  'OBRIGADO',
  'VOLTE SEMPRE',
];

const HEADER_NOISE: readonly string[] = [
  'CNPJ',
  'CPF',
  'CEP',
  'RUA',
  'AV.',
  'AVENIDA',
  'CUPOM',
  'FISCAL',
  'ELETRONICA',
  'ELETRÔNICA',
  'EXTRATO',
  'CODIGO',
  'CÓDIGO',
  'DESCRI',
  'ENDERECO',
  'ENDEREÇO',
  'BAIRRO',
  'CONSUMIDOR',
  'DOCUMENTO',
];

export interface ParsedReceiptItem {
  readonly name: string;
  readonly quantity: number;
  readonly unitPriceInCents: number;
}

interface PriceSegment {
  readonly index: number;
  readonly quantity: number;
  readonly unitPriceInCents: number;
}

function containsAnyKeyword(
  line: string,
  keywords: readonly string[],
): boolean {
  const upper = line.toUpperCase();
  return keywords.some((keyword) => upper.includes(keyword));
}

function hasLetters(value: string): boolean {
  return LETTER_PATTERN.test(value);
}

function parseQuantity(raw: string): number {
  const value = Number.parseFloat(raw.replace(',', '.'));
  if (Number.isNaN(value) || value <= 0) return MIN_QUANTITY;
  return Math.max(MIN_QUANTITY, Math.ceil(value));
}

function parsePriceInCents(raw: string): number {
  const value = Number.parseFloat(raw.replace(',', '.'));
  return Math.round(value * CENTS_PER_UNIT);
}

function matchPriceSegment(line: string): PriceSegment | null {
  const match = PRICE_SEGMENT.exec(line);
  if (!match || match.index === undefined) return null;
  return {
    index: match.index,
    quantity: parseQuantity(match[1]),
    unitPriceInCents: parsePriceInCents(match[2]),
  };
}

function cleanName(value: string): string {
  const tokens = value.trim().split(WHITESPACE_RUN);
  while (tokens.length > 0 && LEADING_CODE_TOKEN.test(tokens[0])) {
    tokens.shift();
  }
  return tokens.join(' ').trim();
}

export function parseReceiptLines(
  lines: readonly string[],
): ParsedReceiptItem[] {
  const items: ParsedReceiptItem[] = [];
  let pendingName: string | null = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') continue;
    if (containsAnyKeyword(line, FOOTER_FENCES)) break;
    if (containsAnyKeyword(line, HEADER_NOISE)) {
      pendingName = null;
      continue;
    }
    const priced = matchPriceSegment(line);
    if (!priced) {
      const name = cleanName(line);
      pendingName = hasLetters(name) ? name : null;
      continue;
    }
    const inlineName = cleanName(line.slice(0, priced.index));
    const name = hasLetters(inlineName) ? inlineName : pendingName;
    pendingName = null;
    if (name === null || !hasLetters(name)) continue;
    items.push({
      name,
      quantity: priced.quantity,
      unitPriceInCents: priced.unitPriceInCents,
    });
  }
  return items;
}
