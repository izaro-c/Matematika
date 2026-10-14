import { objectKind } from '@/diagrams';
import type { DiagramTarget, DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { modelElements, modelPoints, modelSliders } from './objectLists';
import type { VisualDiagramModel, ElementKind } from '../types';
import type { DiagramState } from '@/fixed-pages/editor/diagrams/history/types';

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return false;
  }
  if (Array.isArray(left)) {
    return Array.isArray(right)
      && left.length === right.length
      && left.every((item, index) => deepEqual(item, right[index]));
  }
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every(key => Object.prototype.hasOwnProperty.call(rightRecord, key)
    && deepEqual(leftRecord[key], rightRecord[key]));
}

export function isDiagramStateDirty(state: DiagramState): boolean {
  if (state.currentSource !== state.originalSource) return true;
  return !deepEqual(state.currentModel, state.originalModel);
}

export function targetKind(kind: ElementKind): DiagramTarget['kind'] {
  if (kind === 'segment' || kind === 'segmentExtension' || kind === 'dimensionLine') return 'segment';
  if (kind === 'line' || kind === 'ray' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'poincareGeodesic' || kind === 'poincareArc') return 'line';
  if (kind === 'polygon' || kind === 'areaDecomposition' || kind === 'grid' || kind === 'halfPlane' || kind === 'areaIntersection') return 'polygon';
  if (kind === 'intersection' || kind === 'midpoint' || kind === 'perpendicularFoot') return 'point';
  if (kind === 'angle' || kind === 'nonReflexAngle' || kind === 'rightAngle' || kind === 'perpendicularMark') return 'angle';
  if (kind === 'circle' || kind === 'arc' || kind === 'congruenceMark' || kind === 'parallelMark') return 'other';
  if (kind === 'measureTicks') return 'measurement';
  return 'measurement';
}

export function buildTargets(model: VisualDiagramModel): DiagramTargetRegistry {
  const pointTargets = modelPoints(model)
    .filter(item => item.target)
    .map(item => ({ id: item.targetId ?? item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.targetId ?? item.id}`, label: `Punto ${item.label}`, color: item.color, kind: 'point' as const }));
  const elementTargets = modelElements(model)
    .filter(item => item.target)
    .map(item => {
      const kind = objectKind(item);
      return { id: item.targetId ?? item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.targetId ?? item.id}`, label: item.label, color: item.color, kind: kind === 'point' || kind === 'control' ? 'point' as const : targetKind(kind) };
    });
  const sliderTargets = modelSliders(model)
    .filter(item => item.target)
    .map(item => ({ id: item.targetId ?? item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.targetId ?? item.id}`, label: item.label, color: item.color, kind: 'slider' as const }));
  const groupTargets = model.groups
    .filter(group => group.target)
    .map(group => {
      const member = [...modelPoints(model), ...modelElements(model), ...modelSliders(model)].find(item => group.memberIds.includes(item.id));
      const color = group.color ?? member?.color ?? 'ocre';
      return { id: group.targetId ?? group.id, objectId: group.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${group.targetId ?? group.id}`, label: group.label, color, kind: 'other' as const };
    });
  const stepTargets = model.steps
    .map(item => ({ id: item.id, objectId: item.id, scopeId: model.componentId, qualifiedId: `${model.componentId}:${item.id}`, label: item.label, color: 'ocre' as const, kind: 'step' as const }));
  return [...pointTargets, ...elementTargets, ...sliderTargets, ...groupTargets, ...stepTargets];
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
  summary?: string;
  primaryDiagnosticId?: string;
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
