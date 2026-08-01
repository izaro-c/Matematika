import type { DiagramSceneItem } from '@/diagrams/spec';
import {
  angleCandidates,
  areaCandidates,
  anchorCandidatesForEqualLength,
  otherSegmentCandidatesForEqualLength,
  pointLikeCandidates,
  reflectionAxisCandidates,
  supportCandidates,
} from './v3Projection';
import {
  combinedConstraintBlockReason,
  constraintPresentation,
} from './constraintOptions';
import type { VisualConstraint, VisualDiagramModel } from './types';

export type RelationSlotKindFilter =
  | 'point'
  | 'support'
  | 'area'
  | 'reflection-axis'
  | 'point-like'
  | 'equal-length-anchor'
  | 'equal-length-segment'
  | 'equal-angle-vertex'
  | 'equal-angle-fixed'
  | 'equal-angle-source'
  | 'equal-angle-target'
  | 'other-points';

export interface RelationSlot {
  index: number;
  label: string;
  filter: RelationSlotKindFilter;
  /** When true, this slot is the constrained subject and usually not edited in the UI. */
  subject?: boolean;
}

export interface RelationAvailability {
  status: 'ready' | 'disabled';
  reason?: string;
}

const POINT_POINT_KINDS = new Set<VisualConstraint['kind']>([
  'horizontal',
  'vertical',
  'coincident',
  'distance',
]);

function subjectSlot(label = 'Punto restringido'): RelationSlot {
  return { index: 0, label, filter: 'point', subject: true };
}

export function slotsFor(kind: VisualConstraint['kind']): RelationSlot[] {
  switch (kind) {
    case 'fixed':
    case 'expression':
      return [subjectSlot()];
    case 'horizontal':
    case 'vertical':
    case 'coincident':
    case 'distance':
      return [
        subjectSlot(),
        {
          index: 1,
          label: kind === 'coincident' ? 'Punto con el que coincide' : 'Punto de referencia',
          filter: 'other-points',
        },
      ];
    case 'on':
      return [
        subjectSlot(),
        { index: 1, label: 'Objeto soporte', filter: 'support' },
      ];
    case 'insideArea':
      return [
        subjectSlot(),
        { index: 1, label: 'Área', filter: 'area' },
      ];
    case 'midpoint':
      return [
        { index: 0, label: 'Punto medio', filter: 'point', subject: true },
        { index: 1, label: 'Primer extremo', filter: 'other-points' },
        { index: 2, label: 'Segundo extremo', filter: 'other-points' },
      ];
    case 'perpendicular':
    case 'parallel':
      return [
        subjectSlot(),
        { index: 1, label: 'Primer punto de la dirección', filter: 'other-points' },
        { index: 2, label: 'Segundo punto de la dirección', filter: 'other-points' },
      ];
    case 'insideDisk':
      return [
        subjectSlot(),
        { index: 1, label: 'Centro', filter: 'other-points' },
        { index: 2, label: 'Punto del borde', filter: 'other-points' },
      ];
    case 'sameSide':
      return [
        subjectSlot(),
        { index: 1, label: 'Primer punto de la frontera', filter: 'other-points' },
        { index: 2, label: 'Segundo punto de la frontera', filter: 'other-points' },
      ];
    case 'equalLength':
      return [
        { index: 0, label: 'Extremo ajustado', filter: 'point', subject: true },
        { index: 1, label: 'Extremo ancla', filter: 'equal-length-anchor' },
        { index: 2, label: 'Segmento de referencia', filter: 'equal-length-segment' },
      ];
    case 'equalAngle':
      return [
        { index: 0, label: 'Extremo ajustado', filter: 'point', subject: true },
        { index: 1, label: 'Vértice', filter: 'equal-angle-vertex' },
        { index: 2, label: 'Punto del lado fijo', filter: 'equal-angle-fixed' },
        { index: 3, label: 'Ángulo de referencia', filter: 'equal-angle-source' },
        { index: 4, label: 'Ángulo ajustado', filter: 'equal-angle-target' },
      ];
    case 'reflection':
      return [
        { index: 0, label: 'Punto ajustado (resultado)', filter: 'point', subject: true },
        { index: 1, label: 'Centro o eje de simetría (respecto a qué)', filter: 'reflection-axis' },
        { index: 2, label: 'Objeto de origen (de qué objeto es reflejo)', filter: 'point-like' },
      ];
    default:
      return Array.from({ length: constraintPresentation(kind).refs }, (_, index) => (
        index === 0
          ? subjectSlot()
          : { index, label: `Referencia ${index}`, filter: POINT_POINT_KINDS.has(kind) ? 'other-points' : 'point-like' }
      ));
  }
}

