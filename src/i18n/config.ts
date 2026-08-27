import type { LanguageConfig, RouteSegmentMap } from './types';
import { esLanguage } from './languages/es';
import { euLanguage } from './languages/eu';
import { enLanguage } from './languages/en';

/**
 * Registro central de idiomas soportados.
 * Para añadir un nuevo idioma, basta con crear su archivo en `languages/`
 * y añadirlo a este array.
 */
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  esLanguage,
  euLanguage,
  enLanguage,
];

export const DEFAULT_LANGUAGE = esLanguage;

export function getLanguage(code?: string | null): LanguageConfig {
  if (!code) return DEFAULT_LANGUAGE;
  const found = SUPPORTED_LANGUAGES.find((lang) => lang.code.toLowerCase() === code.toLowerCase());
  return found || DEFAULT_LANGUAGE;
}

export function isSupportedLanguage(code?: string | null): boolean {
  if (!code) return false;
  return SUPPORTED_LANGUAGES.some((lang) => lang.code.toLowerCase() === code.toLowerCase());
}

/** Mapa global inverso de segmentos de ruta (en cualquier idioma) hacia su clave canónica */
export const SEGMENT_TO_CANONICAL_TYPE: Record<string, keyof RouteSegmentMap> = {};
SUPPORTED_LANGUAGES.forEach((lang) => {
  Object.entries(lang.routeSegments).forEach(([key, seg]) => {
    SEGMENT_TO_CANONICAL_TYPE[seg.toLowerCase()] = key as keyof RouteSegmentMap;
  });
});
// Aliases comunes adicionales
SEGMENT_TO_CANONICAL_TYPE['metodos'] = 'metodo';
SEGMENT_TO_CANONICAL_TYPE['metodoak'] = 'metodo';
SEGMENT_TO_CANONICAL_TYPE['methods'] = 'metodo';
SEGMENT_TO_CANONICAL_TYPE['proofs'] = 'demo';
SEGMENT_TO_CANONICAL_TYPE['theorems'] = 'teorema';
SEGMENT_TO_CANONICAL_TYPE['definitions'] = 'definicion';
SEGMENT_TO_CANONICAL_TYPE['exercises'] = 'ejercicio';
SEGMENT_TO_CANONICAL_TYPE['examples'] = 'ejemplo';
SEGMENT_TO_CANONICAL_TYPE['sistema-axiomatico'] = 'sistema';
SEGMENT_TO_CANONICAL_TYPE['sistemas-axiomaticos'] = 'sistema';
SEGMENT_TO_CANONICAL_TYPE['sistemas'] = 'sistema';
SEGMENT_TO_CANONICAL_TYPE['caso-de-uso'] = 'caso';
SEGMENT_TO_CANONICAL_TYPE['casos-de-uso'] = 'caso';
SEGMENT_TO_CANONICAL_TYPE['use-cases'] = 'caso';
SEGMENT_TO_CANONICAL_TYPE['casos'] = 'caso';
SEGMENT_TO_CANONICAL_TYPE['construccion'] = 'construccion';
SEGMENT_TO_CANONICAL_TYPE['eraikuntzan'] = 'construccion';
SEGMENT_TO_CANONICAL_TYPE['under-construction'] = 'construccion';

export function getCanonicalSegmentType(segment: string): keyof RouteSegmentMap | undefined {
  return SEGMENT_TO_CANONICAL_TYPE[segment.toLowerCase()];
}

