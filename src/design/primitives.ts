/**
 * Primitive color tokens — referencias a la fuente canónica en theme.css.
 *
 * Los consumidores DOM usan estas variables directamente. Canvas y workers
 * deben resolverlas en runtime mediante useThemeColors(); no se duplican aquí
 * los pigmentos definidos por los temas claro y oscuro.
 */

// ── CSS variable references ──────────────────────────────────────────────────

export const THEME_COLOR_VARS = {
  lienzo:     'var(--theme-lienzo)',
  carbon:     'var(--theme-carbon)',
  salvia:     'var(--theme-salvia)',
  terracota:  'var(--theme-terracota)',
  pizarra:    'var(--theme-pizarra)',
  ocre:       'var(--theme-ocre)',
  pavo:       'var(--theme-pavo)',
  granada:    'var(--theme-granada)',
  musgo:      'var(--theme-musgo)',
} as const;

export type ThemeColorName = keyof typeof THEME_COLOR_VARS;
export type ThemeColorVar  = (typeof THEME_COLOR_VARS)[ThemeColorName];
