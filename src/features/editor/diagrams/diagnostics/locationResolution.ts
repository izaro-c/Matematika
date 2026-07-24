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
  if (collection === 'constraints' || field === 'refs' || field === 'gliderTarget' || field === 'kind') return 'geometry';
  if (field === 'dependencies' || field === 'xExpression' || field === 'yExpression') return 'geometry';
  if (field?.includes('constraint') || field === 'x' || field === 'y' || field?.includes('Expression')) return 'geometry';
  if (field === 'expression' || field === 'properties') return 'geometry';
  if (field === 'visibleWhen' || field === 'target' || field?.startsWith('selection')) return 'advanced';
  if (field === 'color' || field?.startsWith('style') || field === 'label' || field === 'showLabel') return 'appearance';
  return 'general';
}

export function resolveFieldKey(field?: string, collection?: DiagramDiagnosticCollection): string | undefined {
  if (collection === 'constraints') return 'constraints';
  if (!field) return undefined;
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

  const collection = location.collection === 'objects' ? 'elements' : location.collection;
  switch (collection) {
    case 'points': return itemIdAt(model.points, location.index);
    case 'elements': return itemIdAt(model.elements, location.index);
    case 'sliders': return itemIdAt(model.sliders, location.index);
    case 'constraints': return itemIdAt(model.constraints, location.index);
    case 'steps': return itemIdAt(model.steps, location.index);
    case 'groups': return itemIdAt(model.groups, location.index);
    default: return undefined;
  }
}

function segmentIdForConstraint(
  model: VisualDiagramModel,
  constraint: NonNullable<VisualDiagramModel['constraints']>[number],
): string | undefined {
  if (constraint.kind === 'equalLength' && constraint.refs.length >= 2) {
    const [first, second] = constraint.refs;
    const segment = model.elements.find(element => (
      element.kind === 'segment'
      && element.refs.includes(first)
      && element.refs.includes(second)
    ));
    if (segment) return segment.id;
  }

  const lastRef = constraint.refs[constraint.refs.length - 1];
  if (lastRef) {
    const segment = model.elements.find(element => element.id === lastRef && element.kind === 'segment');
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

  if (location.collection === 'constraints' && location.index !== undefined) {
    const constraint = model.constraints?.[location.index];
    if (!constraint) return undefined;

    const segmentId = segmentIdForConstraint(model, constraint);
    if (segmentId) return segmentId;

    const pointOwner = constraint.refs.find(ref => model.points.some(point => point.id === ref));
    if (pointOwner) return pointOwner;

    return constraint.refs[0] ?? constraint.id;
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
  if (!model || location.collection !== 'points' || location.index === undefined) return location;

  const point = model.points[location.index];
  if (!point) return location;

  if (location.field) {
    return {
      ...location,
      fieldKey: location.fieldKey ?? resolveFieldKey(location.field, location.collection),
      inspectorSection: location.inspectorSection
        ?? resolveInspectorSection(location.field, location.collection),
    };
  }

  const mentionsDerived = /derivad|expresion/i.test(diagnostic.message);
  if (point.constraint === 'derived' || mentionsDerived) {
    const field = !point.xExpression
      ? 'xExpression'
      : !point.yExpression
        ? 'yExpression'
        : !point.dependencies?.length
          ? 'dependencies'
          : 'xExpression';
    return {
      ...location,
      field,
      fieldKey: field,
      inspectorSection: 'geometry',
      leftPanel: location.leftPanel ?? 'objects',
    };
  }

  if (point.constraint === 'glider' && !point.gliderTarget) {
    return {
      ...location,
      field: 'gliderTarget',
      fieldKey: 'gliderTarget',
      inspectorSection: 'geometry',
      leftPanel: location.leftPanel ?? 'objects',
    };
  }

  if (point.constraint === 'constrained' && !point.constraintIds?.length) {
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
  const constraintId = parsed.collection === 'constraints' && model && parsed.index !== undefined
    ? model.constraints?.[parsed.index]?.id
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
