
// ─── Paleta Arts & Crafts ───────────────────────────────────────────────────

export const DIAGRAM_THEME_TOKENS = [
  'lienzo',
  'carbon',
  'canela',
  'terracota',
  'mora',
  'ocre',
  'pavo',
  'granada',
  'musgo',
] as const;

export type DiagramThemeToken = (typeof DIAGRAM_THEME_TOKENS)[number];

/** Lee una variable CSS --theme-<token> del documento. Seguro en SSR. */
export function getDiagramColor(token: DiagramThemeToken): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${token}`)
    .trim();
}

/** Lee cualquier variable CSS por nombre completo (ej. '--theme-carbon'). */
export function getCSSVar(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── Actualización segura del board ─────────────────────────────────────────

interface BoardUpdateLike {
  inUpdate?: boolean;
  update: () => unknown;
}

/**
 * Llama a `board.update()` salvo que el board ya esté en mitad de una pasada
 * de actualización (`board.inUpdate`, la bandera real de JSXGraph). JSXGraph
 * ya protege internamente su `update()` frente a reentrancia (una llamada
 * anidada no vuelve a renderizar), pero comprobarlo antes evita además el
 * trabajo previo de quien llama — p. ej. recalcular un bounding box que
 * después se descartaría — y deja constancia explícita del porqué.
 */
export function safeBoardUpdate(board: BoardUpdateLike): void {
  if (board.inUpdate) return;
  board.update();
}

// ─── Reposicionamiento exacto (sin imán de JSXGraph) ────────────────────────

interface SnappablePointLike {
  visProp?: { [name: string]: unknown };
  setPosition: (method: number, coords: number[]) => unknown;
}

/**
 * JSXGraph reaplica `snapToGrid`/`attractToGrid`/`snapToPoints`/`attractors`
 * dentro de `setPosition` (alias de `setPositionDirectly`) en *cada* llamada,
 * sin distinguir si el origen es un arrastre real del usuario o una
 * reasignación programática. Cuando reposicionamos un punto para reflejar el
 * resultado YA RESUELTO de nuestro propio motor de restricciones (p. ej. el
 * recorte de `sameSide`, que desplaza el punto una distancia submilimétrica
 * respecto a la línea límite), ese imán vuelve a redondear la posición al
 * cuadro de rejilla más cercano y puede reintroducir la violación que la
 * restricción acababa de corregir. `setExactPointPosition` suspende
 * temporalmente esos imanes para que la coordenada calculada llegue intacta,
 * y los restaura inmediatamente después (afectan solo a este punto, no al
 * resto del board).
 */
export function setExactPointPosition(point: SnappablePointLike, method: number, coords: number[]): void {
  const visProp = point.visProp;
  if (!visProp) {
    point.setPosition(method, coords);
    return;
  }
  const previous = {
    snaptogrid: visProp.snaptogrid,
    attracttogrid: visProp.attracttogrid,
    snaptopoints: visProp.snaptopoints,
  };
  visProp.snaptogrid = false;
  visProp.attracttogrid = false;
  visProp.snaptopoints = false;
  try {
    point.setPosition(method, coords);
  } finally {
    visProp.snaptogrid = previous.snaptogrid;
    visProp.attracttogrid = previous.attracttogrid;
    visProp.snaptopoints = previous.snaptopoints;
  }
}

// ─── Highlight helpers ───────────────────────────────────────────────────────

export type DiagramTargetState = string | readonly string[] | null | undefined;
export type DiagramTargetMatcher = (targetId: string) => boolean;

/** Comprueba si un target está activo dado el valor del highlight del MathStore. */
export function isDiagramTargetActive(
  value: unknown,
  targetId: string,
): boolean {
  if (typeof value === 'string') return value === targetId;
  if (!Array.isArray(value)) return false;
  return (value as readonly unknown[]).includes(targetId);
}

// ─── JXG Type Aliases ────────────────────────────────────────────────────────

import type JXG from 'jsxgraph';
export type DiagramBoard = JXG.Board;
export type DiagramElement = JXG.GeometryElement;
export type DiagramElementRegistry = Record<string, unknown>;

export interface PointLike {
  X(): number;
  Y(): number;
  Dist?(other: PointLike): number;
}

export type JXGCoord = number | (() => number);
export type PointSupport = JXG.Point | PointLike | string | [JXGCoord, JXGCoord];

export type Evaluatable<T> = T | (() => T);

export interface GeometryOptions {
  strokeColor?: Evaluatable<string>;
  strokeWidth?: Evaluatable<number>;
  strokeOpacity?: Evaluatable<number>;
  fillColor?: Evaluatable<string>;
  fillOpacity?: Evaluatable<number>;
  dash?: Evaluatable<number>;
  fixed?: boolean;
  visible?: Evaluatable<boolean>;
  highlight?: boolean;
  straightFirst?: boolean;
  straightLast?: boolean;
  showInfobox?: boolean;
  label?: Record<string, unknown>;
  borders?: GeometryOptions;
  vertices?: Record<string, unknown>;
  baseline?: GeometryOptions;
  highline?: GeometryOptions;
  [key: string]: unknown;
}

export interface JXGPolygon extends JXG.Polygon {
  borders: JXG.Segment[];
  vertices: JXG.Point[];
  [key: string]: unknown;
}

export interface JXGSlider extends JXG.GeometryElement {
  Value(): number;
  [key: string]: unknown;
}

