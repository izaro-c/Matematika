import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import curvesFixture from '../../../fixtures/diagrams/phase3-curves.json';
import pointsFixture from '../../../fixtures/diagrams/phase3-points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/phase3-annotations-layers.json';
import areasFixture from '../../../fixtures/diagrams/phase3-area-grids.json';
import primitivesFixture from '../../../fixtures/diagrams/phase3-euclidean-primitives.json';
import { migrateDiagramSpec } from '../../../../src/shared/diagrams/public';
import { DiagramInspector } from '../../../../src/features/editor/diagrams/ui/DiagramInspector';
import { DiagramToolbar } from '../../../../src/features/editor/diagrams/ui/DiagramToolbar';
import { DiagramToolReferencePicker } from '../../../../src/features/editor/diagrams/ui/DiagramToolReferencePicker';

describe('Phase 3 visual editing', () => {
  it('edits safe function properties in the contextual inspector', () => {
    const model = migrateDiagramSpec(curvesFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="functionSin" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Expresión de función'), { target: { value: 'cos(x)' } });
    expect(onModelEdit).toHaveBeenCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({ id: 'functionSin', properties: expect.objectContaining({ expression: 'cos(x)' }) })]),
    }));
  });

  it('creates and assigns different point constraints from the point inspector', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Nueva restricción'), { target: { value: 'vertical' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir relación' }));
    expect(onModelEdit).toHaveBeenCalledWith(expect.objectContaining({
      constraints: expect.arrayContaining([expect.objectContaining({ kind: 'vertical', refs: ['pC', 'pA'] })]),
      dependencies: expect.arrayContaining([expect.objectContaining({ targetId: 'pC', relation: 'constraint' })]),
    }));
  });

  it('unlocks a formerly fixed point when a movable constraint is selected', () => {
    const base = migrateDiagramSpec(pointsFixture).spec;
    const model = {
      ...base,
      points: base.points.map(item => item.id === 'pC'
        ? { ...item, fixed: true, constraint: 'fixed' as const }
        : item),
    };
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Restricción del punto'), { target: { value: 'glider' } });

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === 'pC')).toMatchObject({
      fixed: false,
      constraint: 'glider',
    });
  });

  it('returns a point to free movement after deleting its final relation', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar relación' }));

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === 'pC')).toMatchObject({
      fixed: false,
      constraint: 'free',
    });
    expect(edited.points.find((item: { id: string }) => item.id === 'pC').constraintIds).toBeUndefined();
  });

  it('groups tools by purpose and creates expression-only curves without fake point references', () => {
    const curveModel = migrateDiagramSpec(curvesFixture).spec;
    const model = { ...curveModel, points: migrateDiagramSpec(pointsFixture).spec.points };
    const onAddElement = vi.fn();
    const onSetCanvasTool = vi.fn();
    render(
      <DiagramToolbar
        model={model}
        canvasTool="select"
        syncStatus="synced"
        onSetCanvasTool={onSetCanvasTool}
        onAddElement={onAddElement}
        onModelEdit={vi.fn()}
        onAddSlider={vi.fn()}
        onAddGliderPoint={vi.fn()}
        onAddStep={vi.fn()}
        onResolveDivergence={vi.fn()}
      />,
    );
    const addObjects = screen.getByRole('button', { name: /Añadir objeto/ });
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(addObjects);
    expect(addObjects.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Geometría básica')).toBeTruthy();
    expect(screen.getByText('Puntos y construcciones')).toBeTruthy();
    expect(screen.getByText('Curvas')).toBeTruthy();
    expect(screen.getByText('Ángulos y medidas')).toBeTruthy();
    expect(screen.getByText('Explicación')).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Gráfica de función' }));
    expect(onAddElement).toHaveBeenCalledWith('functionCurve');
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(addObjects);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Panel informativo' }));
    expect(onAddElement).toHaveBeenCalledWith('infoPanel');
    fireEvent.click(addObjects);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Punto medio' }));
    expect(onSetCanvasTool).toHaveBeenCalledWith('midpoint');
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
  });

  it('allows choosing tool references manually and polygons with more than three vertices', () => {
    const model = migrateDiagramSpec(areasFixture).spec;
    const onRefsChange = vi.fn();
    const onCreate = vi.fn();
    const refs = model.points.slice(0, 3).map(point => point.id);
    const view = render(
      <DiagramToolReferencePicker
        model={model}
        tool="polygon"
        refs={refs}
        onRefsChange={onRefsChange}
        onCreate={onCreate}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Añadir vértice/ }));
    expect(onRefsChange).toHaveBeenCalledWith([...refs, '']);

    view.rerender(
      <DiagramToolReferencePicker
        model={model}
        tool="polygon"
        refs={[...refs, model.points[3].id]}
        onRefsChange={onRefsChange}
        onCreate={onCreate}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Crear Polígono' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Vértice 4 para Polígono')).toBeTruthy();
  });

  it('persists the dashed option for a polygon', () => {
    const model = migrateDiagramSpec(primitivesFixture).spec;
    const polygon = model.elements.find(item => item.kind === 'polygon');
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={polygon?.id ?? ''} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox', { name: '¿Línea discontinua?' }));

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === polygon?.id)).toMatchObject({ dashed: true });
  });

  it('edits information panels in viewport-relative percentages', () => {
    const model = migrateDiagramSpec(annotationsFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="panelA" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Tipo de anclaje del panel'), { target: { value: 'viewport' } });
    const positioned = onModelEdit.mock.calls.at(-1)?.[0];
    expect(positioned.elements.find((item: { id: string }) => item.id === 'panelA')).toMatchObject({
      refs: [],
      properties: { anchorMode: 'viewport', viewportPosition: [0.08, 0.22] },
    });
  });

  it('offers title alignment as a viewport-position preset without removing manual coordinates', () => {
    const baseModel = migrateDiagramSpec(annotationsFixture).spec;
    const model = {
      ...baseModel,
      elements: baseModel.elements.map(item => item.id === 'panelA'
        ? { ...item, refs: [], properties: { ...item.properties, anchorMode: 'viewport' as const, viewportPosition: [0.45, 0.35] as [number, number] } }
        : item),
    };
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="panelA" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    expect(screen.getByLabelText('Posición horizontal del panel')).toBeTruthy();
    expect(screen.getByLabelText('Posición vertical del panel')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Alinear panel con el título' }));

    const positioned = onModelEdit.mock.calls.at(-1)?.[0];
    expect(positioned.elements.find((item: { id: string }) => item.id === 'panelA')).toMatchObject({
      properties: { anchorMode: 'viewport', viewportPosition: [0, 0] },
    });
  });

  it('uses explicit front and back actions instead of making authors guess numeric order', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    fireEvent.click(screen.getByText(/Organización visual/));
    fireEvent.click(screen.getByRole('button', { name: 'Traer al frente' }));

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    const selected = edited.points.find((item: { id: string }) => item.id === 'pC');
    const peers = [...edited.points, ...edited.elements].filter((item: { id: string; layerId: string }) => item.layerId === selected.layerId && item.id !== selected.id);
    expect(selected.order).toBeGreaterThan(Math.max(...peers.map((item: { order: number }) => item.order)));
    expect(screen.getByText(/Una capa superior siempre queda delante/)).toBeTruthy();
  });
});
