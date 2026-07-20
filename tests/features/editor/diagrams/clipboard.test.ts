import { describe, expect, it } from 'vitest';
import {
  createDiagramClipboard,
  createTemplateModel,
  element,
  parseDiagramClipboard,
  pasteDiagramClipboard,
  serializeDiagramClipboard,
  step,
} from '../../../../src/features/editor/diagrams/model/commands';
import { parseDiagramSpecV2 } from '../../../../src/shared/diagrams/public';

describe('diagram structured clipboard', () => {
  it('copies and pastes one object with the supporting references it needs', () => {
    const model = createTemplateModel('triangulo-deformable', 'Copia simple', 'definicion');
    const segment = model.elements.find(item => item.kind === 'segment')!;
    const payload = createDiagramClipboard(model, [segment.id]);
    expect(payload).not.toBeNull();
    if (!payload) return;

    const result = pasteDiagramClipboard(model, payload);
    const pasted = result.model.elements.find(item => item.id === `${segment.id}_copy`)!;

    expect(pasted.refs).toEqual(segment.refs.map(ref => `${ref}_copy`));
    expect(pasted.targetId).not.toBe(segment.targetId);
    expect(result.selectedId).toBe(pasted.id);
    expect(parseDiagramSpecV2(result.model).success).toBe(true);
  });

  it('copies a group as one coherent subgraph and rewrites expressions, targets and step states', () => {
    const base = createTemplateModel('triangulo-deformable', 'Copia de grupo', 'definicion');
    const sourceSegment = base.elements.find(item => item.id === 'segAB')!;
    const formula = element('formulaArea', 'Fórmula de longitud', 'formula', [sourceSegment.id], 'pizarra', true, {
      text: 'L^2 = {value}',
      properties: { expression: 'segAB.length^2', precision: 2 },
      groupIds: ['groupTriangle'],
    });
    const memberIds = ['pA', 'pB', sourceSegment.id, formula.id];
    const model = {
      ...base,
      points: base.points.map(item => memberIds.includes(item.id) ? { ...item, groupIds: ['groupTriangle'] } : item),
      elements: [...base.elements.map(item => memberIds.includes(item.id) ? { ...item, groupIds: ['groupTriangle'] } : item), formula],
      groups: [{
        id: 'groupTriangle',
        label: 'Construcción AB',
        memberIds,
        visible: true,
        locked: false,
        target: true,
        targetId: 'construction-ab',
        selection: { selectable: true, role: 'primary' as const },
      }],
      steps: [step('step1', 'Presentación', 'Mostrar la construcción.', memberIds)],
      dependencies: [{ sourceId: sourceSegment.id, targetId: formula.id, relation: 'expression' as const }],
    };
    const payload = createDiagramClipboard(model, [], ['groupTriangle']);
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(parseDiagramClipboard(serializeDiagramClipboard(payload))).toEqual(payload);

    const result = pasteDiagramClipboard(model, payload);
    const pastedSegment = result.model.elements.find(item => item.id === 'segAB_copy')!;
    const pastedFormula = result.model.elements.find(item => item.id === 'formulaArea_copy')!;
    const pastedGroup = result.model.groups.find(item => item.id === 'groupTriangle_copy')!;

    expect(pastedSegment.refs).toEqual(['pA_copy', 'pB_copy']);
    expect(pastedFormula.refs).toEqual(['segAB_copy']);
    expect(pastedFormula.properties?.expression).toBe('segAB_copy.length^2');
    expect(pastedGroup.memberIds).toEqual(expect.arrayContaining(['pA_copy', 'pB_copy', 'segAB_copy', 'formulaArea_copy']));
    expect(pastedGroup.targetId).not.toBe('construction-ab');
    expect(result.model.dependencies).toContainEqual({ sourceId: 'segAB_copy', targetId: 'formulaArea_copy', relation: 'expression', constraintId: undefined });
    expect(result.model.steps[0].visibleTargets).toEqual(expect.arrayContaining(['pA_copy', 'pB_copy', 'segAB_copy', 'formulaArea_copy']));
    expect(parseDiagramSpecV2(result.model).success).toBe(true);
  });

  it('rewrites expressions nested in composite panel blocks and their variants', () => {
    const base = createTemplateModel('triangulo-deformable', 'Copia de panel', 'definicion');
    const panel = element('panel', 'Lecturas', 'infoPanel', [], 'pizarra', true, {
      text: '',
      properties: {
        anchorMode: 'viewport', viewportPosition: [0.1, 0.2], infoPanelLayout: 'stack',
        infoPanelBlocks: [{
          id: 'longitud', text: 'AB = {value}', expression: 'segAB.length',
          rules: [{ when: 'gt(segAB.length,2)', text: 'AB² = {value}', expression: 'segAB.length^2' }],
        }],
      },
    });
    const model = {
      ...base,
      elements: [...base.elements, panel],
      dependencies: [{ sourceId: 'segAB', targetId: 'panel', relation: 'expression' as const }],
    };
    const payload = createDiagramClipboard(model, ['panel']);
    expect(payload).not.toBeNull();
    if (!payload) return;

    const result = pasteDiagramClipboard(model, payload);
    const pasted = result.model.elements.find(item => item.id === 'panel_copy')!;
    expect(pasted.properties?.infoPanelBlocks?.[0]).toMatchObject({
      expression: 'segAB_copy.length',
      rules: [{ when: 'gt(segAB_copy.length,2)', expression: 'segAB_copy.length^2' }],
    });
    expect(parseDiagramSpecV2(result.model).success).toBe(true);
  });

  it('rejects arbitrary clipboard text', () => {
    expect(parseDiagramClipboard('{"kind":"another-format"}')).toBeNull();
    expect(parseDiagramClipboard('{"kind":"matematika-diagram-clipboard-v1","rootIds":[],"points":[{}],"elements":[],"sliders":[],"groups":[],"constraints":[],"dependencies":[],"stepStates":[]}')).toBeNull();
    expect(parseDiagramClipboard('not json')).toBeNull();
  });
});
