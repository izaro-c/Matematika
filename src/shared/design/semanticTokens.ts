import {
  THEME_COLOR_VARS,
  type ThemeColorVar,
} from './primitives';

/**
 * Functional color roles for the current visual baseline.
 *
 * The role-to-primitive mapping is intentionally replaceable once a visual
 * direction is chosen.
 */
export const SEMANTIC_COLOR_ROLES = {
  primaryAccent: THEME_COLOR_VARS.salvia,
  secondaryAccent: THEME_COLOR_VARS.pavo,
  definitionAccent: THEME_COLOR_VARS.ocre,
  warningAccent: THEME_COLOR_VARS.terracota,
  neutralStrong: THEME_COLOR_VARS.carbon,
} as const satisfies Record<string, ThemeColorVar>;

export type SemanticColorRole = keyof typeof SEMANTIC_COLOR_ROLES;
