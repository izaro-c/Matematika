import type { DiagramLayer } from './model/schema/types';

export const DEFAULT_ANGLE_RADIUS = 0.55;
export const DEFAULT_RIGHT_ANGLE_RADIUS = 0.45;

/** Viewport por defecto al migrar specs legacy. */
export const DEFAULT_VIEWPORT_MIN_ZOOM = 0.2;
export const DEFAULT_VIEWPORT_MAX_ZOOM = 12;
export const DEFAULT_VIEWPORT_PADDING = 0.16;

export const DEFAULT_LAYER_ID = 'geometry';
export const DEFAULT_CURVE_SAMPLES = 64;

export const DEFAULT_DIAGRAM_LAYERS: DiagramLayer[] = [
  { id: 'background', label: 'Fondo', order: 0, visible: true, locked: false },
  { id: 'geometry', label: 'Geometría', order: 10, visible: true, locked: false },
  { id: 'annotations', label: 'Anotaciones & Texto', order: 20, visible: true, locked: false },
  { id: 'controls', label: 'Controles & Deslizadores', order: 30, visible: true, locked: false },
];

