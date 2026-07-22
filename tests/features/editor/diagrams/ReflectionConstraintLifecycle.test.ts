import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  reflectionConstraintForPoint,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForPoint,
  setReflectionConstraintForSegment,
} from '../../../../src/features/editor/diagrams/model/reflectionConstraints';
import { SegmentReflectionConstraintEditor } from '../../../../src/features/editor/diagrams/ui/SegmentReflectionConstraintEditor';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';

const baseModel: VisualDiagramModel = {
  version: '2.0',
  renderer: 'matematika-diagram-renderer-v2',
  title: 'Test Reflejo',
  componentId: 'test-reflejo',
  category: 'Demos',
  mode: 'simulation',
  axis: false,
  grid: false,
  showLabels: true,
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  layers: [
    { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
    { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
  ],
  groups: [],
  points: [
    { id: 'pP', label: 'P', x: 1, y: 3, showLabel: true, fixed: false, color: 'terracota', constraint: 'free', layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pC', label: 'C', x: 3, y: 3, showLabel: true, fixed: true, color: 'salvia', constraint: 'fixed', layerId: 'geometry', order: 1, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pPrime', label: "P'", x: 0, y: 0, showLabel: true, fixed: false, color: 'ocre', constraint: 'constrained', constraintIds: ['cReflP'], layerId: 'geometry', order: 2, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pA', label: 'A', x: 0, y: 0, showLabel: true, fixed: true, color: 'pavo', constraint: 'fixed', layerId: 'geometry', order: 3, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pB', label: 'B', x: 4, y: 0, showLabel: true, fixed: true, color: 'pavo', constraint: 'fixed', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pQ', label: 'Q', x: 2, y: 4, showLabel: true, fixed: false, color: 'terracota', constraint: 'free', layerId: 'geometry', order: 5, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pQPrime', label: "Q'", x: 0, y: 0, showLabel: true, fixed: false, color: 'granada', constraint: 'constrained', constraintIds: ['cReflQ'], layerId: 'geometry', order: 6, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
  ],
  elements: [
    { id: 'segAB', label: 'Eje AB', kind: 'segment', refs: ['pA', 'pB'], color: 'carbon', layerId: 'geometry', order: 10, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'segS1', label: 'Segmento S1', kind: 'segment', refs: ['pP', 'pQ'], color: 'pavo', layerId: 'geometry', order: 11, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'segS2', label: 'Segmento S2', kind: 'segment', refs: ['pPrime', 'pQPrime'], color: 'granada', layerId: 'geometry', order: 12, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
  ],
  sliders: [],
  steps: [],
  constraints: [
    { id: 'cReflP', label: "Reflejo central de P respecto de C", kind: 'reflection', refs: ['pPrime', 'pC', 'pP'], enabled: true },
    { id: 'cReflQ', label: "Reflejo axial de Q respecto del eje AB", kind: 'reflection', refs: ['pQPrime', 'segAB', 'pQ'], enabled: true },
  ],
  dependencies: [],
  note: 'Test note',
  extensions: {},
};

function segmentReflectionConstraints(model: VisualDiagramModel, segmentId: string) {
  const segment = model.elements.find(element => element.id === segmentId && element.kind === 'segment');
  if (!segment) return [];
  return (model.constraints ?? []).filter(constraint => (
    constraint.kind === 'reflection'
    && (
      constraint.refs[0] === segmentId
      || segment.refs.some(ref => constraint.refs[0] === ref)
    )
  ));
}

describe('Reflection constraint lifecycle', () => {
  it('setReflectionConstraintForSegment creates a coherent group (segment + endpoint reflections)', () => {
    const updated = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    const segmentConstraint = reflectionConstraintForSegment(updated, 'segS2');

    expect(segmentConstraint).toBeDefined();
    expect(segmentConstraint?.refs).toEqual(['segS2', 'segS1', 'segAB']);
    expect(reflectionConstraintForPoint(updated, 'pPrime')).toBeDefined();
    expect(reflectionConstraintForPoint(updated, 'pQPrime')).toBeDefined();
    expect(segmentReflectionConstraints(updated, 'segS2')).toHaveLength(3);
  });

  it('removeSegmentReflectionConstraint removes the segment constraint and both endpoint reflections', () => {
    const withReflection = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    expect(segmentReflectionConstraints(withReflection, 'segS2')).toHaveLength(3);

    const removed = removeSegmentReflectionConstraint(withReflection, 'segS2');

    expect(reflectionConstraintForSegment(removed, 'segS2')).toBeUndefined();
    expect(reflectionConstraintForPoint(removed, 'pPrime')).toBeUndefined();
    expect(reflectionConstraintForPoint(removed, 'pQPrime')).toBeUndefined();
    expect(removed.constraints?.filter(constraint => constraint.kind === 'reflection')).toHaveLength(0);
    expect(removed.points.find(point => point.id === 'pPrime')).toMatchObject({ constraint: 'free' });
    expect(removed.points.find(point => point.id === 'pQPrime')).toMatchObject({ constraint: 'free' });
  });

  it('re-applying segment reflection replaces the previous group instead of accumulating', () => {
    const first = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    expect(segmentReflectionConstraints(first, 'segS2')).toHaveLength(3);

    const second = setReflectionConstraintForSegment(first, 'segS2', 'pC', 'segS1');
    const secondGroup = segmentReflectionConstraints(second, 'segS2');

    expect(secondGroup).toHaveLength(3);
    expect(second.constraints?.filter(constraint => constraint.kind === 'reflection')).toHaveLength(3);
    expect(reflectionConstraintForSegment(second, 'segS2')?.refs).toEqual(['segS2', 'segS1', 'pC']);
  });

  it('setReflectionConstraintForPoint replaces an existing point reflection instead of accumulating', () => {
    const first = setReflectionConstraintForPoint(baseModel, 'pQPrime', 'pC', 'pQ');
    const firstId = reflectionConstraintForPoint(first, 'pQPrime')?.id;

    const second = setReflectionConstraintForPoint(first, 'pQPrime', 'segAB', 'pQ');
    const secondConstraint = reflectionConstraintForPoint(second, 'pQPrime');

    expect(secondConstraint).toBeDefined();
    expect(secondConstraint?.id).toBe(firstId);
    expect(secondConstraint?.refs).toEqual(['pQPrime', 'segAB', 'pQ']);
    expect(second.points.find(point => point.id === 'pQPrime')?.constraintIds).toEqual([firstId]);
    expect(second.constraints?.filter(constraint => (
      constraint.kind === 'reflection' && constraint.refs[0] === 'pQPrime'
    ))).toHaveLength(1);
  });

  it('SegmentReflectionConstraintEditor shows one active reflection entry, not three', () => {
    const model = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    const segment = model.elements.find(element => element.id === 'segS2')!;

    render(React.createElement(SegmentReflectionConstraintEditor, { model, segment, onModelEdit: vi.fn() }));

    expect(screen.getAllByRole('button', { name: /^Eliminar / })).toHaveLength(1);
  });
});
