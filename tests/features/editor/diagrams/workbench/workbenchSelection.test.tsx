import { describe, expect, it } from 'vitest';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import { validConstructionRefs } from '@/fixed-pages/editor/diagrams/model/tools/guidedConstructions';
import {
  effectiveSelection,
  parseOptionalNumber,
  primaryIdForSelection,
  repairBrokenReferences,
  syncStepObjectVisibility,
  toggleAdditiveSelection,
} from '@/fixed-pages/editor/diagrams/ui/workbenchSelection';
import type { VisualDiagramModel, VisualStep } from '@/fixed-pages/editor/diagrams/model/types';
import { element, modelPoints, point } from '@/fixed-pages/editor/diagrams/model';
import { constrained, pointById, relationFor, sceneSpec } from '../../../../helpers/diagramSpec';

function miniModel(overrides: Partial<VisualDiagramModel> = {}): VisualDiagramModel {
  return sceneSpec({
    title: 'Test',
    componentId: 'Test',
    viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
    layers: [{ id: 'geometry', label: 'G', order: 0, visible: true, locked: false }],
    objects: [
      point('pA', 'A', 0, 0, false, 'carbon'),
      point('pB', 'B', 1, 0, false, 'carbon'),
      element('segAB', 'AB', 'segment', ['pA', 'pB'], 'pavo'),
    ],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pA', 'pB', 'segAB'] }],
    ...overrides,
  });
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

  it('repairBrokenReferences drops dangling objects and relations', () => {
    const model = miniModel({
      objects: [
        constrained(point('pA', 'A', 0, 0, false, 'carbon'), ['cBad']),
        point('pB', 'B', 1, 0, false, 'carbon'),
        element('segAB', 'AB', 'segment', ['pA', 'missing'], 'pavo'),
        element('segBA', 'BA', 'segment', ['pB', 'pA'], 'pavo'),
      ],
      relations: [relationFor('on', 'cBad', 'Bad', ['pA', 'gone'])],
    });
    const next = repairBrokenReferences(model);
    expect(next.objects.map(object => object.id)).toEqual(['pA', 'pB', 'segBA']);
    expect(next.relations).toEqual([]);
    expect(pointById(next, 'pA').mobility).toEqual({ type: 'free' });
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
    expect(modelPoints(t).length).toBeGreaterThan(0);
  });
});
