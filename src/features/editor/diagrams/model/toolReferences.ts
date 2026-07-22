import { refsNeededForTool } from './diagramElements';
import {
  legacyReferenceCandidates,
  referenceSlotsForLegacyKind,
  isAreaElement,
} from '../../../../shared/diagrams/spec';
import type { CanvasTool, VisualDiagramModel } from './types';

const ANGLE_REFERENCE_LABELS = ['Punto del primer lado', 'Vértice', 'Punto del segundo lado'] as const;
export const INTERSECTION_SUPPORT_KINDS = new Set(['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector']);

export function toolReferenceLabel(tool: CanvasTool, index: number): string {
  const slotLabel = referenceSlotsForLegacyKind(tool)[index]?.label;
  if (slotLabel) return slotLabel;
  if (tool === 'intersection') return `Soporte lineal ${index + 1}`;
  if (tool === 'measureTicks') return 'Segmento graduado';
  if (tool === 'parallelMark') return index === 0 ? 'Primer extremo del lado paralelo' : 'Segundo extremo del lado paralelo';
  if (tool === 'label') return 'Objeto etiquetado';
  if (tool === 'angle' || tool === 'nonReflexAngle' || tool === 'rightAngle' || tool === 'perpendicularMark' || tool === 'angleBisector') {
    return ANGLE_REFERENCE_LABELS[index] ?? `Punto ${index + 1}`;
  }
  return `${tool === 'polygon' ? 'Vértice' : tool === 'areaIntersection' ? 'Área' : 'Punto'} ${index + 1}`;
}

export function toolReferencePurpose(tool: CanvasTool, index: number): string {
  if (tool === 'polygon') return index === 0 ? 'Primer vértice; fija el inicio del contorno.' : `Vértice ${index + 1} del contorno, siguiendo su orden.`;
  if (tool === 'areaIntersection') return index === 0 ? 'Primera región que acota la intersección.' : `Área ${index + 1} que participa en la intersección.`;
  const purposes: Partial<Record<CanvasTool, readonly string[]>> = {
    segment: ['Extremo inicial del segmento.', 'Extremo final del segmento.'],
    line: ['Primer punto por el que pasa la recta.', 'Segundo punto que fija su dirección.'],
    ray: ['Origen de la semirrecta.', 'Punto que fija la dirección desde el origen.'],
    circle: ['Centro de la circunferencia.', 'Punto por el que pasa; determina el radio.'],
    arc: ['Centro de la circunferencia soporte.', 'Inicio del arco.', 'Final del arco.'],
    intersection: ['Primera recta, segmento o semirrecta que se cruza.', 'Segundo soporte; el cruce de ambos define el punto.'],
    midpoint: ['Primer extremo del segmento implícito.', 'Segundo extremo; el nuevo punto queda equidistante de ambos.'],
    perpendicularFoot: ['Primer punto de la recta base.', 'Segundo punto que fija la recta base.', 'Punto que se proyectará perpendicularmente sobre la base.'],
    baseExtension: ['Primer extremo de la base.', 'Segundo extremo de la base.', 'Punto exterior hasta el que se muestra la prolongación.'],
    perpendicular: ['Primer punto de la recta de referencia.', 'Segundo punto que fija su dirección.', 'Punto por el que pasará la perpendicular.'],
    parallel: ['Primer punto de la recta de referencia.', 'Segundo punto que fija su dirección.', 'Punto por el que pasará la paralela.'],
    angleBisector: ['Punto del primer lado del ángulo.', 'Vértice y origen de la bisectriz.', 'Punto del segundo lado del ángulo.'],
    angle: ['Punto del primer lado; inicia la lectura orientada.', 'Vértice del ángulo.', 'Punto del segundo lado; cierra la lectura orientada.'],
    nonReflexAngle: ['Punto del primer lado.', 'Vértice del ángulo.', 'Punto del segundo lado; se mostrará siempre el ángulo menor.'],
    rightAngle: ['Punto del primer lado.', 'Vértice donde se dibuja el cuadrado.', 'Punto del segundo lado.'],
    perpendicularMark: ['Punto del primer lado.', 'Vértice donde se cruzan los lados.', 'Punto del segundo lado.'],
    congruenceMark: ['Primer extremo del segmento que se marcará.', 'Segundo extremo del segmento que se marcará.'],
    parallelMark: ['Primer extremo del lado que recibirá la flecha.', 'Segundo extremo; fija la orientación de la marca.'],
    measureTicks: ['Segmento sobre el que se repartirán las graduaciones.'],
    dimensionLine: ['Primer extremo de la distancia acotada.', 'Segundo extremo de la distancia acotada.'],
    measurement: ['Primer punto de la distancia que se calcula.', 'Segundo punto de la distancia que se calcula.'],
    areaDecomposition: ['Primer vértice de la región.', 'Segundo vértice que fija una dirección.', 'Tercer vértice que completa la región base.'],
    halfPlane: ['Primer punto de la recta frontera.', 'Segundo punto de la recta frontera.', 'Punto que indica el semiplano deseado.'],
    areaIntersection: ['Primera área que participa en la intersección.', 'Segunda área que participa en la intersección.'],
    poincareGeodesic: ['Primer punto de la frontera de referencia.', 'Segundo punto de esa frontera.', 'Primer extremo interior de la geodésica.', 'Segundo extremo interior de la geodésica.'],
    poincareArc: ['Primer punto de la frontera de referencia.', 'Segundo punto de esa frontera.', 'Inicio del arco hiperbólico.', 'Final del arco hiperbólico.'],
    grid: ['Esquina inferior izquierda.', 'Esquina inferior derecha.', 'Esquina superior derecha.', 'Esquina superior izquierda.'],
    text: ['Punto junto al que se situará el texto.'],
    label: ['Objeto geométrico al que seguirá la etiqueta.'],
    formula: ['Punto junto al que se situará la fórmula.'],
  };
  return purposes[tool]?.[index] ?? `Referencia ${index + 1} necesaria para construir el objeto.`;
}

