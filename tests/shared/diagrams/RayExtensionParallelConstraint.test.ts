/**
 * Investigación del "ray-flip" reportado en /demo/demo-angulo-externo al
 * arrastrar C por debajo de la recta AB.
 *
 * `DemoAnguloExterno` construye la semirrecta "rayBC" (prolongación de BC
 * más allá de C) como `ray(pC, paux)`, donde `paux` es un punto auxiliar
 * oculto con restricción `parallel` (refs = [paux, pB, pC]) que lo mantiene
 * sobre la recta BC. La idea es simular un "punto en el infinito" en la
 * dirección B→C: `paux` se coloca muy lejos de B en esa dirección para que
 * el rayo `pC → paux` se vea como la prolongación de BC.
 *
 * `applyLinearConstraint` (src/shared/diagrams/spec/scene.ts) resolvía la
 * posición de `paux` en cada fotograma proyectando su ÚLTIMA posición
 * resuelta sobre la recta ACTUAL que pasa por B con dirección (C - B):
 *
 *   amount = dot(paux_prev - B, C - B) / |C - B|^2
 *   paux   = B + amount * (C - B)
 *
 * ROOT CAUSE (confirmado con evidencia numérica): esto es un truco de
 * "punto en el infinito" con un defecto matemático. Si la dirección B→C
 * rota más de 90° respecto de la dirección que tenía `paux` cuando se
 * resolvió por última vez, `amount` cambia de signo y `paux` salta al lado
 * OPUESTO de B, invirtiendo la dirección visual del rayo.
 *
 * Simulando el gesto en pasos pequeños y continuos (muchos fotogramas, como
 * un arrastre lento con el ratón) el giro por fotograma es tan pequeño que
 * `amount` nunca cambia de signo: por eso los spikes iniciales de este
 * bug (arrastre sintético fino en JSDOM) no lo reprodujeron. La rotación
 * SÍ supera 90° en un único fotograma cuando el gesto real produce pocos
 * eventos de arrastre para un desplazamiento grande (arrastre rápido, un
 * paso de teclado de "salto grande", o simplemente soltar y volver a
 * agarrar el punto en una posición lejana) — exactamente lo que un usuario
 * hace de forma natural al "arrastrar C por debajo de AB" de un solo tirón.
 * Un experimento numérico (ver commit) confirma la transición: con el
 * mismo desplazamiento total de C, 60 fotogramas no invierten `paux`, pero
 * 1-2 fotogramas sí lo hacen.
 *
 * Este archivo reproduce, sin JSXGraph ni React, el mismo patrón de
 * resolución de restricciones que usa el runtime real (`withMovedPoint`):
 * primero confirma que el arrastre fino (muchos fotogramas) no invierte
 * `paux`, y después confirma con un salto grande (pocos fotogramas) que sí
 * lo hacía antes de la corrección y que ya no lo hace tras ella.
 */
import { describe, expect, it } from 'vitest';
import { diagramConstraint, point } from '../../../src/features/editor/diagrams/model/diagramElements';
import { resolvePointCoordinates, withMovedPoint } from '../../../src/shared/diagrams/spec/scene';
import type { VisualDiagramModel } from '../../../src/features/editor/diagrams/model/types';

const A = { x: -4.04, y: -2.69 };
const B = { x: 2.9, y: -2.6 };
const C0 = { x: -0.38, y: 2.77 };

/** Calibra `paux` exactamente como lo haría el editor: lejos de B, más allá de C. */
function calibratedAux(b: typeof B, c: typeof C0, amount = 15): { x: number; y: number } {
  return { x: b.x + amount * (c.x - b.x), y: b.y + amount * (c.y - b.y) };
}

function rayExtensionModel(): VisualDiagramModel {
  const aux = calibratedAux(B, C0);
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Prolongación de BC vía punto en el infinito (test)',
    componentId: 'ray-extension-test',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-8, 8, 8, -8], home: [-8, 8, 8, -8], minZoom: 0.2, maxZoom: 8, padding: 0.1 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      point('pA', 'A', A.x, A.y),
      point('pB', 'B', B.x, B.y),
      point('pC', 'C', C0.x, C0.y),
      { ...point('paux', 'Aux', aux.x, aux.y, false, 'terracota', 'constrained'), constraintIds: ['constraint1'] },
    ],
    elements: [],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pA', 'pB', 'pC', 'paux'], durationMs: 0 }],
    constraints: [
      diagramConstraint('constraint1', 'Sobre una paralela', 'parallel', ['paux', 'pB', 'pC']),
    ],
    note: '',
    extensions: {},
  };
}

/** Un único fotograma: mueve C y deja que se resuelvan las restricciones dependientes (paux). */
function dragFrame(model: VisualDiagramModel, x: number, y: number): VisualDiagramModel {
  return withMovedPoint(model, 'pC', x, y);
}

/**
 * Signo esperado: `paux` debe quedar más allá de C en la dirección B→C, es
 * decir, proyectado sobre (C - B) debe tener un parámetro MAYOR que el de C
 * (que vale 1). Si el parámetro cae por debajo de 1 (o se vuelve negativo),
 * el rayo `C → paux` deja de representar la prolongación de BC y apunta
 * hacia el lado equivocado: esto es la manifestación observable del "flip".
 */
