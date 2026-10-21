/**
 * Microinteracciones de tinta del grafo de conocimiento («nada aparece, se escribe»).
 * Funciones puras de tiempo y trazo; el lienzo las consulta en cada fotograma.
 */

/** Duraciones en ms. Las respuestas a hover, toque o búsqueda no pasan de 700 ms; la entrada, al cargar la página, ronda 2,5 s para que se aprecie. */
export const INK_TIMING = {
  veilIn: 260,
  veilOut: 200,
  trace: 320,
  mark: 450,
  stamp: 380,
  introLead: 380,
  introSpread: 1300,
  introLink: 560,
} as const;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Estampado: se pasa un poco de tamaño y vuelve, como un sello. */
export const easeStamp = (t: number) => {
  const c = 1.7;
  const u = t - 1;
  return 1 + (c + 1) * u ** 3 + c * u ** 2;
};

export const progress = (now: number, start: number, duration: number) =>
  duration <= 0 ? 1 : clamp01((now - start) / duration);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/** Valor animado entre dos estados, sin re-render de React. */
export interface Tween {
  from: number;
  to: number;
  start: number;
  duration: number;
}

export const tweenValue = (tween: Tween, now: number) =>
  tween.from + (tween.to - tween.from) * easeOut(progress(now, tween.start, tween.duration));

/**
 * Círculo de pluma alrededor de un punto: radio irregular, da algo más de una vuelta
 * y se cierra un poco hacia dentro, como quien rodea un lugar en un mapa.
 */
export function traceHandCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  t: number,
) {
  const start = -Math.PI * 0.6;
  const sweep = Math.PI * 2 * 1.1 * easeOut(t);
  const steps = Math.max(2, Math.ceil(64 * (sweep / (Math.PI * 2))));
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const a = start + (sweep * i) / steps;
    const turn = (a - start) / (Math.PI * 2);
    const r = radius * (1 + 0.05 * Math.sin(2 * a + 1) + 0.025 * Math.sin(5 * a) - 0.07 * turn);
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a) * 0.92;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** Segmento trazado desde `from` hacia `to` hasta la fracción `t`. */
export function traceSegment(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number,
) {
  if (t <= 0) return;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
  ctx.stroke();
}

/**
 * Retardo de entrada de cada nodo: el centro, después las ramas y luego el contenido
 * de dentro hacia fuera. El contenido se reparte por su puesto en el orden de distancia
 * al centro del encuadre, no por la distancia misma: así los nodos descolgados no
 * comprimen la entrada del resto en un instante.
 */
export function introDelays<T extends { id: string; x?: number; y?: number }>(
  nodes: T[],
  rankOf: (node: T) => number,
  center: { x: number; y: number },
): Map<string, number> {
  const delays = new Map<string, number>();
  const content: Array<{ id: string; distance: number }> = [];
  nodes.forEach((node) => {
    const rank = rankOf(node);
    if (rank < 3) delays.set(node.id, [0, 130, 260][rank]);
    else content.push({ id: node.id, distance: Math.hypot((node.x ?? 0) - center.x, (node.y ?? 0) - center.y) });
  });
  content.sort((a, b) => a.distance - b.distance);
  const last = Math.max(1, content.length - 1);
  content.forEach(({ id }, index) => delays.set(id, INK_TIMING.introLead + INK_TIMING.introSpread * (index / last)));
  return delays;
}

/** La entrada dibujada se ve en cada carga de la página, salvo con movimiento reducido. */
export function shouldPlayIntro(): boolean {
  return !prefersReducedMotion();
}
