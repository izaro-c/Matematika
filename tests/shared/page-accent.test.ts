import { describe, expect, it } from 'vitest';
import {
  CONTENT_PAGE_ACCENTS,
  getContentPageAccent,
} from '@/shared/design';

describe('page accents', () => {
  it('assigns distinct accents to the main editorial page types', () => {
    const types = [
      'axioma',
      'definicion',
      'lema',
      'teorema',
      'corolario',
      'demostracion',
      'leccion',
      'modelo',
      'ejemplo',
      'ejercicio',
      'matematico',
    ];

    expect(new Set(types.map(getContentPageAccent)).size).toBe(types.length);
  });

  it('uses only canonical Arts & Crafts theme variables', () => {
    const canonicalTokens = new Set([
      'var(--theme-carbon)',
      'var(--theme-salvia)',
      'var(--theme-terracota)',
      'var(--theme-pizarra)',
      'var(--theme-ocre)',
      'var(--theme-pavo)',
      'var(--theme-granada)',
      'var(--theme-musgo)',
      'var(--theme-modelo)',
      'var(--theme-leccion)',
      'var(--theme-ejemplo)',
      'var(--theme-ejercicio)',
      'var(--theme-matematico)',
      'var(--theme-lila)',
      'var(--theme-nogal)',
      'var(--theme-cardenal)',
      'var(--theme-piedra)',
      'var(--theme-cromo)',
    ]);

    expect(Object.values(CONTENT_PAGE_ACCENTS).every((accent) => canonicalTokens.has(accent))).toBe(true);
  });

  it('falls back to carbon for unknown page types', () => {
    expect(getContentPageAccent('desconocido')).toBe('var(--theme-carbon)');
  });
});