function auxParameterAlongBC(model: VisualDiagramModel): number {
  const b = resolvePointCoordinates(model, 'pB')!;
  const c = resolvePointCoordinates(model, 'pC')!;
  const aux = resolvePointCoordinates(model, 'paux')!;
  const dx = c.x - b.x;
  const dy = c.y - b.y;
  const lengthSquared = dx * dx + dy * dy;
  return ((aux.x - b.x) * dx + (aux.y - b.y) * dy) / lengthSquared;
}

describe('semirrecta construida vía punto "en el infinito" con restricción parallel (rayBC de DemoAnguloExterno)', () => {
  it('mantiene paux más allá de C mientras el arrastre no gira la dirección B→C demasiado', () => {
    const model = rayExtensionModel();
    const next = dragFrame(model, C0.x, C0.y - 1);
    expect(auxParameterAlongBC(next)).toBeGreaterThan(1);
  });

  it('no invierte paux durante un arrastre fino de muchos fotogramas pequeños hasta debajo de AB', () => {
    const model = rayExtensionModel();
    // Camino continuo y gradual: 60 fotogramas, igual que un arrastre lento con el
    // ratón, llevando C desde su posición inicial (por encima de AB) hasta un punto
    // muy por debajo de la recta AB. El giro por fotograma es pequeño, así que el
    // truco de proyección se mantiene estable (con o sin la corrección aplicada).
    const steps = 60;
    const targetY = -8;
    let current = model;
    let minParameter = Infinity;
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const y = C0.y + t * (targetY - C0.y);
      current = dragFrame(current, C0.x, y);
      minParameter = Math.min(minParameter, auxParameterAlongBC(current));
    }

    expect(minParameter).toBeGreaterThan(1);
  });

  it('[ROOT CAUSE confirmado] un salto grande de C en un único fotograma ya NO invierte paux al otro lado de B', () => {
    const model = rayExtensionModel();
    // Un único fotograma que mueve C directamente desde su posición inicial hasta
    // muy por debajo de AB: reproduce un arrastre rápido, un "salto grande" de
    // teclado, o soltar y volver a agarrar el punto lejos. Antes de la corrección,
    // esto invertía `paux` al lado opuesto de B (amount pasaba de ~14.5 a ~-6.85,
    // ver commit); la corrección subdivide internamente giros grandes en pasos
    // pequeños para reproducir el comportamiento estable de un arrastre fino.
    const next = dragFrame(model, C0.x, -8);
    const parameter = auxParameterAlongBC(next);

    expect(parameter).toBeGreaterThan(1);
  });

  it('[ROOT CAUSE confirmado] el rayo C→paux sigue apuntando más allá de C (no hacia B) tras un salto grande', () => {
    const next = dragFrame(rayExtensionModel(), C0.x, -8);

    const b = resolvePointCoordinates(next, 'pB')!;
    const c = resolvePointCoordinates(next, 'pC')!;
    const aux = resolvePointCoordinates(next, 'paux')!;
    const bcDirection = { x: c.x - b.x, y: c.y - b.y };
    const rayDirection = { x: aux.x - c.x, y: aux.y - c.y };
    const alignment = bcDirection.x * rayDirection.x + bcDirection.y * rayDirection.y;

    expect(alignment).toBeGreaterThan(0);
  });

  it('no invierte paux cuando C se acerca a B por la recta BC (degeneración de dirección)', () => {
    const model = rayExtensionModel();
    const b = resolvePointCoordinates(model, 'pB')!;
    let current = model;
    let minParameter = Infinity;
    const steps = 40;
    for (let i = 1; i <= steps; i += 1) {
      const t = i / (steps + 1);
      const x = C0.x + t * (b.x - C0.x);
      const y = C0.y + t * (b.y - C0.y);
      current = dragFrame(current, x, y);
      minParameter = Math.min(minParameter, auxParameterAlongBC(current));
    }
    expect(minParameter).toBeGreaterThan(1);
  });

  it('preserva paux cuando C coincide con B (portador degenerado)', () => {
    const model = rayExtensionModel();
    const b = resolvePointCoordinates(model, 'pB')!;
    const auxBefore = resolvePointCoordinates(model, 'paux')!;
    const atB = dragFrame(model, b.x, b.y);
    const auxAfter = resolvePointCoordinates(atB, 'paux')!;
    expect(auxAfter.x).toBeCloseTo(auxBefore.x, 6);
    expect(auxAfter.y).toBeCloseTo(auxBefore.y, 6);
  });

  it('no invierte paux cuando C orbita cerca de B (dirección B→C casi degenerada)', () => {
    const model = rayExtensionModel();
    const b = resolvePointCoordinates(model, 'pB')!;
    let current = model;
    const badFrames: Array<{ step: number; parameter: number }> = [];
    for (let i = 1; i <= 80; i += 1) {
      const angle = i * 0.35;
      const radius = 0.08 + (i % 12) * 0.04;
      const x = b.x + radius * Math.cos(angle);
      const y = b.y + radius * Math.sin(angle);
      current = dragFrame(current, x, y);
      const parameter = auxParameterAlongBC(current);
      if (parameter <= 1) badFrames.push({ step: i, parameter });
    }
    expect(badFrames).toEqual([]);
  });
});
