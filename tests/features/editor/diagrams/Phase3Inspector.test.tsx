import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import curvesFixture from '../../../fixtures/diagrams/phase3-curves.json';
import pointsFixture from '../../../fixtures/diagrams/phase3-points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/phase3-annotations-layers.json';
import areasFixture from '../../../fixtures/diagrams/phase3-area-grids.json';
import primitivesFixture from '../../../fixtures/diagrams/phase3-euclidean-primitives.json';
import marksFixture from '../../../fixtures/diagrams/phase3-marks-angles.json';
import { migrateDiagramSpec, projectDiagramSpecV3ToV2 } from '../../../../src/shared/diagrams/public';
import { DiagramInspector } from '../../../../src/features/editor/diagrams/ui/DiagramInspector';
import { DiagramToolbar } from '../../../../src/features/editor/diagrams/ui/DiagramToolbar';
import { DiagramToolReferencePicker } from '../../../../src/features/editor/diagrams/ui/DiagramToolReferencePicker';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { addLabelToElement } from '../../../../src/features/editor/diagrams/model/commands';
import { AxiomaArquimedesSpec } from '../../../../src/widgets/diagrams/Axiomas/AxiomaArquimedes';

function openInspectorSection(name: 'Esencial' | 'Geometría' | 'Estilo' | 'Interacción') {
  fireEvent.click(screen.getByRole('button', { name }));
}

