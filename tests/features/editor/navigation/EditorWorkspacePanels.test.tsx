// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EditorShell } from '../../../../src/fixed-pages/editor/ui/page/EditorShell';
import { EditorDiagnosticsPanel } from '../../../../src/fixed-pages/editor/ui/panels/EditorDiagnosticsPanel';

describe('paneles del espacio de trabajo', () => {
  it('expone separadores ajustables con teclado y paneles colapsables controlados', () => {
    const setNavigationWidth = vi.fn();
    const setInspectorWidth = vi.fn();
    const setDiagnosticsHeight = vi.fn();
    const { rerender } = render(
      <EditorShell
        toolbar={<div>Barra</div>}
        navigation={<nav>Árbol</nav>}
        navigationOpen
        navigationWidth={304}
        setNavigationWidth={setNavigationWidth}
        inspector={<div>Inspector</div>}
        inspectorOpen
        inspectorWidth={336}
        setInspectorWidth={setInspectorWidth}
        diagnostics={<div>Diagnósticos</div>}
        diagnosticsOpen
        diagnosticsHeight={184}
        setDiagnosticsHeight={setDiagnosticsHeight}
        persistPanelSizes={vi.fn()}
      >
        <div>Documento</div>
      </EditorShell>,
    );
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Redimensionar explorador' }), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Redimensionar inspector' }), { key: 'ArrowLeft' });
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Redimensionar diagnósticos' }), { key: 'ArrowUp' });
    expect(setNavigationWidth).toHaveBeenCalledWith(312);
    expect(setInspectorWidth).toHaveBeenCalledWith(344);
    expect(setDiagnosticsHeight).toHaveBeenCalledWith(192);

    rerender(
      <EditorShell toolbar={<div>Barra</div>} navigationOpen={false} navigationWidth={304} setNavigationWidth={setNavigationWidth} inspectorOpen={false} inspectorWidth={336} setInspectorWidth={setInspectorWidth} diagnosticsOpen={false} diagnosticsHeight={184} setDiagnosticsHeight={setDiagnosticsHeight} persistPanelSizes={vi.fn()}>
        <div>Documento</div>
      </EditorShell>,
    );
    expect(screen.queryByText('Árbol')).toBeNull();
    expect(screen.queryByText('Inspector')).toBeNull();
    expect(screen.queryByText('Diagnósticos')).toBeNull();
  });

  it('sigue el esquema único: cabecera, barra, explorador, lienzo con avisos debajo e inspector', () => {
    render(
      <EditorShell
        header={<header>Cabecera</header>}
        toolbar={<div>Barra</div>}
        navigation={<nav>Árbol</nav>}
        navigationOpen
        navigationWidth={304}
        setNavigationWidth={vi.fn()}
        inspector={<div>Inspector</div>}
        inspectorOpen
        inspectorWidth={336}
        setInspectorWidth={vi.fn()}
        diagnostics={<div>Lista de avisos</div>}
        diagnosticsOpen
        diagnosticsHeight={184}
        setDiagnosticsHeight={vi.fn()}
        mainLabel="Lienzo del diagrama"
      >
        <div>Documento</div>
      </EditorShell>,
    );
    const main = screen.getByRole('main', { name: 'Lienzo del diagrama' });
    const warnings = screen.getByRole('region', { name: 'Avisos' });
    const inspector = screen.getByRole('complementary', { name: 'Panel de detalles' });
    // Los avisos comparten columna con el lienzo; los paneles laterales ocupan toda la altura.
    expect(warnings.parentElement).toBe(main.parentElement);
    expect(inspector.parentElement).toBe(main.parentElement?.parentElement);
    const order = [screen.getByText('Cabecera'), screen.getByText('Barra'), screen.getByText('Árbol'), main, warnings, inspector];
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it('muestra errores, conflicto y capacidad real en el panel inferior', () => {
    const onSelectIssue = vi.fn();
    render(
      <EditorDiagnosticsPanel
        currentFile="widgets/diagrams/Punto.tsx"
        resource={{ path: 'widgets/diagrams/Punto.tsx', name: 'Punto.tsx', type: 'diagram-definitions', kind: 'diagram', capability: 'code-preview', capabilityLabel: 'Edición de código con vista previa', reason: 'El TSX es autoritativo.' }}
        validation={{ issues: [{ id: 'tsx', severity: 'error', area: 'source', message: 'TSX inválido' }], canSave: false, errorCount: 1, warningCount: 0 }}
        persistenceStatus={{ kind: 'conflict', file: { path: 'widgets/diagrams/Punto.tsx' }, localRevision: 2, expectedVersion: 'a', actualVersion: 'b' }}
        persistenceLabel="Conflicto"
        level="advanced"
        onSelectIssue={onSelectIssue}
        close={vi.fn()}
      />,
    );
    expect(screen.getByText('1 errores')).toBeTruthy();
    expect(screen.getByText(/La versión externa cambió/)).toBeTruthy();
    expect(screen.getByText(/Edición de código con vista previa/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /TSX inválido/ }));
    expect(onSelectIssue).toHaveBeenCalled();
  });
});
