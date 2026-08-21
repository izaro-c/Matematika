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
  if (!el || typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return 1;
  if (typeof Element !== 'undefined' && !(el instanceof Element)) return 1;
  try {
    const cssScale = parseFloat(window.getComputedStyle(el).getPropertyValue('--diagram-text-scale'));
    if (Number.isFinite(cssScale) && cssScale > 0) return cssScale;
    return typeof el.clientHeight === 'number' && el.clientHeight > 0 ? diagramTextScaleFromHeight(el.clientHeight) : 1;
  } catch {
    return 1;
  }
}

/** Calcula el tamaño adaptativo en píxeles para un punto respetando el límite mínimo. */
export function resolveAdaptivePointSize(authoredSize: number = 4, scale: number = 1, minSize: number = MIN_POINT_SIZE): number {
  return Math.max(minSize, Math.round(authoredSize * scale));
}

/** Calcula el tamaño adaptativo de resaltado en píxeles para un punto. */
export function resolveAdaptiveHighlightPointSize(authoredSize: number = 6, scale: number = 1): number {
  return resolveAdaptivePointSize(authoredSize, scale, MIN_HIGHLIGHT_POINT_SIZE);
}

function extractCoords(point: any): { x: number; y: number } | null {
  if (!point) return null;
  if (typeof point.X === 'function' && typeof point.Y === 'function') {
    const x = point.X();
    const y = point.Y();
    if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  }
  if (Array.isArray(point) && point.length >= 2) {
    const x = typeof point[0] === 'function' ? point[0]() : point[0];
    const y = typeof point[1] === 'function' ? point[1]() : point[1];
    if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  }
  if (typeof point.x === 'number' && typeof point.y === 'number') {
    return { x: point.x, y: point.y };
  }
  if (typeof point.coords?.usrCoords === 'object') {
    const x = point.coords.usrCoords[1];
    const y = point.coords.usrCoords[2];
    if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  }
  return null;
}

/** Radio base en píxeles de pantalla para el arco de un ángulo estándar. */
export const DEFAULT_ANGLE_RADIUS_PX = 24;

/** Tamaño base en píxeles de pantalla para el marcador cuadrado de ángulo recto. */
export const DEFAULT_RIGHT_ANGLE_RADIUS_PX = 15;

/** Retorna una función getter () => number que calcula el radio adaptativo en redibujado (tamaño visual en pantalla constante como los puntos). */
export function resolveAdaptiveAngleRadius(
  board: any,
  vertexPoint: any,
  authoredRadius: number | (() => number) = 0.45,
  armPoints?: any[] | readonly any[],
  basePixelRadius: number = DEFAULT_ANGLE_RADIUS_PX,
): () => number {
  return () => {
    const base = typeof authoredRadius === 'function' ? authoredRadius() : authoredRadius;
    if (!Number.isFinite(base) || base <= 0) return 0.45;
    if (!board || !board.containerObj) return base;

    const unitX = Math.max(board.unitX || 20, 1);
    const diagramScale = getDiagramScale(board);

    // Escalar el tamaño en píxeles de pantalla proporcionalmente al valor del autor:
    const referenceDefault = basePixelRadius === DEFAULT_RIGHT_ANGLE_RADIUS_PX ? 0.35 : 0.55;
    const customRatio = base / referenceDefault;
    const targetPx = basePixelRadius * customRatio * diagramScale;

    const evalSize = typeof vertexPoint?.evalVisProp === 'function' ? vertexPoint.evalVisProp('size') : undefined;
    const pointRadiusPx = typeof evalSize === 'number' && Number.isFinite(evalSize)
      ? evalSize
      : (typeof vertexPoint?.size === 'number' ? vertexPoint.size : MIN_POINT_SIZE);

    const minClearancePx = (pointRadiusPx + MIN_ANGLE_MARKER_CLEARANCE_PX) * diagramScale;
    let effectivePx = Math.max(targetPx, minClearancePx);

    if (armPoints && armPoints.length > 0) {
      const vCoords = extractCoords(vertexPoint);
      if (vCoords) {
        const distancesPx = armPoints
          .map(arm => {
            const aCoords = extractCoords(arm);
            return aCoords ? Math.hypot(aCoords.x - vCoords.x, aCoords.y - vCoords.y) * unitX : null;
          })
          .filter((d): d is number => d !== null && d > 0);

        if (distancesPx.length > 0) {
          const minArmDistPx = Math.min(...distancesPx);
          const maxAllowedPx = minArmDistPx * 0.45;
          if (maxAllowedPx > 0) {
            effectivePx = Math.min(effectivePx, maxAllowedPx);
          }
        }
      }
    }

    return effectivePx / unitX;
  };
}