describe('Phase 3 visual editing', () => {
  it('adds, hides and positions an element label from contextual visual controls', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const source = base.elements.find(item => item.kind === 'segment')!;
    const onAddElementLabel = vi.fn();
    const onModelEdit = vi.fn();
    const onSelect = vi.fn();
    const view = render(
      <DiagramInspector model={base} selectedId={source.id} onSelect={onSelect} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} onAddElementLabel={onAddElementLabel} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Añadir etiqueta a este elemento' }));
    expect(onAddElementLabel).toHaveBeenCalledWith(source.id);

    const labelled = addLabelToElement(base, source.id);
    view.rerender(<DiagramInspector model={labelled.model} selectedId={source.id} onSelect={onSelect} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} onAddElementLabel={onAddElementLabel} />);
    fireEvent.click(screen.getByRole('checkbox', { name: `Mostrar etiqueta de ${source.label}` }));
    expect(onModelEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({ id: labelled.labelId, visible: false })]),
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar texto y posición' }));
    expect(onSelect).toHaveBeenCalledWith(labelled.labelId);

    view.rerender(<DiagramInspector model={labelled.model} selectedId={labelled.labelId} onSelect={onSelect} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');
    fireEvent.change(screen.getByLabelText('Posición de la etiqueta sobre el elemento'), { target: { value: '0.7' } });
    expect(onModelEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({ id: labelled.labelId, properties: expect.objectContaining({ anchorParameter: 0.7 }) })]),
    }));
    fireEvent.change(screen.getByLabelText('Separación horizontal de la etiqueta'), { target: { value: '0.02' } });
    expect(onModelEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({ id: labelled.labelId, style: expect.objectContaining({ textOffset: [0.02, 0.04] }) })]),
    }));
    fireEvent.change(screen.getByLabelText('Tamaño de la etiqueta vinculada'), { target: { value: '18' } });
    expect(onModelEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({ id: labelled.labelId, style: expect.objectContaining({ labelSize: 18 }) })]),
    }));
  });

  it('makes all labels optional from the View menu', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const onModelEdit = vi.fn();
    render(
      <DiagramToolbar
        model={model}
        canvasTool="select"
        syncStatus="synced"
        onSetCanvasTool={vi.fn()}
        onAddElement={vi.fn()}
        onModelEdit={onModelEdit}
        onAddSlider={vi.fn()}
        onAddGliderPoint={vi.fn()}
        onResolveDivergence={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Vista/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mostrar etiquetas' }));
    expect(onModelEdit).toHaveBeenCalledWith(expect.objectContaining({ showLabels: false }));
  });

  it('chooses independently whether a point label is drawn on the canvas', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const target = model.points.find(point => point.visible)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    const control = screen.getByRole('checkbox', { name: `Mostrar etiqueta nativa de ${target.label}` });
    expect((control as HTMLInputElement).checked).toBe(true);
    fireEvent.click(control);

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === target.id)).toMatchObject({ showLabel: false });

    fireEvent.change(screen.getByLabelText(`Tamaño de etiqueta de ${target.label}`), { target: { value: '24' } });
    const resized = onModelEdit.mock.calls.at(-1)?.[0];
    expect(resized.points.find((item: { id: string }) => item.id === target.id)).toMatchObject({ style: { labelSize: 24 } });
    fireEvent.change(screen.getByLabelText(`Desplazamiento horizontal de etiqueta de ${target.label}`), { target: { value: '12' } });
    const shifted = onModelEdit.mock.calls.at(-1)?.[0];
    expect(shifted.points.find((item: { id: string }) => item.id === target.id)).toMatchObject({ style: { labelOffset: [12, 0] } });
  });

  it('authors direct interaction separately from fixed position and relations', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const target = model.points.find(point => !point.fixed && point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Interacción');

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
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const target = model.points.find(point => point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Interacción');

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
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const target = model.points.find(point => point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Interacción');

    const control = screen.getByRole('checkbox', { name: /Atenuar los demás desde MDX/ });
    expect((control as HTMLInputElement).checked).toBe(true);
    fireEvent.click(control);

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === target.id).selection).toMatchObject({
      dimOthersOnHighlight: false,
    });
  });

  it('authors the reveal-on-MDX-highlight behavior without editing source code', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const target = model.points.find(point => point.selection.selectable)!;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={target.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Interacción');

    const control = screen.getByRole('checkbox', { name: /Revelar desde un enlace MDX/ });
    expect((control as HTMLInputElement).checked).toBe(false);
    fireEvent.click(control);

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === target.id).style).toMatchObject({
      highlightVisible: true,
    });
  });

  it('creates and edits an intersection from two compatible supports', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
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
    openInspectorSection('Geometría');
    fireEvent.click(screen.getByRole('checkbox', { name: /Exigir pertenencia a los soportes finitos/ }));
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === 'intQ')).toMatchObject({ properties: { restrictToSupports: false } });
  });

  it('edits safe function properties in the contextual inspector', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(curvesFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="functionSin" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');
    fireEvent.change(screen.getByLabelText('Expresión de función'), { target: { value: 'cos(x)' } });
    expect(onModelEdit).toHaveBeenCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({ id: 'functionSin', properties: expect.objectContaining({ expression: 'cos(x)' }) })]),
    }));
  });

  it('authors a reactive slider maximum and reactive copy spacing without using source code', () => {
    const onSliderEdit = vi.fn();
    const sliderView = render(<DiagramInspector model={AxiomaArquimedesSpec} selectedId="n" onSelect={vi.fn()} onModelEdit={onSliderEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');
    fireEvent.change(screen.getByLabelText('Expresión del máximo dinámico del slider'), {
      target: { value: 'floor(segCD.length/segAB.length)+2' },
    });
    expect(onSliderEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      sliders: expect.arrayContaining([expect.objectContaining({ id: 'n', maxExpression: 'floor(segCD.length/segAB.length)+2' })]),
      dependencies: expect.arrayContaining([
        { sourceId: 'segAB', targetId: 'n', relation: 'expression' },
        { sourceId: 'segCD', targetId: 'n', relation: 'expression' },
      ]),
    }));

    sliderView.unmount();
    const onTicksEdit = vi.fn();
    render(<DiagramInspector model={AxiomaArquimedesSpec} selectedId="copyTicks" onSelect={vi.fn()} onModelEdit={onTicksEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');
    fireEvent.change(screen.getByLabelText('Expresión de separación entre marcas'), {
      target: { value: '2*abs(pB.x-pA.x)' },
    });
    expect(onTicksEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({
        id: 'copyTicks',
        properties: expect.objectContaining({ tickDistanceExpression: '2*abs(pB.x-pA.x)' }),
      })]),
      dependencies: expect.arrayContaining([
        { sourceId: 'pA', targetId: 'copyTicks', relation: 'expression' },
        { sourceId: 'pB', targetId: 'copyTicks', relation: 'expression' },
      ]),
    }));
    fireEvent.change(screen.getByLabelText('Número de subdivisiones menores'), { target: { value: '2' } });
    expect(onTicksEdit).toHaveBeenLastCalledWith(expect.objectContaining({
      elements: expect.arrayContaining([expect.objectContaining({
        id: 'copyTicks',
        properties: expect.objectContaining({ minorTickCount: 2 }),
      })]),
    }));
  });

  it('creates and assigns different point constraints from the point inspector', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');
    fireEvent.change(screen.getByLabelText('Nueva restricción'), { target: { value: 'vertical' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir relación' }));
    expect(onModelEdit).toHaveBeenCalledWith(expect.objectContaining({
      constraints: expect.arrayContaining([expect.objectContaining({ kind: 'vertical', refs: ['pC', 'pA'] })]),
      dependencies: expect.arrayContaining([expect.objectContaining({ targetId: 'pC', relation: 'constraint' })]),
    }));
  });

  it('authors equal-length and midpoint relations with geometry-specific references', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
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
    openInspectorSection('Geometría');

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
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const model = {
      ...base,
      elements: [
        ...base.elements,
        { ...base.elements[0], id: 'segOC', label: 'Segmento OC', refs: ['pO', 'pC'], order: 20 },
      ],
    };
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="segOC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

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

  it('explains and creates equal angles directly from the selected angle', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(marksFixture).spec);
    const pointTemplate = base.points[0];
    const angleTemplate = base.elements.find(element => element.kind === 'nonReflexAngle')!;
    const model = {
      ...base,
      points: [
        ...base.points,
        { ...pointTemplate, id: 'pC', label: 'C', x: 5, y: 0, order: 3 },
        { ...pointTemplate, id: 'pW', label: 'W', x: 4, y: 0, fixed: true, constraint: 'fixed' as const, locked: true, order: 4 },
        { ...pointTemplate, id: 'pD', label: 'D', x: 4.5, y: Math.sqrt(3) / 2, order: 5 },
      ],
      elements: [
        ...base.elements,
        { ...angleTemplate, id: 'angleCWD', label: 'Ángulo CWD', refs: ['pC', 'pW', 'pD'], order: 20 },
      ],
    };
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="nonReflexAngleAVB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    const summary = screen.getByText('Igualar ángulos');
    expect(summary.closest('details')?.open).toBe(true);
    expect(screen.getByText(/girará alrededor del vértice/)).toBeTruthy();
    expect((screen.getByLabelText('Extremo que se ajusta para igualar ángulos') as HTMLSelectElement).value).toBe('pA');
    expect((screen.getByLabelText('Ángulo de referencia para igualar ángulos') as HTMLSelectElement).value).toBe('angleCWD');

    fireEvent.click(screen.getByRole('button', { name: 'Mantener el mismo ángulo' }));
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited).toMatchObject({
      points: expect.arrayContaining([expect.objectContaining({
        id: 'pA',
        constraint: 'constrained',
        constraintIds: expect.any(Array),
      })]),
      constraints: expect.arrayContaining([expect.objectContaining({
        kind: 'equalAngle',
        refs: ['pA', 'pV', 'pB', 'angleCWD', 'nonReflexAngleAVB'],
      })]),
    });

    view.rerender(<DiagramInspector model={edited} selectedId="nonReflexAngleAVB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    expect(screen.getByText('Igualar ángulos').closest('details')?.open).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Quitar igualdad de ángulos' }));
    const removed = onModelEdit.mock.calls.at(-1)?.[0];
    expect(removed.constraints?.some((constraint: { kind: string }) => constraint.kind === 'equalAngle')).toBe(false);
    expect(removed.points.find((point: { id: string }) => point.id === 'pA')).toMatchObject({ constraint: 'free' });
  });

  it('shows equal-angle authoring immediately for the real SAS diagram', () => {
    const parsed = parseDiagramSourceAST(readFileSync('src/widgets/diagrams/Axiomas/SAS.tsx', 'utf8'));
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;

    render(<DiagramInspector model={parsed.model} selectedId="nonReflexAngleBAC" onSelect={vi.fn()} onModelEdit={vi.fn()} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    const summary = screen.getByText('Igualar ángulos');
    expect(summary.closest('details')?.open).toBe(true);
    expect((screen.getByLabelText('Ángulo de referencia para igualar ángulos') as HTMLSelectElement).value)
      .toBe('nonReflexAngleBBAACC');
    expect((screen.getByRole('button', { name: 'Mantener el mismo ángulo' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('adds, edits and removes segment measure marks directly from the selected segment', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const segment = model.elements.find(element => element.id === 'segAB')!;
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId={segment.id} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

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
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="segAB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

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

  it('authors point attractors and their distances without editing source code', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="pA" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    fireEvent.click(screen.getByText('Magnetismo hacia formas notables'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Usar Recta como atractor' }));
    const withAttractor = onModelEdit.mock.calls.at(-1)?.[0];
    expect(withAttractor.points.find((point: { id: string }) => point.id === 'pA').attractorIds).toEqual(['lineBC']);
    expect(withAttractor.dependencies).toContainEqual({ sourceId: 'lineBC', targetId: 'pA', relation: 'constraint' });

    view.rerender(<DiagramInspector model={withAttractor} selectedId="pA" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Distancia de atracción'), { target: { value: '0.35' } });
    fireEvent.change(screen.getByLabelText('Distancia de liberación'), { target: { value: '0.55' } });
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((point: { id: string }) => point.id === 'pA')).toMatchObject({ snatchDistance: 0.55 });
  });

  it('edits the count and size of a parallel mark from the visual inspector', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(marksFixture).spec);
    const onModelEdit = vi.fn();
    const view = render(<DiagramInspector model={model} selectedId="parallelAV" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    fireEvent.change(screen.getByLabelText('Número de marcas'), { target: { value: '1' } });
    const oneArrow = onModelEdit.mock.calls.at(-1)?.[0];
    view.rerender(<DiagramInspector model={oneArrow} selectedId="parallelAV" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Estilo');
    fireEvent.change(screen.getByLabelText('Altura de las marcas de paralelismo'), { target: { value: '0.5' } });
    const edited = onModelEdit.mock.calls.at(-1)?.[0];

    expect(edited.elements.find((element: { id: string }) => element.id === 'parallelAV')).toMatchObject({
      properties: { markCount: 1 },
      style: { markHeight: 0.5 },
    });
  });

  it('describes relation activation as a reversible pause instead of an extra movement mode', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    expect(screen.getByRole('checkbox', { name: /Relación activa/ })).toBeTruthy();
    expect(screen.getByText(/Se pueden pausar sin perder su configuración/)).toBeTruthy();
    expect(screen.queryByText('Aplicar al mover')).toBeNull();
  });

  it('unlocks a formerly fixed point when a movable constraint is selected', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const model = {
      ...base,
      points: base.points.map(item => item.id === 'pC'
        ? { ...item, fixed: true, constraint: 'fixed' as const }
        : item),
    };
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    fireEvent.change(screen.getByLabelText('Restricción del punto'), { target: { value: 'glider' } });

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === 'pC')).toMatchObject({
      fixed: false,
      constraint: 'glider',
    });
  });

  it('hides snap and magnetism when fixed movement makes them unavailable', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const model = {
      ...base,
      points: base.points.map(item => item.id === 'pC'
        ? { ...item, fixed: true, constraint: 'fixed' as const }
        : item),
    };
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    expect(screen.queryByText('Snap a cuadrícula')).toBeNull();
    expect(screen.queryByText('Magnetismo hacia formas notables')).toBeNull();
    expect(screen.queryByRole('checkbox', { name: 'Ajuste a cuadrícula' })).toBeNull();
    expect(onModelEdit).not.toHaveBeenCalled();
  });

  it('returns a point to free movement after deleting its final relation', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar relación' }));

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((item: { id: string }) => item.id === 'pC')).toMatchObject({
      fixed: false,
      constraint: 'free',
    });
    expect(edited.points.find((item: { id: string }) => item.id === 'pC').constraintIds).toBeUndefined();
  });

  it('groups tools by purpose and creates expression-only curves without fake point references', () => {
    const curveModel = projectDiagramSpecV3ToV2(migrateDiagramSpec(curvesFixture).spec);
    const primitiveModel = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
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
        onResolveDivergence={vi.fn()}
      />,
    );
    const addObjects = screen.getByRole('button', { name: /Añadir objeto/ });
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(addObjects);
    expect(addObjects.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Líneas y contornos')).toBeTruthy();
    expect(screen.getByText('Puntos construidos')).toBeTruthy();
    expect(screen.getByText('Curvas y modelos')).toBeTruthy();
    expect(screen.getByText('Medir y comparar')).toBeTruthy();
    expect(screen.getByText('Texto y explicación')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Marca de congruencia' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Marcas de medida' })).toBeTruthy();
    expect(screen.getAllByRole('menuitem', { name: 'Ángulo orientado' }).length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Ángulo no reflejo (≤ 180°)' }));
    expect(onSetCanvasTool).toHaveBeenCalledWith('nonReflexAngle');
    fireEvent.click(addObjects);
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
    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Punto medio' })[0]);
    expect(onSetCanvasTool).toHaveBeenCalledWith('midpoint');
    expect(addObjects.getAttribute('aria-expanded')).toBe('false');
  });

  it('chooses an existing segment, rather than two points, for ruler-like measure marks', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
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
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(areasFixture).spec);
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
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(marksFixture).spec);
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

    expect(screen.getByLabelText('Punto del primer lado para Ángulo orientado')).toBeTruthy();
    expect(screen.getByLabelText('Vértice para Ángulo orientado')).toBeTruthy();
    expect(screen.getByLabelText('Punto del segundo lado para Ángulo orientado')).toBeTruthy();

    picker.unmount();
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="angleAVB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');
    expect(screen.getByLabelText('Vértice de Ángulo orientado')).toBeTruthy();
    openInspectorSection('Estilo');
    fireEvent.change(screen.getByLabelText('Radio de la marca angular'), { target: { value: '0.8' } });

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === 'angleAVB')).toMatchObject({ style: { angleRadius: 0.8 } });
  });

  it('edits the radius of a non-reflex angle through the same visual controls', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(marksFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="nonReflexAngleAVB" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    openInspectorSection('Geometría');
    expect(screen.getByLabelText('Vértice de Ángulo no reflejo (≤ 180°)')).toBeTruthy();
    openInspectorSection('Estilo');
    fireEvent.change(screen.getByLabelText('Radio de la marca angular'), { target: { value: '0.9' } });

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === 'nonReflexAngleAVB')).toMatchObject({ style: { angleRadius: 0.9 } });
  });

  it('persists the dashed option for a polygon', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const polygon = model.elements.find(item => item.kind === 'polygon');
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId={polygon?.id ?? ''} onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Estilo');

    fireEvent.click(screen.getByRole('checkbox', { name: '¿Línea discontinua?' }));

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.elements.find((item: { id: string }) => item.id === polygon?.id)).toMatchObject({ dashed: true });
  });

  it('edits information panels in viewport-relative percentages', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(annotationsFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="panelA" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    const openBtn = screen.getByRole('button', { name: /Editar contenido y diseño del panel/i });
    if (openBtn) fireEvent.click(openBtn);
    fireEvent.click(screen.getByRole('tab', { name: 'Posición' }));
    fireEvent.change(screen.getByLabelText('Tipo de anclaje del panel'), { target: { value: 'viewport' } });
    const positioned = onModelEdit.mock.calls.at(-1)?.[0];
    expect(positioned.elements.find((item: { id: string }) => item.id === 'panelA')).toMatchObject({
      refs: [],
      properties: { anchorMode: 'viewport', viewportPosition: [0.08, 0.22] },
    });
  });

  it('offers title alignment as a viewport-position preset without removing manual coordinates', () => {
    const baseModel = projectDiagramSpecV3ToV2(migrateDiagramSpec(annotationsFixture).spec);
    const model = {
      ...baseModel,
      elements: baseModel.elements.map(item => item.id === 'panelA'
        ? { ...item, refs: [], properties: { ...item.properties, anchorMode: 'viewport' as const, viewportPosition: [0.45, 0.35] as [number, number] } }
        : item),
    };
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="panelA" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    const openBtn = screen.getByRole('button', { name: /Editar contenido y diseño del panel/i });
    if (openBtn) fireEvent.click(openBtn);
    fireEvent.click(screen.getByRole('tab', { name: 'Posición' }));

    expect(screen.getByLabelText('Posición horizontal del panel')).toBeTruthy();
    expect(screen.getByLabelText('Posición vertical del panel')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Alinear panel con el título' }));

    const positioned = onModelEdit.mock.calls.at(-1)?.[0];
    expect(positioned.elements.find((item: { id: string }) => item.id === 'panelA')).toMatchObject({
      properties: { anchorMode: 'viewport', viewportPosition: [0, 0] },
    });
  });

  it('uses explicit front and back actions instead of making authors guess numeric order', () => {
    const model = projectDiagramSpecV3ToV2(migrateDiagramSpec(pointsFixture).spec);
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);

    openInspectorSection('Interacción');
    fireEvent.click(screen.getByText(/Organización visual/));
    fireEvent.click(screen.getByRole('button', { name: 'Traer al frente' }));

    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    const selected = edited.points.find((item: { id: string }) => item.id === 'pC');
    const peers = [...edited.points, ...edited.elements].filter((item: { id: string; layerId: string }) => item.layerId === selected.layerId && item.id !== selected.id);
    expect(selected.order).toBeGreaterThan(Math.max(...peers.map((item: { order: number }) => item.order)));
    expect(screen.getByText(/Una capa superior siempre queda delante/)).toBeTruthy();
  });
});
