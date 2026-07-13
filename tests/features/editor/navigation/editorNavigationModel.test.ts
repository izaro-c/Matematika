import { describe, expect, it } from 'vitest';
import type { FileNode } from '../../../../src/features/editor/lib/editorContracts';
import {
  DEFAULT_EDITOR_CATALOG_FILTERS,
  DEFAULT_EDITOR_WORKSPACE_PREFERENCES,
  EDITOR_WORKSPACE_STORAGE_KEY,
  filterCatalogResources,
  readEditorWorkspacePreferences,
  recordRecentPath,
  resourceDisplayName,
  resourceStatus,
  toggleFavoritePath,
  writeEditorWorkspacePreferences,
} from '../../../../src/features/editor/navigation/editorNavigationModel';

const files: FileNode[] = [
  { path: 'database/content/definitions/punto.mdx', name: 'definicion-punto.mdx', type: 'definitions', kind: 'mdx-document', capability: 'visual-exact', capabilityLabel: 'Edición visual exacta', reason: 'Documento lossless.' },
  { path: 'database/content/theorems/tales.mdx', name: 'teorema-tales.mdx', type: 'theorems', kind: 'mdx-document', capability: 'invalid', capabilityLabel: 'Recurso inválido', reason: 'Sintaxis inválida.' },
  { path: 'widgets/diagrams/Definitions/Punto.tsx', name: 'Punto.tsx', type: 'diagram-definitions', kind: 'diagram', capability: 'code-preview', capabilityLabel: 'Edición de código con vista previa', reason: 'TSX autoritativo.' },
];

describe('modelo de navegación del editor', () => {
  it('separa documentos y diagramas y combina nombre, tipo, estado y capacidad', () => {
    expect(filterCatalogResources(files, 'documents', DEFAULT_EDITOR_CATALOG_FILTERS)).toHaveLength(2);
    expect(filterCatalogResources(files, 'diagrams', DEFAULT_EDITOR_CATALOG_FILTERS)).toEqual([files[2]]);
    expect(filterCatalogResources(files, 'documents', { query: 'tales', type: 'theorems', status: 'invalid', capability: 'invalid' })).toEqual([files[1]]);
    expect(filterCatalogResources(files, 'diagrams', { query: 'punto', type: 'diagram-definitions', status: 'attention', capability: 'code-preview' })).toEqual([files[2]]);
    expect(resourceStatus(files[0])).toBe('available');
    expect(resourceStatus(files[2])).toBe('attention');
    expect(resourceDisplayName(files[0])).toBe('Punto');
  });

  it('mantiene recientes sin duplicados y favoritos reversibles', () => {
    expect(recordRecentPath(['a', 'b'], 'b')).toEqual(['b', 'a']);
    expect(recordRecentPath(['a', 'b'], 'c', 2)).toEqual(['c', 'a']);
    expect(toggleFavoritePath(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleFavoritePath(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('persiste un contrato versionado, acota paneles y tolera datos corruptos', () => {
    let stored = '';
    const storage = {
      getItem: (key: string) => key === EDITOR_WORKSPACE_STORAGE_KEY ? stored : null,
      setItem: (_key: string, value: string) => { stored = value; },
    };
    writeEditorWorkspacePreferences({ ...DEFAULT_EDITOR_WORKSPACE_PREFERENCES, level: 'advanced', favoritePaths: ['a'] }, storage);
    expect(readEditorWorkspacePreferences(storage)).toMatchObject({ level: 'advanced', favoritePaths: ['a'] });

    stored = JSON.stringify({ version: 1, navigationWidth: 9000, inspectorWidth: 1, diagnosticsHeight: 9999 });
    expect(readEditorWorkspacePreferences(storage)).toMatchObject({ navigationWidth: 480, inspectorWidth: 280, diagnosticsHeight: 360 });
    stored = '{';
    expect(readEditorWorkspacePreferences(storage)).toEqual(DEFAULT_EDITOR_WORKSPACE_PREFERENCES);
  });
});
