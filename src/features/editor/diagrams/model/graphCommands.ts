import {
  diagramTemplateIdentifiers,
  extractMathExpressionIdentifiers,
  renameDiagramTemplateIdentifiers,
  renameMathExpressionIdentifier,
} from '../../../../shared/diagrams/spec';
import { cleanTargetId } from './diagramElements';
import type { VisualDiagramModel, VisualElement, VisualPoint, VisualSlider } from './types';

export interface DiagramDeleteImpact {
  requestedId: string;
  removedIds: string[];
  dependentIds: string[];
  relationIds: string[];
}

function allSceneItems(model: VisualDiagramModel): Array<VisualPoint | VisualElement | VisualSlider> {
  return [...model.points, ...model.elements, ...model.sliders];
}

export function allDiagramIds(model: VisualDiagramModel): Set<string> {
  return new Set([
    ...allSceneItems(model).map(item => item.id), ...model.layers.map(item => item.id), ...model.groups.map(item => item.id),
    ...model.steps.map(item => item.id), ...(model.constraints ?? []).map(item => item.id),
  ]);
}

function safeRenameExpression(source: string | undefined, oldId: string, newId: string): string | undefined {
  if (!source) return source;
  try { return renameMathExpressionIdentifier(source, oldId, newId); }
  catch { return source; }
}

function renameElementExpressions(element: VisualElement, oldId: string, newId: string): VisualElement {
  const properties = element.properties;
  if (!properties) return element;
  return {
    ...element,
    text: element.text ? renameDiagramTemplateIdentifiers(element.text, oldId, newId) : element.text,
    properties: {
      ...properties,
      expression: safeRenameExpression(properties.expression, oldId, newId),
      xExpression: safeRenameExpression(properties.xExpression, oldId, newId),
      yExpression: safeRenameExpression(properties.yExpression, oldId, newId),
      tickDistanceExpression: safeRenameExpression(properties.tickDistanceExpression, oldId, newId),
      visibleWhen: safeRenameExpression(properties.visibleWhen, oldId, newId),
      textRules: properties.textRules?.map(rule => ({
        ...rule,
        when: safeRenameExpression(rule.when, oldId, newId) ?? rule.when,
        text: renameDiagramTemplateIdentifiers(rule.text, oldId, newId),
      })),
      infoPanelBlocks: properties.infoPanelBlocks?.map(block => ({
        ...block,
        text: renameDiagramTemplateIdentifiers(block.text, oldId, newId),
        expression: safeRenameExpression(block.expression, oldId, newId),
        rules: block.rules?.map(rule => ({
          ...rule,
          when: safeRenameExpression(rule.when, oldId, newId) ?? rule.when,
          expression: safeRenameExpression(rule.expression, oldId, newId),
          text: renameDiagramTemplateIdentifiers(rule.text, oldId, newId),
        })),
      })),
    },
  };
}

