import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { extractResourceIdentity } from './editorNavigationModel';

/**
 * Versiones de idioma de un mismo concepto: los documentos de `content/mdx/{es,eu,en}`
 * que comparten `type` e `id`. El idioma del documento (carpeta o `lang` del frontmatter)
 * es independiente del idioma de la interfaz (`:lang` de la URL).
 */

/** Idioma de referencia de las traducciones: las demás versiones se comparan con él. */
export const SOURCE_DOCUMENT_LANG = 'es';

export type ConceptVersions = Partial<Record<string, string>>;

/** Estado de una versión respecto a la de referencia. */
export type DocumentVersionStatus = 'present' | 'missing' | 'outdated';

export interface DocumentVersion {
  lang: string;
  status: DocumentVersionStatus;
  path?: string;
}

export function documentLang(file: FileNode): string {
  return extractResourceIdentity(file).lang || SOURCE_DOCUMENT_LANG;
}

export function conceptKey(file: FileNode): string {
  return `${file.type}:${extractResourceIdentity(file).conceptId}`;
}

/** Índice concepto → idioma → documento, construido una sola vez a partir del catálogo. */
export function buildConceptIndex(files: readonly FileNode[]): Map<string, Record<string, FileNode>> {
  const index = new Map<string, Record<string, FileNode>>();
  for (const file of files) {
    if (file.kind !== 'mdx-document') continue;
    const key = conceptKey(file);
    const versions = index.get(key) ?? {};
    versions[documentLang(file)] = file;
    index.set(key, versions);
  }
  return index;
}

/**
 * Rutas de las versiones de un concepto por idioma. `type` desambigua cuando dos
 * tipos de contenido reutilizan el mismo `id`; sin él vale cualquier tipo.
 */
export function conceptVersions(files: readonly FileNode[], id: string, type?: string): ConceptVersions {
  const versions: ConceptVersions = {};
  for (const file of files) {
    if (file.kind !== 'mdx-document') continue;
    if (type && file.type !== type) continue;
    if (extractResourceIdentity(file).conceptId !== id) continue;
    versions[documentLang(file)] = file.path;
  }
  return versions;
}

/**
 * Estado de cada idioma (en el orden de `langs`). Una versión está desfasada si su
 * esquema de bloques (`outline` del catálogo) ya no coincide con el de la versión de
 * referencia: se ha añadido, quitado o reordenado un bloque sin trasladarlo.
 */
export function documentVersionStatuses(
  versions: Readonly<Record<string, FileNode>>,
  langs: readonly string[],
): DocumentVersion[] {
  const source = versions[SOURCE_DOCUMENT_LANG];
  return langs.map(lang => {
    const file = versions[lang];
    if (!file) return { lang, status: 'missing' };
    const outdated = lang !== SOURCE_DOCUMENT_LANG
      && source?.outline !== undefined
      && file.outline !== undefined
      && file.outline !== source.outline;
    return { lang, status: outdated ? 'outdated' : 'present', path: file.path };
  });
}

/** Idioma original para traducir `currentLang`: el de referencia o, si falta, otro existente. */
export function translationOriginLang(versions: ConceptVersions, currentLang: string): string | null {
  if (currentLang !== SOURCE_DOCUMENT_LANG && versions[SOURCE_DOCUMENT_LANG]) return SOURCE_DOCUMENT_LANG;
  return Object.keys(versions).find(lang => lang !== currentLang && versions[lang]) ?? null;
}
