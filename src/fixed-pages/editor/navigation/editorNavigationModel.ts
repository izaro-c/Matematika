import type { FileNode } from '../lib/editorContracts';

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

export function resourceDisplayName(file: FileNode): string {
  const clean = file.name
    .replace(/\.(mdx|tsx)$/, '')
    .replace(/^(teorema|lema|corolario|definicion|axioma|ejercicio|ejemplo|modelo)-/, '')
    .replace(/-/g, ' ');
  return clean.replace(/\b\p{L}/gu, letter => letter.toUpperCase());
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