function excludeIds(items: DiagramSceneItem[], refs: readonly string[], upToIndex: number): DiagramSceneItem[] {
  const blocked = new Set(refs.slice(0, upToIndex));
  return items.filter(item => !blocked.has(item.id));
}

export function candidatesForSlot(
  model: VisualDiagramModel,
  kind: VisualConstraint['kind'],
  index: number,
  refs: readonly string[],
): DiagramSceneItem[] {
  const slot = slotsFor(kind).find(item => item.index === index);
  if (!slot) return [];

  switch (slot.filter) {
    case 'point':
      return model.points.filter(candidate => candidate.id === refs[0] || index === 0);
    case 'other-points':
      return excludeIds(model.points, refs, index);
    case 'support':
      return supportCandidates(model);
    case 'area':
      return areaCandidates(model);
    case 'reflection-axis':
      return reflectionAxisCandidates(model).filter(candidate => candidate.id !== refs[0]);
    case 'point-like':
      return pointLikeCandidates(model).filter(candidate => (
        candidate.id !== refs[0] && candidate.id !== refs[1]
      ));
    case 'equal-length-anchor':
      return anchorCandidatesForEqualLength(model, refs[0]);
    case 'equal-length-segment':
      return otherSegmentCandidatesForEqualLength(model, refs[1], refs[0]);
    case 'equal-angle-vertex': {
      const targetAngles = model.elements.filter(element => (
        (element.kind === 'angle' || element.kind === 'nonReflexAngle')
        && (element.refs[0] === refs[0] || element.refs[2] === refs[0])
      ));
      return model.points.filter(candidate => targetAngles.some(angle => angle.refs[1] === candidate.id));
    }
    case 'equal-angle-fixed': {
      const targetAngles = model.elements.filter(element => (
        (element.kind === 'angle' || element.kind === 'nonReflexAngle')
        && (element.refs[0] === refs[0] || element.refs[2] === refs[0])
      ));
      return model.points.filter(candidate => targetAngles.some(angle => (
        angle.refs[1] === refs[1]
        && candidate.id !== refs[0]
        && (angle.refs[0] === candidate.id || angle.refs[2] === candidate.id)
      )));
    }
    case 'equal-angle-source': {
      const targetAngles = model.elements.filter(element => (
        (element.kind === 'angle' || element.kind === 'nonReflexAngle')
        && (element.refs[0] === refs[0] || element.refs[2] === refs[0])
      ));
      const targetAngle = targetAngles.find(angle => angle.refs[1] === refs[1] && angle.refs.includes(refs[2]));
      const kinds = targetAngle?.kind === 'angle' || targetAngle?.kind === 'nonReflexAngle'
        ? [targetAngle.kind]
        : undefined;
      return angleCandidates(model, kinds).filter(element => (
        element.id !== targetAngle?.id && !element.refs.includes(refs[0])
      ));
    }
    case 'equal-angle-target': {
      const targetAngles = model.elements.filter(element => (
        (element.kind === 'angle' || element.kind === 'nonReflexAngle')
        && (element.refs[0] === refs[0] || element.refs[2] === refs[0])
      ));
      return targetAngles;
    }
    default:
      return [];
  }
}

/** Editable slots only (excludes subject index 0). */
export function editableSlotsFor(kind: VisualConstraint['kind']): RelationSlot[] {
  return slotsFor(kind).filter(slot => !slot.subject);
}

export function isIdAllowedForSlot(
  model: VisualDiagramModel,
  kind: VisualConstraint['kind'],
  index: number,
  refs: readonly string[],
  id: string,
): boolean {
  return candidatesForSlot(model, kind, index, refs).some(item => item.id === id);
}

export function relationAvailability(
  model: VisualDiagramModel,
  kind: VisualConstraint['kind'],
  targetId: string,
  activeKinds: readonly VisualConstraint['kind'][],
  options?: { ignoreKind?: VisualConstraint['kind'] },
): RelationAvailability {
  const reason = combinedConstraintBlockReason(model, kind, targetId, activeKinds, options);
  if (reason) return { status: 'disabled', reason };
  return { status: 'ready' };
}
