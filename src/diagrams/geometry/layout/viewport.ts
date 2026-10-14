import type { DiagramBounds } from '@/diagrams/model/schema/types';
import type { DiagramSpec } from '@/diagrams/model/schema/v3';
import { isControlObject, isPositionedPoint, pointPosition } from '@/diagrams/model/objects/queries';
import {
  boundsContain,
  createScenePlan,
  padBounds,
  resolveDiagramScene,
  resolvedSceneContentBounds,
  sceneReferences,
  type PlannedSceneItem,
} from '@/diagrams/geometry/layout/scene';

type ViewportSpec = DiagramSpec;

function resolvedViewportScene(spec: ViewportSpec): DiagramSpec {
  return resolveDiagramScene(spec);
}

export interface ViewportChangeOptions {
  /** Persiste los límites en el modelo (viewport.bounds). */
  persist?: boolean;
  /** Actualiza también viewport.home. */
  persistHome?: boolean;
}

/** Valida y normaliza un bounding box JSXGraph [left, top, right, bottom]. */
export function normalizeViewportBounds(bounds: readonly number[]): DiagramBounds | null {
  if (bounds.length !== 4) return null;
  const [left, top, right, bottom] = bounds;
  if (![left, top, right, bottom].every(Number.isFinite)) return null;
  if (right <= left || top <= bottom) return null;
  return [left, top, right, bottom];
}

export function resolveHomeViewport(spec: ViewportSpec): DiagramBounds {
  const resolved = resolvedViewportScene(spec);
  return normalizeViewportBounds(resolved.viewport.home) ?? normalizeViewportBounds(resolved.viewport.bounds) ?? [-5, 5, 5, -5];
}

/** Autoridad de la vista configurada al cargar o tras editar límites manualmente. */
export function resolveInitialCamera(spec: ViewportSpec): DiagramBounds {
  const resolved = resolvedViewportScene(spec);
  return normalizeViewportBounds(resolved.viewport.bounds) ?? resolveHomeViewport(resolved);
}

export function unionBounds(boundsList: readonly DiagramBounds[]): DiagramBounds | null {
  if (boundsList.length === 0) return null;
  let minX = Infinity;
  let maxY = -Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  for (const [left, top, right, bottom] of boundsList) {
    minX = Math.min(minX, left);
    maxY = Math.max(maxY, top);
    maxX = Math.max(maxX, right);
    minY = Math.min(minY, bottom);
  }
  if (![minX, maxY, maxX, minY].every(Number.isFinite)) return null;
  return [minX, maxY, maxX, minY];
}

export function applyBoundsPadding(bounds: DiagramBounds, padding: number): DiagramBounds {
  return padBounds(bounds, padding);
}

/** Aplica valores temporales de sliders definidos en un paso. */
export function specWithStepSliderValues(input: ViewportSpec, stepId: string): DiagramSpec {
  return withStepControlValues(resolvedViewportScene(input), stepId);
}

/** Valores temporales de controles sobre una escena ya resuelta (no vuelve a resolverla). */
function withStepControlValues(spec: DiagramSpec, stepId: string): DiagramSpec {
  const step = spec.steps.find(item => item.id === stepId);
  if (!step?.objectStates) return spec;
  const hasSliderOverride = spec.objects.some(object => isControlObject(object) && step.objectStates?.[object.id]?.value !== undefined);
  if (!hasSliderOverride) return spec;
  return {
    ...spec,
    objects: spec.objects.map(object => {
      if (!isControlObject(object)) return object;
      const value = step.objectStates?.[object.id]?.value;
      return value !== undefined ? { ...object, value } : object;
    }),
  };
}

export function isEffectivelyVisible(entry: PlannedSceneItem): boolean {
  return entry.visible;
}

export function computeElementBoundsAtStep(spec: ViewportSpec, itemId: string, stepId?: string): DiagramBounds | null {
  return elementBoundsAtStep(resolvedViewportScene(spec), itemId, stepId);
}

