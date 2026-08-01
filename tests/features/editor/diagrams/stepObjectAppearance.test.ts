import { describe, expect, it } from 'vitest';
import { createScenePlan, resolveStepSceneAppearance } from '../../../../src/diagrams/spec/scene';
import { createTemplateModel, updateStepObjectState } from '../../../../src/fixed-pages/editor/diagrams/model';

describe('step object appearance', () => {
  it('merges temporal color, label, dashed and style overrides into the scene plan', () => {
    const base = createTemplateModel('demostracion-pasos', 'Apariencia temporal', 'demostracion');
    const model = {
      ...base,
      steps: updateStepObjectState(base.steps, 'step2', 'segAB', {
        color: 'granada',
        label: 'Base resaltada',
        dashed: true,
        showLabel: false,
        style: { strokeWidth: 4.2, fillOpacity: 0.4 },
      }),
    };

    const appearance = resolveStepSceneAppearance(
      model.elements.find(item => item.id === 'segAB')!,
      model.steps[1].objectStates?.segAB,
    );
    expect(appearance).toMatchObject({
      color: 'granada',
      label: 'Base resaltada',
      stepShowLabel: false,
      stepDashed: true,
      style: expect.objectContaining({ strokeWidth: 4.2, fillOpacity: 0.4 }),
    });

    const plan = createScenePlan(model, { activeStepId: 'step2' });
    const segment = plan.find(entry => entry.item.id === 'segAB');
    expect(segment).toMatchObject({
      color: 'granada',
      label: 'Base resaltada',
      stepShowLabel: false,
      stepDashed: true,
      style: expect.objectContaining({ strokeWidth: 4.2, fillOpacity: 0.4 }),
    });
  });
});
