import { isPositionedPoint, objectConstructionReferences, objectKind } from '@/diagrams';
import { relationDraft } from '../model/constraints/relationIntents';
import type { DiagramDiagnostic } from '../source/generator';
import type { VisualDiagramModel } from '../model/types';
import type {
  DiagramDiagnosticCollection,
  DiagramDiagnosticLocation,
  DiagramDiagnosticWorkspace,
  DiagramInspectorSection,
  DiagramLeftPanel,
} from './types';

export function resolveInspectorSection(
  field?: string,
  collection?: DiagramDiagnosticCollection,
): DiagramInspectorSection {
  if (collection === 'relations' || field === 'refs' || field === 'gliderTarget' || field === 'kind') return 'geometry';
  if (field?.startsWith('definition') || field?.startsWith('mobility') || field?.startsWith('geometry') || field === 'points' || field?.startsWith('anchor')) return 'geometry';
  if (field?.startsWith('appearance')) return 'appearance';
  if (field === 'dependencies' || field === 'xExpression' || field === 'yExpression') return 'geometry';
  if (field?.includes('constraint') || field === 'x' || field === 'y' || field?.includes('Expression')) return 'geometry';
  if (field === 'expression' || field === 'properties') return 'geometry';
  if (field === 'visibleWhen' || field === 'target' || field?.startsWith('selection')) return 'advanced';
  if (field === 'color' || field?.startsWith('style') || field === 'label' || field === 'showLabel') return 'appearance';
  return 'general';
}

export function resolveFieldKey(field?: string, collection?: DiagramDiagnosticCollection): string | undefined {
  if (collection === 'relations') return 'constraints';
  if (!field) return undefined;
  if (field === 'definition.x' || field === 'geometry.x') return 'xExpression';
  if (field === 'definition.y' || field === 'geometry.y') return 'yExpression';
  if (field === 'geometry.expression') return 'expression';
  if (field === 'mobility.support') return 'gliderTarget';
  if (field.startsWith('mobility.relationIds')) return 'constraints';
  if (field.startsWith('definition') || field.startsWith('geometry') || field === 'points' || field.startsWith('points.')) return 'refs';
  if (field.startsWith('appearance.')) return 'style';
  if (field === 'refs' || field.startsWith('refs.')) return 'refs';
  if (field.includes('constraint')) return 'constraints';
  if (field === 'gliderTarget') return 'gliderTarget';
  if (field === 'constraint') return 'constraint';
  if (field === 'dependencies') return 'dependencies';
  if (field === 'xExpression' || field === 'yExpression') return field;
  if (field.startsWith('properties.')) {
    const propertyKey = field.split('.')[1];
    if (propertyKey === 'expression' || propertyKey === 'xExpression' || propertyKey === 'yExpression') {
      return propertyKey;
    }
    return 'properties';
  }
  if (field.startsWith('style.')) return 'style';
  return field.split('.')[0];
}

function itemIdAt<T extends { id: string }>(items: readonly T[] | undefined, index: number): string | undefined {
  const item = items?.[index];
  return typeof item?.id === 'string' ? item.id : undefined;
}

export function resolveObjectId(
  model: VisualDiagramModel | null,
  location: Pick<DiagramDiagnosticLocation, 'collection' | 'index'>,
): string | undefined {
  if (!model || location.collection === undefined || location.index === undefined) return undefined;

  switch (location.collection) {
    case 'objects': return itemIdAt(model.objects, location.index);
    case 'relations': return itemIdAt(model.relations, location.index);
    case 'steps': return itemIdAt(model.steps, location.index);
    case 'groups': return itemIdAt(model.groups, location.index);
    default: return undefined;
  }
}

function segmentIdForConstraint(
  model: VisualDiagramModel,
  relation: VisualDiagramModel['relations'][number],
): string | undefined {
  const refs = relationDraft(relation, model.objects).refs;
  if (relation.type === 'equal-length' && refs.length >= 2) {
    const [first, second] = refs;
    const segment = model.objects.find(object => {
      if (objectKind(object) !== 'segment') return false;
      const endpoints = objectConstructionReferences(object);
      return endpoints.includes(first) && endpoints.includes(second);
    });
    if (segment) return segment.id;
  }

  const lastRef = refs[refs.length - 1];
  if (lastRef) {
    const segment = model.objects.find(object => object.id === lastRef && objectKind(object) === 'segment');
    if (segment) return segment.id;
  }

  return undefined;
}

