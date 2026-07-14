import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import curvesFixture from '../../../fixtures/diagrams/phase3-curves.json';
import pointsFixture from '../../../fixtures/diagrams/phase3-points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/phase3-annotations-layers.json';
import { migrateDiagramSpec } from '../../../../src/shared/diagrams/public';
import { DiagramInspector } from '../../../../src/features/editor/diagrams/ui/DiagramInspector';
import { DiagramToolbar } from '../../../../src/features/editor/diagrams/ui/DiagramToolbar';

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

  it('creates and assigns a point constraint from the point inspector', () => {
    const model = migrateDiagramSpec(pointsFixture).spec;
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="pC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '+ Restricción horizontal' }));
    expect(onModelEdit).toHaveBeenCalledWith(expect.objectContaining({
      constraints: expect.arrayContaining([expect.objectContaining({ kind: 'horizontal', refs: ['pC', 'pA'] })]),
      dependencies: expect.arrayContaining([expect.objectContaining({ targetId: 'pC', relation: 'constraint' })]),
    }));
  });

  it('groups tools by purpose and creates expression-only curves without fake point references', () => {
    const model = migrateDiagramSpec(curvesFixture).spec;
    const onAddElement = vi.fn();
    render(
      <DiagramToolbar
        model={model}
        canvasTool="select"
        syncStatus="synced"
        onSetCanvasTool={vi.fn()}
        onAddElement={onAddElement}
        onModelEdit={vi.fn()}
        onAddSlider={vi.fn()}
        onAddStep={vi.fn()}
        onResolveDivergence={vi.fn()}
      />,
    );
    expect(screen.getByText('Geometría')).toBeTruthy();
    expect(screen.getByText('Curvas')).toBeTruthy();
    expect(screen.getByText('Relaciones')).toBeTruthy();
    expect(screen.getByText('Explicación')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Gráfica de función' }));
    expect(onAddElement).toHaveBeenCalledWith('functionCurve');
    fireEvent.click(screen.getByRole('button', { name: 'Panel informativo' }));
    expect(onAddElement).toHaveBeenCalledWith('infoPanel');
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
});
