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
  lila:       'var(--theme-lila)',
  cardenal:    'var(--theme-cardenal)',
  nogal:      'var(--theme-nogal)',
  piedra:     'var(--theme-piedra)',
  cromo:      'var(--theme-cromo)',
  // Derived (color-mix)
  modelo:     'var(--theme-modelo)',
  leccion:    'var(--theme-leccion)',
  ejemplo:    'var(--theme-ejemplo)',
  ejercicio:  'var(--theme-ejercicio)',
  matematico: 'var(--theme-matematico)',
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
  terracota: { hex: '#C05C3E', ring: '#D67A60' },
  ocre:      { hex: '#C28A2E', ring: '#CBA05D' },
  granada:   { hex: '#9E3B33', ring: '#B85C5C' },
  musgo:     { hex: '#526E4A', ring: '#708E68' },
  salvia:    { hex: '#5E8066', ring: '#7BA887' },
  pavo:      { hex: '#3A5A7A', ring: '#5E7FA3' },
  pizarra:   { hex: '#5C728A', ring: '#7FA1C2' },
  lila:      { hex: '#83697B', ring: '#A890A3' },
  cardenal:  { hex: '#7A536E', ring: '#9C7790' },
  nogal:     { hex: '#705545', ring: '#8F796B' },
  piedra:    { hex: '#808277', ring: '#9AA096' },
  cromo:     { hex: '#BFA15C', ring: '#CCA86B' },

  // Derived — aproximaciones de los colores mapeados para canvas:
  matematico:{ hex: '#BFA15C', ring: '#CCA86B' }, // cromo
  modelo:     { hex: '#3A5A7A', ring: '#5E7FA3' }, // pavo
  leccion:    { hex: '#705545', ring: '#8F796B' }, // nogal
  ejemplo:    { hex: '#5C728A', ring: '#7FA1C2' }, // pizarra
  ejercicio:  { hex: '#7A536E', ring: '#9C7790' }, // cardenal
} as const;

export type ThemeHexName = keyof typeof THEME_PALETTE_HEX;
