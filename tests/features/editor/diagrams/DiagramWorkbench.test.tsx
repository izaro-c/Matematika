import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiagramWorkbench } from '../../../../src/features/editor/diagrams/ui/DiagramWorkbench';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model';
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
    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Punto medio' })[0]);
    fireEvent.change(screen.getByLabelText('Punto 1 para Punto medio'), { target: { value: 'pO' } });
    fireEvent.change(screen.getByLabelText('Punto 2 para Punto medio'), { target: { value: 'pA' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear Punto medio' }));

    await waitFor(() => expect(screen.getAllByText(/midOA/).length).toBeGreaterThan(0));
    expect(screen.getAllByText(/Punto · Punto medio/).length).toBeGreaterThan(0);
  });

  it('asks for confirmation in a dialog before deleting the selected object', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'DiagramaBorrable' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByText('Objetos')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar elemento' }));
    expect(screen.getByRole('dialog', { name: /¿Eliminar pO\?/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    await waitFor(() => expect(screen.queryByText(/pO/)).toBeNull());
  });

  it('exposes copy and paste controls in the header on narrow viewports', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'DiagramaMovil' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByText('Objetos')).toBeTruthy());
    const clipboardGroup = screen.getByLabelText('Copiar y pegar objetos');
    expect(clipboardGroup.className).not.toMatch(/\bhidden\b/);
    expect(within(clipboardGroup).getByRole('button', { name: 'Copiar selección' })).toBeTruthy();
    expect(within(clipboardGroup).getByRole('button', { name: 'Pegar selección' })).toBeTruthy();
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
    fireEvent.click(screen.getByRole('button', { name: 'Copiar selección' }));
    await waitFor(() => expect(screen.getByText('Objeto copiado.')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Pegar selección' }));

    await waitFor(() => expect(screen.getAllByText(/pO_copy/).length).toBeGreaterThan(0));
    expect(screen.getByText(/referencias internas se han actualizado/)).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Código TSX' }).getAttribute('aria-selected')).toBe('false');
  });

  it('copies and pastes several explicitly selected objects as one coherent selection', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'DiagramaMultiseleccion' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Objetos' })).toBeTruthy());
    fireEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar A' }));
    expect(screen.getByText('2 seleccionados')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Copiar objetos seleccionados' }));
    await waitFor(() => expect(screen.getByText('2 objetos copiados.')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Pegar selección' }));

    await waitFor(() => expect(screen.getByText('2 objeto(s) pegado(s). Las referencias internas se han actualizado.')).toBeTruthy());
    expect(screen.getByText('2 seleccionados')).toBeTruthy();
    expect(screen.getAllByText(/pO_copy/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/pA_copy/).length).toBeGreaterThan(0);
  });

  it('organizes the left panel into independent object, organization and diagram tabs', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'DiagramaConPaneles' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Objetos' }).getAttribute('aria-selected')).toBe('true'));
    expect(screen.getByLabelText('Árbol de escena por capas')).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Organizar' }));
    expect(screen.getByRole('tab', { name: 'Organizar' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.click(screen.getByRole('tab', { name: 'Diagrama' }));
    expect(screen.getByText('Información bajo el título')).toBeTruthy();
    expect(screen.getByText('Plano y viewport')).toBeTruthy();
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

    await waitFor(() => expect(screen.getByRole('tab', { name: /Diseñar/ }).getAttribute('aria-selected')).toBe('true'));
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

  it('shows a notice when linking the diagram to an MDX page fails', async () => {
    const model = createTemplateModel('circunferencia', 'Enlace MDX', 'definicion');
    const generated = generateDiagramSource(model, 'EnlaceMdx');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    readDiagram.mockResolvedValueOnce({
      source: generated.source,
      model,
      parseStatus: 'visual-exact',
      diagnostics: [],
      version: 'v1',
    });
    updateMdxImports.mockRejectedValueOnce(new Error('No se encontró la página MDX.'));

    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'file', path: 'src/shared/diagrams/EnlaceMdx.tsx' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByRole('tab', { name: /Comprobar/ })).toBeTruthy());
    fireEvent.click(screen.getByRole('tab', { name: /Comprobar/ }));
    fireEvent.change(screen.getByLabelText('Ruta de la página MDX'), {
      target: { value: 'database/content/definitions/a.mdx' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Vincular a página MDX' }));

    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/No se pudo vincular/i));
    expect(screen.getByRole('alert').textContent).toMatch(/No se encontró la página MDX/i);
    expect(updateMdxImports).toHaveBeenCalledWith(
      'database/content/definitions/a.mdx',
      'EnlaceMdx',
      'src/shared/diagrams/EnlaceMdx.tsx',
      'simulation',
    );
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
