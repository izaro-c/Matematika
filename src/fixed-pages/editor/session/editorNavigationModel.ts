import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';

export type EditorResourceSection = 'documents' | 'diagrams';
export type EditorCatalogStatus = 'available' | 'attention' | 'invalid';
export type EditorCatalogCapability = 'all' | FileNode['capability'];
export type EditorWorkspaceLevel = 'basic' | 'advanced';

export interface EditorCatalogFilters {
  query: string;
  type: string;
  status: 'all' | EditorCatalogStatus;
  capability: EditorCatalogCapability;
  language?: string;
}

export interface EditorWorkspacePreferences {
  version: number;
  level: EditorWorkspaceLevel;
  favoritePaths: string[];
  recentPaths: string[];
  navigationWidth: number;
  inspectorWidth: number;
  diagnosticsHeight: number;
}

export const EDITOR_WORKSPACE_STORAGE_KEY = 'matematika-editor-workspace-v1';
export const DEFAULT_EDITOR_CATALOG_FILTERS: EditorCatalogFilters = {
  query: '',
  type: 'all',
  status: 'all',
  capability: 'all',
  language: 'all',
};
export const DEFAULT_EDITOR_WORKSPACE_PREFERENCES: EditorWorkspacePreferences = {
  version: 1,
  level: 'basic',
  favoritePaths: [],
  recentPaths: [],
  navigationWidth: 304,
  inspectorWidth: 336,
  diagnosticsHeight: 220,
};

const MIN_NAVIGATION_WIDTH = 256;
const MAX_NAVIGATION_WIDTH = 480;
const MIN_INSPECTOR_WIDTH = 280;
const MAX_INSPECTOR_WIDTH = 520;
const MIN_DIAGNOSTICS_HEIGHT = 120;
const MAX_DIAGNOSTICS_HEIGHT = 360;

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0))]
    : [];
}

export function readEditorWorkspacePreferences(storage?: Pick<Storage, 'getItem'>): EditorWorkspacePreferences {
  if (!storage) return DEFAULT_EDITOR_WORKSPACE_PREFERENCES;
  try {
    const raw = storage.getItem(EDITOR_WORKSPACE_STORAGE_KEY);
    if (!raw) return DEFAULT_EDITOR_WORKSPACE_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<EditorWorkspacePreferences>;
    if (parsed.version !== 1) return DEFAULT_EDITOR_WORKSPACE_PREFERENCES;
    return {
      version: 1,
      level: parsed.level === 'advanced' ? 'advanced' : 'basic',
      favoritePaths: stringList(parsed.favoritePaths),
      recentPaths: stringList(parsed.recentPaths).slice(0, 8),
      navigationWidth: clamp(parsed.navigationWidth, MIN_NAVIGATION_WIDTH, MAX_NAVIGATION_WIDTH, DEFAULT_EDITOR_WORKSPACE_PREFERENCES.navigationWidth),
      inspectorWidth: clamp(parsed.inspectorWidth, MIN_INSPECTOR_WIDTH, MAX_INSPECTOR_WIDTH, DEFAULT_EDITOR_WORKSPACE_PREFERENCES.inspectorWidth),
      diagnosticsHeight: clamp(parsed.diagnosticsHeight, MIN_DIAGNOSTICS_HEIGHT, MAX_DIAGNOSTICS_HEIGHT, DEFAULT_EDITOR_WORKSPACE_PREFERENCES.diagnosticsHeight),
    };
  } catch {
    return DEFAULT_EDITOR_WORKSPACE_PREFERENCES;
  }
}