export function toolReferenceSequenceDescription(tool: CanvasTool): string {
  const count = refsNeededForTool(tool);
  if (count === 0) return 'No requiere seleccionar referencias.';
  const roles = Array.from({ length: count }, (_, index) => {
    const label = toolReferenceLabel(tool, index).toLocaleLowerCase('es');
    const purpose = toolReferencePurpose(tool, index).replace(/\.$/, '');
    return `${label} — ${purpose}`;
  });
  return `Seleccione, en orden: ${roles.join(' → ')}.`;
}

export function toolReferenceCandidates(model: VisualDiagramModel, tool: CanvasTool) {
  if (tool === 'point' || tool === 'select') return [];
  const firstSlot = referenceSlotsForLegacyKind(tool)[0];
  const candidates = firstSlot ? legacyReferenceCandidates(model, firstSlot.capability) : [];
  if (tool === 'areaIntersection') {
    return candidates.filter((item): item is VisualDiagramModel['elements'][number] => (
      'kind' in item && isAreaElement(item)
    ));
  }
  return candidates;
}

export function toolReferenceCandidatesForSlot(model: VisualDiagramModel, tool: CanvasTool, index: number) {
  if (tool === 'point' || tool === 'select') return [];
  const slots = referenceSlotsForLegacyKind(tool);
  if (slots.length === 0) return [];
  const slot = slots[index] ?? slots.find(candidate => candidate.repeatable) ?? slots[slots.length - 1];
  const candidates = slot ? legacyReferenceCandidates(model, slot.capability) : [];
  if (tool === 'areaIntersection') {
    return candidates.filter((item): item is VisualDiagramModel['elements'][number] => (
      'kind' in item && isAreaElement(item) && item.id !== undefined
    ));
  }
  return candidates;
}

export function normalizedToolReferences(tool: CanvasTool, refs: readonly string[]): string[] {
  const required = refsNeededForTool(tool);
  const length = tool === 'polygon' || tool === 'areaIntersection'
    ? Math.max(required, refs.length)
    : required;
  return Array.from({ length }, (_, index) => refs[index] ?? '');
}

export function addToolReference(tool: CanvasTool, refs: readonly string[], referenceId: string): string[] {
  const normalized = normalizedToolReferences(tool, refs);
  if (normalized.includes(referenceId)) return normalized;
  const openIndex = normalized.findIndex(ref => ref === '');
  if (openIndex >= 0) normalized[openIndex] = referenceId;
  else if (tool === 'polygon' || tool === 'areaIntersection') normalized.push(referenceId);
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
  const enoughReferences = tool === 'polygon' || tool === 'areaIntersection'
    ? normalized.filter(Boolean).length >= refsNeededForTool(tool)
    : normalized.length > 0;
  return enoughReferences
    && normalized.every(Boolean)
    && new Set(normalized).size === normalized.length;
}
