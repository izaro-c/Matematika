import type { DiagramTarget } from '@/features/editor/core/editorTypes';
import type { DiagramDiagnostic } from '../source/generator';
import type { VisualDiagramModel } from '../model/types';
import { humanizeDiagnostic } from './humanize';
export * from './types';
import type {
  DiagramDiagnosticWorkspace,
  DiagramInspectorSection,
  DiagramLeftPanel,
  DiagramDiagnosticCollection,
  DiagramDiagnosticLocation,
  EnrichedDiagramDiagnostic,
  DiagnosticSummary,
} from './types';

const MODEL_COLLECTIONS = new Set<DiagramDiagnosticCollection>([
  'points', 'elements', 'sliders', 'constraints', 'steps', 'groups', 'layers', 'objects',
]);


function parsePathFromMessage(message: string): { path: (string | number)[]; rest: string } | null {
  const match = message.match(/^(points|elements|sliders|constraints|steps|groups|objects)\.(\d+)\.([^:]+):\s*(.*)$/);
  if (!match) return null;
  return {
    path: [match[1], Number(match[2]), ...match[3].split('.')],
    rest: match[4],
  };
}

export function parseDiagnosticPath(path: readonly (string | number)[]): Omit<DiagramDiagnosticLocation, 'workspace'> {
  if (path.length === 0) return {};

  const [first, second, ...rest] = path;
  const collection = typeof first === 'string' && MODEL_COLLECTIONS.has(first as DiagramDiagnosticCollection)
    ? first as DiagramDiagnosticCollection
    : undefined;
  const index = typeof second === 'number' ? second : undefined;
  const fieldParts = (index !== undefined ? rest : path.slice(1)).map(part => String(part));
  const field = fieldParts.length > 0 ? fieldParts.join('.') : undefined;

  return { collection, index, field };
}

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

function refinePointLocation(
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

function segmentIdForConstraint(model: VisualDiagramModel, constraint: NonNullable<VisualDiagramModel['constraints']>[number]): string | undefined {
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
  location: Omit<DiagramDiagnosticLocation, 'workspace' | 'navigationObjectId' | 'inspectorSection' | 'fieldKey'>,
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
  location: Omit<DiagramDiagnosticLocation, 'workspace'>,
  diagnostic: DiagramDiagnostic,
): DiagramDiagnosticWorkspace {
  if (diagnostic.source === 'source' || diagnostic.code === 'invalid-source') return 'source';
  if (location.collection === 'steps') return 'steps';
  if (location.field === 'componentId' || location.field === 'title' || location.field === 'note') return 'build';
  if (diagnostic.code === 'invalid-component-name') return 'source';
  if (location.collection) return 'build';
  return 'check';
}

export function resolveObjectId(
  model: VisualDiagramModel | null,
  location: Omit<DiagramDiagnosticLocation, 'workspace'>,
): string | undefined {
  if (!model || location.collection === undefined || location.index === undefined) return undefined;

  const collection = location.collection === 'objects' ? 'elements' : location.collection;
  if (collection === 'points') {
    const item = model.points[location.index];
    return typeof item?.id === 'string' ? item.id : undefined;
  }
  if (collection === 'elements') {
    const item = model.elements[location.index];
    return typeof item?.id === 'string' ? item.id : undefined;
  }
  if (collection === 'sliders') {
    const item = model.sliders[location.index];
    return typeof item?.id === 'string' ? item.id : undefined;
  }
  if (collection === 'constraints') {
    const item = model.constraints?.[location.index];
    return typeof item?.id === 'string' ? item.id : undefined;
  }
  if (collection === 'steps') {
    const item = model.steps[location.index];
    return typeof item?.id === 'string' ? item.id : undefined;
  }
  if (collection === 'groups') {
    const item = model.groups[location.index];
    return typeof item?.id === 'string' ? item.id : undefined;
  }
  return undefined;
}

function expandLegacyDiagnostic(diagnostic: DiagramDiagnostic): DiagramDiagnostic[] {
  if (diagnostic.path && diagnostic.path.length > 0) return [diagnostic];

  const parts = diagnostic.message.split(/(?=\b(?:elements|points|objects|relations|constraints|steps|sliders|groups)\.\d+)/g)
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) return [diagnostic];

  return parts.map((part, index) => {
    const parsed = parsePathFromMessage(part);
    if (!parsed) return { ...diagnostic, message: part };
    return {
      ...diagnostic,
      message: parsed.rest || part,
      path: parsed.path,
      code: `${diagnostic.code}-${index}`,
    };
  });
}