export function writeEditorWorkspacePreferences(
  preferences: EditorWorkspacePreferences,
  storage?: Pick<Storage, 'setItem'>,
): void {
  try {
    storage?.setItem(EDITOR_WORKSPACE_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // El editor sigue siendo utilizable si el navegador bloquea el almacenamiento local.
  }
}

export function resourceSection(file: FileNode): EditorResourceSection {
  return file.kind === 'diagram' ? 'diagrams' : 'documents';
}

export function resourceStatus(file: FileNode): EditorCatalogStatus {
  if (file.capability === 'invalid') return 'invalid';
  if (file.capability === 'code-preview') return 'attention';
  return 'available';
}

const KNOWN_TITLES: Record<string, string> = {
  // Teoremas, lemas y corolarios MDX
  'teorema-pitagoras': 'Teorema de Pitágoras',
  'teorema-tales': 'Teorema de Tales',
  'teorema-angulo-externo': 'Teorema del Ángulo Externo',
  'teorema-angulos-alternos-internos': 'Teorema de los Ángulos Alternos Internos',
  'teorema-angulos-opuestos-verticales': 'Teorema de los Ángulos Opuestos por el Vértice',
  'teorema-area-aditividad': 'Teorema de Aditividad del Área',
  'teorema-area-invariancia': 'Teorema de Invariancia del Área',
  'teorema-area-rectangulo': 'Teorema del Área del Rectángulo',
  'teorema-area-triangulo': 'Teorema del Área del Triángulo',
  'teorema-congruencia-aal': 'Teorema de Congruencia AAL',
  'teorema-congruencia-ala': 'Teorema de Congruencia ALA',
  'teorema-congruencia-lll': 'Teorema de Congruencia LLL',
  'teorema-desigualdad-triangular': 'Teorema de la Desigualdad Triangular',
  'teorema-dos-rectas-un-punto': 'Teorema de la Intersección de Rectas',
  'teorema-existencia-bisectriz': 'Teorema de Existencia de la Bisectriz',
  'teorema-existencia-perpendicular': 'Teorema de Existencia de Perpendicular',
  'teorema-invariancia-triangulacion': 'Teorema de Invariancia por Triangulación',
  'teorema-punto-medio-perpendicular': 'Teorema de la Perpendicular en el Punto Medio',
  'teorema-reciproco-triangulo-isosceles': 'Teorema Recíproco del Triángulo Isósceles',
  'teorema-suma-angulos-triangulo': 'Teorema de la Suma de Ángulos del Triángulo',
  'teorema-triangulacion-poligono': 'Teorema de Triangulación del Polígono',
  'teorema-triangulo-isosceles': 'Teorema del Triángulo Isósceles',
  'lema-punto-medio': 'Lema del Punto Medio',
  'corolario-rectas-coincidentes': 'Corolario de Rectas Coincidentes',

  // Diagramas TSX
  'AngulosOpuestos': 'Ángulos Opuestos por el Vértice',
  'CongruenciaALA': 'Congruencia ALA',
  'CongruenciaLLL': 'Congruencia LLL',
  'DesigualdadTriangular': 'Desigualdad Triangular',
  'DosRectasUnPunto': 'Intersección de dos rectas en un punto',
  'LemaPuntoMedio': 'Lema del Punto Medio',
  'Pitagoras': 'Teorema de Pitágoras',
  'PuntoMedioPerpendicular': 'Perpendicular por el Punto Medio',
  'SumaAngulos': 'Suma de los Ángulos de un Triángulo',
  'Tales': 'Teorema de Tales',
  'TrianguloIsosceles': 'Teorema del Triángulo Isósceles',
};

const ACCENTED_WORDS: Record<string, string> = {
  angulo: 'ángulo',
  angulos: 'ángulos',
  area: 'área',
  areas: 'áreas',
  definicion: 'definición',
  definiciones: 'definiciones',
  demostracion: 'demostración',
  demostraciones: 'demostraciones',
  metodo: 'método',
  metodos: 'métodos',
  isosceles: 'isósceles',
  poligono: 'polígono',
  poligonos: 'polígonos',
  triangulo: 'triángulo',
  triangulos: 'triángulos',
  reciproco: 'recíproco',
  triangulacion: 'triangulación',
};

import { getContentTypeLabel } from '@/lib/theme/constants';

export function getCategoryDisplayName(type: string, form: 'singular' | 'plural' = 'singular', lang?: string): string {
  return getContentTypeLabel(type, form, lang);
}

export function resourceDisplayName(file: FileNode): string {
  if (file.title && file.title.trim()) return file.title;
  const baseName = file.name.replace(/\.(mdx|tsx)$/, '');
  if (KNOWN_TITLES[baseName]) return KNOWN_TITLES[baseName];

  const words = baseName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split('-')
    .map(w => w.trim())
    .filter(Boolean);

  const formatted = words.map((word, index) => {
    const lower = word.toLowerCase();
    const accented = ACCENTED_WORDS[lower] ?? lower;
    if (index > 0 && ['de', 'del', 'la', 'los', 'las', 'en', 'con', 'y', 'un', 'una', 'por', 'el'].includes(lower)) {
      return lower;
    }
    return accented.charAt(0).toUpperCase() + accented.slice(1);
  });

  const result = formatted.join(' ');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function extractResourceIdentity(file: FileNode): { conceptId: string; lang?: string } {
  if (file.id && file.lang) return { conceptId: file.id, lang: file.lang };
  const parts = file.path.split('/');
  const fileName = parts[parts.length - 1] || file.name;
  const baseName = fileName.replace(/\.(mdx|tsx)$/i, '');
  const langMatch = parts.find(p => /^[a-z]{2}(-[A-Z]{2})?$/.test(p));
  return {
    conceptId: file.id || baseName,
    lang: file.lang || langMatch,
  };
}

export function filterCatalogResources(
  files: FileNode[],
  section: EditorResourceSection,
  filters: EditorCatalogFilters,
): FileNode[] {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('es');
  return files.filter(file => {
    if (resourceSection(file) !== section) return false;
    if (filters.type !== 'all' && file.type !== filters.type) return false;
    if (filters.status !== 'all' && resourceStatus(file) !== filters.status) return false;
    if (filters.capability !== 'all' && file.capability !== filters.capability) return false;
    if (filters.language && filters.language !== 'all') {
      const { lang } = extractResourceIdentity(file);
      if (lang && lang !== filters.language) return false;
    }
    if (!normalizedQuery) return true;
    const haystack = `${resourceDisplayName(file)} ${file.name} ${file.path} ${file.type}`.toLocaleLowerCase('es');
    return haystack.includes(normalizedQuery);
  });
}

export function recordRecentPath(paths: string[], path: string, limit = 8): string[] {
  return [path, ...paths.filter(candidate => candidate !== path)].slice(0, limit);
}

export function toggleFavoritePath(paths: string[], path: string): string[] {
  return paths.includes(path) ? paths.filter(candidate => candidate !== path) : [...paths, path];
}

export const EDITOR_PANEL_LIMITS = {
  navigation: { min: MIN_NAVIGATION_WIDTH, max: MAX_NAVIGATION_WIDTH },
  inspector: { min: MIN_INSPECTOR_WIDTH, max: MAX_INSPECTOR_WIDTH },
  diagnostics: { min: MIN_DIAGNOSTICS_HEIGHT, max: MAX_DIAGNOSTICS_HEIGHT },
} as const;

// ---------------------------------------------------------------------------
// URL del editor como fuente de verdad
//
//   /:lang/editor                                   portada (?seccion=diagramas)
//   /:lang/editor/:docLang/:carpeta/:slug           documento de content/mdx
//   /:lang/editor/diagrama/:nombre                  diagrama de content/diagrams
//   /:lang/editor/archivo/<ruta>                    cualquier otro recurso del catálogo
//
// Parámetros: vista=visual|codigo|previa, bloque=<id>, editar=diagrama (superficie
// de diagrama sobre la página), paso=<n|id>, volver=<ruta interna>.
// `:lang` es el idioma de la interfaz; `:docLang` el del documento (siempre explícito,
// para que cambiar el idioma de la interfaz nunca cambie el archivo abierto).
// La URL se deriva SOLO de la ruta del archivo: `id`, `type` y `lang` del catálogo
// salen de heurísticas sobre el código fuente y pueden repetirse.
// ---------------------------------------------------------------------------

export type EditorUrlViewMode = 'visual' | 'code' | 'preview';

export const EDITOR_DIAGRAM_SEGMENT = 'diagrama';
export const EDITOR_GENERIC_SEGMENT = 'archivo';

const VIEW_MODE_TO_URL: Record<EditorUrlViewMode, string> = { visual: 'visual', code: 'codigo', preview: 'previa' };
const URL_TO_VIEW_MODE: Record<string, EditorUrlViewMode> = { visual: 'visual', codigo: 'code', previa: 'preview' };

export interface EditorUrlState {
  uiLang: string;
  /** Ruta del corpus del archivo abierto. `null` → portada. */
  path?: string | null;
  viewMode?: EditorUrlViewMode;
  blockId?: string | null;
  /** Superficie de diagrama abierta sobre la página MDX (diagrama en línea o nuevo). */
  diagramSurface?: boolean;
  step?: string | null;
  returnTo?: string | null;
  section?: EditorResourceSection;
}

export type EditorRoute =
  | { status: 'landing'; section: EditorResourceSection }
  | { status: 'not-found'; requested: string }
  | {
      status: 'file';
      path: string;
      viewMode: EditorUrlViewMode;
      blockId: string | null;
      diagramSurface: boolean;
      step: string | null;
      returnTo: string | null;
    };

/** Segmentos de URL (tras `/editor/`) que identifican un archivo del corpus. */
export function editorRouteSegmentsForPath(path: string): string[] {
  const parts = path.split('/').filter(Boolean);
  const name = parts[parts.length - 1] ?? '';
  if (parts[0] === 'content' && parts[1] === 'mdx' && parts.length === 5 && name.endsWith('.mdx')) {
    return [parts[2], parts[3], name.replace(/\.mdx$/, '')];
  }
  if (parts[0] === 'content' && parts[1] === 'diagrams' && name.endsWith('.tsx')) {
    return [EDITOR_DIAGRAM_SEGMENT, name.replace(/\.tsx$/, '')];
  }
  return [EDITOR_GENERIC_SEGMENT, ...parts];
}

function isDiagramPath(path: string): boolean {
  return path.endsWith('.tsx');
}

/** Solo rutas internas absolutas (evita redirecciones abiertas con `//host` o `https:`). */
export function sanitizeReturnPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null;
  return value;
}

function editorSegments(pathname: string): string[] | null {
  const parts = pathname.split('?')[0].split('/').filter(Boolean).map(part => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });
  const index = parts.indexOf('editor');
  return index === -1 ? null : parts.slice(index + 1);
}

