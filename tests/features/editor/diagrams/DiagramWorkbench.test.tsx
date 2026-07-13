import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiagramWorkbench } from '../../../../src/features/editor/ui/diagrams/DiagramWorkbench';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';

const repositoryMocks = vi.hoisted(() => ({
  readDiagram: vi.fn(),
  saveDiagram: vi.fn(),
  updateMdxImports: vi.fn(),
}));

vi.mock('../../../../src/features/editor/diagrams/persistence/repository', () => ({
  diagramRepository: {
    readDiagram: repositoryMocks.readDiagram,
    saveDiagram: repositoryMocks.saveDiagram,
    updateMdxImports: repositoryMocks.updateMdxImports,
  },
}));

const { readDiagram, saveDiagram, updateMdxImports } = repositoryMocks;

describe('DiagramWorkbench authority adapters', () => {
  beforeEach(() => {
    readDiagram.mockReset();
    saveDiagram.mockReset();
    updateMdxImports.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses initialSource for inline diagrams and does not read an MDX file as a TSX diagram', async () => {
    const initialModel = createTemplateModel('circunferencia', 'Inline Diagram', 'definicion');
    const initialSource = 'export const InlineDiagram = () => <svg data-inline="source" />;\n';
    readDiagram.mockResolvedValueOnce({
      source: 'repository source that must not be used',
      model: createTemplateModel('circunferencia', 'Repository Diagram', 'definicion'),
      version: 'repo-version',
    });

    render(
      <DiagramWorkbench
        isOpen
        mode={{
          kind: 'inline',
          source: initialSource,
          model: initialModel,
        }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByText(/sync:source-authoritative/)).toBeTruthy());
    expect(readDiagram).not.toHaveBeenCalled();
    expect(screen.queryByText('Añadir rápido')).toBeNull();

    const sourceEditor = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(sourceEditor.value).toBe(initialSource);
  });

  it('does not create a template for an existing inline source without a verifiable model', async () => {
    const originalSource = 'export const ManualInline = () => <svg data-manual="source" />;\n';

    render(
      <DiagramWorkbench
        isOpen
        mode={{
          kind: 'inline',
          source: originalSource,
        }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByText(/sync:source-authoritative/)).toBeTruthy());
    expect(screen.queryByText('Añadir rápido')).toBeNull();

    const sourceEditor = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(sourceEditor.value).toBe(originalSource);
  });

  it('loads file diagram source only from the repository', async () => {
    const persistedSource = 'export const Persisted = () => <svg data-source="persisted" />;\n';
    readDiagram.mockResolvedValueOnce({
      source: persistedSource,
      model: null,
      parseStatus: 'code-preview',
      diagnostics: [],
      version: 'repo-version',
    });

    render(
      <DiagramWorkbench
        isOpen
        mode={{
          kind: 'file',
          path: 'src/shared/diagrams/Persisted.tsx',
        }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(readDiagram).toHaveBeenCalledWith('src/shared/diagrams/Persisted.tsx'));
    await waitFor(() => expect(screen.getByText(/sync:source-authoritative/)).toBeTruthy());

    const sourceEditor = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(sourceEditor.value).toBe(persistedSource);
  });

  it('creates a template only in explicit new mode', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'NuevoDiagrama' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getAllByText(/Diagrama interactivo/).length).toBeGreaterThan(0));
    expect(screen.getByText(/sync:visual-authoritative/)).toBeTruthy();
    expect(screen.getByText('Añadir rápido')).toBeTruthy();
  });

  it('does not lose axis, grid, note, mode or category when opening the raw visual model', async () => {
    const model = {
      ...createTemplateModel('circunferencia', 'Campos completos', 'definicion'),
      axis: true,
      grid: true,
      note: 'Overlay conservado',
      mode: 'diagram' as const,
      category: 'Models',
    };
    const generated = generateDiagramSource(model, 'CamposCompletos');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    readDiagram.mockResolvedValueOnce({
      source: generated.source,
      model,
      parseStatus: 'visual-exact',
      diagnostics: [],
      version: 'v1',
    });

    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'file', path: 'widgets/diagrams/Models/CamposCompletos.tsx' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getAllByText(/Campos completos/).length).toBeGreaterThan(0));
    expect((screen.getByLabelText('Cuadrícula') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Ejes') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Código TSX' }));
    const source = (screen.getByRole('textbox') as HTMLTextAreaElement).value;
    expect(source).toContain('Overlay conservado');
    expect(source).toContain('"mode": "diagram"');
    expect(source).toContain('"category": "Models"');
  });
});
