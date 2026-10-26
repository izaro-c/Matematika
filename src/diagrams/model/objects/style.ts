import { omitKeys } from './transform';
import type { DiagramVisualStyle } from '@/diagrams/model/schema/types';
import type { DiagramObject } from '@/diagrams/model/schema/v3';

function compact(style: DiagramVisualStyle): DiagramVisualStyle | undefined {
  (Object.keys(style) as Array<keyof DiagramVisualStyle>).forEach(key => {
    if (style[key] === undefined) delete style[key];
  });
  return Object.keys(style).length > 0 ? style : undefined;
}

/**
 * Estilo visual resuelto de un objeto: normaliza la apariencia propia de cada
 * familia V3 al vocabulario común que usan el renderer y los pasos
 * (`DiagramStepVisualStyle` se fusiona sobre este resultado).
 */
export function objectStyle(object: DiagramObject): DiagramVisualStyle | undefined {
  if (object.objectType === 'control') return undefined;
  const appearance = object.appearance ?? {};
  const style: DiagramVisualStyle = {};
  if ('strokeWidth' in appearance) style.strokeWidth = appearance.strokeWidth;
  if ('strokeOpacity' in appearance) style.strokeOpacity = appearance.strokeOpacity;
  if ('opacity' in appearance) style.strokeOpacity = appearance.opacity;
  if ('labelOffset' in appearance) style.labelOffset = appearance.labelOffset;
  if ('labelPosition' in appearance) style.labelPosition = appearance.labelPosition;
  if ('fontSize' in appearance) style.labelSize = appearance.fontSize;
  if ('labelSize' in appearance) style.labelSize = appearance.labelSize;
  if ('highlightSize' in appearance) style.highlightPointSize = appearance.highlightSize;
  if ('preserveColorOnHighlight' in appearance) style.preserveColorOnHighlight = appearance.preserveColorOnHighlight;
  switch (object.objectType) {
    case 'point':
      style.pointSize = object.appearance?.size;
      style.highlightVisible = object.appearance?.highlightVisible;
      break;
    case 'path':
      style.fillOpacity = object.appearance?.fillOpacity;
      style.highlightStrokeWidth = object.appearance?.highlightStrokeWidth;
      style.highlightFillOpacity = object.appearance?.highlightFillOpacity;
      style.highlightVisible = object.appearance?.highlightVisible;
      if (object.appearance?.textOffset) style.textOffset = object.appearance.textOffset;
      break;
    case 'angle':
      style.fillOpacity = object.appearance?.fillOpacity;
      style.angleRadius = object.appearance?.radius;
      style.highlightStrokeWidth = object.appearance?.highlightStrokeWidth;
      style.highlightFillOpacity = object.appearance?.highlightFillOpacity;
      style.highlightVisible = object.appearance?.highlightVisible;
      break;
    case 'region':
      style.fillOpacity = object.appearance?.fillOpacity;
      style.highlightFillOpacity = object.appearance?.highlightFillOpacity;
      break;
    case 'area':
      style.fillOpacity = object.appearance?.fillOpacity;
      style.highlightFillOpacity = object.appearance?.highlightFillOpacity;
      style.highlightVisible = object.appearance?.highlightVisible;
      break;
    case 'mark':
      style.markHeight = object.height;
      break;
    case 'annotation':
      if (object.anchor.type === 'object' && object.anchor.offset) style.textOffset = object.anchor.offset;
      break;
  }
  return compact(style);
}

function compactRecord<T extends object>(record: T): T | undefined {
  const entries = Object.entries(record).filter(([, value]) => value !== undefined);
  return entries.length > 0 ? Object.fromEntries(entries) as T : undefined;
}

/**
 * Inversa de `objectStyle`: escribe un estilo visual completo en los campos de
 * apariencia de la familia V3 del objeto. Las claves que la familia no admite
 * se descartan; la visibilidad de la etiqueta y el trazo discontinuo se conservan.
 */
