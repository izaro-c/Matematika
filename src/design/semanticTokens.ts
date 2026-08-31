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
  primaryAccent:      THEME_COLOR_VARS.canela,
  secondaryAccent:    THEME_COLOR_VARS.pavo,
  neutralStrong:      THEME_COLOR_VARS.carbon,
  warningAccent:      THEME_COLOR_VARS.terracota,

  // Roles editoriales resueltos con los nueve tokens canónicos.
  axiomAccent:        THEME_COLOR_VARS.ocre,       // ocre (oro)
  definitionAccent:   THEME_COLOR_VARS.musgo,      // musgo (verde)
  lemmaAccent:        THEME_COLOR_VARS.granada,    // granada (burdeos)
  theoremAccent:      THEME_COLOR_VARS.terracota,  // terracota (rojizo cálido)
  corollaryAccent:    THEME_COLOR_VARS.canela,     // canela (naranja)
  proofAccent:        THEME_COLOR_VARS.granada,    // granada
  methodAccent:       THEME_COLOR_VARS.granada,    // granada (carmín / demostración)
  modelAccent:        THEME_COLOR_VARS.pavo,       // pavo (azul)
  exampleAccent:      THEME_COLOR_VARS.canela,     // canela (naranja / aplicación)
  exerciseAccent:     THEME_COLOR_VARS.terracota,  // terracota
  biographyAccent:    THEME_COLOR_VARS.mora,       // mora (púrpura / historia)

  // Editorial secundario y roles de utilidad
  conceptAccent:      THEME_COLOR_VARS.carbon,
  referenceAccent:    THEME_COLOR_VARS.musgo,
  foundationalAccent: THEME_COLOR_VARS.ocre,       // ocre
} as const satisfies Record<string, ThemeColorVar>;

export type SemanticColorRole = keyof typeof SEMANTIC_COLOR_ROLES;
