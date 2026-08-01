import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DiagramElementKind } from '../../../../src/diagrams/public';
import { WorkbenchElementInspector } from '../../../../src/fixed-pages/editor/diagrams/ui/WorkbenchElementInspector';
import { element, createTemplateModel } from '../../../../src/fixed-pages/editor/diagrams/model';
import type { VisualDiagramModel, VisualElement } from '../../../../src/fixed-pages/editor/diagrams/model/types';

afterEach(cleanup);

const ALL_KINDS: DiagramElementKind[] = [
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'intersection', 'midpoint', 'perpendicularFoot',
  'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
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

function setupV2InspectorForKind(
  kind: DiagramElementKind,
  extra: Partial<VisualElement> = {}
) {
  const base = createTemplateModel('estatico', 'Escena', 'diagram');
  const segment = base.elements.find(item => item.kind === 'segment')!;
  const refs = kind === 'label' ? [segment.id] : [base.points[0].id];
  const targetElement = element(`el-${kind}`, `Elemento ${kind}`, kind, refs, 'pizarra', true, {
    text: 'Texto base',
    properties: { anchorMode: 'reference', anchorParameter: 0.5 },
    ...extra,
  });

  const model: VisualDiagramModel = {
    ...base,
    elements: [...base.elements, targetElement],
  };

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

describe('V2ElementPropertiesBelonging', () => {
  it.each(ALL_KINDS)('ensures fill opacity is only shown for fill kinds in V2 inspector (%s)', (kind) => {
    setupV2InspectorForKind(kind);
    const fillControl = screen.queryByLabelText(/^Opacidad Relleno$/i);
    expect(Boolean(fillControl)).toBe(FILL_KINDS.has(kind));
  });

  it.each(ALL_KINDS.filter(k => k !== 'functionCurve'))('does not show function curve inputs for %s', (kind) => {
    setupV2InspectorForKind(kind);
    expect(screen.queryByLabelText(/Expresión \$f\(x\)\$/i)).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => k !== 'parametricCurve'))('does not show parametric curve inputs for %s', (kind) => {
    setupV2InspectorForKind(kind);
    expect(screen.queryByLabelText(/Expresión \$x\(t\)\$/i)).toBeNull();
    expect(screen.queryByLabelText(/Expresión \$y\(t\)\$/i)).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => !MARK_KINDS.has(k) && k !== 'segment'))('does not show mark properties section for non-mark %s', (kind) => {
    setupV2InspectorForKind(kind);
    expect(screen.queryByText('Marcas & Anotaciones Visuales')).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => !PANEL_OR_TEXT_KINDS.has(k)))('does not show panel positioning for non-panel/text %s', (kind) => {
    setupV2InspectorForKind(kind);
    expect(screen.queryByText('Posicionamiento del Panel')).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => k !== 'segment'))('does not show segment equal length constraint for %s', (kind) => {
    setupV2InspectorForKind(kind);
    expect(screen.queryByText('Igualar Longitud de Segmento')).toBeNull();
  });

  it.each(ALL_KINDS.filter(k => !['angle', 'nonReflexAngle', 'rightAngle'].includes(k)))('does not show angle amplitude equality for %s', (kind) => {
    setupV2InspectorForKind(kind);
    expect(screen.queryByText('Igualar Amplitud de Ángulo')).toBeNull();
  });
});
