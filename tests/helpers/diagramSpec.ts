import {
  isPositionedPoint,
  pointPosition,
  withPointPosition,
  type PositionedPoint,
  type DiagramObject,
  type DiagramRelation,
  type DiagramSpec,
  type PointObject,
} from '@/diagrams';
import type { CurvePath } from '@/diagrams/geometry';
import { buildRelation, element, type RelationExtras, type RelationIntent } from '@/fixed-pages/editor/diagrams/model';

/** Escena V3 mínima para pruebas: los campos no indicados toman valores neutros. */
export function sceneSpec(overrides: Partial<DiagramSpec> = {}): DiagramSpec {
  return {
    version: 3,
    renderer: 'matematika-diagram-renderer-v3',
    title: 'Escena de prueba',
    componentId: 'escena-prueba',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    objects: [],
    relations: [],
    steps: [],
    note: '',
    ...overrides,
  };
}

export function findById<T extends DiagramObject = DiagramObject>(spec: Pick<DiagramSpec, 'objects'>, id: string): T {
  const object = spec.objects.find(item => item.id === id);
  if (!object) throw new Error(`No existe el objeto ${id}`);
  return object as T;
}

/** Posición persistida de un punto con posición propia. */
export function positionOf(spec: Pick<DiagramSpec, 'objects'>, id: string): { x: number; y: number } {
  const object = findById(spec, id);
  if (!isPositionedPoint(object)) throw new Error(`${id} no es un punto con posición propia`);
  return pointPosition(object)!;
}

/** Asigna relaciones a un punto (movilidad `constrained`). */
export function constrained<T extends PointObject>(point: T, relationIds: string[]): T {
  return { ...point, mobility: { type: 'constrained', relationIds } };
}

export function relation<T extends DiagramRelation['type']>(
  value: Omit<Extract<DiagramRelation, { type: T }>, 'enabled' | 'label'> & { type: T; label?: string; enabled?: boolean },
): DiagramRelation {
  return { label: value.id, enabled: true, ...value } as unknown as DiagramRelation;
}

/** Curva V3 (función o paramétrica) construida con la herramienta y una geometría concreta. */
export function curvePath(
  id: string,
  label: string,
  kind: 'functionCurve' | 'parametricCurve',
  refs: string[],
  geometry: Record<string, unknown>,
): CurvePath {
  const base = element(id, label, kind, refs, 'pavo') as CurvePath;
  return { ...base, geometry: { ...base.geometry, ...geometry } as CurvePath['geometry'] };
}

/** Relación V3 construida desde una intención del editor y sus huecos ordenados. */
export function relationFor(
  intent: RelationIntent,
  id: string,
  label: string,
  refs: string[],
  objects: readonly DiagramObject[] = [],
  extras: RelationExtras = {},
): DiagramRelation {
  const built = buildRelation(intent, id, label, refs, objects, extras);
  if (!built) throw new Error(`${intent} no es una relación V3`);
  return built;
}

export function pointById(spec: Pick<DiagramSpec, 'objects'>, id: string): PositionedPoint {
  const object = findById(spec, id);
  if (!isPositionedPoint(object)) throw new Error(`${id} no es un punto con posición propia`);
  return object;
}

/** Devuelve la escena con el punto colocado en otra posición persistida. */
export function movedTo<T extends Pick<DiagramSpec, 'objects'>>(spec: T, id: string, x: number, y: number): T {
  return {
    ...spec,
    objects: spec.objects.map(object => object.id === id && object.objectType === 'point' ? withPointPosition(object, { x, y }) : object),
  };
}

/** Punto con posición propia junto con su posición persistida (`x`, `y`) para aserciones. */
export function pointAt(spec: Pick<DiagramSpec, 'objects'>, id: string): PositionedPoint & { x: number; y: number } {
  return { ...pointById(spec, id), ...positionOf(spec, id) };
}

/** Relación de prueba descrita como intención del editor y huecos ordenados. */
export interface TestRelation extends RelationExtras {
  id: string;
  label: string;
  kind: RelationIntent;
  refs: string[];
  enabled?: boolean;
}

export function diagramConstraint(id: string, label: string, kind: RelationIntent, refs: string[], extras: RelationExtras & { enabled?: boolean } = {}): TestRelation {
  return { id, label, kind, refs, ...extras };
}

type SceneParts = Omit<Partial<DiagramSpec>, 'objects' | 'relations' | 'version' | 'renderer'> & {
  version?: number;
  renderer?: string;
  points?: DiagramObject[];
  elements?: DiagramObject[];
  sliders?: DiagramObject[];
  objects?: DiagramObject[];
  constraints?: TestRelation[];
  relations?: DiagramRelation[];
};

/**
 * Escena V3 a partir de grupos de objetos (puntos, construcciones y controles)
 * y relaciones descritas como intenciones; los grupos se concatenan en `objects`.
 */
export function sceneFromParts({ points = [], elements = [], sliders = [], objects = [], constraints = [], relations = [], version: _version, renderer: _renderer, ...rest }: SceneParts): DiagramSpec {
  const allObjects = [...points, ...elements, ...sliders, ...objects];
  return sceneSpec({
    ...rest,
    objects: allObjects,
    relations: [
      ...relations,
      ...constraints.map(item => {
        const built = buildRelation(item.kind, item.id, item.label, item.refs, allObjects, item, item.enabled ?? true);
        if (!built) throw new Error(`${item.kind} no es una relación V3`);
        return built;
      }),
    ],
  });
}