export function renameDiagramId(model: VisualDiagramModel, oldId: string, requestedId: string): VisualDiagramModel {
  const newId = cleanTargetId(requestedId, oldId);
  if (newId === oldId || allDiagramIds(model).has(newId)) return model;
  const renameRef = (id: string) => id === oldId ? newId : id;
  return {
    ...model,
    points: model.points.map(point => ({
      ...(point.id === oldId ? { ...point, id: newId } : point),
      layerId: renameRef(point.layerId),
      groupIds: point.groupIds.map(renameRef),
      ...(point.targetId === oldId ? { targetId: newId } : {}),
      ...(point.gliderTarget ? { gliderTarget: renameRef(point.gliderTarget) } : {}),
      dependencies: point.dependencies?.map(renameRef),
      attractorIds: point.attractorIds?.map(renameRef),
      constraintIds: point.constraintIds?.map(renameRef),
      xExpression: safeRenameExpression(point.xExpression, oldId, newId),
      yExpression: safeRenameExpression(point.yExpression, oldId, newId),
      visibleWhen: safeRenameExpression(point.visibleWhen, oldId, newId),
    })),
    elements: model.elements.map(element => renameElementExpressions({
      ...(element.id === oldId ? { ...element, id: newId } : element),
      layerId: renameRef(element.layerId),
      groupIds: element.groupIds.map(renameRef),
      ...(element.targetId === oldId ? { targetId: newId } : {}),
      refs: element.refs.map(renameRef),
    }, oldId, newId)),
    sliders: model.sliders.map(slider => ({
      ...(slider.id === oldId ? { ...slider, id: newId } : slider),
      layerId: renameRef(slider.layerId),
      groupIds: slider.groupIds.map(renameRef),
      ...(slider.targetId === oldId ? { targetId: newId } : {}),
      maxExpression: safeRenameExpression(slider.maxExpression, oldId, newId),
      visibleWhen: safeRenameExpression(slider.visibleWhen, oldId, newId),
    })),
    layers: model.layers.map(layer => layer.id === oldId ? { ...layer, id: newId } : layer),
    groups: model.groups.map(group => ({
      ...(group.id === oldId ? { ...group, id: newId } : group),
      ...(group.targetId === oldId ? { targetId: newId } : {}),
      memberIds: group.memberIds.map(renameRef),
    })),
    header: model.header ? {
      ...model.header,
      readings: model.header.readings.map(reading => ({ ...reading, sourceIds: reading.sourceIds.map(renameRef) })),
    } : undefined,
    steps: model.steps.map(step => ({
      ...(step.id === oldId ? { ...step, id: newId } : step),
      visibleTargets: step.visibleTargets.map(renameRef),
      objectStates: step.objectStates
        ? Object.fromEntries(Object.entries(step.objectStates).map(([id, state]) => [renameRef(id), {
          ...state,
          overlay: state.overlay ? {
            ...state.overlay,
            content: renameDiagramTemplateIdentifiers(state.overlay.content, oldId, newId),
            expression: safeRenameExpression(state.overlay.expression, oldId, newId),
          } : undefined,
        }]))
        : undefined,
    })),
    constraints: model.constraints?.map(constraint => ({
      ...(constraint.id === oldId ? { ...constraint, id: newId } : constraint),
      refs: constraint.refs.map(renameRef),
      expression: safeRenameExpression(constraint.expression, oldId, newId),
    })),
    dependencies: model.dependencies?.map(dependency => ({
      ...dependency,
      sourceId: renameRef(dependency.sourceId),
      targetId: renameRef(dependency.targetId),
      ...(dependency.constraintId ? { constraintId: renameRef(dependency.constraintId) } : {}),
    })),
  };
}

function expressionReferences(source: string | undefined, id: string): boolean {
  if (!source) return false;
  try { return extractMathExpressionIdentifiers(source).some(identifier => identifier.split('.')[0] === id); }
  catch { return false; }
}

function templateReferences(source: string | undefined, id: string, legacyExpression?: string): boolean {
  if (!source) return false;
  return diagramTemplateIdentifiers(source, legacyExpression).some(identifier => identifier.split('.')[0] === id);
}

function elementDependsOn(element: VisualElement, id: string): boolean {
  const properties = element.properties;
  return element.refs.includes(id)
    || templateReferences(element.text, id, properties?.expression)
    || expressionReferences(properties?.expression, id)
    || expressionReferences(properties?.xExpression, id)
    || expressionReferences(properties?.yExpression, id)
    || expressionReferences(properties?.tickDistanceExpression, id)
    || expressionReferences(properties?.visibleWhen, id)
    || properties?.textRules?.some(rule => expressionReferences(rule.when, id) || templateReferences(rule.text, id, properties.expression)) === true
    || properties?.infoPanelBlocks?.some(block => templateReferences(block.text, id, block.expression) || expressionReferences(block.expression, id) || block.rules?.some(rule => expressionReferences(rule.when, id) || expressionReferences(rule.expression, id) || templateReferences(rule.text, id, rule.expression ?? block.expression))) === true;
}

