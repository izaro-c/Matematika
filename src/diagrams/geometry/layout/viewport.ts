import type { DiagramBounds, DiagramSpecV2 } from '@/diagrams/model/schema/types';
import type { DiagramSpecV3 } from '@/diagrams/model/schema/v3';
import {
  boundsContain,
  contentBounds,
  createScenePlan,
  padBounds,
  prepareSceneSpec,
  type PlannedSceneItem,
} from '@/diagrams/geometry/layout/scene';

type ViewportSpec = DiagramSpecV2 | DiagramSpecV3;

function viewportV2(spec: ViewportSpec): DiagramSpecV2 {
  return spec.version === 3 ? prepareSceneSpec(spec) : spec;
}

export interface ViewportLimits {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
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

export function boundsFromLimits(limits: ViewportLimits): DiagramBounds | null {
  return normalizeViewportBounds([limits.minX, limits.maxY, limits.maxX, limits.minY]);
}

export function limitsFromBounds(bounds: DiagramBounds): ViewportLimits {
  const [left, top, right, bottom] = bounds;
  return { minX: left, maxX: right, minY: bottom, maxY: top };
}

export function resolveHomeViewport(spec: ViewportSpec): DiagramBounds {
  const v2 = viewportV2(spec);
  return normalizeViewportBounds(v2.viewport.home) ?? normalizeViewportBounds(v2.viewport.bounds) ?? [-5, 5, 5, -5];
}

/** Autoridad de la vista configurada al cargar o tras editar límites manualmente. */
export function resolveInitialCamera(spec: ViewportSpec): DiagramBounds {
  const v2 = viewportV2(spec);
  return normalizeViewportBounds(v2.viewport.bounds) ?? resolveHomeViewport(v2);
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
export function specWithStepSliderValues(input: ViewportSpec, stepId: string): DiagramSpecV2 {
  const spec = viewportV2(input);
  const step = spec.steps.find(item => item.id === stepId);
  if (!step?.objectStates) return spec;
  const hasSliderOverride = spec.sliders.some(slider => step.objectStates?.[slider.id]?.value !== undefined);
  if (!hasSliderOverride) return spec;
  return {
    ...spec,
    sliders: spec.sliders.map(slider => {
      const value = step.objectStates?.[slider.id]?.value;
      return value !== undefined ? { ...slider, value } : slider;
    }),
  };
}

export function isEffectivelyVisible(entry: PlannedSceneItem): boolean {
  return entry.visible;
}

export function isEffectivelyVisibleAtStep(spec: ViewportSpec, itemId: string, stepId?: string): boolean {
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  return plan.find(entry => entry.item.id === itemId)?.visible ?? false;
}

export function isEffectivelyVisibleInAnyStep(spec: ViewportSpec, itemId: string): boolean {
  const v2 = viewportV2(spec);
  if (v2.steps.length === 0) return isEffectivelyVisibleAtStep(v2, itemId);
  return v2.steps.some(step => isEffectivelyVisibleAtStep(v2, itemId, step.id));
}

export function computeElementBoundsAtStep(spec: ViewportSpec, itemId: string, stepId?: string): DiagramBounds | null {
  const v2 = viewportV2(spec);
  if (!stepId) return contentBounds(v2, [itemId]);

  const plan = createScenePlan(v2, { activeStepId: stepId });
  const targetEntry = plan.find(entry => entry.item.id === itemId);
  if (!targetEntry || !targetEntry.visible) return null;

  const visiblePointIds = new Set(
    plan.filter(entry => entry.visible && 'x' in entry.item).map(entry => entry.item.id)
  );

  if ('x' in targetEntry.item && 'constraint' in targetEntry.item) {
    const coords = targetEntry.item;
    return [coords.x, coords.y, coords.x, coords.y];
  }

  if ('kind' in targetEntry.item) {
    const element = targetEntry.item;
    const refs = element.refs
      .filter(ref => visiblePointIds.has(ref))
      .map(ref => {
        const pointItem = plan.find(p => p.item.id === ref)?.item;
        return pointItem && 'x' in pointItem ? { x: pointItem.x, y: pointItem.y } : null;
      })
      .filter((point): point is { x: number; y: number } => Boolean(point));

    if ((element.kind === 'functionCurve' || element.kind === 'parametricCurve') && element.properties?.domain) {
      return contentBounds(v2, [itemId]);
    }
    if (element.kind === 'circle' && refs.length >= 2) {
      const [center, edge] = refs;
      const radius = Math.hypot(edge.x - center.x, edge.y - center.y);
      return [center.x - radius, center.y + radius, center.x + radius, center.y - radius];
    }
    const xs = refs.map(p => p.x);
    const ys = refs.map(p => p.y);
    if (xs.length === 0) return null;
    return [Math.min(...xs), Math.max(...ys), Math.max(...xs), Math.min(...ys)];
  }

  return contentBounds(v2, [itemId]);
}

/**
 * Calcula el encuadre automático considerando todos los pasos:
 * un elemento entra si es visible efectivamente en al menos un paso.
 */
export function computeAutoFitBounds(
  input: ViewportSpec,
  padding?: number,
): DiagramBounds | null {
  const spec = viewportV2(input);
  const pad = padding ?? spec.viewport.padding;
  const collected: DiagramBounds[] = [];

  if (spec.steps.length === 0) {
    const plan = createScenePlan(spec);
    for (const entry of plan) {
      if (!isEffectivelyVisible(entry)) continue;
      const bounds = computeElementBoundsAtStep(spec, entry.item.id);
      if (bounds) collected.push(bounds);
    }
  } else {
    for (const step of spec.steps) {
      const stepSpec = specWithStepSliderValues(spec, step.id);
      const plan = createScenePlan(stepSpec, { activeStepId: step.id });
      for (const entry of plan) {
        if (!isEffectivelyVisible(entry)) continue;
        const bounds = computeElementBoundsAtStep(stepSpec, entry.item.id, step.id);
        if (bounds) collected.push(bounds);
      }
    }
  }

  const united = unionBounds(collected);
  return united ? applyBoundsPadding(united, pad) : null;
}

/** Elementos visibles en el paso actual que quedan fuera del viewport dado. */
export function offscreenVisibleItemIds(
  spec: ViewportSpec,
  bounds: DiagramBounds,
  stepId?: string,
): string[] {
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  return plan
    .filter(entry => isEffectivelyVisible(entry))
    .filter(entry => {
      const itemBounds = computeElementBoundsAtStep(spec, entry.item.id);
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
  const spec = viewportV2(input);
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  const collected = plan
    .filter(entry => isEffectivelyVisible(entry))
    .flatMap(entry => {
      const bounds = computeElementBoundsAtStep(spec, entry.item.id);
      return bounds ? [bounds] : [];
    });
  const united = unionBounds(collected);
  return united ? applyBoundsPadding(united, padding ?? spec.viewport.padding) : null;
}
