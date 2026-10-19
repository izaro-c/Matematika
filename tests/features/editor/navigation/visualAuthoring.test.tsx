// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VisualEditorPanel } from '@/fixed-pages/editor/ui/panels/VisualEditorPanel';
import { MetadataInspector } from '@/fixed-pages/editor/ui/components/MetadataInspector';
import { MathProvider, useMathStore } from '@/lib/page-context/MathStoreContext';
import type { Block } from '@/fixed-pages/editor/session/parser';

const blocks: Block[] = [
  { id: 'heading', type: 'heading', content: 'Construcción', metadata: { level: 3, editable: true } },
  { id: 'text', type: 'paragraph', content: '<InteractiveElement target="lado-ab" color="terracota">lado AB</InteractiveElement>', metadata: { editable: true } },
];

const HighlightProbe = () => {
  const highlight = useMathStore(state => state.variables.highlight);
  return <output aria-label="highlight actual">{String(highlight ?? '')}</output>;
};

describe('Visual authoring interactions', () => {
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
    const stepSection = vi.fn();
    const setDiagramBuilderOpen = vi.fn();
    const setActiveDiagramIndex = vi.fn();
    const setEditingBlockId = vi.fn();
    render(
      <MathProvider>
        <VisualEditorPanel
          currentFile="content/mdx/definitions/test.mdx"
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
          relocateBlock={vi.fn()}
          relocateSection={vi.fn()}
          stepSection={stepSection}
          sectionBlocks={id => [id]}
          duplicateBlock={vi.fn()}
          removeBlock={vi.fn()}
          updateBlock={vi.fn()}
          handleTextareaSelect={vi.fn()}
          handleEditLink={vi.fn()}
          setActiveDiagramIndex={setActiveDiagramIndex}
          setActiveDiagramBlockId={vi.fn()}
          setDiagramBuilderOpen={setDiagramBuilderOpen}
          diagramTargets={[{ id: 'lado-ab', label: 'Lado AB', color: 'terracota', kind: 'segment' }]}
        />
      </MathProvider>,
    );

    const indexBtn = screen.queryByRole('button', { name: /Índice/ });
    if (indexBtn) fireEvent.click(indexBtn);
    const outlineNav = screen.queryByRole('navigation', { name: 'Outline del documento' });
    if (outlineNav) expect(outlineNav.textContent).toContain('Construcción');
    expect(screen.queryByRole('navigation', { name: 'Outline responsive del documento' })).toBeNull();
    fireEvent.keyDown(window, { key: '/', ctrlKey: true });
    const dialog = screen.getByRole('dialog', { name: 'Insertar bloque' });
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByRole('option', { name: /Definición formal/ })).toBeTruthy();
    fireEvent.change(within(dialog).getByRole('combobox'), { target: { value: 'casos limite' } });
    fireEvent.click(within(dialog).getByRole('option', { name: /Casos límite/ }));
    expect(addBlock).toHaveBeenCalledWith(2, 'note', expect.stringContaining('casos degenerados'), undefined);

    // ＋ al principio: Enter inserta la primera coincidencia en esa posición.
    fireEvent.click(screen.getByRole('button', { name: 'Insertar un bloque al principio' }));
    const search = within(screen.getByRole('dialog', { name: 'Insertar bloque' })).getByRole('combobox');
    fireEvent.change(search, { target: { value: 'separador' } });
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(addBlock).toHaveBeenLastCalledWith(0, 'separator', '', undefined);

    // «/» sobre un bloque abre la paleta tras él; el diagrama abre el constructor en ese hueco.
    fireEvent.keyDown(screen.getByLabelText(/Bloque 1: heading/), { key: '/' });
    const diagramSearch = within(screen.getByRole('dialog', { name: 'Insertar bloque' })).getByRole('combobox');
    fireEvent.change(diagramSearch, { target: { value: 'simulation' } });
    fireEvent.keyDown(diagramSearch, { key: 'ArrowDown' });
    fireEvent.keyDown(diagramSearch, { key: 'Enter' });
    expect(setActiveDiagramIndex).toHaveBeenCalledWith(1);
    expect(setDiagramBuilderOpen).toHaveBeenCalledWith(true);

    fireEvent.keyDown(screen.getByLabelText(/Bloque 1: heading/), { key: 'ArrowDown', altKey: true, shiftKey: true });
    expect(stepSection).toHaveBeenCalledWith('heading', 1);
    expect(screen.getByRole('button', { name: /mover la sección entera/ })).toBeTruthy();

    fireEvent.keyDown(screen.getByLabelText(/Bloque 2: paragraph/), { key: 'ArrowUp', altKey: true });
    expect(moveBlock).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(screen.getByLabelText(/Bloque 2: paragraph/), { key: 'Enter' });
    expect(setEditingBlockId).toHaveBeenCalledWith('text');
  });

  it('coordinates MDX references with the shared diagram highlight store', () => {
    render(
      <MathProvider>
        <VisualEditorPanel
          currentFile="content/mdx/definitions/test.mdx"
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
          currentFile="content/mdx/axioms/test.mdx"
          metadata={{ id: 'test', type: 'axioma', title: 'Test', description: 'Descripción' }}
          isReadOnly={false} canEditVisualMetadata canMutateVisualStructure blocks={[nestedLinkBlock]}
          editingBlockId={null} setEditingBlockId={vi.fn()} handleMetadataChange={vi.fn()}
          addBlock={vi.fn()} moveBlock={vi.fn()} duplicateBlock={vi.fn()} removeBlock={vi.fn()} updateBlock={vi.fn()}
          handleTextareaSelect={vi.fn()} handleEditLink={handleEditLink} setActiveDiagramIndex={vi.fn()}
          setActiveDiagramBlockId={vi.fn()} setDiagramBuilderOpen={vi.fn()} diagramTargets={[]}
        />
      </MathProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /punto/ }));

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
          currentFile="content/mdx/definitions/test.mdx"
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
    expect(screen.getByText(/Este fragmento se conserva tal cual/)).toBeTruthy();
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
    render(<MathProvider><VisualEditorPanel currentFile="content/mdx/exercises/test.mdx" metadata={{ id: 'test', type: 'ejercicio', title: 'Test', description: 'Descripción' }} isReadOnly={false} canEditVisualMetadata canMutateVisualStructure blocks={[exercise]} editingBlockId={null} setEditingBlockId={vi.fn()} handleMetadataChange={vi.fn()} addBlock={vi.fn()} moveBlock={vi.fn()} duplicateBlock={vi.fn()} removeBlock={vi.fn()} updateBlock={updateBlock} handleTextareaSelect={vi.fn()} handleEditLink={vi.fn()} setActiveDiagramIndex={vi.fn()} setActiveDiagramBlockId={vi.fn()} setDiagramBuilderOpen={vi.fn()} diagramTargets={[]} /></MathProvider>);

    expect(screen.getByText('Pregunta 1')).toBeTruthy();
    expect(screen.getByText('Correcta')).toBeTruthy();
    fireEvent.change(screen.getByDisplayValue('¿Cuál es el resultado?'), { target: { value: '¿Cuál es el valor?' } });
    expect(updateBlock).toHaveBeenCalledWith('exercise-step', expect.stringContaining('texto="¿Cuál es el valor?"'));
  });
});
