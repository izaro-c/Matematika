import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import curvesFixture from '../../../fixtures/diagrams/phase3-curves.json';
import pointsFixture from '../../../fixtures/diagrams/phase3-points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/phase3-annotations-layers.json';
import areasFixture from '../../../fixtures/diagrams/phase3-area-grids.json';
import primitivesFixture from '../../../fixtures/diagrams/phase3-euclidean-primitives.json';
import marksFixture from '../../../fixtures/diagrams/phase3-marks-angles.json';
import { migrateDiagramSpec } from '../../../../src/shared/diagrams/public';
import { DiagramInspector } from '../../../../src/features/editor/diagrams/ui/DiagramInspector';
import { DiagramToolbar } from '../../../../src/features/editor/diagrams/ui/DiagramToolbar';
import { DiagramToolReferencePicker } from '../../../../src/features/editor/diagrams/ui/DiagramToolReferencePicker';

describe('Phase 3 visual editing', () => {
  it('authors direct interaction separately from fixed position and relations', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const target = model.points.find(point => !point.fixed && point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    const directSelectionControl = screen.getByRole('checkbox', { name: /Permitir selección directa/ });
    fireEvent.click(directSelectionControl);

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === target.id)).toMatchObject({
      fixed: false,
      constraint: target.constraint,
      selection: { selectable: false },
    });
    expect(directSelectionControl.closest('label')?.textContent).toContain('Conserva el foco y el resaltado');
    expect(directSelectionControl.closest('label')?.textContent).toContain('las relaciones aún pueden moverlo');
  });

  it('disables local hover highlighting without blocking MDX references', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const target = model.points.find(point => point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    const control = screen.getByRole('checkbox', { name: /Resaltar por hover o foco/ });
    expect(control.closest('label')?.textContent).toContain('Las referencias MDX');
    fireEvent.click(control);

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === target.id).selection).toMatchObject({
      selectable: true,
      highlightable: false,
    });
  });

  it('authors additive MDX highlighting while keeping dimming as the default', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const target = model.points.find(point => point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    const control = screen.getByRole('checkbox', { name: /Atenuar los demás desde MDX/ });
    expect((control as HTMLInputElement).checked).toBe(true);
    fireEvent.click(control);

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === target.id).selection).toMatchObject({
      dimOthersOnHighlight: false,
    });
  });

  it('creates and edits an intersection from two compatible supports', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const line = { ...base.elements.find(item => item.id === 'lineBC')!, id: 'lineOC', label: 'Recta OC', refs: ['pO', 'pC'], target: false };
    const intersection = {
      ...base.elements.find(item => item.id === 'segAB')!,
      id: 'intQ', label: 'Q', kind: 'intersection' as const, refs: ['lineOC', 'segAB'], order: 80,
      locked: true, target: false, properties: { restrictToSupports: true },
    };
    const model = { ...base, elements: [...base.elements, line, intersection] };
    const onRefsChange = vi.fn();
    const picker = render(<DiagramToolReferencePicker model={model} tool="intersection" refs={[]} onRefsChange={onRefsChange} onCreate={vi.fn()} />);

    expect(screen.getByLabelText('Soporte lineal 1 para Intersección')).toBeTruthy();
    expect(screen.getByLabelText('Soporte lineal 2 para Intersección')).toBeTruthy();
    expect(screen.queryByRole('option', { name: /Polígono/ })).toBeNull();

    picker.unmount();
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="intQ" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Exigir pertenencia a los soportes finitos/ }));
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === 'intQ')).toMatchObject({ properties: { restrictToSupports: false } });
  });

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

  it('authors equal-length and midpoint relations with geometry-specific references', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const model = {
      ...base,
      elements: [
        ...base.elements,
        { ...base.elements[0], id: 'segOC', label: 'Segmento OC', refs: ['pO', 'pC'], order: 20 },
      ],
      points: base.points.map(point => point.id === 'pC'
        ? { ...point, constraint: 'constrained' as const, constraintIds: [] }
        : point),
    };
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nueva restricción'), { target: { value: 'equalLength' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir relación' }));
    expect(onModelEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      constraints: expect.arrayContaining([expect.objectContaining({
        kind: 'equalLength',
        refs: ['pC', 'pO', 'segAB'],
      })]),
      dependencies: expect.arrayContaining([expect.objectContaining({
        sourceId: 'segAB',
        targetId: 'pC',
        relation: 'constraint',
      })]),
    }));

    view.rerender(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Nueva restricción'), { target: { value: 'midpoint' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir relación' }));
    expect(onModelEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      constraints: expect.arrayContaining([expect.objectContaining({
        kind: 'midpoint',
        refs: ['pC', 'pO', 'pA'],
      })]),
    }));
  });

  it('explains and creates equal lengths directly from the selected segment', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const model = {
      ...base,
      elements: [
        ...base.elements,
        { ...base.elements[0], id: 'segOC', label: 'Segmento OC', refs: ['pO', 'pC'], order: 20 },
      ],
    };
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="segOC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    const summary = screen.getByText('Igualar longitudes');
    expect(summary.closest('details')?.open).toBe(false);
    fireEvent.click(summary);
    expect(summary.closest('details')?.open).toBe(true);
    expect(screen.getByText(/Un extremo queda como ancla/)).toBeTruthy();
    expect((screen.getByLabelText('Extremo que se ajusta para igualar longitudes') as HTMLSelectElement).value).toBe('pC');
    expect((screen.getByLabelText('Segmento de referencia para igualar longitudes') as HTMLSelectElement).value).toBe('segAB');

    fireEvent.click(screen.getByRole('button', { name: 'Mantener la misma longitud' }));
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited).toMatchObject({
      points: expect.arrayContaining([expect.objectContaining({
        id: 'pC',
        constraint: 'constrained',
        constraintIds: expect.any(Array),
      })]),
      constraints: expect.arrayContaining([expect.objectContaining({
        kind: 'equalLength',
        refs: ['pC', 'pO', 'segAB'],
      })]),
    });

    view.rerender(<DiagramInspector model={edited} selectedId="segOC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    expect(screen.getByText('Igualar longitudes').closest('details')?.open).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Quitar igualdad de longitudes' }));
    const removed = onModelEdit.mock.calls.at(-1)?.[0];
    expect(removed.constraints?.some((constraint: { kind: string }) => constraint.kind === 'equalLength')).toBe(false);
    expect(removed.points.find((point: { id: string }) => point.id === 'pC')).toMatchObject({
      constraint: 'free',
    });
  });

  it('adds, edits and removes segment measure marks directly from the selected segment', () => {
    const model = migrateDiagramSpec(primitivesFixture).spec;
    const segment = model.elements.find(element => element.id === 'segAB')!;
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId={segment.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    expect(screen.getByRole('region', { name: 'Marcas del segmento' })).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: /Congruencia rayas centrales/ })).toBeTruthy();
    expect(screen.queryByLabelText('Separación entre marcas de medida')).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: /Medida graduación de regla/ }));

    const withMarks = onModelEdit.mock.calls.at(-1)?.[0];
    const createdMark = withMarks.elements.find((element: { kind: string }) => element.kind === 'measureTicks');
    expect(createdMark).toMatchObject({
      refs: [segment.id],
      color: 'carbon',
      properties: { tickDistance: 2 },
      style: { strokeWidth: 2 },
    });
    expect(withMarks.dependencies).toEqual(expect.arrayContaining([{
      sourceId: segment.id,
      targetId: createdMark.id,
      relation: 'construction',
    }]));

    view.rerender(<DiagramInspector model={withMarks} selectedId={segment.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Separación entre marcas de medida'), { target: { value: '1.5' } });
    const withCloserMarks = onModelEdit.mock.calls.at(-1)?.[0];
    expect(withCloserMarks.elements.find((element: { id: string }) => element.id === createdMark.id))
      .toMatchObject({ properties: { tickDistance: 1.5 } });

    view.rerender(<DiagramInspector model={withCloserMarks} selectedId={segment.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Altura de las marcas de medida'), { target: { value: '14' } });
    const withTallerMarks = onModelEdit.mock.calls.at(-1)?.[0];
    expect(withTallerMarks.elements.find((element: { id: string }) => element.id === createdMark.id))
      .toMatchObject({ style: { markHeight: 14 } });

    view.rerender(<DiagramInspector model={withTallerMarks} selectedId={segment.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Medida graduación de regla/ }));
    const withoutMarks = onModelEdit.mock.calls.at(-1)?.[0];
    expect(withoutMarks.elements.some((element: { id: string }) => element.id === createdMark.id)).toBe(false);
    expect(withoutMarks.dependencies.some((dependency: { targetId: string }) => dependency.targetId === createdMark.id)).toBe(false);
  });

  it('adds compact congruence marks to a segment and edits their count and height separately', () => {
    const model = migrateDiagramSpec(primitivesFixture).spec;
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="segAB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox', { name: /Congruencia rayas centrales/ }));
    const withCongruence = onModelEdit.mock.calls.at(-1)?.[0];
    const mark = withCongruence.elements.find((element: { kind: string }) => element.kind === 'congruenceMark');
    expect(mark).toMatchObject({
      refs: ['pA', 'pB'],
      properties: { markCount: 1 },
      style: { markHeight: 0.32, strokeWidth: 2 },
    });

    view.rerender(<DiagramInspector model={withCongruence} selectedId="segAB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Número de marcas de congruencia'), { target: { value: '3' } });
    const withThreeMarks = onModelEdit.mock.calls.at(-1)?.[0];
    view.rerender(<DiagramInspector model={withThreeMarks} selectedId="segAB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Altura de las marcas de congruencia'), { target: { value: '0.5' } });
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((element: { id: string }) => element.id === mark.id)).toMatchObject({
      properties: { markCount: 3 },
      style: { markHeight: 0.5 },
    });
  });

  it('describes relation activation as a reversible pause instead of an extra movement mode', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    expect(screen.getByText('Relación activa')).toBeTruthy();
    expect(screen.getByText('Desmarcar para pausarla sin eliminarla.')).toBeTruthy();
    expect(screen.queryByText('Aplicar al mover')).toBeNull();
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
    const primitiveModel = migrateDiagramSpec(primitivesFixture).spec;
    const model = { ...curveModel, points: primitiveModel.points, elements: [...curveModel.elements, ...primitiveModel.elements] };
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
    expect(screen.getByRole('menuitem', { name: 'Marca de congruencia' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Marcas de medida' })).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Gráfica de función' }));
    expect(onAddElement).toHaveBeenCalledWith('functionCurve');
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(addObjects);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Panel informativo' }));
    expect(onAddElement).toHaveBeenCalledWith('infoPanel');
    fireEvent.click(addObjects);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Intersección' }));
    expect(onSetCanvasTool).toHaveBeenCalledWith('intersection');
    fireEvent.click(addObjects);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Punto medio' }));
    expect(onSetCanvasTool).toHaveBeenCalledWith('midpoint');
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
  });

  it('chooses an existing segment, rather than two points, for ruler-like measure marks', () => {
    const model = migrateDiagramSpec(primitivesFixture).spec;
    render(
      <DiagramToolReferencePicker
        model={model}
        tool="measureTicks"
        refs={[]}
        onRefsChange={vi.fn()}
        onCreate={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Segmento graduado para Marcas de medida')).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Segmento · segAB' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: /^A · pA$/ })).toBeNull();
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

  it('names angular references by role and edits the angular radius', () => {
    const model = migrateDiagramSpec(marksFixture).spec;
    const onRefsChange = vi.fn();
    const picker = render(
      <DiagramToolReferencePicker
        model={model}
        tool="angle"
        refs={[]}
        onRefsChange={onRefsChange}
        onCreate={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Punto del primer lado para Ángulo')).toBeTruthy();
    expect(screen.getByLabelText('Vértice para Ángulo')).toBeTruthy();
    expect(screen.getByLabelText('Punto del segundo lado para Ángulo')).toBeTruthy();

    picker.unmount();
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="angleAVB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    expect(screen.getByLabelText('Vértice de Ángulo')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Radio de la marca angular'), { target: { value: '0.8' } });

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === 'angleAVB')).toMatchObject({ style: { angleRadius: 0.8 } });
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
