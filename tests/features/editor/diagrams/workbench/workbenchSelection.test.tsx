import { describe, expect, it } from 'vitest';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/templateModels';
import { validConstructionRefs } from '@/fixed-pages/editor/diagrams/model/guidedConstructions';
import {
  effectiveSelection,
  parseOptionalNumber,
  primaryIdForSelection,
  repairBrokenReferences,
  syncStepObjectVisibility,
  toggleAdditiveSelection,
} from '@/fixed-pages/editor/diagrams/ui/workbenchSelection';
import type { VisualDiagramModel, VisualStep } from '@/fixed-pages/editor/diagrams/model/types';
import { DIAGRAM_RENDERER_V2_ID, DIAGRAM_SPEC_V2_VERSION } from '@/diagrams/spec';

function miniModel(overrides: Partial<VisualDiagramModel> = {}): VisualDiagramModel {
  return {
    version: DIAGRAM_SPEC_V2_VERSION,
    renderer: DIAGRAM_RENDERER_V2_ID,
    title: 'Test',
    componentId: 'Test',
    category: 'demostracion',
    mode: 'simulation',
    axis: false,
    grid: false,
    showLabels: true,
    viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5] },
    layers: [{ id: 'geometry', label: 'G', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      { id: 'pA', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
      { id: 'pB', label: 'B', x: 1, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
    ],
    elements: [
      { id: 'segAB', label: 'AB', kind: 'segment', refs: ['pA', 'pB'], color: 'pavo', groupIds: [] },
    ],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', visibleTargets: ['pA', 'pB', 'segAB'] }],
    constraints: [],
    dependencies: [],
    ...overrides,
  };
}

describe('workingSceneSelection helpers', () => {
  it('does not revive state.selectedId after local selection is cleared', () => {
    const model = miniModel();
    expect(effectiveSelection(model, [], 'pA')).toEqual([]);
    expect(effectiveSelection(model, ['pA'], 'pB')).toEqual(['pA']);
    expect(primaryIdForSelection([])).toBe('');
    expect(primaryIdForSelection(toggleAdditiveSelection(['pA'], 'pA'))).toBe('');
  });

  it('syncs objectStates.visible with visibleTargets on step toggle', () => {
    const step: VisualStep = {
      id: 's1',
      label: 'Paso',
      visibleTargets: ['pA', 'pB'],
      objectStates: { pA: { visible: true, emphasis: 'none' } },
    };
    const hidden = syncStepObjectVisibility(step, 'pA', false);
    expect(hidden.visibleTargets).not.toContain('pA');
    expect(hidden.objectStates?.pA?.visible).toBe(false);

    const shown = syncStepObjectVisibility(hidden, 'pA', true);
    expect(shown.visibleTargets).toContain('pA');
    expect(shown.objectStates?.pA?.visible).toBe(true);
  });

  it('repairBrokenReferences drops dead deps and constraintIds', () => {
    const model = miniModel({
      elements: [
        { id: 'segAB', label: 'AB', kind: 'segment', refs: ['pA', 'missing'], color: 'pavo', groupIds: [] },
      ],
      constraints: [{ id: 'cBad', label: 'Bad', kind: 'on', refs: ['pA', 'gone'], enabled: true }],
      points: [
        {
          id: 'pA', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'constrained',
          constraintIds: ['cBad'], groupIds: [], target: true,
        },
        { id: 'pB', label: 'B', x: 1, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
      ],
      dependencies: [
        { sourceId: 'gone', targetId: 'pA', relation: 'construction' },
        { sourceId: 'pB', targetId: 'pA', relation: 'constraint', constraintId: 'cBad' },
        { sourceId: 'pB', targetId: 'segAB', relation: 'construction' },
      ],
    });
    const next = repairBrokenReferences(model);
    expect(next.elements[0].refs).toEqual(['pA']);
    expect(next.constraints).toEqual([]);
    expect(next.points.find(p => p.id === 'pA')?.constraintIds).toEqual([]);
    expect(next.dependencies).toEqual([
      { sourceId: 'pB', targetId: 'segAB', relation: 'construction' },
    ]);
  });

  it('parseOptionalNumber preserves zero', () => {
    expect(parseOptionalNumber('0', 7)).toBe(0);
    expect(parseOptionalNumber('', 7)).toBe(7);
    expect(parseOptionalNumber('1.5', 0)).toBe(1.5);
  });

  it('validConstructionRefs rejects duplicate guided refs', () => {
    expect(validConstructionRefs('mediatriz', { a: 'pA', b: 'pA', c: '' })).toBe(false);
    expect(validConstructionRefs('mediatriz', { a: 'pA', b: 'pB', c: '' })).toBe(true);
  });

  it('template still boots for sandbox', () => {
    const t = createTemplateModel('triangulo-deformable', 'T', 'demostración');
    expect(t.points.length).toBeGreaterThan(0);
  });
});
