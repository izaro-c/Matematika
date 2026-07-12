import type { DiagramTarget, DiagramTargetRegistry } from '../../core/editorTypes';
import type { VisualDiagramModel, ElementKind, ColorToken } from './types';

export function targetKind(kind: ElementKind): DiagramTarget['kind'] {
  if (kind === 'segment' || kind === 'baseExtension') return 'segment';
  if (kind === 'line' || kind === 'ray' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector') return 'line';
  if (kind === 'polygon') return 'polygon';
  if (kind === 'midpoint' || kind === 'perpendicularFoot') return 'point';
  if (kind === 'angle' || kind === 'rightAngle') return 'angle';
  if (kind === 'circle') return 'other';
  return 'measurement';
}

export function buildTargets(model: VisualDiagramModel): DiagramTargetRegistry {
  const pointTargets = model.points
    .filter(item => item.target)
    .map(item => ({ id: item.id, label: `Punto ${item.label}`, color: item.color, kind: 'point' as const }));
  const elementTargets = model.elements
    .filter(item => item.target)
    .map(item => ({ id: item.id, label: item.label, color: item.color, kind: targetKind(item.kind) }));
  const sliderTargets = model.sliders
    .filter(item => item.target)
    .map(item => ({ id: item.id, label: item.label, color: item.color, kind: 'slider' as const }));
  const stepTargets = model.steps
    .map(item => ({ id: item.id, label: item.label, color: 'ocre' as const, kind: 'step' as const }));
  return [...pointTargets, ...elementTargets, ...sliderTargets, ...stepTargets];
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
