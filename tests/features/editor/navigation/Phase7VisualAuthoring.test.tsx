// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VisualEditorPanel } from '@/features/editor/ui/panels/VisualEditorPanel';
import { MetadataInspector } from '@/features/editor/ui/components/MetadataInspector';
import { MathProvider, useMathStore } from '@/shared/lib/MathStoreContext';
import type { Block } from '@/features/editor/core/parser';

const blocks: Block[] = [
  { id: 'heading', type: 'heading', content: 'Construcción', metadata: { level: 3, editable: true } },
  { id: 'text', type: 'paragraph', content: '<InteractiveElement target="lado-ab" color="terracota">lado AB</InteractiveElement>', metadata: { editable: true } },
];

const HighlightProbe = () => {
  const highlight = useMathStore(state => state.variables.highlight);
  return <output aria-label="highlight actual">{String(highlight ?? '')}</output>;
};

describe('Phase 7 visual authoring interactions', () => {
  it('adapts metadata fields to the page type and keeps the public ID immutable', () => {
    render(<MetadataInspector metadata={{ id: 'teorema-fijo', type: 'teorema', title: 'Teorema', description: '', statement: '' }}
      onChange={vi.fn()} onRemove={vi.fn()} onAddCustom={vi.fn()} />);
    expect((screen.getByDisplayValue('teorema-fijo') as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByText('Enunciado formal')).toBeTruthy();
    expect(screen.getByText('Demostraciones')).toBeTruthy();
  });

  it('offers outline, quick command, complete presets and keyboard reordering', () => {
    const addBlock = vi.fn();
    const moveBlock = vi.fn();
    render(
      <MathProvider>
        <VisualEditorPanel
          currentFile="database/content/definitions/test.mdx"
          metadata={{ id: 'test', type: 'definicion', title: 'Test', description: 'Descripción', subtype: 'nominal' }}
          isReadOnly={false}
          canEditVisualMetadata
          canMutateVisualStructure
          blocks={blocks}
          editingBlockId={null}
          setEditingBlockId={vi.fn()}
          handleMetadataChange={vi.fn()}
          addBlock={addBlock}
          moveBlock={moveBlock}
          duplicateBlock={vi.fn()}
          removeBlock={vi.fn()}
          updateBlock={vi.fn()}
          handleTextareaSelect={vi.fn()}
          handleEditLink={vi.fn()}
          setActiveDiagramIndex={vi.fn()}
          setActiveDiagramBlockId={vi.fn()}
          setDiagramBuilderOpen={vi.fn()}
          diagramTargets={[{ id: 'lado-ab', label: 'Lado AB', color: 'terracota', kind: 'segment' }]}
        />
      </MathProvider>,
    );

    expect(screen.getByRole('navigation', { name: 'Outline del documento' }).textContent).toContain('Construcción');
    expect(screen.getByRole('navigation', { name: 'Outline responsive del documento' }).textContent).toContain('Construcción');
    fireEvent.keyDown(window, { key: '/', ctrlKey: true });
    const dialog = screen.getByRole('dialog', { name: 'Insertar bloque' });
    expect(dialog).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText(/Buscar bloque/), { target: { value: 'Casos límite' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /Casos límite/ }));
    expect(addBlock).toHaveBeenCalledWith(2, 'note', expect.stringContaining('casos degenerados'), undefined);

    fireEvent.keyDown(screen.getByLabelText(/Bloque 2: paragraph/), { key: 'ArrowUp', altKey: true });
    expect(moveBlock).toHaveBeenCalledWith(1, 0);
  });

  it('coordinates MDX references with the shared diagram highlight store', () => {
    render(
      <MathProvider>
        <VisualEditorPanel
          currentFile="database/content/definitions/test.mdx"
          metadata={{ id: 'test', type: 'definicion', title: 'Test', description: 'Descripción', subtype: 'nominal' }}
          isReadOnly={false} canEditVisualMetadata canMutateVisualStructure blocks={blocks}
          editingBlockId={null} setEditingBlockId={vi.fn()} handleMetadataChange={vi.fn()}
          addBlock={vi.fn()} moveBlock={vi.fn()} duplicateBlock={vi.fn()} removeBlock={vi.fn()} updateBlock={vi.fn()}
          handleTextareaSelect={vi.fn()} handleEditLink={vi.fn()} setActiveDiagramIndex={vi.fn()}
          setActiveDiagramBlockId={vi.fn()} setDiagramBuilderOpen={vi.fn()}
          diagramTargets={[{ id: 'lado-ab', label: 'Lado AB', color: 'terracota', kind: 'segment' }]}
        />
        <HighlightProbe />
      </MathProvider>,
    );
    const reference = screen.getByText('lado AB');
    fireEvent.mouseEnter(reference);
    expect(screen.getByLabelText('highlight actual').textContent).toBe('lado-ab');
    fireEvent.mouseLeave(reference);
    expect(screen.getByLabelText('highlight actual').textContent).toBe('');
  });

  it('preserves unknown MDX as source-only instead of exposing a false visual editor', () => {
    render(
      <MathProvider>
        <VisualEditorPanel
          currentFile="database/content/definitions/test.mdx"
          metadata={{ id: 'test', type: 'definicion', title: 'Test', description: 'Descripción', subtype: 'nominal' }}
          isReadOnly={false} canEditVisualMetadata canMutateVisualStructure
          blocks={[...blocks, { id: 'future', type: 'advancedMdx', content: '<FutureWidget keep={{ nested: true }} />', metadata: { preserved: true } }]}
          editingBlockId={null} setEditingBlockId={vi.fn()} handleMetadataChange={vi.fn()}
          addBlock={vi.fn()} moveBlock={vi.fn()} duplicateBlock={vi.fn()} removeBlock={vi.fn()} updateBlock={vi.fn()}
          handleTextareaSelect={vi.fn()} handleEditLink={vi.fn()} setActiveDiagramIndex={vi.fn()}
          setActiveDiagramBlockId={vi.fn()} setDiagramBuilderOpen={vi.fn()} diagramTargets={[]}
        />
      </MathProvider>,
    );
    expect(screen.getByText(/Bloque desconocido preservado byte a byte/)).toBeTruthy();
    expect(screen.queryByDisplayValue('<FutureWidget keep={{ nested: true }} />')).toBeNull();
  });
});