export function withObjectStyle<T extends DiagramObject>(object: T, style: DiagramVisualStyle | undefined): T {
  const value = style ?? {};
  switch (object.objectType) {
    case 'point': {
      const appearance = compactRecord({
        labelVisible: object.appearance?.labelVisible,
        size: value.pointSize,
        labelOffset: value.labelOffset,
        labelPosition: value.labelPosition,
        labelSize: value.labelSize,
        opacity: value.strokeOpacity,
        highlightSize: value.highlightPointSize,
        highlightVisible: value.highlightVisible,
        preserveColorOnHighlight: value.preserveColorOnHighlight,
      });
      const rest = omitKeys(object, 'appearance');
      return (appearance ? { ...rest, appearance } : rest) as T;
    }
    case 'path': {
      const appearance = compactRecord({
        dashed: object.appearance?.dashed,
        labelVisible: object.appearance?.labelVisible,
        strokeWidth: value.strokeWidth,
        strokeOpacity: value.strokeOpacity,
        fillOpacity: value.fillOpacity,
        labelOffset: value.labelOffset,
        textOffset: value.textOffset,
        labelPosition: value.labelPosition,
        labelSize: value.labelSize,
        highlightStrokeWidth: value.highlightStrokeWidth,
        highlightFillOpacity: value.highlightFillOpacity,
        highlightVisible: value.highlightVisible,
        preserveColorOnHighlight: value.preserveColorOnHighlight,
      });
      const rest = omitKeys(object, 'appearance');
      return (appearance ? { ...rest, appearance } : rest) as T;
    }
    case 'angle': {
      const appearance = compactRecord({
        radius: value.angleRadius,
        strokeWidth: value.strokeWidth,
        strokeOpacity: value.strokeOpacity,
        fillOpacity: value.fillOpacity,
        labelVisible: object.appearance?.labelVisible,
        labelOffset: value.labelOffset,
        labelPosition: value.labelPosition,
        labelSize: value.labelSize,
        highlightStrokeWidth: value.highlightStrokeWidth,
        highlightFillOpacity: value.highlightFillOpacity,
        highlightVisible: value.highlightVisible,
        preserveColorOnHighlight: value.preserveColorOnHighlight,
      });
      const rest = omitKeys(object, 'appearance');
      return (appearance ? { ...rest, appearance } : rest) as T;
    }
    case 'region':
    case 'area': {
      const appearance = compactRecord({
        strokeWidth: value.strokeWidth,
        strokeOpacity: value.strokeOpacity,
        fillOpacity: value.fillOpacity,
        highlightFillOpacity: value.highlightFillOpacity,
        highlightVisible: object.objectType === 'area' ? value.highlightVisible : undefined,
        preserveColorOnHighlight: value.preserveColorOnHighlight,
      });
      const rest = omitKeys(object, 'appearance');
      return (appearance ? { ...rest, appearance } : rest) as T;
    }
    case 'mark': {
      const appearance = compactRecord({
        strokeWidth: value.strokeWidth,
        strokeOpacity: value.strokeOpacity,
        preserveColorOnHighlight: value.preserveColorOnHighlight,
      });
      const rest = omitKeys(object, 'appearance', 'height');
      return {
        ...rest,
        ...(value.markHeight !== undefined ? { height: value.markHeight } : {}),
        ...(appearance ? { appearance } : {}),
      } as T;
    }
    case 'annotation': {
      const appearance = compactRecord({
        fontSize: value.labelSize,
        opacity: value.strokeOpacity,
        preserveColorOnHighlight: value.preserveColorOnHighlight,
        labelVisible: object.appearance?.labelVisible,
      });
      const rest = omitKeys(object, 'appearance');
      let anchor = object.anchor;
      if (anchor.type === 'object') {
        const anchorRest = omitKeys(anchor, 'offset');
        anchor = value.textOffset ? { ...anchorRest, offset: value.textOffset } : anchorRest;
      }
      return { ...rest, anchor, ...(appearance ? { appearance } : {}) } as T;
    }
    case 'control':
      return object;
  }
}

/** Fusiona un ajuste parcial sobre el estilo resuelto actual del objeto. */
export function withObjectStylePatch<T extends DiagramObject>(object: T, patch: Partial<DiagramVisualStyle>): T {
  const merged = { ...objectStyle(object), ...patch };
  (Object.keys(merged) as Array<keyof DiagramVisualStyle>).forEach(key => {
    if (merged[key] === undefined) delete merged[key];
  });
  return withObjectStyle(object, merged);
}

/** Muestra u oculta la etiqueta nativa; `undefined` vuelve al comportamiento por defecto. */
export function withObjectLabelVisible<T extends DiagramObject>(object: T, visible: boolean | undefined): T {
  if (object.objectType === 'control' || object.objectType === 'region' || object.objectType === 'area' || object.objectType === 'mark') return object;
  const current = (object.appearance ?? {}) as Record<string, unknown>;
  const rest = omitKeys(current, 'labelVisible');
  const appearance = visible === undefined ? rest : { ...rest, labelVisible: visible };
  const base = omitKeys(object as DiagramObject & { appearance?: unknown }, 'appearance');
  return (Object.keys(appearance).length > 0 ? { ...base, appearance } : base) as T;
}

/** Trazo discontinuo de un camino; otras familias no lo admiten. */
export function withObjectDashed<T extends DiagramObject>(object: T, dashed: boolean | undefined): T {
  if (object.objectType !== 'path') return object;
  const rest = omitKeys(object.appearance ?? {}, 'dashed');
  const appearance = dashed === undefined ? rest : { ...rest, dashed };
  const base = omitKeys(object, 'appearance');
  return (Object.keys(appearance).length > 0 ? { ...base, appearance } : base) as T;
}
