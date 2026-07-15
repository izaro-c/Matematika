import {
  THEME_COLOR_VARS,
  type ThemeColorVar,
} from './primitives';

/**
 * Roles funcionales de color. Cambiar la asignación aquí propaga
 * automáticamente a toda la UI. Los grafos canvas resuelven estas mismas
 * variables en runtime mediante useThemeColors().
 */
export const SEMANTIC_COLOR_ROLES = {
  primaryAccent:      THEME_COLOR_VARS.salvia,
  secondaryAccent:    THEME_COLOR_VARS.pavo,
  neutralStrong:      THEME_COLOR_VARS.carbon,
  warningAccent:      THEME_COLOR_VARS.terracota,

  // Roles editoriales resueltos con los nueve tokens canónicos.
  axiomAccent:        THEME_COLOR_VARS.ocre,       // ocre
  definitionAccent:   THEME_COLOR_VARS.musgo,
  lemmaAccent:        THEME_COLOR_VARS.granada,
  theoremAccent:      THEME_COLOR_VARS.terracota,  // terracota
  corollaryAccent:    THEME_COLOR_VARS.salvia,
  proofAccent:        THEME_COLOR_VARS.granada,    // granada
  methodAccent:       THEME_COLOR_VARS.ocre,
  modelAccent:        THEME_COLOR_VARS.pavo,       // pavo
  exampleAccent:      THEME_COLOR_VARS.pizarra,    // pizarra
  exerciseAccent:     THEME_COLOR_VARS.granada,
  biographyAccent:    THEME_COLOR_VARS.salvia,

  // Editorial secundario y roles de utilidad
  conceptAccent:      THEME_COLOR_VARS.carbon,
  referenceAccent:    THEME_COLOR_VARS.musgo,     // salvia
  foundationalAccent: THEME_COLOR_VARS.ocre,       // ocre
} as const satisfies Record<string, ThemeColorVar>;

export type SemanticColorRole = keyof typeof SEMANTIC_COLOR_ROLES;
