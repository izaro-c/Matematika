import {
  DIAGRAM_RENDERER_V2_ID,
  DIAGRAM_SPEC_V2_VERSION,
  migrateDiagramSpec,
  migrateDiagramSpecV2ToV3,
  type DiagramSpec,
  type DiagramSpecV2,
  type DiagramSpecV3,
} from '@/diagrams';
import { toWorkingSceneV2 } from '@/diagrams/model/schema/v3Compatibility';
import type { VisualDiagramModel } from '../types';

function sceneFieldsToV2(model: VisualDiagramModel | (DiagramSpecV3 & Partial<DiagramSpecV2>)): DiagramSpecV2 {
  return {
    version: DIAGRAM_SPEC_V2_VERSION,
    renderer: DIAGRAM_RENDERER_V2_ID,
    title: model.title,
    componentId: model.componentId,
    category: model.category,
    mode: model.mode,
    axis: model.axis,
    grid: model.grid,
    showLabels: model.showLabels,
    showHeader: model.showHeader,
    header: model.header,
    viewport: model.viewport,
    layers: model.layers,
    groups: model.groups,
    points: [...(model.points ?? [])],
    elements: [...(model.elements ?? [])],
    sliders: [...(model.sliders ?? [])],
    steps: model.steps,
    constraints: model.constraints,
    dependencies: model.dependencies,
    note: model.note,
    extensions: { ...(model.extensions ?? {}) },
    ...(model.translations ? { translations: structuredClone(model.translations) } : {}),
  };
}

function mergeEnumerableScene(inputSpec: DiagramSpecV3, projected: DiagramSpecV2): DiagramSpecV2 {
  type SceneOverrides = Partial<Pick<DiagramSpecV2, 'points' | 'elements' | 'sliders' | 'constraints' | 'dependencies'>>;
  const compatibility = inputSpec as DiagramSpecV3 & SceneOverrides;
  if (!Object.prototype.propertyIsEnumerable.call(inputSpec, 'points')) return projected;
  return {
    ...projected,
    points: Array.isArray(compatibility.points) ? [...compatibility.points] : projected.points,
    elements: Array.isArray(compatibility.elements) ? [...compatibility.elements] : projected.elements,
    sliders: Array.isArray(compatibility.sliders) ? [...compatibility.sliders] : projected.sliders,
    ...(Object.prototype.propertyIsEnumerable.call(inputSpec, 'constraints')
      ? { constraints: compatibility.constraints }
      : {}),
    ...(Object.prototype.propertyIsEnumerable.call(inputSpec, 'dependencies')
      ? { dependencies: compatibility.dependencies }
      : {}),
  };
}

/**
 * Escena de trabajo (proyección V2) para mutaciones del runtime shared.
 * Preferir `applySceneMutation` desde UI — no usar esta proyección fuera del model.
 */
export function workingScene(model: VisualDiagramModel | DiagramSpecV2 | DiagramSpec): DiagramSpecV2 {
  if (model.version === 2) return model;
  if (Object.prototype.propertyIsEnumerable.call(model, 'points')) {
    return sceneFieldsToV2(model as VisualDiagramModel);
  }
  return mergeEnumerableScene(model, toWorkingSceneV2(model));
}

/** Reifica una escena de trabajo como modelo de editor (V3 + escena enumerable). */
export function materializeEditorModel(scene: DiagramSpecV2): VisualDiagramModel {
  const v3: DiagramSpecV3 = migrateDiagramSpecV2ToV3(scene);
  return {
    ...v3,
    points: scene.points.map(point => ({ ...point })),
    elements: scene.elements.map(element => ({ ...element })),
    sliders: scene.sliders.map(slider => ({ ...slider })),
    constraints: scene.constraints?.map(constraint => ({ ...constraint })),
    dependencies: scene.dependencies?.map(dependency => ({ ...dependency })),
    extensions: { ...(scene.extensions ?? {}) },
  };
}

/** Normaliza JSON/desconocido a modelo de editor. */
export function toEditorModel(value: unknown): VisualDiagramModel | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  try {
    if (record.version === 3 && Array.isArray(record.objects) && Array.isArray(record.points)) {
      return value as VisualDiagramModel;
    }
    return materializeEditorModel(workingScene(migrateDiagramSpec(value).spec));
  } catch {
    return null;
  }
}

/** Aplica un patch estilo escena sobre el modelo canónico. */
export function patchEditorScene(
  model: VisualDiagramModel,
  patch: Partial<DiagramSpecV2> | ((scene: DiagramSpecV2) => DiagramSpecV2),
): VisualDiagramModel {
  const current = workingScene(model);
  const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
  return materializeEditorModel(next);
}

/**
 * Mutación V3-first: el caller opera sobre la escena de trabajo y recibe
 * VisualDiagramModel canónico. Un solo roundtrip en el model layer.
 */
export function applySceneMutation(
  model: VisualDiagramModel,
  mutate: (scene: DiagramSpecV2) => DiagramSpecV2 | DiagramSpec,
): VisualDiagramModel {
  return materializeEditorModel(workingScene(mutate(workingScene(model))));
}

/** Reify V3 puro (sin campos de escena) para proyección/capacidades. */
export function toCanonicalV3(model: VisualDiagramModel): DiagramSpecV3 {
  return migrateDiagramSpecV2ToV3(workingScene(model));
}

export type { DiagramSpec };
