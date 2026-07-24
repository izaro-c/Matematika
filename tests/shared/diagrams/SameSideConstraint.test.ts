/**
 * Restricción `sameSide` ("en el mismo semiplano"): un punto no debe poder
 * cruzar la recta definida por otros dos puntos.
 *
 * Reproduce con precisión, sin JSXGraph ni React, el patrón real que usa
 * `item.on('drag', ...)` en `useBoardLifecycle.ts` para construir `liveSpec`
 * en cada fotograma de arrastre: todos los puntos, incluido el que se está
 * arrastrando, se leen de su posición "en vivo" (ya movida nativamente por
 * JSXGraph) antes de invocar `withMovedPoint`.
 */
import { describe, expect, it } from 'vitest';
import { diagramConstraint, point } from '../../../src/features/editor/diagrams/model/diagramElements';
import { materializeSameSideConstraints, withMovedPoint } from '../../../src/shared/diagrams/spec/scene';
import { projectDiagramSpecV3ToV2 } from '../../../src/shared/diagrams/spec/v3Compatibility';
import type { VisualDiagramModel } from '../../../src/features/editor/diagrams/model/types';

function sameSideModel(side?: 1 | -1): VisualDiagramModel {
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Semiplano (test)',
    componentId: 'sameside-test',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      { ...point('pA', 'A', 0, 2), constraintIds: ['sameA'] },
      point('pB', 'B', -2, -2),
      point('pC', 'C', 2, -2),
    ],
    elements: [],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pA', 'pB', 'pC'], durationMs: 0 }],
    constraints: [
      diagramConstraint('sameA', 'A no cruza la recta BC', 'sameSide', ['pA', 'pB', 'pC'], side !== undefined ? { side } : {}),
    ],
    note: '',
    extensions: {},
  };
}

/**
 * Reproduce un único fotograma del manejador `item.on('drag', ...)` de
 * `useBoardLifecycle.ts`: reconstruye `liveSpec` con la posición en vivo de
 * los DEMÁS puntos, pero conserva la última posición confirmada del punto
 * que se está arrastrando (no la sobrescribe), tal como exige la corrección
 * del runtime — de lo contrario `applySameSideConstraint` no tiene una
 * referencia real de "antes de este movimiento".
 */
function simulateDragFrame(committed: VisualDiagramModel, pointId: string, x: number, y: number): VisualDiagramModel {
  return withMovedPoint(committed, pointId, x, y);
}

function simulateDragGesture(committed: VisualDiagramModel, pointId: string, path: Array<[number, number]>): VisualDiagramModel {
  return path.reduce((live, [x, y]) => simulateDragFrame(live, pointId, x, y), committed);
}

