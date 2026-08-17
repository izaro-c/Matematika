import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorLandingView } from '../../../../src/fixed-pages/editor/ui/landing/EditorLandingView';
import { VisualEditorPanel } from '../../../../src/fixed-pages/editor/ui/panels/VisualEditorPanel';
import { MathProviderBoundary } from '../../../../src/lib/page-context/MathStoreContext';

describe('Editor Loading UX states', () => {
  describe('EditorLandingView', () => {
    it('shows loading skeletons and message when isLoading is true without showing premature empty text', () => {
      render(
        <EditorLandingView
          files={[]}
          isLoading={true}
          onOpenFile={vi.fn()}
          onCreateDocument={vi.fn()}
          onCreateDiagram={vi.fn()}
        />
      );

      // Loading state indicator should be present
      expect(screen.getByText('Cargando contenido…')).toBeDefined();
      expect(screen.getByRole('status', { name: 'Cargando elementos' })).toBeDefined();

      // Should NOT show "No se encontraron elementos" or "No se encontraron resultados"
      expect(screen.queryByText('No se encontraron elementos')).toBeNull();
      expect(screen.queryByText('No se encontraron resultados')).toBeNull();
    });

    it('shows friendly empty state when isLoading is false and catalog is truly empty', () => {
      render(
        <EditorLandingView
          files={[]}
          isLoading={false}
          onOpenFile={vi.fn()}
          onCreateDocument={vi.fn()}
          onCreateDiagram={vi.fn()}
        />
      );

      // Should show friendly onboarding empty state without technical jargon
      expect(screen.getByText('Aún no hay documentos')).toBeDefined();
      expect(screen.queryByText('Cargando contenido…')).toBeNull();
    });
  });

  describe('VisualEditorPanel', () => {
    it('shows document loading skeleton when isLoading is true without premature empty state', () => {
      render(
        <MathProviderBoundary>
          <VisualEditorPanel
            currentFile="/test/doc.mdx"
            isLoading={true}
            metadata={{ title: 'Teorema de Pitágoras', type: 'teorema' }}
            isReadOnly={false}
            canEditVisualMetadata={true}
            canMutateVisualStructure={true}
            blocks={[]}
            editingBlockId={null}
            setEditingBlockId={vi.fn()}
            handleMetadataChange={vi.fn()}
            addBlock={vi.fn()}
            moveBlock={vi.fn()}
            duplicateBlock={vi.fn()}
            removeBlock={vi.fn()}
            updateBlock={vi.fn()}
            handleTextareaSelect={vi.fn()}
            handleEditLink={vi.fn()}
            setActiveDiagramIndex={vi.fn()}
            setActiveDiagramBlockId={vi.fn()}
            setDiagramBuilderOpen={vi.fn()}
            diagramTargets={[]}
          />
        </MathProviderBoundary>
      );

      // Should show loading status indicator and skeleton container
      expect(screen.getByText('Cargando contenido…')).toBeDefined();
      expect(screen.getByRole('status', { name: 'Cargando documento' })).toBeDefined();

      // Should NOT show "El documento está vacío" or "Esta página no tiene contenido todavía"
      expect(screen.queryByText('El documento está vacío. Añada contenido.')).toBeNull();
      expect(screen.queryByText('Esta página no tiene contenido todavía')).toBeNull();
    });

    it('shows friendly empty state when isLoading is false and blocks is empty', () => {
      render(
        <MathProviderBoundary>
          <VisualEditorPanel
            currentFile="/test/doc.mdx"
            isLoading={false}
            metadata={{ title: 'Nuevo Documento', type: 'teorema' }}
            isReadOnly={false}
            canEditVisualMetadata={true}
            canMutateVisualStructure={true}
            blocks={[]}
            editingBlockId={null}
            setEditingBlockId={vi.fn()}
            handleMetadataChange={vi.fn()}
            addBlock={vi.fn()}
            moveBlock={vi.fn()}
            duplicateBlock={vi.fn()}
            removeBlock={vi.fn()}
            updateBlock={vi.fn()}
            handleTextareaSelect={vi.fn()}
            handleEditLink={vi.fn()}
            setActiveDiagramIndex={vi.fn()}
            setActiveDiagramBlockId={vi.fn()}
            setDiagramBuilderOpen={vi.fn()}
            diagramTargets={[]}
          />
        </MathProviderBoundary>
      );

      // Should show friendly empty state
      expect(screen.getByText('Esta página no tiene contenido todavía')).toBeDefined();
      expect(screen.getByRole('button', { name: 'Añadir Párrafo' })).toBeDefined();
      expect(screen.queryByText('Cargando contenido…')).toBeNull();
    });
  });
});
