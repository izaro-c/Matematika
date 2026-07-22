import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DiagramElementKind } from '../../../../src/shared/diagrams/public';
import { DiagramElementAppearanceEditor } from '../../../../src/features/editor/diagrams/ui/DiagramElementAppearanceEditor';
import { DiagramInspector } from '../../../../src/features/editor/diagrams/ui/DiagramInspector';
import { ELEMENT_INSPECTOR_CAPABILITIES } from '../../../../src/features/editor/diagrams/model/elementInspectorCapabilities';
import { element, createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';

const ALL_KINDS: DiagramElementKind[] = [
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'intersection', 'midpoint', 'perpendicularFoot',
  'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
  'rightAngle', 'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark',
  'dimensionLine', 'measurement', 'grid', 'areaDecomposition', 'text', 'label', 'formula',
  'infoPanel',
];

const FILL_KINDS = new Set<DiagramElementKind>(['polygon', 'circle', 'angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark', 'areaDecomposition']);
const POINT_KINDS = new Set<DiagramElementKind>(['intersection', 'midpoint', 'perpendicularFoot']);
const ANNOTATION_KINDS = new Set<DiagramElementKind>(['dimensionLine', 'measurement', 'text', 'label', 'formula', 'infoPanel']);
const NON_STROKE_KINDS = new Set<DiagramElementKind>([...POINT_KINDS, 'measurement', 'text', 'label', 'formula', 'infoPanel']);
const DASHED_KINDS = new Set<DiagramElementKind>([
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'baseExtension', 'perpendicular', 'parallel',
  'angleBisector', 'dimensionLine', 'grid', 'areaDecomposition',
]);

afterEach(cleanup);

function renderAppearance(kind: DiagramElementKind) {
  render(
    <DiagramElementAppearanceEditor
      element={element(`element-${kind}`, kind, kind, [], 'carbon')}
      onElementChange={vi.fn()}
      onStyleChange={vi.fn()}
    />,
  );
}

describe('element inspector capability matrix', () => {
  it('is exhaustive and keeps every kind behind an explicit typed capability entry', () => {
    expect(Object.keys(ELEMENT_INSPECTOR_CAPABILITIES).sort()).toEqual([...ALL_KINDS].sort());
  });

  it.each(ALL_KINDS)('shows only appearance controls consumed by %s', kind => {
    renderAppearance(kind);
    expect(Boolean(screen.queryByLabelText('Opacidad de relleno'))).toBe(FILL_KINDS.has(kind));
    expect(Boolean(screen.queryByLabelText('Grosor del elemento'))).toBe(!NON_STROKE_KINDS.has(kind));
    expect(Boolean(screen.queryByLabelText('¿Línea discontinua?'))).toBe(DASHED_KINDS.has(kind));
    expect(Boolean(screen.queryByLabelText('Tamaño del punto construido'))).toBe(POINT_KINDS.has(kind));
    expect(Boolean(screen.queryByLabelText('Tamaño del texto del elemento'))).toBe(ANNOTATION_KINDS.has(kind) || POINT_KINDS.has(kind));
  });

  it('keeps conditional panel variants inside the content editor and removes geometric controls', () => {
    const base = createTemplateModel('lienzo-inicial', 'Panel');
    const panel = element('panel', 'Panel', 'infoPanel', [], 'pizarra', true, {
      text: 'Contenido principal',
      properties: { anchorMode: 'viewport', viewportPosition: [0.1, 0.2], textRules: [{ when: '1', text: 'Variante' }] },
    });
    const model = { ...base, elements: [panel] };
    render(<DiagramInspector model={model} selectedId="panel" onSelect={vi.fn()} onModelEdit={vi.fn()} onDeleteSelected={vi.fn()} />);

    const openBtn = screen.getByRole('button', { name: /Editar contenido y diseño del panel/i });
    if (openBtn) fireEvent.click(openBtn);
    
    expect(screen.getByRole('heading', { name: 'Panel informativo' })).toBeTruthy();

    expect(screen.queryByLabelText('Opacidad de relleno')).toBeNull();
    expect(screen.queryByLabelText('Grosor del elemento')).toBeNull();
    expect(screen.queryByLabelText('¿Línea discontinua?')).toBeNull();
    expect(screen.queryByText('Referencias geométricas')).toBeNull();
  });

  it('exposes the meaningful offset of a dimension line', () => {
    const base = createTemplateModel('lienzo-inicial', 'Cota');
    const dimension = element('dimension', 'Cota', 'dimensionLine', [base.points[0].id, base.points[0].id], 'pizarra');
    render(<DiagramInspector model={{ ...base, elements: [dimension] }} selectedId="dimension" onSelect={vi.fn()} onModelEdit={vi.fn()} onDeleteSelected={vi.fn()} />);
    expect(screen.getByLabelText('Separación de la línea de cota')).toBeTruthy();
  });
});
