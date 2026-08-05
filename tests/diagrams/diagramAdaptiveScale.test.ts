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

  it('adaptar dinámicamente el radio del ángulo para sobrepasar el radio del punto', () => {
    // Simular un tablero con unitX = 10px/unidad (diagrama muy pequeño / zoom-out)
    const mockBoardSmall = { unitX: 10, containerObj: {} };
    const mockVertexPoint = { evalVisProp: () => 7 }; // Radio del punto en píxeles = 7

    const authoredRadius = 0.6; // Unidades de coordenada
    const getRadius = resolveAdaptiveAngleRadius(mockBoardSmall, mockVertexPoint, authoredRadius);

    // En 10px/unidad, con MIN_ANGLE_MARKER_CLEARANCE_PX = 8, el radio necesario en píxeles es 7 + 8 = 15px.
    // 15px / 10px/unidad = 1.5 unidades de coordenada.
    expect(getRadius()).toBeCloseTo(1.5);
  });

  it('mantener el radio del ángulo creado por el autor si unitX es holgado', () => {
    // Simular un tablero grande con unitX = 50px/unidad
    const mockBoardLarge = { unitX: 50, containerObj: {} };
    const mockVertexPoint = { evalVisProp: () => 7 };

    const authoredRadius = 0.6;
    const getRadius = resolveAdaptiveAngleRadius(mockBoardLarge, mockVertexPoint, authoredRadius);

    // 7 + 8 = 15px. 15 / 50 = 0.3 unidades de coordenada.
    // 0.6 > 0.3 -> debe mantener exactamente el valor del autor (0.6).
    expect(getRadius()).toBe(0.6);
  });
});
