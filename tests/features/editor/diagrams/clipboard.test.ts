import { describe, expect, it } from 'vitest';
import {
  createDiagramClipboard,
  createTemplateModel,
  element,
  modelElements,
  parseDiagramClipboard,
  pasteDiagramClipboard,
  serializeDiagramClipboard,
  step,
} from '../../../../src/fixed-pages/editor/diagrams/model';
import { objectConstructionReferences, objectKind, parseDiagramSpecV3, type AnnotationObject, type DiagramObject } from '../../../../src/diagrams/public';
import { findById } from '../../../helpers/diagramSpec';

function annotation(object: DiagramObject): AnnotationObject {
  if (object.objectType !== 'annotation') throw new Error(`${object.id} no es una anotación`);
  return object;
}

describe('diagram structured clipboard', () => {
  it('copies and pastes one object with the supporting references it needs', () => {
    const model = createTemplateModel('triangulo-deformable', 'Copia simple', 'definicion');
    const segment = modelElements(model).find(item => objectKind(item) === 'segment')!;
    const payload = createDiagramClipboard(model, [segment.id]);
    expect(payload).not.toBeNull();
    if (!payload) return;

    const result = pasteDiagramClipboard(model, payload);
    const pasted = findById(result.model, `${segment.id}_copy`);

    expect(objectConstructionReferences(pasted)).toEqual(objectConstructionReferences(segment).map(ref => `${ref}_copy`));
    expect(pasted.targetId).not.toBe(segment.targetId);
    expect(result.selectedId).toBe(pasted.id);
    expect(parseDiagramSpecV3(result.model).success).toBe(true);
  });

  it('copies a group as one coherent subgraph and rewrites expressions, targets and step states', () => {
    const base = createTemplateModel('triangulo-deformable', 'Copia de grupo', 'definicion');
    const sourceSegment = findById(base, 'segAB');
    const formulaBase = annotation(element('formulaArea', 'Fórmula de longitud', 'formula', [sourceSegment.id], 'mora', true, { text: 'L^2 = {value}' }));
    const formula: AnnotationObject = {
      ...formulaBase,
      groupIds: ['groupTriangle'],
      content: { ...formulaBase.content, expression: 'segAB.length^2', precision: 2 },
    };
    const memberIds = ['pA', 'pB', sourceSegment.id, formula.id];
    const model = {
      ...base,
      objects: [...base.objects.map(item => memberIds.includes(item.id) ? { ...item, groupIds: ['groupTriangle'] } : item), formula],
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
    };
    const payload = createDiagramClipboard(model, [], ['groupTriangle']);
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(parseDiagramClipboard(serializeDiagramClipboard(payload))).toEqual(payload);

    const result = pasteDiagramClipboard(model, payload);
    const pastedSegment = findById(result.model, 'segAB_copy');
    const pastedFormula = annotation(findById(result.model, 'formulaArea_copy'));
    const pastedGroup = result.model.groups.find(item => item.id === 'groupTriangle_copy')!;

    expect(objectConstructionReferences(pastedSegment)).toEqual(['pA_copy', 'pB_copy']);
    expect(pastedFormula.anchor).toMatchObject({ type: 'object', object: 'segAB_copy' });
    expect(pastedFormula.content.expression).toBe('segAB_copy.length^2');
    expect(pastedGroup.memberIds).toEqual(expect.arrayContaining(['pA_copy', 'pB_copy', 'segAB_copy', 'formulaArea_copy']));
    expect(pastedGroup.targetId).not.toBe('construction-ab');
    expect(result.model.steps[0].visibleTargets).toEqual(expect.arrayContaining(['pA_copy', 'pB_copy', 'segAB_copy', 'formulaArea_copy']));
    expect(parseDiagramSpecV3(result.model).success).toBe(true);
  });

  it('rewrites expressions nested in composite panel blocks and their variants', () => {
    const base = createTemplateModel('triangulo-deformable', 'Copia de panel', 'definicion');
    const panelBase = annotation(element('panel', 'Lecturas', 'infoPanel', [], 'mora', true, { text: '' }));
    const panel: AnnotationObject = {
      ...panelBase,
      anchor: { type: 'viewport', position: [0.1, 0.2] },
      content: {
        ...panelBase.content,
        layout: 'stack',
        blocks: [{
          id: 'longitud', text: 'AB = {value}', expression: 'segAB.length',
          rules: [{ when: 'gt(segAB.length,2)', text: 'AB² = {value}', expression: 'segAB.length^2' }],
        }],
      },
    };
    const model = { ...base, objects: [...base.objects, panel] };
    const payload = createDiagramClipboard(model, ['panel']);
    expect(payload).not.toBeNull();
    if (!payload) return;

    const result = pasteDiagramClipboard(model, payload);
    const pasted = annotation(findById(result.model, 'panel_copy'));
    expect(pasted.content.blocks?.[0]).toMatchObject({
      expression: 'segAB_copy.length',
      rules: [{ when: 'gt(segAB_copy.length,2)', expression: 'segAB_copy.length^2' }],
    });
    expect(parseDiagramSpecV3(result.model).success).toBe(true);
  });

  it('rejects arbitrary clipboard text', () => {
    expect(parseDiagramClipboard('{"kind":"another-format"}')).toBeNull();
    expect(parseDiagramClipboard('{"kind":"matematika-diagram-clipboard-v3","rootIds":[],"objects":[{}],"groups":[],"relations":[],"stepStates":[]}')).toBeNull();
    expect(parseDiagramClipboard('not json')).toBeNull();
  });
});
