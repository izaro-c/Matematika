import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, renderHook, act } from '@testing-library/react';
import type { FileNode } from '../../../../src/fixed-pages/editor/types/editorContracts';
import { useEditorLanding } from '../../../../src/fixed-pages/editor/ui/landing/useEditorLanding';
import { EditorLandingCard } from '../../../../src/fixed-pages/editor/ui/landing/EditorLandingCard';
import { getCategoryDisplayName } from '../../../../src/fixed-pages/editor/session/editorNavigationModel';

// Mock del usageIndex para pruebas deterministas
vi.mock('../../../../src/fixed-pages/editor/diagrams/references/usageIndex', () => ({
  getDiagramUsages: (diagramPath: string) => {
    if (diagramPath.includes('Pitagoras')) {
      return [
        {
          contentId: 'teorema-pitagoras',
          contentPath: 'content/mdx/theorems/teorema-pitagoras.mdx',
          referenceKind: 'Simulation',
        },
        {
          contentId: 'demo-pitagoras-euclides',
          contentPath: 'content/mdx/demonstrations/demo-pitagoras-euclides.mdx',
          referenceKind: 'Simulation',
        },
      ];
    }
    if (diagramPath.includes('AxiomaArquimedes')) {
      return [
        {
          contentId: 'axioma-arquimedes',
          contentPath: 'content/mdx/axioms/axioma-arquimedes.mdx',
          referenceKind: 'Simulation',
        },
      ];
    }
    return [];
  },
}));

// Mock del cliente API para evitar llamadas de red
vi.mock('../../../../src/fixed-pages/editor/save/editorApiClient', () => ({
  editorApiClient: {
    readContent: vi.fn().mockResolvedValue({ source: '' }),
  },
}));

