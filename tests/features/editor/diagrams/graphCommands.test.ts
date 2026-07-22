import { describe, expect, it } from 'vitest';
import { createTemplateModel, deleteDiagramCascade, element, renameDiagramId } from '../../../../src/features/editor/diagrams/model/commands';

describe('diagram graph commands', () => {
  it('renames globally and rewrites references plus expressions through the expression AST', () => {
    const base = createTemplateModel('circunferencia', 'Grafo', 'definicion');
    const model = {
      ...base,
      elements: base.elements.map(item => item.id === 'measRadio'
        ? { ...item, text: 'Mitad: {= pA.x / 2 | precision: 2}', properties: { ...item.properties, visibleWhen: 'gt(pA.x, pO.x)' } }
        : item),
    };
    const renamed = renameDiagramId(model, 'pA', 'pB');
    expect(renamed.points.some(point => point.id === 'pB')).toBe(true);
    expect(renamed.elements.find(item => item.id === 'circle')?.refs).toContain('pB');
    expect(renamed.elements.find(item => item.id === 'measRadio')?.properties?.visibleWhen).toContain('pB.x');
    expect(renamed.elements.find(item => item.id === 'measRadio')?.text).toContain('{= pB.x / 2 | precision: 2}');
    expect(renameDiagramId(renamed, 'pB', 'circle')).toBe(renamed);
  });

  it('treats embedded calculations as graph dependencies during cascade deletion', () => {
    const base = createTemplateModel('circunferencia', 'Plantillas', 'definicion');
    const annotation = element('derivedText', 'Lectura', 'text', ['pO'], 'carbon', true, {
      text: 'Doble: {= pA.x * 2 | precision: 1}',
    });
    const result = deleteDiagramCascade({ ...base, elements: [...base.elements, annotation] }, 'pA');
    expect(result.impact.dependentIds).toContain('derivedText');
  });

  it('computes and deletes transitive dependents without dangling steps or groups', () => {
    const base = createTemplateModel('circunferencia', 'Cascada', 'definicion');
    const model = {
      ...base,
      elements: [
        ...base.elements,
        element('child', 'Dependiente', 'segment', ['pO', 'pA'], 'carbon'),
        element('grandchild', 'Dependiente transitivo', 'label', ['child'], 'carbon'),
      ],
      steps: [{ id: 'step1', label: 'Paso', description: '', visibleTargets: ['pA', 'child', 'grandchild'], objectStates: {} }],
      groups: [{ id: 'group', label: 'Grupo', memberIds: ['child', 'grandchild'], visible: true, locked: false, selection: { selectable: true } }],
    };
    const result = deleteDiagramCascade(model, 'pA');
    expect(result.impact.dependentIds).toEqual(expect.arrayContaining(['circle', 'segOA', 'child', 'grandchild']));
    expect(result.model.elements.some(item => item.refs.includes('pA') || item.refs.includes('child'))).toBe(false);
    expect(result.model.steps[0].visibleTargets).not.toContain('grandchild');
    expect(result.model.groups[0].memberIds).toEqual([]);
  });

  it('keeps layer, group and explicit public-target references coherent when renamed', () => {
    const base = createTemplateModel('circunferencia', 'Grafo global', 'definicion');
    const withGroup = {
      ...base,
      groups: [{ id: 'group', label: 'Grupo', memberIds: ['pA'], visible: true, locked: false, selection: { selectable: true }, target: true, targetId: 'group' }],
      points: base.points.map(item => item.id === 'pA' ? { ...item, groupIds: ['group'] } : item),
    };
    const groupRenamed = renameDiagramId(withGroup, 'group', 'renamedGroup');
    expect(groupRenamed.groups[0]).toMatchObject({ id: 'renamedGroup', targetId: 'renamedGroup' });
    expect(groupRenamed.points.find(item => item.id === 'pA')?.groupIds).toContain('renamedGroup');

    const layerId = groupRenamed.layers[0].id;
    const layerRenamed = renameDiagramId(groupRenamed, layerId, 'renamedLayer');
    expect([...layerRenamed.points, ...layerRenamed.elements, ...layerRenamed.sliders]
      .filter(item => item.layerId === 'renamedLayer').length).toBeGreaterThan(0);
  });

  it('keeps explicit header readings coherent across rename and cascade deletion', () => {
    const base = createTemplateModel('circunferencia', 'Cabecera', 'definicion');
    const model = {
      ...base,
      header: {
        readingsMode: 'custom' as const,
        readings: [{ id: 'radius-equality', sourceIds: ['measRadio', 'segOA'], presentation: 'equality' as const }],
      },
    };
    const renamed = renameDiagramId(model, 'measRadio', 'radiusReading');
    expect(renamed.header?.readings[0].sourceIds).toEqual(['radiusReading', 'segOA']);

    const deleted = deleteDiagramCascade(renamed, 'segOA').model;
    expect(deleted.header?.readings[0]).toMatchObject({
      sourceIds: ['radiusReading'],
      presentation: 'label-value',
    });
  });
});
