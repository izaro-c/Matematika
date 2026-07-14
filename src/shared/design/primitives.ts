/**
 * Primitive color tokens — dos formas de acceder a cada color:
 *
 *   THEME_COLOR_VARS  → 'var(--theme-X)'  — para componentes React/CSS
 *   THEME_PALETTE_HEX → hex estático      — para APIs de canvas y workers
 *
 * Los hex de THEME_PALETTE_HEX corresponden al modo claro (:root).
 * Para modo oscuro en canvas, usar useThemeColors() que lee getComputedStyle.
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

// ── Static hex values (light mode) ──────────────────────────────────────────
//
// ring: versión más clara del color para halos de nodo en canvas.
// Las versiones de modo oscuro se leen en runtime via useThemeColors().

export const THEME_PALETTE_HEX = {
  lienzo:    { hex: '#F8F6F1', ring: '#F8F6F1' },
  carbon:    { hex: '#333333', ring: '#555555' },
  terracota: { hex: '#A94E35', ring: '#D67A60' },
  ocre:      { hex: '#8C641F', ring: '#CBA05D' },
  granada:   { hex: '#9E3B33', ring: '#C26666' },
  musgo:     { hex: '#526E4A', ring: '#7BA173' },
  salvia:    { hex: '#4E7056', ring: '#7BA887' },
  pavo:      { hex: '#3A5A7A', ring: '#6D8FB8' },
  pizarra:   { hex: '#5C728A', ring: '#7FA1C2' },
} as const;

export type ThemeHexName = keyof typeof THEME_PALETTE_HEX;