const sampleFiles: FileNode[] = [
  {
    path: 'content/mdx/theorems/teorema-pitagoras.mdx',
    name: 'teorema-pitagoras.mdx',
    type: 'theorems',
    kind: 'mdx-document',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
  {
    path: 'content/mdx/theorems/teorema-tales.mdx',
    name: 'teorema-tales.mdx',
    type: 'theorems',
    kind: 'mdx-document',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
  {
    path: 'content/mdx/axioms/axioma-arquimedes.mdx',
    name: 'axioma-arquimedes.mdx',
    type: 'axioms',
    kind: 'mdx-document',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
  {
    path: 'content/mdx/definitions/angulo.mdx',
    name: 'angulo.mdx',
    type: 'definitions',
    kind: 'mdx-document',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
  {
    path: 'content/diagrams/Teoremas/Pitagoras.tsx',
    name: 'Pitagoras.tsx',
    type: 'diagram-teoremas',
    kind: 'diagram',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
  {
    path: 'content/diagrams/Axiomas/AxiomaArquimedes.tsx',
    name: 'AxiomaArquimedes.tsx',
    type: 'diagram-axiomas',
    kind: 'diagram',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
  {
    path: 'content/diagrams/Definiciones/Angulo.tsx',
    name: 'Angulo.tsx',
    type: 'diagram-definiciones',
    kind: 'diagram',
    capability: 'visual-exact',
    capabilityLabel: 'Editable',
    reason: '',
  },
];

describe('Editor Landing Dynamic Filtering & Categorization', () => {
  describe('getCategoryDisplayName', () => {
    it('translates document categories to Spanish in singular and plural', () => {
      expect(getCategoryDisplayName('theorems', 'plural')).toBe('Teoremas');
      expect(getCategoryDisplayName('theorems', 'singular')).toBe('Teorema');
      expect(getCategoryDisplayName('axioms', 'plural')).toBe('Axiomas');
      expect(getCategoryDisplayName('axioms', 'singular')).toBe('Axioma');
      expect(getCategoryDisplayName('definitions', 'plural')).toBe('Definiciones');
      expect(getCategoryDisplayName('definitions', 'singular')).toBe('Definición');
      expect(getCategoryDisplayName('demonstrations', 'plural')).toBe('Demostraciones');
      expect(getCategoryDisplayName('demonstrations', 'singular')).toBe('Demostración');
      expect(getCategoryDisplayName('axiomatic-systems', 'plural')).toBe('Sistemas axiomáticos');
    });

    it('translates diagram categories stripping diagram- prefix in singular and plural', () => {
      expect(getCategoryDisplayName('diagram-teoremas', 'plural')).toBe('Teoremas');
      expect(getCategoryDisplayName('diagram-teoremas', 'singular')).toBe('Teorema');
      expect(getCategoryDisplayName('diagram-demos', 'plural')).toBe('Demostraciones');
      expect(getCategoryDisplayName('diagram-demos', 'singular')).toBe('Demostración');
      expect(getCategoryDisplayName('diagram-casosuso', 'plural')).toBe('Casos de uso');
      expect(getCategoryDisplayName('diagram-casosuso', 'singular')).toBe('Caso de uso');
    });
  });

  describe('useEditorLanding hook', () => {
    it('returns categories in Spanish plural for documents section', () => {
      const { result } = renderHook(() =>
        useEditorLanding({
          files: sampleFiles,
          section: 'documents',
        })
      );

      const labels = result.current.availableTypes.map(t => t.label);
      expect(labels).toContain('Todos');
      expect(labels).toContain('Teoremas');
      expect(labels).toContain('Axiomas');
      expect(labels).toContain('Definiciones');

      const theorems = result.current.availableTypes.find(t => t.id === 'theorems');
      expect(theorems?.count).toBe(2);
      const total = result.current.availableTypes.find(t => t.id === 'all');
      expect(total?.count).toBe(4);
    });

    it('returns categories in Spanish plural for diagrams section', () => {
      const { result } = renderHook(() =>
        useEditorLanding({
          files: sampleFiles,
          section: 'diagrams',
        })
      );

      const labels = result.current.availableTypes.map(t => t.label);
      expect(labels).toContain('Todos');
      expect(labels).toContain('Teoremas');
      expect(labels).toContain('Axiomas');
      expect(labels).toContain('Definiciones');
    });

    it('adapts category pills when favorites filter is activated and eliminates zero-count categories', () => {
      // Solo Pitágoras y Ángulo son favoritos en documentos
      const favoritePaths = [
        'content/mdx/theorems/teorema-pitagoras.mdx',
        'content/mdx/definitions/angulo.mdx',
      ];

      const { result } = renderHook(() =>
        useEditorLanding({
          files: sampleFiles,
          section: 'documents',
          favoritePaths,
        })
      );

      // Inicialmente sin filtro solo favoritos
      expect(result.current.availableTypes.map(t => t.label)).toEqual([
        'Todos',
        'Axiomas',
        'Definiciones',
        'Teoremas',
      ]);

      // Activar filtro solo favoritos
      act(() => {
        result.current.setOnlyFavorites(true);
      });

      // Axiomas debe desaparecer porque tiene 0 favoritos, Teoremas pasa a 1, Definiciones pasa a 1, Todos pasa a 2
      const favoriteLabels = result.current.availableTypes.map(t => t.label);
      expect(favoriteLabels).toEqual(['Todos', 'Definiciones', 'Teoremas']);
      expect(favoriteLabels).not.toContain('Axiomas');

      const allPill = result.current.availableTypes.find(t => t.id === 'all');
      expect(allPill?.count).toBe(2);

      const theoremPill = result.current.availableTypes.find(t => t.id === 'theorems');
      expect(theoremPill?.count).toBe(1);
    });

    it('resets selectedType to all when the selected category has 0 items under the active filter', () => {
      const favoritePaths = ['content/mdx/definitions/angulo.mdx'];

      const { result } = renderHook(() =>
        useEditorLanding({
          files: sampleFiles,
          section: 'documents',
          favoritePaths,
        })
      );

      // Seleccionar 'theorems'
      act(() => {
        result.current.setSelectedType('theorems');
      });
      expect(result.current.selectedType).toBe('theorems');

      // Activar favoritos (no hay ningún teorema favorito)
      act(() => {
        result.current.setOnlyFavorites(true);
      });

      // Debe resetearse automáticamente a 'all'
      expect(result.current.selectedType).toBe('all');
    });
  });

  describe('EditorLandingCard', () => {
    it('renders single Spanish category label for MDX documents', async () => {
      const docFile = sampleFiles[0];
      await act(async () => {
        render(
          <EditorLandingCard
            file={docFile}
            onOpenFile={vi.fn()}
          />
        );
      });

      expect(screen.getByText('Teorema')).toBeDefined();
    });

    it('renders multiple page type badges and colors for diagrams linked to multiple pages', async () => {
      const diagramFile = sampleFiles[4]; // Pitagoras.tsx -> enlazado a theorems y demonstrations
      await act(async () => {
        render(
          <EditorLandingCard
            file={diagramFile}
            onOpenFile={vi.fn()}
          />
        );
      });

      // Debe mostrar distintivos para ambos tipos de página enlazados
      expect(screen.getByText('Teorema')).toBeDefined();
      expect(screen.getByText('Demostración')).toBeDefined();
    });

    it('renders single linked page type badge for diagram linked to one page', async () => {
      const diagramFile = sampleFiles[5]; // AxiomaArquimedes.tsx -> enlazado solo a axioms
      await act(async () => {
        render(
          <EditorLandingCard
            file={diagramFile}
            onOpenFile={vi.fn()}
          />
        );
      });

      expect(screen.getByText('Axioma')).toBeDefined();
    });

    it('falls back to diagram category when diagram is not linked to any page', async () => {
      const unlinkedDiagram: FileNode = {
        path: 'content/diagrams/Ejercicios/Unlinked.tsx',
        name: 'Unlinked.tsx',
        type: 'diagram-ejercicios',
        kind: 'diagram',
        capability: 'visual-exact',
        capabilityLabel: 'Editable',
        reason: '',
      };

      await act(async () => {
        render(
          <EditorLandingCard
            file={unlinkedDiagram}
            onOpenFile={vi.fn()}
          />
        );
      });

      expect(screen.getByText('Ejercicio')).toBeDefined();
    });
  });
});
