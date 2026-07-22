import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiagramWorkbench } from '../../../../src/features/editor/diagrams/ui/DiagramWorkbench';

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

describe('DiagramWorkbench responsive layout', () => {
  beforeEach(() => {
    repositoryMocks.readDiagram.mockReset();
    repositoryMocks.saveDiagram.mockReset();
    repositoryMocks.updateMdxImports.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exposes the mobile task selector and bottom pane navigation', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'WorkbenchResponsive' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByLabelText('Tarea del editor de diagramas')).toBeTruthy());
    expect(screen.getByRole('navigation', { name: 'Vistas del editor' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Escena' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Lienzo' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Propiedades' })).toBeTruthy();
  });

  it('marks the active mobile pane with aria-current', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'WorkbenchPaneSwitch' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Lienzo' }).getAttribute('aria-current')).toBe('page'));
    fireEvent.click(screen.getByRole('button', { name: 'Escena' }));
    expect(screen.getByRole('button', { name: 'Escena' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Lienzo' }).getAttribute('aria-current')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Propiedades' }));
    expect(screen.getByRole('button', { name: 'Propiedades' }).getAttribute('aria-current')).toBe('page');
  });

  it('asks for confirmation before deleting the selected object', async () => {
    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'new', componentName: 'WorkbenchDeleteConfirm' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Objetos' })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Escena' }));
    const originItem = (await waitFor(() => screen.getAllByRole('treeitem'))).find(item => item.textContent?.includes('pO'));
    expect(originItem).toBeTruthy();
    fireEvent.click(originItem!.querySelector('button')!);
    fireEvent.click(screen.getByRole('button', { name: 'Propiedades' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Eliminar elemento' })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar elemento' }));

    await waitFor(() => expect(screen.getByRole('dialog', { name: /¿Eliminar pO\?/ })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getAllByText(/pO/).length).toBeGreaterThan(0);
  });
});
