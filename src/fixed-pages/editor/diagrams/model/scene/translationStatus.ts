import { SOURCE_DOCUMENT_LANG, type DocumentVersion } from '@/fixed-pages/editor/session/conceptVersions';
import type { VisualDiagramModel } from '../types';

function hasText(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasText);
  if (value && typeof value === 'object') return Object.values(value).some(hasText);
  return false;
}

/**
 * Variantes de idioma de un diagrama con el mismo contrato que las versiones de un
 * documento: el castellano es la base y existe siempre; otro idioma existe si
 * `translations[lang]` tiene algún texto (si no, el diagrama hereda el castellano).
 */
export function diagramVersionStatuses(
  translations: VisualDiagramModel['translations'],
  langs: readonly string[],
): DocumentVersion[] {
  return langs.map(lang => ({
    lang,
    status: lang === SOURCE_DOCUMENT_LANG || hasText(translations?.[lang]) ? 'present' : 'missing',
  }));
}