export function editorUrlFromState(state: EditorUrlState): string {
  const base = `/${state.uiLang}/editor`;
  const params = new URLSearchParams();

  if (!state.path) {
    if (state.section === 'diagrams') params.set('seccion', 'diagramas');
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  }

  const path = `${base}/${editorRouteSegmentsForPath(state.path).map(encodeURIComponent).join('/')}`;
  if (state.viewMode && state.viewMode !== 'visual') params.set('vista', VIEW_MODE_TO_URL[state.viewMode]);
  if (state.blockId) params.set('bloque', state.blockId);
  if (state.diagramSurface && !isDiagramPath(state.path)) params.set('editar', 'diagrama');
  if (state.step) params.set('paso', state.step);
  const returnTo = sanitizeReturnPath(state.returnTo);
  if (returnTo) params.set('volver', returnTo);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function editorStateFromUrl(
  location: { pathname: string; search?: string },
  files: ReadonlyArray<Pick<FileNode, 'path'>>,
): EditorRoute {
  const segments = editorSegments(location.pathname) ?? [];
  const params = new URLSearchParams(location.search ?? '');

  if (segments.length === 0) {
    const section = params.get('seccion') || params.get('section') || params.get('tab');
    return { status: 'landing', section: section === 'diagramas' || section === 'diagrams' || section === 'diagram' ? 'diagrams' : 'documents' };
  }

  const requested = segments.join('/');
  const key = (file: Pick<FileNode, 'path'>) => editorRouteSegmentsForPath(file.path).join('/');
  let match = files.find(file => key(file) === requested);
  if (!match && segments[0] === EDITOR_DIAGRAM_SEGMENT) {
    const lower = requested.toLowerCase();
    match = files.find(file => isDiagramPath(file.path) && key(file).toLowerCase() === lower);
  }
  if (!match) return { status: 'not-found', requested };

  const view = URL_TO_VIEW_MODE[params.get('vista') ?? ''] ?? 'visual';
  return {
    status: 'file',
    path: match.path,
    viewMode: view,
    blockId: params.get('bloque') || null,
    diagramSurface: !isDiagramPath(match.path) && params.get('editar') === 'diagrama',
    step: params.get('paso') || null,
    returnTo: sanitizeReturnPath(params.get('volver')),
  };
}

/**
 * Identidad del «lugar» de edición: cambia al pasar a otro archivo o al abrir/cerrar la
 * superficie de diagrama, pero no con la vista, el bloque o el paso. Sirve para decidir
 * si atrás/adelante debe avisar de cambios sin guardar.
 */
export function editorDocumentKey(location: { pathname: string; search?: string }): string {
  const segments = editorSegments(location.pathname);
  if (!segments) return `outside:${location.pathname}`;
  const params = new URLSearchParams(location.search ?? '');
  return `${segments.join('/')}${params.get('editar') === 'diagrama' ? '#diagrama' : ''}`;
}