export function resolveLeftPanel(
  location: Pick<DiagramDiagnosticLocation, 'navigationObjectId' | 'objectId' | 'field' | 'collection'>,
): DiagramLeftPanel {
  if (location.navigationObjectId || location.objectId) {
    if (location.collection === 'groups' || location.collection === 'layers') return 'organization';
    return 'objects';
  }
  if (location.collection === 'groups' || location.collection === 'layers') return 'organization';
  if (location.field === 'title' || location.field === 'note' || location.field === 'componentId') return 'diagram';
  return 'diagram';
}

export function resolveNavigationObjectId(
  model: VisualDiagramModel | null,
  location: Pick<DiagramDiagnosticLocation, 'collection' | 'index'>,
): string | undefined {
  if (!model) return undefined;

  if (location.collection === 'relations' && location.index !== undefined) {
    const relation = model.relations[location.index];
    if (!relation) return undefined;

    const segmentId = segmentIdForConstraint(model, relation);
    if (segmentId) return segmentId;

    const refs = relationDraft(relation, model.objects).refs;
    const pointOwner = refs.find(ref => model.objects.some(object => object.id === ref && isPositionedPoint(object)));
    if (pointOwner) return pointOwner;

    return refs[0] ?? relation.id;
  }

  return resolveObjectId(model, location);
}

function workspaceForLocation(
  location: Pick<DiagramDiagnosticLocation, 'collection' | 'field'>,
  diagnostic: DiagramDiagnostic,
): DiagramDiagnosticWorkspace {
  if (diagnostic.source === 'source' || diagnostic.code === 'invalid-source') return 'source';
  if (location.collection === 'steps') return 'steps';
  if (location.field === 'componentId' || location.field === 'title' || location.field === 'note') return 'build';
  if (diagnostic.code === 'invalid-component-name') return 'source';
  if (location.collection) return 'build';
  return 'check';
}

export function refinePointLocation(
  location: DiagramDiagnosticLocation,
  model: VisualDiagramModel | null,
  diagnostic: DiagramDiagnostic,
): DiagramDiagnosticLocation {
  if (!model || location.collection !== 'objects' || location.index === undefined) return location;

  const point = model.objects[location.index];
  if (!isPositionedPoint(point)) return location;

  if (location.field) {
    return {
      ...location,
      fieldKey: location.fieldKey ?? resolveFieldKey(location.field, location.collection),
      inspectorSection: location.inspectorSection
        ?? resolveInspectorSection(location.field, location.collection),
    };
  }

  const mentionsDerived = /derivad|expresion/i.test(diagnostic.message);
  const derived = point.definition.type === 'expression' ? point.definition : undefined;
  if (derived || mentionsDerived) {
    const field = !derived?.x
      ? 'xExpression'
      : !derived.y
        ? 'yExpression'
        : 'xExpression';
    return {
      ...location,
      field,
      fieldKey: field,
      inspectorSection: 'geometry',
      leftPanel: location.leftPanel ?? 'objects',
    };
  }

  if (point.mobility.type === 'on-support' && !point.mobility.support) {
    return {
      ...location,
      field: 'gliderTarget',
      fieldKey: 'gliderTarget',
      inspectorSection: 'geometry',
      leftPanel: location.leftPanel ?? 'objects',
    };
  }

  if (point.mobility.type === 'constrained' && point.mobility.relationIds.length === 0) {
    return {
      ...location,
      field: 'constraints',
      fieldKey: 'constraints',
      inspectorSection: 'geometry',
      leftPanel: location.leftPanel ?? 'objects',
    };
  }

  return location;
}

export function buildDiagnosticLocation(
  diagnostic: DiagramDiagnostic,
  model: VisualDiagramModel | null,
  parsed: Pick<DiagramDiagnosticLocation, 'collection' | 'index' | 'field'>,
): DiagramDiagnosticLocation {
  const fieldKey = resolveFieldKey(parsed.field, parsed.collection);
  const objectId = diagnostic.elementId ?? resolveObjectId(model, parsed);
  const navigationObjectId = resolveNavigationObjectId(model, parsed) ?? objectId;
  const workspace = workspaceForLocation(parsed, diagnostic);
  const inspectorSection = navigationObjectId || objectId
    ? resolveInspectorSection(parsed.field, parsed.collection)
    : undefined;
  const leftPanel = resolveLeftPanel({
    navigationObjectId,
    objectId,
    field: parsed.field,
    collection: parsed.collection,
  });
  const constraintId = parsed.collection === 'relations' && model && parsed.index !== undefined
    ? model.relations[parsed.index]?.id
    : undefined;

  return {
    ...parsed,
    workspace,
    objectId,
    navigationObjectId,
    fieldKey,
    inspectorSection,
    leftPanel,
    constraintId,
  };
}
