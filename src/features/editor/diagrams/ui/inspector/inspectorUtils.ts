import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep } from '../../model/types';
import { KIND_LABELS, toolReferenceCandidatesForSlot } from '../../model';
import { legacyElementCapabilities } from '@/shared/diagrams/public';

export type InspectorSection = 'general' | 'geometry' | 'appearance' | 'advanced';

export function sceneItemLabel(model: VisualDiagramModel, id: string): string {
  const item = [...model.points, ...model.elements, ...model.sliders].find(candidate => candidate.id === id);
  return item ? `${item.label} (${item.id})` : id;
}

export function elementReferenceCandidates(model: VisualDiagramModel, element: VisualElement, index: number) {
  return toolReferenceCandidatesForSlot(model, element.kind, index).filter(candidate => candidate.id !== element.id);
}

export function curveParameter(element: VisualElement): string {
  return element.properties?.parameter ?? (element.kind === 'functionCurve' ? 'x' : 't');
}

export function labelCanMoveAlongPath(kind: VisualElement['kind']): boolean {
  return ['segment', 'line', 'ray', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'dimensionLine'].includes(kind);
}

export interface InspectorSelectionSummary {
  type: string;
  label: string;
  id: string;
}

export function inspectorSelectionSummary(
  point: VisualPoint | undefined,
  element: VisualElement | undefined,
  slider: VisualSlider | undefined,
  step: VisualStep | undefined,
): InspectorSelectionSummary | null {
  if (point) return { type: 'Punto', label: point.label, id: point.id };
  if (element) {
    const family = legacyElementCapabilities(element.kind).has('point') ? 'Punto construido' : KIND_LABELS[element.kind];
    return { type: family, label: element.label, id: element.id };
  }
  if (slider) return { type: 'Control', label: slider.label, id: slider.id };
  if (step) return { type: 'Paso', label: step.label, id: step.id };
  return null;
}
