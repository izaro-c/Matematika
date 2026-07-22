import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { migrateDiagramSpec, projectDiagramSpecV3ToV2 } from '../../../../../src/shared/diagrams/public';
import primitivesFixture from '../../../../fixtures/diagrams/phase3-euclidean-primitives.json';
import marksFixture from '../../../../fixtures/diagrams/phase3-marks-angles.json';
import { DiagramInspector } from '../../../../../src/features/editor/diagrams/ui/DiagramInspector';
import { AngleEqualityConstraintEditor } from '../../../../../src/features/editor/diagrams/ui/AngleEqualityConstraintEditor';
import { SegmentLengthConstraintEditor } from '../../../../../src/features/editor/diagrams/ui/SegmentLengthConstraintEditor';

function openInspectorSection(name: 'Esencial' | 'Geometría' | 'Estilo' | 'Interacción') {
  fireEvent.click(screen.getByRole('button', { name }));
}

describe('Constraint editor panel stability', () => {
  it('keeps the segment length panel collapsed after applying a constraint', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const model = {
      ...base,
      elements: [
        ...base.elements,
        { ...base.elements[0], id: 'segOC', label: 'Segmento OC', refs: ['pO', 'pC'], order: 20 },
      ],
    };
    const onModelEdit = vi.fn();
    render(<DiagramInspector model={model} selectedId="segOC" onSelect={vi.fn()} onModelEdit={onModelEdit} onDeleteSelected={vi.fn()} />);
    openInspectorSection('Geometría');

    const summary = screen.getByText('Igualar longitudes');
    expect(summary.closest('details')?.open).toBe(false);
    fireEvent.click(summary!);
    expect(summary.closest('details')?.open).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Mantener la misma longitud' }));
    expect(summary.closest('details')?.open).toBe(true);
    expect(onModelEdit).toHaveBeenCalled();
  });

  it('does not auto-open the angle equality panel when reference angles exist', () => {
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

    render(<AngleEqualityConstraintEditor model={model} angle={base.elements.find(element => element.kind === 'nonReflexAngle')!} onModelEdit={vi.fn()} />);
    expect(screen.getByText('Igualar ángulos').closest('details')?.open).toBe(false);
  });

  it('allows editing selects inside an open segment length panel without collapsing', () => {
    const base = projectDiagramSpecV3ToV2(migrateDiagramSpec(primitivesFixture).spec);
    const model = {
      ...base,
      elements: [
        ...base.elements,
        { ...base.elements[0], id: 'segOC', label: 'Segmento OC', refs: ['pO', 'pC'], order: 20 },
      ],
    };
    const onModelEdit = vi.fn();
    render(<SegmentLengthConstraintEditor model={model} segment={model.elements.find(element => element.id === 'segOC')!} onModelEdit={onModelEdit} />);

    fireEvent.click(screen.getByText('Igualar longitudes'));
    const endpointSelect = screen.getByLabelText('Extremo que se ajusta para igualar longitudes') as HTMLSelectElement;
    expect(endpointSelect).toBeTruthy();
    const alternate = [...endpointSelect.options].map(option => option.value).find(value => value !== endpointSelect.value);
    if (alternate) {
      fireEvent.change(endpointSelect, { target: { value: alternate } });
    }
    expect(screen.getByText('Igualar longitudes').closest('details')?.open).toBe(true);
    expect(screen.getByLabelText('Extremo que se ajusta para igualar longitudes')).toBeTruthy();
  });
});