function directDependents(model: VisualDiagramModel, id: string): string[] {
  const values = new Set<string>();
  model.elements.forEach(element => { if (element.id !== id && elementDependsOn(element, id)) values.add(element.id); });
  model.points.forEach(point => {
    if (point.id !== id && (point.gliderTarget === id || point.dependencies?.includes(id) || expressionReferences(point.xExpression, id) || expressionReferences(point.yExpression, id) || expressionReferences(point.visibleWhen, id))) values.add(point.id);
  });
  model.sliders.forEach(slider => { if (slider.id !== id && (expressionReferences(slider.maxExpression, id) || expressionReferences(slider.visibleWhen, id))) values.add(slider.id); });
  model.dependencies?.forEach(edge => { if (edge.sourceId === id && edge.targetId !== id) values.add(edge.targetId); });
  return [...values];
}

export function diagramDeleteImpact(model: VisualDiagramModel, requestedId: string): DiagramDeleteImpact {
  const removed = new Set<string>([requestedId]);
  const queue = [requestedId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    directDependents(model, current).forEach(id => { if (!removed.has(id)) { removed.add(id); queue.push(id); } });
  }
  const relationIds = (model.constraints ?? []).filter(relation => relation.id === requestedId || relation.refs.some(ref => removed.has(ref))).map(relation => relation.id);
  return { requestedId, removedIds: [...removed], dependentIds: [...removed].filter(id => id !== requestedId), relationIds };
}

export function deleteDiagramCascade(model: VisualDiagramModel, requestedId: string): { model: VisualDiagramModel; impact: DiagramDeleteImpact } {
  const impact = diagramDeleteImpact(model, requestedId);
  const removed = new Set(impact.removedIds);
  const relationIds = new Set(impact.relationIds);
  const points = model.points.filter(item => !removed.has(item.id)).map(item => {
    const constraintIds = item.constraintIds?.filter(id => !relationIds.has(id));
    const attractorIds = item.attractorIds?.filter(id => !removed.has(id));
    const groupIds = item.groupIds.filter(id => !removed.has(id));
    if (item.constraint !== 'constrained' || constraintIds?.length) return { ...item, groupIds, constraintIds, attractorIds };
    return { ...item, groupIds, fixed: false, constraint: 'free' as const, constraintIds: undefined, attractorIds };
  });
  return {
    impact,
    model: {
      ...model,
      points,
      layers: model.layers.filter(item => !removed.has(item.id)),
      elements: model.elements.filter(item => !removed.has(item.id)).map(item => ({ ...item, groupIds: item.groupIds.filter(id => !removed.has(id)) })),
      sliders: model.sliders.filter(item => !removed.has(item.id)).map(item => ({ ...item, groupIds: item.groupIds.filter(id => !removed.has(id)) })),
      steps: model.steps.filter(item => !removed.has(item.id)).map(step => ({
        ...step,
        visibleTargets: step.visibleTargets.filter(id => !removed.has(id)),
        objectStates: step.objectStates ? Object.fromEntries(Object.entries(step.objectStates).filter(([id]) => !removed.has(id))) : undefined,
      })),
      groups: model.groups.filter(group => !removed.has(group.id)).map(group => ({ ...group, memberIds: group.memberIds.filter(id => !removed.has(id)) })),
      header: model.header ? {
        ...model.header,
        readings: model.header.readings.flatMap(reading => {
          const sourceIds = reading.sourceIds.filter(id => !removed.has(id));
          if (sourceIds.length === 0) return [];
          return [{ ...reading, sourceIds, presentation: reading.presentation === 'equality' && sourceIds.length < 2 ? 'label-value' as const : reading.presentation }];
        }),
      } : undefined,
      constraints: model.constraints?.filter(relation => !relationIds.has(relation.id)),
      dependencies: model.dependencies?.filter(edge => !removed.has(edge.sourceId) && !removed.has(edge.targetId) && (!edge.constraintId || !relationIds.has(edge.constraintId))),
    },
  };
}
