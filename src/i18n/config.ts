import type { LanguageConfig, RouteSegmentMap } from './types';
import { esLanguage } from './languages/es';
import { euLanguage } from './languages/eu';

/**
 * Registro central de idiomas soportados.
 * Para añadir un nuevo idioma, basta con crear su archivo en `languages/`
 * y añadirlo a este array.
 */
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  esLanguage,
  euLanguage,
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

export function getCanonicalSegmentType(segment: string): keyof RouteSegmentMap | undefined {
  return SEGMENT_TO_CANONICAL_TYPE[segment.toLowerCase()];
}
