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
}

export interface EditorWorkspacePreferences {
  version: 1;
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
};
export const DEFAULT_EDITOR_WORKSPACE_PREFERENCES: EditorWorkspacePreferences = {
  version: 1,
  level: 'basic',
  favoritePaths: [],
  recentPaths: [],
  navigationWidth: 304,
  inspectorWidth: 336,
  diagnosticsHeight: 184,
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

import {
  getContentTypeLabel,
  CONTENT_TYPE_LABELS_SINGULAR,
  CONTENT_TYPE_LABELS_PLURAL,
} from '@/lib/theme/constants';

export const CATEGORY_LABELS_SINGULAR = CONTENT_TYPE_LABELS_SINGULAR;
export const CATEGORY_LABELS_PLURAL = CONTENT_TYPE_LABELS_PLURAL;

export function getCategoryDisplayName(type: string, form: 'singular' | 'plural' = 'singular'): string {
  return getContentTypeLabel(type, form);
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

export function pruneWorkspacePaths(preferences: EditorWorkspacePreferences, files: FileNode[]): EditorWorkspacePreferences {
  const available = new Set(files.map(file => file.path));
  return {
    ...preferences,
    favoritePaths: preferences.favoritePaths.filter(path => available.has(path)),
    recentPaths: preferences.recentPaths.filter(path => available.has(path)),
  };
}

export const EDITOR_PANEL_LIMITS = {
  navigation: { min: MIN_NAVIGATION_WIDTH, max: MAX_NAVIGATION_WIDTH },
  inspector: { min: MIN_INSPECTOR_WIDTH, max: MAX_INSPECTOR_WIDTH },
  diagnostics: { min: MIN_DIAGNOSTICS_HEIGHT, max: MAX_DIAGNOSTICS_HEIGHT },
} as const;
