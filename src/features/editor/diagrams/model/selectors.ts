import type { DiagramTarget, DiagramTargetRegistry } from '../../core/editorTypes';
import type { VisualDiagramModel, ElementKind, ColorToken } from './types';
import type { DiagramState } from '../state/types';

export function targetKind(kind: ElementKind): DiagramTarget['kind'] {
  if (kind === 'segment' || kind === 'baseExtension' || kind === 'dimensionLine') return 'segment';
  if (kind === 'line' || kind === 'ray' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'poincareGeodesic' || kind === 'poincareArc') return 'line';
  if (kind === 'polygon' || kind === 'areaDecomposition' || kind === 'grid') return 'polygon';
  if (kind === 'intersection' || kind === 'midpoint' || kind === 'perpendicularFoot') return 'point';
  if (kind === 'angle' || kind === 'nonReflexAngle' || kind === 'rightAngle' || kind === 'perpendicularMark') return 'angle';
  if (kind === 'circle' || kind === 'arc' || kind === 'congruenceMark') return 'other';
  if (kind === 'measureTicks') return 'measurement';
  return 'measurement';
}

export function buildTargets(model: VisualDiagramModel): DiagramTargetRegistry {
  const pointTargets = model.points
    .filter(item => item.target)
    .map(item => ({ id: item.targetId ?? item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.targetId ?? item.id}`, label: `Punto ${item.label}`, color: item.color, kind: 'point' as const }));
  const elementTargets = model.elements
    .filter(item => item.target)
    .map(item => ({ id: item.targetId ?? item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.targetId ?? item.id}`, label: item.label, color: item.color, kind: targetKind(item.kind) }));
  const sliderTargets = model.sliders
    .filter(item => item.target)
    .map(item => ({ id: item.targetId ?? item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.targetId ?? item.id}`, label: item.label, color: item.color, kind: 'slider' as const }));
  const groupTargets = model.groups
    .filter(group => group.target)
    .map(group => {
      const member = [...model.points, ...model.elements, ...model.sliders].find(item => group.memberIds.includes(item.id));
      const color = group.color ?? member?.color ?? 'ocre';
      return { id: group.targetId ?? group.id, objectId: group.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${group.targetId ?? group.id}`, label: group.label, color, kind: 'other' as const };
    });
  const stepTargets = model.steps
    .map(item => ({ id: item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.id}`, label: item.label, color: 'ocre' as const, kind: 'step' as const }));
  return [...pointTargets, ...elementTargets, ...sliderTargets, ...groupTargets, ...stepTargets];
}

export function safeColorToken(value: string): ColorToken {
  const tokens: ColorToken[] = ['carbon', 'terracota', 'salvia', 'pizarra', 'ocre', 'pavo', 'granada', 'musgo'];
  return tokens.includes(value as ColorToken) ? (value as ColorToken) : 'terracota';
}

export function targetText(target: DiagramTarget): string {
  return target.label.replace(/^Punto\s+/i, '').trim() || target.id;
}

export function safeMdxText(value: string): string {
  return value.replace(/[<>{}]/g, '').trim() || 'texto';
}

export function interactiveElementSnippet(target: DiagramTarget): string {
  const color = safeColorToken(target.color);
  return `<InteractiveElement target="${target.id}" color="${color}">${safeMdxText(targetText(target))}</InteractiveElement>`;
}

export function conceptHighlightSnippet(target: DiagramTarget): string {
  const color = safeColorToken(target.color);
  return `<ConceptLink targetId="concepto-id" highlightTarget="${target.id}" highlightColor="${color}">${safeMdxText(targetText(target))}</ConceptLink>`;
}

// Model selectors
export function canSaveDiagram(model: VisualDiagramModel): boolean {
  return Boolean(model.title.trim() && model.componentId.trim() && model.points.length > 0);
}

export type DiagramSaveBlockReason =
  | 'invalid-source'
  | 'diverged'
  | 'conflict'
  | 'validation-error'
  | 'stale-revision'
  | 'missing-authority';

export interface DiagramSaveCapability {
  allowed: boolean;
  reason?: DiagramSaveBlockReason;
}

export function getDiagramSaveCapability(state: DiagramState): DiagramSaveCapability {
  if (!state.filePath || !state.currentSource) return { allowed: false, reason: 'missing-authority' };
  if (state.status === 'invalid-source' || state.parseStatus === 'invalid') return { allowed: false, reason: 'invalid-source' };
  if (state.status === 'diverged') return { allowed: false, reason: 'diverged' };
  if (state.status === 'conflict') return { allowed: false, reason: 'conflict' };
  if (state.diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    return { allowed: false, reason: 'validation-error' };
  }
  if (state.expectedVersion !== null && state.expectedVersion.trim() === '') {
    return { allowed: false, reason: 'stale-revision' };
  }
  if (!state.currentModel && state.parseStatus !== 'code-preview') {
    return { allowed: false, reason: 'missing-authority' };
  }
  return { allowed: true };
}
