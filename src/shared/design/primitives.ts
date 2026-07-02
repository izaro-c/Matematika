/**
 * Primitive color tokens backed by the current CSS custom properties.
 *
 * These aliases preserve the visual baseline; they do not define a future palette.
 */
export const THEME_COLOR_VARS = {
  lienzo: 'var(--theme-lienzo)',
  carbon: 'var(--theme-carbon)',
  salvia: 'var(--theme-salvia)',
  terracota: 'var(--theme-terracota)',
  pizarra: 'var(--theme-pizarra)',
  ocre: 'var(--theme-ocre)',
  pavo: 'var(--theme-pavo)',
  granada: 'var(--theme-granada)',
  musgo: 'var(--theme-musgo)',
} as const;

export type ThemeColorName = keyof typeof THEME_COLOR_VARS;
export type ThemeColorVar = (typeof THEME_COLOR_VARS)[ThemeColorName];
