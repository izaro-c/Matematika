import { describe, expect, it } from 'vitest';
import {
  PAGE_ACCENTS,
  PAGE_ACCENT_ROLES,
  SEMANTIC_COLOR_ROLES,
  THEME_COLOR_VARS,
} from '@/shared/design';
import {
  ALL_TYPES,
  TYPE_COLORS,
  type SearchResult,
} from '@/features/search/lib/searchContracts';

const BASELINE_TYPE_COLORS = {
  teorema: 'var(--theme-terracota)',
  método: 'var(--theme-ocre)',
  definición: 'var(--theme-salvia)',
  axioma: 'var(--theme-ocre)',
  modelo: 'var(--theme-pavo)',
  ejemplo: 'var(--theme-pizarra)',
  ejercicio: 'var(--theme-granada)',
  demo: 'var(--theme-granada)',
  matemático: 'var(--theme-ocre)',
  caso_uso: 'var(--theme-pizarra)',
  glosario: 'var(--theme-carbon)',
  msc2020: 'var(--theme-carbon)',
} as const;

describe('design token contracts', () => {
  it('represents every current CSS theme color variable', () => {
    expect(THEME_COLOR_VARS).toEqual({
      lienzo: 'var(--theme-lienzo)',
      carbon: 'var(--theme-carbon)',
      salvia: 'var(--theme-salvia)',
      terracota: 'var(--theme-terracota)',
      pizarra: 'var(--theme-pizarra)',
      ocre: 'var(--theme-ocre)',
      pavo: 'var(--theme-pavo)',
      granada: 'var(--theme-granada)',
      musgo: 'var(--theme-musgo)',
    });
  });

  it('builds semantic roles exclusively from primitive token values', () => {
    const primitiveValues = new Set(Object.values(THEME_COLOR_VARS));

    for (const [, value] of Object.entries(SEMANTIC_COLOR_ROLES)) {
      expect(primitiveValues.has(value as string), `${value} not in primitives`).toBe(true);
    }
  });

  it('covers every search content type with a primitive-backed accent', () => {
    const primitiveValues = new Set(Object.values(THEME_COLOR_VARS));

    expect(new Set(Object.keys(PAGE_ACCENTS))).toEqual(new Set(ALL_TYPES));
    for (const type of ALL_TYPES) {
      expect(primitiveValues.has(PAGE_ACCENTS[type])).toBe(true);
    }
  });

  it('resolves page accents through replaceable semantic roles', () => {
    for (const type of ALL_TYPES) {
      const role = PAGE_ACCENT_ROLES[type];

      expect(PAGE_ACCENTS[type]).toBe(SEMANTIC_COLOR_ROLES[role]);
    }
  });

  it('preserves the exact search color baseline', () => {
    expect(TYPE_COLORS).toEqual(BASELINE_TYPE_COLORS);
    expect(TYPE_COLORS).toEqual(PAGE_ACCENTS);
  });

  it('gives every SearchResult type an accent', () => {
    const resultTypes: SearchResult['type'][] = ALL_TYPES;

    for (const type of resultTypes) {
      expect(TYPE_COLORS[type]).toBeDefined();
    }
  });
});