function elementBoundsAtStep(resolved: DiagramSpec, itemId: string, stepId?: string): DiagramBounds | null {
  if (!stepId) return resolvedSceneContentBounds(resolved, [itemId]);

  const plan = createScenePlan(resolved, { activeStepId: stepId });
  const targetEntry = plan.find(entry => entry.item.id === itemId);
  if (!targetEntry || !targetEntry.visible) return null;

  const plannedPosition = (entry: PlannedSceneItem | undefined): { x: number; y: number } | null => {
    if (!entry) return null;
    if (isPositionedPoint(entry.item)) return pointPosition(entry.item) ?? null;
    if (isControlObject(entry.item)) return { x: entry.item.position[0], y: entry.item.position[1] };
    return null;
  };
  const visiblePointIds = new Set(
    plan.filter(entry => entry.visible && plannedPosition(entry)).map(entry => entry.item.id)
  );

  const target = targetEntry.item;
  if (isPositionedPoint(target)) {
    const coords = pointPosition(target)!;
    return [coords.x, coords.y, coords.x, coords.y];
  }

  if (!isControlObject(target)) {
    const refs = sceneReferences(resolved, target)
      .filter(ref => visiblePointIds.has(ref))
      .map(ref => plannedPosition(plan.find(p => p.item.id === ref)))
      .filter((point): point is { x: number; y: number } => Boolean(point));

    if (target.objectType === 'path' && (target.geometry.type === 'function' || target.geometry.type === 'parametric')) {
      return resolvedSceneContentBounds(resolved, [itemId]);
    }
    if (target.objectType === 'path' && target.geometry.type === 'circle' && refs.length >= 2) {
      const [center, edge] = refs;
      const radius = Math.hypot(edge.x - center.x, edge.y - center.y);
      return [center.x - radius, center.y + radius, center.x + radius, center.y - radius];
    }
    const xs = refs.map(p => p.x);
    const ys = refs.map(p => p.y);
    if (xs.length === 0) return null;
    return [Math.min(...xs), Math.max(...ys), Math.max(...xs), Math.min(...ys)];
  }

  return resolvedSceneContentBounds(resolved, [itemId]);
}

/**
 * Calcula el encuadre automático considerando todos los pasos:
 * un elemento entra si es visible efectivamente en al menos un paso.
 */
export function computeAutoFitBounds(
  input: ViewportSpec,
  padding?: number,
): DiagramBounds | null {
  const spec = resolvedViewportScene(input);
  const pad = padding ?? spec.viewport.padding;
  const collected: DiagramBounds[] = [];

  if (spec.steps.length === 0) {
    const plan = createScenePlan(spec);
    for (const entry of plan) {
      if (!isEffectivelyVisible(entry)) continue;
      const bounds = elementBoundsAtStep(spec, entry.item.id);
      if (bounds) collected.push(bounds);
    }
  } else {
    for (const step of spec.steps) {
      const stepSpec = withStepControlValues(spec, step.id);
      const plan = createScenePlan(stepSpec, { activeStepId: step.id });
      for (const entry of plan) {
        if (!isEffectivelyVisible(entry)) continue;
        const bounds = elementBoundsAtStep(stepSpec, entry.item.id, step.id);
        if (bounds) collected.push(bounds);
      }
    }
  }

  const united = unionBounds(collected);
  return united ? applyBoundsPadding(united, pad) : null;
}

/** Elementos visibles en el paso actual que quedan fuera del viewport dado. */
export function offscreenVisibleItemIds(
  input: ViewportSpec,
  bounds: DiagramBounds,
  stepId?: string,
): string[] {
  const spec = resolvedViewportScene(input);
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  return plan
    .filter(entry => isEffectivelyVisible(entry))
    .filter(entry => {
      const itemBounds = elementBoundsAtStep(spec, entry.item.id);
      return itemBounds ? !boundsContain(bounds, itemBounds) : false;
    })
    .map(entry => entry.item.id);
}

/** Encuadre de elementos visibles en el paso activo (acción Recuperar). */
export function fitVisibleItemsAtStep(
  input: ViewportSpec,
  stepId?: string,
  padding?: number,
): DiagramBounds | null {
  const spec = resolvedViewportScene(input);
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  const collected = plan
    .filter(entry => isEffectivelyVisible(entry))
    .flatMap(entry => {
      const bounds = elementBoundsAtStep(spec, entry.item.id);
      return bounds ? [bounds] : [];
    });
  const united = unionBounds(collected);
  return united ? applyBoundsPadding(united, padding ?? spec.viewport.padding) : null;
}