describe('restricción sameSide ("en el mismo semiplano")', () => {
  it('recorta correctamente cuando se invoca de forma aislada sobre la posición confirmada anterior', () => {
    const model = sameSideModel();
    const next = withMovedPoint(model, 'pA', 0, -5);
    const moved = next.points.find(item => item.id === 'pA')!;
    expect(moved.y).toBeGreaterThan(-2);
  });

  it('impide que el punto cruce la recta en un único fotograma reproduciendo la construcción real de liveSpec', () => {
    const model = sameSideModel();
    const next = simulateDragFrame(model, 'pA', 0, -5);
    const moved = next.points.find(item => item.id === 'pA')!;
    expect(moved.y).toBeGreaterThan(-2);
  });

  it('impide que el punto termine al otro lado de la recta tras un gesto completo de arrastre frame a frame', () => {
    const model = sameSideModel();
    const path: Array<[number, number]> = Array.from({ length: 24 }, (_, i) => {
      const t = i / 23;
      return [0, 2 - t * 7];
    });
    const final = simulateDragGesture(model, 'pA', path);
    const finalA = final.points.find(item => item.id === 'pA')!;
    expect(finalA.y).toBeGreaterThan(-2 - 1e-6);
  });

  it('permite moverse libremente dentro del mismo semiplano', () => {
    const model = sameSideModel();
    const next = simulateDragFrame(model, 'pA', 3, 4);
    const moved = next.points.find(item => item.id === 'pA')!;
    expect(moved.x).toBeCloseTo(3, 5);
    expect(moved.y).toBeCloseTo(4, 5);
  });

  // --- Regresión: bug "frontera móvil" ---
  // El bug original: cuando los puntos de la frontera (B o C) se movían, la
  // restricción recalculaba el "lado" dinámicamente, lo que podía invertirlo
  // aunque el punto restringido no se hubiera movido.

  it('mantiene el semiplano correcto cuando el punto B de la frontera se mueve (con side persistido)', () => {
    // side=1: A (0,2) está en el semiplano positivo respecto a BC (y=-2)
    const model = sameSideModel(1);
    // Mover B al otro lado del eje; la recta BC rota significativamente
    const after = simulateDragFrame(model, 'pB', -2, 4);
    const A = after.points.find(p => p.id === 'pA')!;
    // A (0,2) sigue siendo accesible: no debe ser proyectado ni flipear
    expect(A.y).toBeCloseTo(2, 4);
  });

  it('mantiene el semiplano correcto cuando el punto C de la frontera se mueve (con side persistido)', () => {
    // side=1: A (0,2) está en el semiplano positivo respecto a BC
    const model = sameSideModel(1);
    // Mover C; la dirección de la recta cambia notablemente
    const after = simulateDragFrame(model, 'pC', 2, 4);
    const A = after.points.find(p => p.id === 'pA')!;
    expect(A.y).toBeCloseTo(2, 4);
  });

  it('mantiene el punto restringido en su semiplano tras giro grande de la frontera (con side persistido)', () => {
    // A está en y>0 (semiplano superior de BC), side=1
    // Sin side persistido, el nuevo initialCross sería negativo y flipearía A
    const model = sameSideModel(1);
    const after1 = simulateDragFrame(model, 'pB', 2, 2);
    const after2 = simulateDragFrame(after1, 'pC', -2, 2);
    const A = after2.points.find(p => p.id === 'pA')!;
    // La nueva recta pasa por y=2, por lo que A queda sobre la frontera
    // (proyectado + offset submilimétrico hacia side=1). Sin side persistido,
    // A flipearía al semiplano opuesto (y << 0). Con side persistido, A
    // permanece en el semiplano correcto: su coordenada y es ≥ frontera-ε.
    expect(A.y).toBeGreaterThanOrEqual(1.9);
  });

  it('fallback sin side: la restricción sigue funcionando para movimiento del punto restringido', () => {
    // Sin side en la spec (specs antiguas): el fallback recalcula el lado
    // desde la posición base del punto. El movimiento puro del punto sigue
    // siendo contenido; el bug solo aparece al mover también la frontera.
    const model = sameSideModel(); // sin side
    const next = simulateDragFrame(model, 'pA', 0, -5);
    const A = next.points.find(p => p.id === 'pA')!;
    expect(A.y).toBeGreaterThan(-2);
  });

  it('materializa side al proyectar una relación v3 sin side explícito', () => {
    const v2 = projectDiagramSpecV3ToV2({
      version: 3,
      renderer: 'matematika-diagram-renderer-v3',
      title: 'Semiplano v3',
      componentId: 'sameside-v3',
      category: 'Demos',
      mode: 'simulation',
      axis: false,
      grid: false,
      viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
      layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
      groups: [],
      objects: [
        {
          id: 'pA', label: 'A', color: 'terracota', layerId: 'geometry', order: 0, visible: true, locked: false,
          groupIds: [], selection: { selectable: true, role: 'primary', ariaLabel: 'A' },
          objectType: 'point', definition: { type: 'coordinates', x: 0, y: 0 },
          mobility: { type: 'constrained', relationIds: ['sameA'] },
        },
        {
          id: 'pB', label: 'B', color: 'terracota', layerId: 'geometry', order: 1, visible: true, locked: false,
          groupIds: [], selection: { selectable: true, role: 'primary', ariaLabel: 'B' },
          objectType: 'point', definition: { type: 'coordinates', x: -2, y: -2 },
          mobility: { type: 'free' },
        },
        {
          id: 'pC', label: 'C', color: 'terracota', layerId: 'geometry', order: 2, visible: true, locked: false,
          groupIds: [], selection: { selectable: true, role: 'primary', ariaLabel: 'C' },
          objectType: 'point', definition: { type: 'coordinates', x: 2, y: -2 },
          mobility: { type: 'free' },
        },
      ],
      relations: [{
        id: 'sameA', label: 'A no cruza BC', enabled: true, type: 'same-half-plane',
        points: ['pA', 'pB'], boundary: 'pC',
      }],
      steps: [],
      note: '',
    });
    const sameA = v2.constraints.find(constraint => constraint.id === 'sameA');
    expect(sameA?.side).toBe(1);
  });

  it('empuja el punto restringido cuando la frontera gira tras materializar side', () => {
    const model = materializeSameSideConstraints({
      ...sameSideModel(),
      points: [
        { ...point('pA', 'A', 0, 0), constraint: 'constrained', constraintIds: ['sameA'] },
        point('pB', 'B', -2, -2),
        point('pC', 'C', 2, -2),
      ],
    });
    expect(model.constraints?.[0]?.side).toBe(1);
    const after = simulateDragFrame(model, 'pB', -2, 4);
    const A = after.points.find(p => p.id === 'pA')!;
    expect(A.y).toBeGreaterThan(0);
  });
});
