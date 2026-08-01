import {
  DIAGRAM_RENDERER_V2_ID,
  DIAGRAM_SPEC_V2_VERSION,
  migrateDiagramSpec,
  migrateDiagramSpecV2ToV3,
  type DiagramSpec,
  type DiagramSpecV2,
  type DiagramSpecV3,
} from '../../../../shared/diagrams/spec';
import { toWorkingSceneV2 } from '../../../../shared/diagrams/spec/v3Compatibility';
import type { VisualDiagramModel } from './types';

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
 * Copia de trabajo V2 para mutaciones / reify.
 * Si la escena ya está materializada (workbench), se usa tal cual — sin
 * project+resolve, que rompería roundtrip o fixtures incompletos.
 */
export function editorV2(model: VisualDiagramModel | DiagramSpecV2 | DiagramSpec): DiagramSpecV2 {
  if (model.version === 2) return model;
  if (Object.prototype.propertyIsEnumerable.call(model, 'points')) {
    return sceneFieldsToV2(model as VisualDiagramModel);
  }
  return mergeEnumerableScene(model, toWorkingSceneV2(model));
}

/** Reifica una escena V2 como modelo de editor (V3 + escena enumerable). */
export function fromEditorV2(v2: DiagramSpecV2): VisualDiagramModel {
  const v3: DiagramSpecV3 = migrateDiagramSpecV2ToV3(v2);
  return {
    ...v3,
    points: v2.points.map(point => ({ ...point })),
    elements: v2.elements.map(element => ({ ...element })),
    sliders: v2.sliders.map(slider => ({ ...slider })),
    constraints: v2.constraints?.map(constraint => ({ ...constraint })),
    dependencies: v2.dependencies?.map(dependency => ({ ...dependency })),
    extensions: { ...(v2.extensions ?? {}) },
  };
}

/** Normaliza JSON/desconocido a modelo de editor. */
export function toEditorModel(value: unknown): VisualDiagramModel | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  try {
    // Ya materializado por el workbench (V3 + escena enumerable).
    if (record.version === 3 && Array.isArray(record.objects) && Array.isArray(record.points)) {
      return value as VisualDiagramModel;
    }
    return fromEditorV2(editorV2(migrateDiagramSpec(value).spec));
  } catch {
    return null;
  }
}

/** Aplica un patch estilo V2 sobre el modelo canónico. */
export function patchEditorScene(
  model: VisualDiagramModel,
  patch: Partial<DiagramSpecV2> | ((v2: DiagramSpecV2) => DiagramSpecV2),
): VisualDiagramModel {
  const current = editorV2(model);
  const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
  return fromEditorV2(next);
}

/** Reify V3 puro (sin campos de escena) para proyección/capacidades. */
export function toCanonicalV3(model: VisualDiagramModel): DiagramSpecV3 {
  return migrateDiagramSpecV2ToV3(editorV2(model));
}

export type { DiagramSpec };
