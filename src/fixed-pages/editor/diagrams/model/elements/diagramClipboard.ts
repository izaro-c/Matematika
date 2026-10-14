import type {
  DiagramGroup,
  DiagramObject,
  DiagramRelation,
  DiagramStepObjectState,
} from '@/diagrams';
import { expressionSourceIds, isPositionedPoint, mapObjectExpressions, mapObjectReferences, mapRelationReferences, objectExpressions, objectReferences, omitKeys, pointPosition, relationReferences, renameDiagramTemplateIdentifiers, withPointPosition } from '@/diagrams';
import type { VisualDiagramModel } from '../types';

export const DIAGRAM_CLIPBOARD_KIND = 'matematika-diagram-clipboard-v3' as const;

interface ClipboardStepState {
  stepId: string;
  visibleIds: string[];
  objectStates: Record<string, DiagramStepObjectState>;
}

export interface DiagramClipboardPayload {
  kind: typeof DIAGRAM_CLIPBOARD_KIND;
  sourceComponentId: string;
  rootIds: string[];
  objects: DiagramObject[];
  groups: DiagramGroup[];
  relations: DiagramRelation[];
  stepStates: ClipboardStepState[];
}

export interface DiagramPasteResult {
  model: VisualDiagramModel;
  selectedId: string;
  pastedIds: string[];
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function uniqueId(base: string, used: Set<string>): string {
  let candidate = `${base}_copy`;
  let index = 2;
  while (used.has(candidate)) candidate = `${base}_copy_${index++}`;
  used.add(candidate);
  return candidate;
}

function rewriteExpression(source: string | undefined, idMap: ReadonlyMap<string, string>): string | undefined {
  if (!source) return source;
  return source.replace(/[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*/g, identifier => {
    const [root, ...path] = identifier.split('.');
    const replacement = idMap.get(root);
    return replacement ? [replacement, ...path].join('.') : identifier;
  });
}

function rewriteTemplate(source: string, idMap: ReadonlyMap<string, string>): string {
  let result = source;
  idMap.forEach((replacement, original) => {
    result = renameDiagramTemplateIdentifiers(result, original, replacement);
  });
  return result;
}

export function createDiagramClipboard(
  model: VisualDiagramModel,
  selectedIds: readonly string[],
  selectedGroupIds: readonly string[] = [],
): DiagramClipboardPayload | null {
  const selected = new Set(selectedIds);
  const groups = model.groups.filter(group => selectedGroupIds.includes(group.id));
  groups.forEach(group => group.memberIds.forEach(id => selected.add(id)));
  const rootIds = [...selected];
  const objectIds = new Set(model.objects.map(object => object.id));
  let closureChanged = true;
  while (closureChanged) {
    closureChanged = false;
    const add = (id: string | undefined) => {
      if (id && objectIds.has(id) && !selected.has(id)) {
        selected.add(id);
        closureChanged = true;
      }
    };
    model.objects.filter(item => selected.has(item.id)).forEach(item => {
      objectReferences(item).forEach(add);
      objectExpressions(item).flatMap(expressionSourceIds).forEach(add);
      if (item.objectType === 'point' && item.mobility.type === 'constrained') {
        item.mobility.relationIds.forEach(relationId => {
          const relation = model.relations.find(candidate => candidate.id === relationId);
          if (relation) relationReferences(relation).forEach(add);
        });
      }
    });
  }

  const objects = model.objects.filter(item => selected.has(item.id));
  const copiedIds = new Set(objects.map(item => item.id));
  if (copiedIds.size === 0) return null;

  const relations = model.relations.filter(relation => relationReferences(relation).every(ref => copiedIds.has(ref)));
  const stepStates = model.steps.map(step => ({
    stepId: step.id,
    visibleIds: step.visibleTargets.filter(id => copiedIds.has(id)),
    objectStates: Object.fromEntries(Object.entries(step.objectStates ?? {})
      .filter(([id]) => copiedIds.has(id))
      .map(([id, state]) => [id, clone(state)])),
  }));

  return clone({
    kind: DIAGRAM_CLIPBOARD_KIND,
    sourceComponentId: model.componentId,
    rootIds,
    objects,
    groups,
    relations,
    stepStates,
  });
}

export function serializeDiagramClipboard(payload: DiagramClipboardPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function parseDiagramClipboard(value: string): DiagramClipboardPayload | null {
  try {
    const parsed = JSON.parse(value) as Partial<DiagramClipboardPayload>;
    if (parsed.kind !== DIAGRAM_CLIPBOARD_KIND) return null;
    const hasStringIds = (items: unknown): items is Array<{ id: string }> => Array.isArray(items) && items.every(item => typeof item === 'object' && item !== null && typeof (item as { id?: unknown }).id === 'string');
    const hasStringArray = (items: unknown): items is string[] => Array.isArray(items) && items.every(item => typeof item === 'string');
    if (typeof parsed.sourceComponentId !== 'string' || !hasStringArray(parsed.rootIds)) return null;
    if (!hasStringIds(parsed.objects) || !parsed.objects.every(item => typeof (item as { objectType?: unknown }).objectType === 'string' && hasStringArray(item.groupIds))) return null;
    if (!Array.isArray(parsed.groups) || !Array.isArray(parsed.relations) || !Array.isArray(parsed.stepStates)) return null;
    if (!hasStringIds(parsed.groups) || !parsed.groups.every(group => hasStringArray(group.memberIds))) return null;
    if (!hasStringIds(parsed.relations) || !parsed.relations.every(relation => typeof (relation as { type?: unknown }).type === 'string')) return null;
    if (!parsed.stepStates.every(state => typeof state?.stepId === 'string' && hasStringArray(state?.visibleIds) && typeof state?.objectStates === 'object' && state.objectStates !== null)) return null;
    return parsed as DiagramClipboardPayload;
  } catch {
    return null;
  }
}

function shiftedCopy(object: DiagramObject): DiagramObject {
  if (isPositionedPoint(object)) {
    const position = pointPosition(object)!;
    return withPointPosition(object, { x: position.x + 0.5, y: position.y - 0.5 });
  }
  if (object.objectType === 'control') {
    return { ...object, position: [object.position[0] + 0.5, object.position[1] - 0.5] };
  }
  if (object.objectType === 'annotation' && object.anchor.type === 'viewport') {
    const [x, y] = object.anchor.position;
    return { ...object, anchor: { ...object.anchor, position: [Math.min(1, x + 0.03), Math.min(1, y + 0.03)] } };
  }
  return object;
}

export function pasteDiagramClipboard(model: VisualDiagramModel, payload: DiagramClipboardPayload): DiagramPasteResult {
  const usedIds = new Set([
    ...model.objects.map(item => item.id),
    ...model.groups.map(group => group.id),
    ...model.steps.map(step => step.id),
    ...model.relations.map(relation => relation.id),
  ]);
  const idMap = new Map<string, string>();
  payload.objects.forEach(item => idMap.set(item.id, uniqueId(item.id, usedIds)));
  payload.groups.forEach(group => idMap.set(group.id, uniqueId(group.id, usedIds)));
  payload.relations.forEach(relation => idMap.set(relation.id, uniqueId(relation.id, usedIds)));

  const targetIds = new Set([
    ...model.steps.map(step => step.id),
    ...model.objects.filter(item => item.target).map(item => item.targetId ?? item.id),
    ...model.groups.filter(group => group.target).map(group => group.targetId ?? group.id),
  ]);
  const uniqueTargetId = (base: string) => uniqueId(base.replace(/_copy(?:_\d+)?$/, ''), targetIds);
  const remapGroupIds = (groupIds: string[]) => groupIds.flatMap(groupId => {
    const mapped = idMap.get(groupId);
    return mapped ? [mapped] : [];
  });
  const mapId = (id: string) => idMap.get(id) ?? id;

  const objects = payload.objects.map(source => {
    const id = idMap.get(source.id)!;
    const remapped = mapObjectExpressions(
      mapObjectReferences(clone(source), mapId),
      expression => rewriteExpression(expression, idMap) ?? expression,
      template => rewriteTemplate(template, idMap),
    );
    let copy: DiagramObject = {
      ...shiftedCopy(remapped),
      id,
      label: `${source.label} (copia)`,
      groupIds: remapGroupIds(source.groupIds),
      order: source.order + 1,
    };
    const withoutTarget = omitKeys(copy, 'targetId');
    copy = (source.target ? { ...withoutTarget, targetId: uniqueTargetId(source.targetId ?? source.id) } : withoutTarget) as DiagramObject;
    if (copy.objectType === 'point' && copy.mobility.type === 'constrained') {
      const relationIds = copy.mobility.relationIds.filter(relationId => payload.relations.some(relation => idMap.get(relation.id) === relationId));
      copy = { ...copy, mobility: relationIds.length > 0 ? { type: 'constrained', relationIds } : { type: 'free' } };
    }
    return copy;
  });
  const groups = payload.groups.map(source => ({
    ...clone(source),
    id: idMap.get(source.id)!,
    label: `${source.label} (copia)`,
    memberIds: source.memberIds.map(id => idMap.get(id)).filter((value): value is string => Boolean(value)),
    targetId: source.target ? uniqueTargetId(source.targetId ?? source.id) : undefined,
  }));
  const relations = payload.relations.map(source => {
    const remapped = mapRelationReferences(clone(source), mapId);
    return {
      ...remapped,
      label: `${source.label} (copia)`,
      ...(remapped.type === 'expression' ? { expression: rewriteExpression(remapped.expression, idMap) ?? remapped.expression } : {}),
    } as DiagramRelation;
  });
  const stepStateById = new Map(payload.stepStates.map(state => [state.stepId, state]));
  const steps = model.steps.map(step => {
    const copied = stepStateById.get(step.id);
    if (!copied) return step;
    const visibleTargets = [...step.visibleTargets, ...copied.visibleIds.map(id => idMap.get(id)).filter((value): value is string => Boolean(value))];
    const objectStates = { ...(step.objectStates ?? {}) };
    Object.entries(copied.objectStates).forEach(([oldId, state]) => {
      const id = idMap.get(oldId);
      if (!id) return;
      objectStates[id] = {
        ...clone(state),
        overlay: state.overlay ? {
          ...clone(state.overlay),
          content: rewriteTemplate(state.overlay.content, idMap),
          expression: rewriteExpression(state.overlay.expression, idMap),
        } : undefined,
      };
    });
    return { ...step, visibleTargets: [...new Set(visibleTargets)], objectStates };
  });
  const pastedIds = objects.map(item => item.id);

  return {
    model: {
      ...model,
      objects: [...model.objects, ...objects],
      groups: [...model.groups, ...groups],
      relations: [...model.relations, ...relations],
      steps,
    },
    selectedId: payload.rootIds.map(id => idMap.get(id)).find((id): id is string => Boolean(id)) ?? pastedIds[0] ?? '',
    pastedIds,
  };
}
