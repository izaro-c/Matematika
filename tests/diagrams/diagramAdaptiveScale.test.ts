import { describe, expect, it } from 'vitest';
import {
  MIN_POINT_SIZE,
  MIN_HIGHLIGHT_POINT_SIZE,
  MIN_ANGLE_MARKER_CLEARANCE_PX,
  resolveAdaptivePointSize,
  resolveAdaptiveHighlightPointSize,
  resolveAdaptiveAngleRadius,
} from '@/diagrams/render/elements/diagramAdaptiveScale';

describe('diagramAdaptiveScale', () => {
  it('respetar el tamaño mínimo interactivo de los puntos', () => {
    // Para escala reducida 0.7 y tamaño 4px -> 4*0.7 = 2.8px -> debe fijar MIN_POINT_SIZE (4px)
    expect(resolveAdaptivePointSize(4, 0.7)).toBe(MIN_POINT_SIZE);

    // Para escala normal (1.0) y tamaño 7px -> 7px
    expect(resolveAdaptivePointSize(7, 1.0)).toBe(7);

    // Para escala reducida (0.7) y tamaño 7px -> 7*0.7 = 4.9px -> Math.round(4.9) = 5px
    expect(resolveAdaptivePointSize(7, 0.7)).toBe(5);
  });

  it('respetar el tamaño mínimo interactivo de resaltado', () => {
    expect(resolveAdaptiveHighlightPointSize(6, 0.7)).toBe(MIN_HIGHLIGHT_POINT_SIZE);
    expect(resolveAdaptiveHighlightPointSize(10, 0.7)).toBe(7);
  });

  it('mantener el tamaño visual en pantalla (píxeles) constante ante zoom in y zoom out como los puntos', () => {
    const mockVertexPoint = { evalVisProp: () => 7 };
    const authoredRadius = 0.55;

    // Zoom normal (unitX = 50px/u) -> 24px en pantalla = 24/50 = 0.48u
    const mockBoardNormal = { unitX: 50, containerObj: {} };
    const getRadiusNormal = resolveAdaptiveAngleRadius(mockBoardNormal, mockVertexPoint, authoredRadius);
    expect(getRadiusNormal() * 50).toBeCloseTo(24);

    // Zoom in (unitX = 200px/u) -> en pantalla sigue midiendo exactamente 24px (0.12u en coordenadas)
    const mockBoardZoomIn = { unitX: 200, containerObj: {} };
    const getRadiusZoomIn = resolveAdaptiveAngleRadius(mockBoardZoomIn, mockVertexPoint, authoredRadius);
    expect(getRadiusZoomIn() * 200).toBeCloseTo(24);
    expect(getRadiusZoomIn()).toBeCloseTo(0.12);

    // Zoom out (unitX = 20px/u) -> en pantalla sigue midiendo 24px (1.2u en coordenadas)
    const mockBoardZoomOut = { unitX: 20, containerObj: {} };
    const getRadiusZoomOut = resolveAdaptiveAngleRadius(mockBoardZoomOut, mockVertexPoint, authoredRadius);
    expect(getRadiusZoomOut() * 20).toBeCloseTo(24);
    expect(getRadiusZoomOut()).toBeCloseTo(1.2);
  });

  it('acotar el radio del ángulo a los brazos cuando el triángulo o figura se hace muy pequeño', () => {
    const mockBoard = { unitX: 50, containerObj: {} };
    const mockVertex = { X: () => 0, Y: () => 0, evalVisProp: () => 4 };
    // Brazos diminutos (longitud 0.2 y 0.3) -> 10px y 15px en pantalla
    const arm1 = { X: () => 0.2, Y: () => 0 };
    const arm2 = { X: () => 0, Y: () => 0.3 };

    const authoredRadius = 0.55;
    const getRadius = resolveAdaptiveAngleRadius(mockBoard, mockVertex, authoredRadius, [arm1, arm2]);

    // Con minArmDistPx = 10px, el radio se acota al 45% del brazo más corto (4.5px en pantalla -> 4.5/50 = 0.09u)
    expect(getRadius()).toBeCloseTo(0.09, 5);
  });

  it('mantener el radio en pantalla si los brazos son suficientemente grandes', () => {
    const mockBoard = { unitX: 50, containerObj: {} };
    const mockVertex = { X: () => 0, Y: () => 0, evalVisProp: () => 7 };
    // Brazos amplios (longitud 3.22 y 4) como en Pitágoras normal -> 161px y 200px
    const arm1 = { X: () => 3.22, Y: () => 0 };
    const arm2 = { X: () => 0, Y: () => 4 };

    const authoredRadius = 0.55;
    const getRadius = resolveAdaptiveAngleRadius(mockBoard, mockVertex, authoredRadius, [arm1, arm2]);

    // 24px < 161 * 0.45 (72.45px) -> conserva exactamente 24px en pantalla (0.48u)
    expect(getRadius() * 50).toBeCloseTo(24);
  });
});
