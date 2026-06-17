import { SETTINGS_ABOUT_ROWS } from '@/features/settings/settings-content';

describe('settings-content', () => {
  it('contains exactly three SOBRE rows', () => {
    expect(SETTINGS_ABOUT_ROWS).toHaveLength(3);
  });

  it('lists the rows in order with verbatim PT-BR labels', () => {
    expect(SETTINGS_ABOUT_ROWS.map((row) => row.label)).toEqual([
      'Central de ajuda',
      'Termos e privacidade',
      'Versão',
    ]);
  });

  it('routes Central de ajuda to /help', () => {
    const help = SETTINGS_ABOUT_ROWS[0];
    expect(help.kind).toBe('navigation');
    expect(help.kind === 'navigation' && help.route).toBe('/help');
  });

  it('routes Termos e privacidade to /terms', () => {
    const terms = SETTINGS_ABOUT_ROWS[1];
    expect(terms.kind).toBe('navigation');
    expect(terms.kind === 'navigation' && terms.route).toBe('/terms');
  });

  it('marks Versão as a non-navigation version row', () => {
    const version = SETTINGS_ABOUT_ROWS[2];
    expect(version.kind).toBe('version');
  });

  it('attaches a leading icon to every row', () => {
    for (const row of SETTINGS_ABOUT_ROWS) {
      expect(row.Icon).toBeDefined();
    }
  });
});
