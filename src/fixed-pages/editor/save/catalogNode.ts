import type { FileNode } from '../types/editorContracts';

/**
 * Entrada del catálogo del editor a partir de la ruta y el código fuente de un archivo.
 * La comparten la API de desarrollo (`scripts/editor/viteEditorApiPlugin.ts`) y el
 * almacén local (`localEditorStore.ts`) para que ambos catálogos sean idénticos.
 */

export const CONTENT_TYPE_MAP: Record<string, string> = {
  definitions: 'definicion',
  theorems: 'teorema',
  methods: 'metodo',
  demonstrations: 'demostracion',
  mathematicians: 'matematico',
  examples: 'ejemplo',
  exercises: 'ejercicio',
  usecases: 'caso-de-uso',
  plans: 'plan-de-estudio',
  axioms: 'axioma',
  models: 'modelo',
  'axiomatic-systems': 'sistema-axiomatico',
};

export interface CatalogSourceMetadata {
  title?: string;
  type?: string;
  lang?: string;
  id?: string;
}

export function extractCatalogTitle(source: string, defaultTitle: string): string {
  const match = source.match(/["']title["']\s*:\s*["']([^"']+)["']/);
  if (match?.[1]) return match[1];
  const h1 = source.match(/^#\s+(.+)$/m);
  if (h1?.[1]) return h1[1].trim();
  const h2 = source.match(/^##\s+(.+)$/m);
  if (h2?.[1]) return h2[1].trim();
  return defaultTitle;
}

/** `null` si el archivo no es un documento (.mdx/.md) ni un diagrama (.tsx). */
export function buildCatalogNode(input: {
  path: string;
  source: string;
  meta?: CatalogSourceMetadata;
  reason: string;
}): FileNode | null {
  const { path, source, meta = {}, reason } = input;
  const isMdx = path.endsWith('.mdx') || path.endsWith('.md');
  const isDiagram = path.endsWith('.tsx');
  if (!isMdx && !isDiagram) return null;

  const name = path.split('/').pop() || '';
  const idFromPath = name.replace(/\.(mdx|md|tsx)$/i, '');
  const common = { path, name, capability: 'visual-exact', capabilityLabel: 'Visual exacto', reason } as const;

  if (isMdx) {
    const relParts = path.replace(/^(content\/mdx|docs\/content)\//, '').split('/');
    let lang = meta.lang || 'es';
    let typeDir = relParts[0];
    if (relParts.length > 1 && /^[a-z]{2}(-[A-Z]{2})?$/.test(relParts[0])) {
      lang = relParts[0];
      typeDir = relParts[1];
    }
    const id = meta.id || idFromPath;
    return {
      ...common,
      title: extractCatalogTitle(source, meta.title || id),
      type: meta.type || CONTENT_TYPE_MAP[typeDir] || typeDir || 'content',
      kind: 'mdx-document',
      lang,
      id,
    };
  }

  const category = path.replace(/^content\/diagrams\//, '').split('/')[0] || 'general';
  // El nombre del archivo es la identidad del diagrama; un `"id"` del TSX es de algún objeto de la especificación.
  const id = idFromPath;
  return {
    ...common,
    title: extractCatalogTitle(source, id),
    type: `diagram-${category.toLowerCase()}`,
    kind: 'diagram',
    id,
  };
}
