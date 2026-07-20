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

  it('opens a code-preview rewrite as a new visual model and only replaces it on save', async () => {
    const legacySource = 'export const LegacyDiagram = () => <svg data-legacy />;\n';
    readDiagram.mockResolvedValueOnce({
      source: legacySource,
      model: null,
      parseStatus: 'code-preview',
      diagnostics: [],
      version: 'legacy-v1',
    });
    saveDiagram.mockResolvedValueOnce({ version: 'visual-v2', backupId: 'backup-legacy' });
    const onConfirm = vi.fn();

    render(
      <DiagramWorkbench
        isOpen
        mode={{
          kind: 'rewrite',
          path: 'src/widgets/diagrams/LegacyDiagram.tsx',
          componentName: 'LegacyDiagram',
          title: 'Diagrama legado',
          template: 'lienzo-inicial',
        }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    await waitFor(() => expect(screen.getByText('Reescritura visual desde cero.')).toBeTruthy());
    expect(screen.getByText('Objetos')).toBeTruthy();
    expect(saveDiagram).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar diagrama' }));

    await waitFor(() => expect(saveDiagram).toHaveBeenCalledWith(
      'src/widgets/diagrams/LegacyDiagram.tsx',
      expect.stringContaining('createDiagramSpec'),
      'legacy-v1',
    ));
    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({
      componentName: 'LegacyDiagram',
      path: 'src/widgets/diagrams/LegacyDiagram.tsx',
    }));
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
    expect(screen.getByText('Objetos')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Punto libre' }));
    await waitFor(() => expect(screen.getByText(/Haga clic una vez en el lugar exacto/)).toBeTruthy());
  });

  it('creates a multi-reference object from manual point selectors', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'ConstruccionManual' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByText('Objetos')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /Añadir objeto/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Punto medio' }));
    fireEvent.change(screen.getByLabelText('Punto 1 para Punto medio'), { target: { value: 'pO' } });
    fireEvent.change(screen.getByLabelText('Punto 2 para Punto medio'), { target: { value: 'pA' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear Punto medio' }));

    await waitFor(() => expect(screen.getAllByText(/midOA/).length).toBeGreaterThan(0));
    expect(screen.getByText(/Seleccione un objeto en el lienzo/)).toBeTruthy();
  });

  it('copies and pastes the selected object without using the code tab', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'DiagramaCopiable' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByText('Objetos')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    await waitFor(() => expect(screen.getByText('Objeto copiado.')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Pegar' }));

    await waitFor(() => expect(screen.getAllByText(/pO_copy/).length).toBeGreaterThan(0));
    expect(screen.getByText(/referencias internas se han actualizado/)).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Código TSX' }).getAttribute('aria-selected')).toBe('false');
  });

  it('separates construction, sequence, MDX links and checks into understandable tasks', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'DiagramaOrganizado' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByRole('tab', { name: /Construir/ }).getAttribute('aria-selected')).toBe('true'));
    expect(screen.getByText('Objetos')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Línea temporal y comportamiento' })).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: /Secuencia/ }));
    expect(screen.getByRole('heading', { name: 'Línea temporal y comportamiento' })).toBeTruthy();
    expect(screen.queryByText('Objetos')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: /Enlaces MDX/ }));
    expect(screen.getByRole('heading', { name: 'Registro estable de targets' })).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: /Comprobar/ }));
    expect(screen.getByText('Comprobación antes de guardar')).toBeTruthy();
    expect(screen.getByText('Referencias del Diagrama')).toBeTruthy();
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
    fireEvent.click(screen.getByRole('button', { name: /Vista/ }));
    expect((screen.getByLabelText('Cuadrícula') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Ejes') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('tab', { name: 'Código TSX' }));
    const source = (screen.getByRole('textbox') as HTMLTextAreaElement).value;
    expect(source).toContain('Overlay conservado');
    expect(source).toContain('"mode": "diagram"');
    expect(source).toContain('"category": "Models"');
  });
});
