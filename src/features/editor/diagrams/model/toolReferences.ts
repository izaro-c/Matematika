import { refsNeededForTool } from './diagramElements';
import type { CanvasTool, VisualDiagramModel } from './types';

const ANGLE_REFERENCE_LABELS = ['Punto del primer lado', 'Vértice', 'Punto del segundo lado'] as const;
export const INTERSECTION_SUPPORT_KINDS = new Set(['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector']);

export function toolReferenceLabel(tool: CanvasTool, index: number): string {
  if (tool === 'intersection') return `Soporte lineal ${index + 1}`;
  if (tool === 'measureTicks') return 'Segmento graduado';
  if (tool === 'angle' || tool === 'nonReflexAngle' || tool === 'rightAngle' || tool === 'perpendicularMark' || tool === 'angleBisector') {
    return ANGLE_REFERENCE_LABELS[index] ?? `Punto ${index + 1}`;
  }
  return `${tool === 'polygon' ? 'Vértice' : 'Punto'} ${index + 1}`;
}

export function toolReferenceCandidates(model: VisualDiagramModel, tool: CanvasTool) {
  if (tool === 'intersection') return model.elements.filter(element => INTERSECTION_SUPPORT_KINDS.has(element.kind));
  if (tool === 'measureTicks') return model.elements.filter(element => element.kind === 'segment');
  return model.points;
}

export function normalizedToolReferences(tool: CanvasTool, refs: readonly string[]): string[] {
  const required = refsNeededForTool(tool);
  const length = tool === 'polygon' ? Math.max(required, refs.length) : required;
  return Array.from({ length }, (_, index) => refs[index] ?? '');
}

export function addToolReference(tool: CanvasTool, refs: readonly string[], referenceId: string): string[] {
  const normalized = normalizedToolReferences(tool, refs);
  if (normalized.includes(referenceId)) return normalized;
  const openIndex = normalized.findIndex(ref => ref === '');
  if (openIndex >= 0) normalized[openIndex] = referenceId;
  else if (tool === 'polygon') normalized.push(referenceId);
  return normalized;
}

export function updateToolReference(tool: CanvasTool, refs: readonly string[], index: number, referenceId: string): string[] {
  const normalized = normalizedToolReferences(tool, refs);
  if (index < 0 || index >= normalized.length) return normalized;
  normalized[index] = referenceId;
  return normalized;
}

export function completedToolReferenceCount(tool: CanvasTool, refs: readonly string[]): number {
  return normalizedToolReferences(tool, refs).filter(Boolean).length;
}

export function toolReferencesAreReady(tool: CanvasTool, refs: readonly string[]): boolean {
  const normalized = normalizedToolReferences(tool, refs);
  const enoughReferences = tool === 'polygon'
    ? normalized.filter(Boolean).length >= refsNeededForTool(tool)
    : normalized.length > 0;
  return enoughReferences
    && normalized.every(Boolean)
    && new Set(normalized).size === normalized.length;
}
