import { parseReceiptLines } from '@/features/shop/receipt-parser';

describe('parseReceiptLines', () => {
  it('extracts items from well-formed combined cupom lines', () => {
    const lines = [
      'SUPERMERCADO EXEMPLO LTDA',
      'CNPJ: 12.345.678/0001-90',
      'RUA DAS FLORES, 100',
      'CUPOM FISCAL ELETRONICO - SAT',
      'ITEM CODIGO DESCRICAO QTD UN VL UNIT VL ITEM',
      '001 7891234567890 ARROZ TIPO1 5KG 1 UN x 6,90 6,90',
      '002 7899876543210 FEIJAO PRETO 1KG 2 UN x 8,50 17,00',
      'TOTAL R$ 23,90',
      'DINHEIRO 30,00',
      'TROCO 6,10',
    ];
    expect(parseReceiptLines(lines)).toEqual([
      { name: 'ARROZ TIPO1 5KG', quantity: 1, unitPriceInCents: 690 },
      { name: 'FEIJAO PRETO 1KG', quantity: 2, unitPriceInCents: 850 },
    ]);
  });

  it('uses the previous line as the name on two-line item entries', () => {
    const lines = [
      'HORTIFRUTI BOM PRECO',
      'CNPJ 11.111.111/0001-11',
      '001 BANANA PRATA',
      '2,000 KG x 5,49 10,98',
      'TOTAL 10,98',
    ];
    expect(parseReceiptLines(lines)).toEqual([
      { name: 'BANANA PRATA', quantity: 2, unitPriceInCents: 549 },
    ]);
  });

  it('rounds fractional weighed quantities up and keeps the unit price', () => {
    const lines = ['TOMATE ITALIANO', '0,750 KG x 12,00 9,00'];
    expect(parseReceiptLines(lines)).toEqual([
      { name: 'TOMATE ITALIANO', quantity: 1, unitPriceInCents: 1200 },
    ]);
  });

  it('accepts UN, LT and PC unit tokens with upper or lower case x', () => {
    const lines = [
      '001 LEITE INTEGRAL 1LT 3 LT x 4,29 12,87',
      '002 SABONETE 90G 5 PC X 1,99 9,95',
    ];
    expect(parseReceiptLines(lines)).toEqual([
      { name: 'LEITE INTEGRAL 1LT', quantity: 3, unitPriceInCents: 429 },
      { name: 'SABONETE 90G', quantity: 5, unitPriceInCents: 199 },
    ]);
  });

  it('stops at the footer and never reads totals or payment lines as items', () => {
    const lines = [
      '001 CAFE TORRADO 500G 1 UN x 14,90 14,90',
      'TOTAL 14,90',
      'CARTAO 1 UN x 14,90 14,90',
      'TROCO 0,00',
    ];
    expect(parseReceiptLines(lines)).toEqual([
      { name: 'CAFE TORRADO 500G', quantity: 1, unitPriceInCents: 1490 },
    ]);
  });

  it('ignores priced lines that have no confident name', () => {
    expect(parseReceiptLines(['1 UN x 2,00 2,00'])).toEqual([]);
  });

  it('returns an empty array for unreadable garbage input', () => {
    const lines = ['#@!%&*', '......', '0000 1111 2222', '???'];
    expect(parseReceiptLines(lines)).toEqual([]);
  });

  it('returns an empty array when nothing was recognized', () => {
    expect(parseReceiptLines([])).toEqual([]);
  });
});
