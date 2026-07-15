// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FileNode } from '../../../../src/features/editor/lib/editorContracts';
import { EditorNavigation } from '../../../../src/features/editor/ui/EditorNavigation';

const files: FileNode[] = [
  { path: 'database/content/definitions/punto.mdx', name: 'definicion-punto.mdx', type: 'definitions', kind: 'mdx-document', capability: 'visual-exact', capabilityLabel: 'Edición visual exacta', reason: 'Documento lossless.' },
  { path: 'database/content/theorems/tales.mdx', name: 'teorema-tales.mdx', type: 'theorems', kind: 'mdx-document', capability: 'invalid', capabilityLabel: 'Recurso inválido', reason: 'Sintaxis inválida.' },
  { path: 'widgets/diagrams/Definitions/Punto.tsx', name: 'Punto.tsx', type: 'diagram-definitions', kind: 'diagram', capability: 'code-preview', capabilityLabel: 'Edición de código con vista previa', reason: 'TSX autoritativo.' },
];

function renderNavigation(overrides: Partial<React.ComponentProps<typeof EditorNavigation>> = {}) {
  const props: React.ComponentProps<typeof EditorNavigation> = {
    files,
    isLoading: false,
    error: null,
    currentFile: null,
    openFile: vi.fn(),
    retry: vi.fn(),
    close: vi.fn(),
    level: 'basic',
    favoritePaths: [],
    recentPaths: [],
    toggleFavorite: vi.fn(),
    width: 304,
    ...overrides,
  };
  return { ...render(<EditorNavigation {...props} />), props };
}

describe('explorador de recursos', () => {
  it('presenta entradas primarias inequívocas para documentos y diagramas', () => {
    renderNavigation();
    const filterDisclosure = screen.getByText('Filtrar resultados').closest('details');
    expect(filterDisclosure?.open).toBe(false);
    fireEvent.click(screen.getByText('Filtrar resultados'));
    expect(filterDisclosure?.open).toBe(true);
    expect(screen.getByRole('tab', { name: /Documentos 2/ }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('button', { name: /PuntoEdición exacta/ })).toBeTruthy();
    expect(screen.queryByText('Código + vista previa')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: /Diagramas 1/ }));
    expect(screen.getByText('Código + vista previa')).toBeTruthy();
    expect(screen.getByTitle(/TSX autoritativo/)).toBeTruthy();
  });

  it('filtra por texto, tipo, estado y capacidad y explica el resultado vacío', () => {
    renderNavigation();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tales' } });
    expect(screen.getByRole('button', { name: /TalesRequiere corrección/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /PuntoEdición exacta/ })).toBeNull();

    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'available' } });
    expect(screen.getByText('No hay resultados con estos filtros.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    fireEvent.change(screen.getByLabelText('Capacidad de edición'), { target: { value: 'invalid' } });
    expect(screen.getAllByText('Requiere corrección')).toHaveLength(2);
  });

  it('abre recursos, marca favoritos y permite recorrerlos con flechas', () => {
    const { props } = renderNavigation();
    const punto = screen.getByRole('button', { name: /PuntoEdición exacta/ });
    fireEvent.click(punto);
    expect(props.openFile).toHaveBeenCalledWith(files[0].path);
    fireEvent.click(screen.getByRole('button', { name: /Añadir Punto a favoritos/ }));
    expect(props.toggleFavorite).toHaveBeenCalledWith(files[0].path);

    punto.focus();
    fireEvent.keyDown(punto, { key: 'ArrowDown' });
    const resourceButtons = within(screen.getByLabelText('Explorador de recursos')).getAllByTitle(/Edición|Recurso/);
    expect(resourceButtons).toContain(document.activeElement);
    expect(document.activeElement).not.toBe(punto);
  });

  it('distingue carga, error y catálogo vacío', () => {
    const { rerender, props } = renderNavigation({ isLoading: true, files: [] });
    expect(screen.getByRole('status', { name: 'Cargando catálogo' })).toBeTruthy();
    rerender(<EditorNavigation {...props} files={[]} isLoading={false} error="Sin conexión" />);
    expect(screen.getByRole('alert').textContent).toContain('Sin conexión');
    rerender(<EditorNavigation {...props} files={[]} isLoading={false} error={null} />);
    expect(screen.getByText('No hay recursos editables en el catálogo seguro.')).toBeTruthy();
  });
});
