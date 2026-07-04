import {
  THEME_COLOR_VARS,
  THEME_PALETTE_HEX,
  type ThemeColorVar,
} from './primitives';

/**
 * Roles funcionales de color. Cambiar la asignación aquí propaga
 * automáticamente a toda la UI (componentes React) y a través de
 * SEMANTIC_HEX también a los grafos canvas.
 */
export const SEMANTIC_COLOR_ROLES = {
  primaryAccent:      THEME_COLOR_VARS.salvia,
  secondaryAccent:    THEME_COLOR_VARS.pavo,
  neutralStrong:      THEME_COLOR_VARS.carbon,
  warningAccent:      THEME_COLOR_VARS.terracota,

  // Editorial principal (acentos únicos para los 11 tipos principales de Matematika)
  axiomAccent:        THEME_COLOR_VARS.ocre,       // ocre
  definitionAccent:   THEME_COLOR_VARS.salvia,     // salvia
  lemmaAccent:        THEME_COLOR_VARS.lila,       // lila
  theoremAccent:      THEME_COLOR_VARS.terracota,  // terracota
  corollaryAccent:    THEME_COLOR_VARS.musgo,      // musgo
  proofAccent:        THEME_COLOR_VARS.granada,    // granada
  lessonAccent:       THEME_COLOR_VARS.nogal,      // nogal
  modelAccent:        THEME_COLOR_VARS.pavo,       // pavo
  exampleAccent:      THEME_COLOR_VARS.pizarra,    // pizarra
  exerciseAccent:     THEME_COLOR_VARS.cardenal,   // cardenal
  biographyAccent:    THEME_COLOR_VARS.cromo,      // cromo

  // Editorial secundario y roles de utilidad
  conceptAccent:      THEME_COLOR_VARS.piedra,     // piedra
  referenceAccent:    THEME_COLOR_VARS.salvia,     // salvia
  foundationalAccent: THEME_COLOR_VARS.ocre,       // ocre
} as const satisfies Record<string, ThemeColorVar>;

export type SemanticColorRole = keyof typeof SEMANTIC_COLOR_ROLES;

/**
 * Hex estáticos (modo claro) por rol semántico.
 * Usados exclusivamente por APIs de canvas que no pueden leer CSS vars.
 * Para canvas reactivo al tema oscuro, ver useThemeColors().
 */
export const SEMANTIC_HEX: Record<SemanticColorRole, { hex: string; ring: string }> = {
  primaryAccent:      THEME_PALETTE_HEX.salvia,
  secondaryAccent:    THEME_PALETTE_HEX.pavo,
  neutralStrong:      THEME_PALETTE_HEX.carbon,
  warningAccent:      THEME_PALETTE_HEX.terracota,

  // Mapeo exacto a las paletas estáticas
  axiomAccent:        THEME_PALETTE_HEX.ocre,
  definitionAccent:   THEME_PALETTE_HEX.salvia,
  lemmaAccent:        THEME_PALETTE_HEX.lila,
  theoremAccent:      THEME_PALETTE_HEX.terracota,
  corollaryAccent:    THEME_PALETTE_HEX.musgo,
  proofAccent:        THEME_PALETTE_HEX.granada,
  lessonAccent:       THEME_PALETTE_HEX.nogal,
  modelAccent:        THEME_PALETTE_HEX.pavo,
  exampleAccent:      THEME_PALETTE_HEX.pizarra,
  exerciseAccent:     THEME_PALETTE_HEX.cardenal,
  biographyAccent:    THEME_PALETTE_HEX.cromo,

  conceptAccent:      THEME_PALETTE_HEX.piedra,
  referenceAccent:    THEME_PALETTE_HEX.salvia,
  foundationalAccent: THEME_PALETTE_HEX.ocre,
};
