import { describe, expect, it } from 'vitest';
import {
  CONTENT_PAGE_ACCENTS,
  getContentPageAccent,
} from '@/shared/design';

describe('page accents', () => {
  it('assigns an explicit accent to every main editorial page type', () => {
    const types = [
      'axioma',
      'definicion',
      'lema',
      'teorema',
      'corolario',
      'demostracion',
      'metodo',
      'modelo',
      'ejemplo',
      'ejercicio',
      'matematico',
    ];

    expect(types.every(type => CONTENT_PAGE_ACCENTS[type as keyof typeof CONTENT_PAGE_ACCENTS] === getContentPageAccent(type))).toBe(true);
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
    ]);

    expect(Object.values(CONTENT_PAGE_ACCENTS).every((accent) => canonicalTokens.has(accent))).toBe(true);
  });

  it('falls back to carbon for unknown page types', () => {
    expect(getContentPageAccent('desconocido')).toBe('var(--theme-carbon)');
  });
});
