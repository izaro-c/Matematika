import {
  SEMANTIC_COLOR_ROLES,
  type SemanticColorRole,
} from './semanticTokens';
import type { ThemeColorVar } from './primitives';

export type PageAccentType =
  | 'teorema'
  | 'método'
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

export type ContentPageAccentType =
  | 'axioma'
  | 'concepto'
  | 'definicion'
  | 'lema'
  | 'teorema'
  | 'corolario'
  | 'demostracion'
  | 'ejemplo'
  | 'ejercicio'
  | 'caso-de-uso'
  | 'matematico'
  | 'metodo'
  | 'modelo'
  | 'sistema-axiomatico'
  | 'plan-de-estudio';

/**
 * Content types depend on semantic roles, not on palette token names.
 */
export const PAGE_ACCENT_ROLES = {
  teorema: 'theoremAccent',
  método: 'methodAccent',
  definición: 'definitionAccent',
  axioma: 'axiomAccent',
  modelo: 'modelAccent',
  ejemplo: 'exampleAccent',
  ejercicio: 'exerciseAccent',
  demo: 'proofAccent',
  matemático: 'biographyAccent',
  caso_uso: 'lemmaAccent',
  glosario: 'conceptAccent',
  msc2020: 'conceptAccent',
} as const satisfies Record<PageAccentType, SemanticColorRole>;

/**
 * Resolved accents preserve the current baseline and are not a final palette.
 */
export const PAGE_ACCENTS = {
  teorema: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.teorema],
  método: SEMANTIC_COLOR_ROLES[PAGE_ACCENT_ROLES.método],
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

/**
 * Acentos de las páginas de contenido. Los seis tipos editoriales principales
 * conservan colores distintos y todos se resuelven mediante roles semánticos.
 */
export const CONTENT_PAGE_ACCENT_ROLES = {
  axioma: PAGE_ACCENT_ROLES.axioma,
  concepto: 'conceptAccent',
  definicion: PAGE_ACCENT_ROLES.definición,
  lema: 'lemmaAccent',
  teorema: PAGE_ACCENT_ROLES.teorema,
  corolario: 'corollaryAccent',
  demostracion: 'proofAccent',
  ejemplo: PAGE_ACCENT_ROLES.ejemplo,
  ejercicio: PAGE_ACCENT_ROLES.ejercicio,
  'caso-de-uso': 'lemmaAccent',
  matematico: 'biographyAccent',
  metodo: PAGE_ACCENT_ROLES.método,
  modelo: PAGE_ACCENT_ROLES.modelo,
  'sistema-axiomatico': 'neutralStrong',
  'plan-de-estudio': 'secondaryAccent',
} as const satisfies Record<ContentPageAccentType, SemanticColorRole>;

export const CONTENT_PAGE_ACCENTS = Object.fromEntries(
  Object.entries(CONTENT_PAGE_ACCENT_ROLES).map(([type, role]) => [
    type,
    SEMANTIC_COLOR_ROLES[role],
  ]),
) as Record<ContentPageAccentType, ThemeColorVar>;

export function getContentPageAccent(type?: string): ThemeColorVar {
  if (!type || !(type in CONTENT_PAGE_ACCENTS)) {
    return SEMANTIC_COLOR_ROLES.neutralStrong;
  }

  return CONTENT_PAGE_ACCENTS[type as ContentPageAccentType];
}
