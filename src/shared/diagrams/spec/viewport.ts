import type { DiagramBounds, DiagramSpecV2 } from './types';
import {
  boundsContain,
  contentBounds,
  createScenePlan,
  padBounds,
  type PlannedSceneItem,
} from './scene';

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

export function resolveHomeViewport(spec: DiagramSpecV2): DiagramBounds {
  return normalizeViewportBounds(spec.viewport.home) ?? normalizeViewportBounds(spec.viewport.bounds) ?? [-5, 5, 5, -5];
}

/** Autoridad de la vista configurada al cargar o tras editar límites manualmente. */
export function resolveInitialCamera(spec: DiagramSpecV2): DiagramBounds {
  return normalizeViewportBounds(spec.viewport.bounds) ?? resolveHomeViewport(spec);
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
export function specWithStepSliderValues(spec: DiagramSpecV2, stepId: string): DiagramSpecV2 {
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

export function isEffectivelyVisibleAtStep(spec: DiagramSpecV2, itemId: string, stepId?: string): boolean {
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  return plan.find(entry => entry.item.id === itemId)?.visible ?? false;
}

export function isEffectivelyVisibleInAnyStep(spec: DiagramSpecV2, itemId: string): boolean {
  if (spec.steps.length === 0) return isEffectivelyVisibleAtStep(spec, itemId);
  return spec.steps.some(step => isEffectivelyVisibleAtStep(spec, itemId, step.id));
}

export function computeElementBoundsAtStep(spec: DiagramSpecV2, itemId: string): DiagramBounds | null {
  return contentBounds(spec, [itemId]);
}

/**
 * Calcula el encuadre automático considerando todos los pasos:
 * un elemento entra si es visible efectivamente en al menos un paso.
 */
export function computeAutoFitBounds(
  spec: DiagramSpecV2,
  padding = spec.viewport.padding,
): DiagramBounds | null {
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
        const bounds = computeElementBoundsAtStep(stepSpec, entry.item.id);
        if (bounds) collected.push(bounds);
      }
    }
  }

  const united = unionBounds(collected);
  return united ? applyBoundsPadding(united, padding) : null;
}

/** Elementos visibles en el paso actual que quedan fuera del viewport dado. */
export function offscreenVisibleItemIds(
  spec: DiagramSpecV2,
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
  spec: DiagramSpecV2,
  stepId?: string,
  padding = spec.viewport.padding,
): DiagramBounds | null {
  const plan = createScenePlan(spec, stepId ? { activeStepId: stepId } : {});
  const collected = plan
    .filter(entry => isEffectivelyVisible(entry))
    .flatMap(entry => {
      const bounds = computeElementBoundsAtStep(spec, entry.item.id);
      return bounds ? [bounds] : [];
    });
  const united = unionBounds(collected);
  return united ? applyBoundsPadding(united, padding) : null;
}
