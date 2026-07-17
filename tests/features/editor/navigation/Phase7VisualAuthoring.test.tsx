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
    const setEditingBlockId = vi.fn();
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
          setEditingBlockId={setEditingBlockId}
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

    fireEvent.click(screen.getByRole('button', { name: /Índice/ }));
    expect(screen.getByRole('navigation', { name: 'Outline del documento' }).textContent).toContain('Construcción');
    expect(screen.queryByRole('navigation', { name: 'Outline responsive del documento' })).toBeNull();
    fireEvent.keyDown(window, { key: '/', ctrlKey: true });
    const dialog = screen.getByRole('dialog', { name: 'Insertar bloque' });
    expect(dialog).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText(/Buscar bloque/), { target: { value: 'Casos límite' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /Casos límite/ }));
    expect(addBlock).toHaveBeenCalledWith(2, 'note', expect.stringContaining('casos degenerados'), undefined);

    fireEvent.keyDown(screen.getByLabelText(/Bloque 2: paragraph/), { key: 'ArrowUp', altKey: true });
    expect(moveBlock).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(screen.getByLabelText(/Bloque 2: paragraph/), { key: 'Enter' });
    expect(setEditingBlockId).toHaveBeenCalledWith('text');
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
    reference.focus();
    fireEvent.keyDown(reference, { key: 'Enter' });
    expect(reference.getAttribute('role')).toBe('button');
  });

  it('keeps the owning block identity when editing a nested semantic link', () => {
    const handleEditLink = vi.fn((
      _blockId: string,
      _rawMarkup: string,
      _text: string,
      _attrs: Record<string, unknown>,
      _tag: string,
      event: React.MouseEvent,
    ) => event.stopPropagation());
    const nestedLinkBlock: Block = {
      id: 'paragraph-with-link',
      type: 'paragraph',
      content: '<InteractiveElement target="pP" color="terracota"><ConceptLink targetId="punto">punto</ConceptLink></InteractiveElement>',
      metadata: { editable: true },
    };

    render(
      <MathProvider>
        <VisualEditorPanel
          currentFile="database/content/axioms/test.mdx"
          metadata={{ id: 'test', type: 'axioma', title: 'Test', description: 'Descripción' }}
          isReadOnly={false} canEditVisualMetadata canMutateVisualStructure blocks={[nestedLinkBlock]}
          editingBlockId={null} setEditingBlockId={vi.fn()} handleMetadataChange={vi.fn()}
          addBlock={vi.fn()} moveBlock={vi.fn()} duplicateBlock={vi.fn()} removeBlock={vi.fn()} updateBlock={vi.fn()}
          handleTextareaSelect={vi.fn()} handleEditLink={handleEditLink} setActiveDiagramIndex={vi.fn()}
          setActiveDiagramBlockId={vi.fn()} setDiagramBuilderOpen={vi.fn()} diagramTargets={[]}
        />
      </MathProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /punto\. Concepto: punto/ }));

    expect(handleEditLink).toHaveBeenCalledWith(
      'paragraph-with-link',
      '<InteractiveElement target="pP" color="terracota"><ConceptLink targetId="punto">punto</ConceptLink></InteractiveElement>',
      'punto',
      expect.objectContaining({ targetId: 'punto', highlightTarget: 'pP', highlightColor: 'terracota' }),
      'ConceptLink',
      expect.anything(),
    );
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

  it('edits nested exercise questions as visual fields instead of raw JSX', () => {
    const updateBlock = vi.fn();
    const exercise: Block = {
      id: 'exercise-step',
      type: 'exercise',
      content: `Planteamiento.\n<Pregunta id="q1" correct="a" texto="¿Cuál es el resultado?" opciones={[{ value: 'a', texto: '$2$' }, { value: 'b', texto: '$3$' }]} />`,
      metadata: { editable: true, id: 'p1', numero: 1, titulo: 'Cálculo' },
    };
    render(<MathProvider><VisualEditorPanel currentFile="database/content/exercises/test.mdx" metadata={{ id: 'test', type: 'ejercicio', title: 'Test', description: 'Descripción' }} isReadOnly={false} canEditVisualMetadata canMutateVisualStructure blocks={[exercise]} editingBlockId={null} setEditingBlockId={vi.fn()} handleMetadataChange={vi.fn()} addBlock={vi.fn()} moveBlock={vi.fn()} duplicateBlock={vi.fn()} removeBlock={vi.fn()} updateBlock={updateBlock} handleTextareaSelect={vi.fn()} handleEditLink={vi.fn()} setActiveDiagramIndex={vi.fn()} setActiveDiagramBlockId={vi.fn()} setDiagramBuilderOpen={vi.fn()} diagramTargets={[]} /></MathProvider>);

    expect(screen.getByText('Pregunta 1')).toBeTruthy();
    expect(screen.getByText('Correcta')).toBeTruthy();
    fireEvent.change(screen.getByDisplayValue('¿Cuál es el resultado?'), { target: { value: '¿Cuál es el valor?' } });
    expect(updateBlock).toHaveBeenCalledWith('exercise-step', expect.stringContaining('texto="¿Cuál es el valor?"'));
  });
});
