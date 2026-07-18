import { describe, expect, it } from 'vitest';
import {
  createScenePlan,
  diagramPlaybackReducer,
  evaluateStepOverlayContent,
  initialDiagramPlaybackState,
  parseDiagramSpecV2,
} from '../../../../src/shared/diagrams/spec';
import {
  createTemplateModel,
  duplicateStep,
  moveStep,
  removeStep,
  renameElement,
  updateStepObjectState,
} from '../../../../src/features/editor/diagrams/model/commands';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { classifyEmbeddedDiagramSource } from '../../../../src/features/editor/diagrams/source/parser';

function complexSequence() {
  const base = createTemplateModel('demostracion-pasos', 'Secuencia compleja', 'demostracion');
  const stable = {
    ...base,
    componentId: 'demo-compleja',
    elements: base.elements.map(item => item.id === 'segAB' ? { ...item, targetId: 'base-estable' } : item),
  };
  return {
    ...stable,
    steps: updateStepObjectState(stable.steps, 'step2', 'step2Altura', {
      visible: true,
      emphasis: 'primary',
      interactive: false,
      label: 'Altura construida',
      overlay: {
        visible: true,
        title: 'Longitud de la altura',
        content: 'h = {value}',
        expression: 'segAB.length / 2',
        unit: 'u',
        precision: 1,
        position: 'top-right',
      },
    }),
  };
}

describe('Phase 4 step model', () => {
  it('creates, duplicates, removes and reorders steps without sharing nested state', () => {
    const model = complexSequence();
    const duplicated = duplicateStep(model.steps, 'step2');
    expect(duplicated).toHaveLength(4);
    expect(duplicated[2].label).toContain('(copia)');
    expect(duplicated[2].objectStates).toEqual(duplicated[1].objectStates);
    expect(duplicated[2].objectStates).not.toBe(duplicated[1].objectStates);

    const moved = moveStep(duplicated, duplicated[2].id, -1);
    expect(moved[1].id).toBe(duplicated[2].id);
    expect(removeStep(moved, moved[1].id)).toHaveLength(3);
  });

  it('keeps temporal step emphasis separate from external highlight', () => {
    const model = complexSequence();
    const plan = createScenePlan(model, { activeStepId: 'step2', highlightedIds: ['segAB'] });
    const height = plan.find(entry => entry.item.id === 'step2Altura');
    const base = plan.find(entry => entry.item.id === 'segAB');
    expect(height).toMatchObject({ visible: true, stepEmphasis: 'primary', interactive: false, locked: true, label: 'Altura construida' });
    expect(height?.highlighted).toBe(false);
    expect(base?.highlighted).toBe(true);
    expect(base?.stepEmphasis).toBe('none');
  });

  it('preserves the public target when the internal object is renamed', () => {
    const model = complexSequence();
    const renamed = renameElement(model, 'segAB', 'segmentoInterno');
    const item = renamed.elements.find(element => element.id === 'segmentoInterno');
    expect(item?.targetId).toBe('base-estable');
    expect(renamed.steps.every(step => !step.visibleTargets.includes('segAB'))).toBe(true);
    expect(renamed.steps.some(step => step.visibleTargets.includes('segmentoInterno'))).toBe(true);
  });

  it('renames a geometric attractor without losing the point relationship', () => {
    const base = complexSequence();
    const pointId = base.points.find(point => !base.elements.find(element => element.id === 'segAB')?.refs.includes(point.id))!.id;
    const model = {
      ...base,
      points: base.points.map(point => point.id === pointId ? { ...point, attractorIds: ['segAB'] } : point),
      dependencies: [...(base.dependencies ?? []), { sourceId: 'segAB', targetId: pointId, relation: 'constraint' as const }],
    };

    const renamed = renameElement(model, 'segAB', 'guiaBase');

    expect(renamed.points.find(point => point.id === pointId)?.attractorIds).toEqual(['guiaBase']);
    expect(renamed.dependencies).toContainEqual({ sourceId: 'guiaBase', targetId: pointId, relation: 'constraint' });
  });

  it('navigates playback deterministically and pauses at the end', () => {
    const steps = complexSequence().steps;
    let state = initialDiagramPlaybackState(steps);
    expect(state.activeStepId).toBe('step1');
    state = diagramPlaybackReducer(state, { type: 'play' });
    state = diagramPlaybackReducer(state, { type: 'tick', steps });
    expect(state).toMatchObject({ activeStepId: 'step2', playing: true });
    state = diagramPlaybackReducer(state, { type: 'tick', steps });
    state = diagramPlaybackReducer(state, { type: 'tick', steps });
    expect(state).toMatchObject({ activeStepId: 'step3', playing: false });
    expect(diagramPlaybackReducer(state, { type: 'previous', steps }).activeStepId).toBe('step2');
    expect(diagramPlaybackReducer(state, { type: 'reset', steps }).activeStepId).toBe('step1');
  });

  it('evaluates reactive overlay expressions without executing JavaScript', () => {
    const overlay = complexSequence().steps[1].objectStates?.step2Altura.overlay;
    if (!overlay) throw new Error('La secuencia compleja debe incluir overlay.');
    expect(evaluateStepOverlayContent(overlay, { 'segAB.length': 7 })).toBe('h = 3.5 u');
    expect(evaluateStepOverlayContent({ ...overlay, expression: 'missing.value' }, {})).toBe('h = valor no definido');
  });

  it('rejects missing step references, duplicate public targets and invalid overlay references', () => {
    const model = complexSequence();
    const duplicateTarget = {
      ...model,
      points: model.points.map((item, index) => index < 2 ? { ...item, targetId: 'duplicado' } : item),
    };
    expect(parseDiagramSpecV2(duplicateTarget).success).toBe(false);

    const missing = {
      ...model,
      steps: model.steps.map((item, index) => index === 0 ? { ...item, visibleTargets: [...item.visibleTargets, 'no-existe'] } : item),
    };
    expect(parseDiagramSpecV2(missing).success).toBe(false);

    const invalidOverlay = {
      ...model,
      steps: model.steps.map((item, index) => index === 1 ? {
        ...item,
        objectStates: {
          ...item.objectStates,
          step2Altura: {
            ...item.objectStates?.step2Altura,
            overlay: { ...item.objectStates?.step2Altura.overlay, visible: true, title: 'Inválido', content: '{value}', expression: 'objetoFantasma.x' },
          },
        },
      } : item),
    };
    const parsed = parseDiagramSpecV2(invalidOverlay);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('objetoFantasma.x');
  });

  it('saves and reopens a complex sequence with exact state', () => {
    const model = complexSequence();
    const generated = generateDiagramSource(model, 'SecuenciaCompleja');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const reopened = classifyEmbeddedDiagramSource(generated.source);
    expect(reopened?.status).toBe('visual-exact');
    if (reopened?.status !== 'visual-exact') return;
    expect(reopened.model).toEqual(model);
    expect(reopened.model.steps[1].objectStates?.step2Altura.overlay?.expression).toBe('segAB.length / 2');
    const regenerated = generateDiagramSource(reopened.model, 'SecuenciaCompleja');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });
});
