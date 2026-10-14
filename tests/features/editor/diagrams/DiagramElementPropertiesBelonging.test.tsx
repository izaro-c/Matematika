import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DiagramConstructionKind as DiagramElementKind } from '../../../../src/diagrams/public';
import { WorkbenchElementInspector } from '../../../../src/fixed-pages/editor/diagrams/ui/workbench/WorkbenchElementInspector';
import { element, createTemplateModel, insertObjects, modelElements, modelPoints, elementKind, type ElementOptions } from '../../../../src/fixed-pages/editor/diagrams/model';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';

afterEach(cleanup);

const ALL_KINDS: DiagramElementKind[] = [
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'intersection', 'midpoint', 'perpendicularFoot',
  'segmentExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
  'rightAngle', 'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark',
  'dimensionLine', 'measurement', 'grid', 'areaDecomposition', 'halfPlane', 'areaIntersection',
  'text', 'label', 'formula', 'infoPanel',
];

const FILL_KINDS = new Set<DiagramElementKind>([
  'polygon', 'circle', 'halfPlane', 'areaIntersection', 'areaDecomposition',
  'angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark',
]);

const MARK_KINDS = new Set<DiagramElementKind>([
  'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark',
]);

const PANEL_OR_TEXT_KINDS = new Set<DiagramElementKind>([
  'infoPanel', 'text', 'label', 'formula', 'measurement',
]);

function setupInspectorForKind(
  kind: DiagramElementKind,
  extra: ElementOptions = {}
) {
  const base = createTemplateModel('modelo-estatico', 'Escena', 'diagram');
  const segment = modelElements(base).find(item => elementKind(item) === 'segment')!;
  const refs = kind === 'label' ? [segment.id] : [modelPoints(base)[0].id];
  const targetElement = element(`el-${kind}`, `Elemento ${kind}`, kind, refs, 'mora', true, {
    text: 'Texto base',
    ...extra,
  });

  const model: VisualDiagramModel = insertObjects(base, [targetElement]);

  render(
    <WorkbenchElementInspector
      model={model}
      selectedId={targetElement.id}
      onUpdatePoint={vi.fn()}
      onUpdateElement={vi.fn()}
      onUpdateSlider={vi.fn()}
      onDeleteSelected={vi.fn()}
      onUpdateModel={vi.fn()}
    />
  );
}

describe('DiagramElementPropertiesBelonging', () => {
  it.each(ALL_KINDS)('ensures fill opacity is only shown for fill kinds in inspector (%s)', (kind) => {
    setupInspectorForKind(kind);
    const fillControl = screen.queryByLabelText(/^Opacidad Relleno$/i);
    expect(Boolean(fillControl)).toBe(FILL_KINDS.has(kind));
  });

  it.each(ALL_KINDS.filter(k => k !== 'functionCurve'))('does not show function curve inputs for %s', (kind) => {
    setupInspectorForKind(kind);
    expect(screen.queryByLabelText(/Expresión \$f\(x\)\$/i)).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => k !== 'parametricCurve'))('does not show parametric curve inputs for %s', (kind) => {
    setupInspectorForKind(kind);
    expect(screen.queryByLabelText(/Expresión \$x\(t\)\$/i)).toBeNull();
    expect(screen.queryByLabelText(/Expresión \$y\(t\)\$/i)).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => !MARK_KINDS.has(k) && k !== 'segment'))('does not show mark properties section for non-mark %s', (kind) => {
    setupInspectorForKind(kind);
    expect(screen.queryByText('Marcas & Anotaciones Visuales')).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => !PANEL_OR_TEXT_KINDS.has(k)))('does not show panel positioning for non-panel/text %s', (kind) => {
    setupInspectorForKind(kind);
    expect(screen.queryByText('Posicionamiento del Panel')).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => k !== 'segment'))('does not show segment equal length constraint for %s', (kind) => {
    setupInspectorForKind(kind);
    expect(screen.queryByText('Igualar Longitud de Segmento')).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => !['angle', 'nonReflexAngle', 'rightAngle'].includes(k)))('does not show angle amplitude equality for %s', (kind) => {
    setupInspectorForKind(kind);
    expect(screen.queryByText('Igualar Amplitud de Ángulo')).toBeNull();
  });
});
