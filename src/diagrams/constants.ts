import type { DiagramLayer } from './model/schema/types';

export {
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  DEFAULT_VIEWPORT_MIN_ZOOM,
  DEFAULT_VIEWPORT_MAX_ZOOM,
  DEFAULT_VIEWPORT_PADDING,
  DEFAULT_LAYER_ID,
  DEFAULT_CURVE_SAMPLES,
} from './model/schema/types';

export const DEFAULT_DIAGRAM_LAYERS: DiagramLayer[] = [
  { id: 'background', label: 'Fondo', order: 0, visible: true, locked: false },
  { id: 'geometry', label: 'Geometría', order: 10, visible: true, locked: false },
  { id: 'annotations', label: 'Anotaciones & Texto', order: 20, visible: true, locked: false },
  { id: 'controls', label: 'Controles & Deslizadores', order: 30, visible: true, locked: false },
];