function buildLocation(
  diagnostic: DiagramDiagnostic,
  model: VisualDiagramModel | null,
): DiagramDiagnosticLocation {
  const parsed = diagnostic.path && diagnostic.path.length > 0
    ? parseDiagnosticPath(diagnostic.path)
    : (() => {
      const fromMessage = parsePathFromMessage(diagnostic.message);
      return fromMessage ? parseDiagnosticPath(fromMessage.path) : {};
    })();

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

function finalizeLocation(
  diagnostic: DiagramDiagnostic,
  model: VisualDiagramModel | null,
): DiagramDiagnosticLocation {
  return refinePointLocation(buildLocation(diagnostic, model), model, diagnostic);
}

export function enrichDiagramDiagnostics(
  diagnostics: readonly DiagramDiagnostic[],
  model: VisualDiagramModel | null,
  targets: DiagramTarget[] = [],
): EnrichedDiagramDiagnostic[] {
  const expanded = diagnostics.flatMap(expandLegacyDiagnostic);

  return expanded.map((diagnostic, index) => {
    const location = finalizeLocation(diagnostic, model);
    const humanized = humanizeDiagnostic(diagnostic, location, location.objectId, targets);
    const id = `${diagnostic.code}-${location.objectId ?? location.collection ?? 'global'}-${index}`;

    return {
      id,
      severity: diagnostic.severity,
      code: diagnostic.code,
      title: humanized.title,
      message: humanized.message,
      hint: humanized.hint,
      location,
      rawMessage: diagnostic.message,
    };
  });
}

export function summarizeDiagnostics(diagnostics: readonly EnrichedDiagramDiagnostic[]): DiagnosticSummary {
  const objectIdsWithErrors = new Set<string>();
  const objectIdsWithWarnings = new Set<string>();

  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  diagnostics.forEach(diagnostic => {
    if (diagnostic.severity === 'error') {
      errorCount += 1;
      const targetId = diagnostic.location.navigationObjectId ?? diagnostic.location.objectId;
      if (targetId) objectIdsWithErrors.add(targetId);
    } else if (diagnostic.severity === 'warning') {
      warningCount += 1;
      const targetId = diagnostic.location.navigationObjectId ?? diagnostic.location.objectId;
      if (targetId) objectIdsWithWarnings.add(targetId);
    } else {
      infoCount += 1;
    }
  });

  return {
    errorCount,
    warningCount,
    infoCount,
    objectIdsWithErrors: [...objectIdsWithErrors],
    objectIdsWithWarnings: [...objectIdsWithWarnings],
  };
}

export function formatDiagnosticTabDetail(summary: DiagnosticSummary): string {
  if (summary.errorCount > 0) return `${summary.errorCount} error${summary.errorCount === 1 ? '' : 'es'}`;
  if (summary.warningCount > 0) return `${summary.warningCount} aviso${summary.warningCount === 1 ? '' : 's'}`;
  return 'Sin problemas';
}

export function fieldErrorsForObject(
  diagnostics: readonly EnrichedDiagramDiagnostic[],
  objectId: string,
): Map<string, string> {
  const errors = new Map<string, string>();
  diagnostics.forEach(diagnostic => {
    const targetId = diagnostic.location.navigationObjectId ?? diagnostic.location.objectId;
    if (targetId !== objectId) return;
    const key = diagnostic.location.fieldKey ?? diagnostic.location.field ?? 'general';
    errors.set(key, diagnostic.message);
  });
  return errors;
}

export function objectHasDiagnosticIssues(
  diagnostics: readonly EnrichedDiagramDiagnostic[],
  objectId: string,
  severity: EnrichedDiagramDiagnostic['severity'] = 'error',
): boolean {
  return diagnostics.some(diagnostic => {
    if (diagnostic.severity !== severity) return false;
    const targetId = diagnostic.location.navigationObjectId ?? diagnostic.location.objectId;
    return targetId === objectId;
  });
}
