/**
 * diagramAdaptiveScale.ts
 *
 * Escalado adaptativo responsivo para elementos geométricos de diagramas.
 * - Los puntos se reducen proporcionalmente pero nunca bajan de MIN_POINT_SIZE (4px).
 * - Los ángulos adaptan su radio en coordenadas en redibujado para sobrepasar la superficie
 *   del punto del vértice en pantalla cuando el tablero es pequeño (baja densidad de píxeles).
 * - En pantallas normales o grandes, el radio retorna exactamente al valor del autor.
 */

import { diagramTextScaleFromHeight } from '@/diagrams/diagramTextScale';

/** Tamaño mínimo en píxeles para que un punto siga siendo visible y arrastrable. */
export const MIN_POINT_SIZE = 4;

/** Tamaño mínimo en píxeles para la resaltación (hover/active) de un punto. */
export const MIN_HIGHLIGHT_POINT_SIZE = 6;

/** Holgura mínima en píxeles entre el borde del punto del vértice y el marcador de ángulo. */
export const MIN_ANGLE_MARKER_CLEARANCE_PX = 8;

/** Factor de escala actual del contenedor del diagrama (entre 0.7 y 1.0). */
export function getDiagramScale(board: any): number {
  const el = board?.containerObj;
  if (!el) return 1;
  const cssScale = parseFloat(getComputedStyle(el).getPropertyValue('--diagram-text-scale'));
  if (Number.isFinite(cssScale) && cssScale > 0) return cssScale;
  return el.clientHeight > 0 ? diagramTextScaleFromHeight(el.clientHeight) : 1;
}

/** Calcula el tamaño adaptativo en píxeles para un punto respetando el límite mínimo. */
export function resolveAdaptivePointSize(authoredSize: number = 4, scale: number = 1, minSize: number = MIN_POINT_SIZE): number {
  return Math.max(minSize, Math.round(authoredSize * scale));
}

/** Calcula el tamaño adaptativo de resaltado en píxeles para un punto. */
export function resolveAdaptiveHighlightPointSize(authoredSize: number = 6, scale: number = 1): number {
  return resolveAdaptivePointSize(authoredSize, scale, MIN_HIGHLIGHT_POINT_SIZE);
}

/** Retorna una función getter () => number que calcula el radio adaptativo en redibujado. */
export function resolveAdaptiveAngleRadius(
  board: any,
  vertexPoint: any,
  authoredRadius: number | (() => number) = 0.45,
): () => number {
  return () => {
    const base = typeof authoredRadius === 'function' ? authoredRadius() : authoredRadius;
    if (!Number.isFinite(base) || base <= 0) return 0.45;
    if (!board || !board.containerObj) return base;

    const unitX = Math.max(board.unitX || 20, 1);
    const evalSize = typeof vertexPoint?.evalVisProp === 'function' ? vertexPoint.evalVisProp('size') : undefined;
    const pointRadiusPx = typeof evalSize === 'number' && Number.isFinite(evalSize)
      ? evalSize
      : (typeof vertexPoint?.size === 'number' ? vertexPoint.size : MIN_POINT_SIZE);

    const minCoordRadius = (pointRadiusPx + MIN_ANGLE_MARKER_CLEARANCE_PX) / unitX;
    return Math.max(base, minCoordRadius);
  };
}
