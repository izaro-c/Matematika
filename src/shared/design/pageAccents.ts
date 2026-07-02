import {
  SEMANTIC_COLOR_ROLES,
  type SemanticColorRole,
} from './semanticTokens';
import type { ThemeColorVar } from './primitives';

export type PageAccentType =
  | 'teorema'
  | 'lección'
  | 'definición'
  | 'ejemplo'
  | 'ejercicio'
  | 'demo'
  | 'glosario'
  | 'matemático'
  | 'caso_uso'
  | 'axioma'
  | 'msc2020'
  | 'modelo';

/**
 * Content types depend on semantic roles, not on palette token names.
 */
export const PAGE_ACCENT_ROLES = {
  teorema: 'primaryAccent',
  lección: 'secondaryAccent',
  definición: 'definitionAccent',
  axioma: 'neutralStrong',
  modelo: 'secondaryAccent',
  ejemplo: 'primaryAccent',
  ejercicio: 'warningAccent',
  demo: 'secondaryAccent',
  matemático: 'definitionAccent',
  caso_uso: 'primaryAccent',
  glosario: 'definitionAccent',
  msc2020: 'secondaryAccent',
} as const satisfies Record<PageAccentType, SemanticColorRole>;

/**
 * Resolved accents preserve the current baseline and are not a final palette.
 */
export const PAGE_ACCENTS = {
  teorema: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.teorema],
  lección: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.lección],
  definición: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.definición],
  axioma: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.axioma],
  modelo: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.modelo],
  ejemplo: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.ejemplo],
  ejercicio: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.ejercicio],
  demo: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.demo],
  matemático: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.matemático],
  caso_uso: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.caso_uso],
  glosario: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.glosario],
  msc2020: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.msc2020],
} as const satisfies Record<PageAccentType, ThemeColorVar>;
