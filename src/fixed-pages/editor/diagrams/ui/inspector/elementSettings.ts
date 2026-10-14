import { omitKeys, withObjectDashed, withObjectLabelVisible, withObjectStylePatch, type DiagramObject, type DiagramTextRule, type DiagramVisualStyle } from '@/diagrams';

/**
 * Ajustes que editan los paneles del inspector, leídos y escritos en el campo
 * V3 que corresponde a cada familia (cota, anotación o marca).
 */
export type SettingKey = 'offset' | 'precision' | 'unit' | 'anchorParameter' | 'markCount' | 'tickDistance' | 'minorTickCount' | 'title';

export function setting(object: DiagramObject | undefined, key: SettingKey): number | string | undefined {
  if (!object) return undefined;
  if (object.objectType === 'path' && object.geometry.type === 'dimension') {
    if (key === 'offset' || key === 'precision' || key === 'unit') return object.geometry[key];
  }
  if (object.objectType === 'annotation') {
    if (key === 'precision' || key === 'unit' || key === 'title') return object.content[key];
    if (key === 'anchorParameter') return object.anchor.type === 'object' ? object.anchor.parameter : undefined;
  }
  if (object.objectType === 'mark') {
    if (key === 'markCount') return object.count;
    if (key === 'tickDistance') return object.spacing;
    if (key === 'minorTickCount') return object.subdivisions;
  }
  return undefined;
}

export function withSetting<T extends DiagramObject>(object: T, key: SettingKey, value: number | string): T {
  const current = object as DiagramObject;
  if (current.objectType === 'path' && current.geometry.type === 'dimension' && (key === 'offset' || key === 'precision' || key === 'unit')) {
    return { ...current, geometry: { ...current.geometry, [key]: value } } as T;
  }
  if (current.objectType === 'annotation') {
    if (key === 'precision' || key === 'unit' || key === 'title') return { ...current, content: { ...current.content, [key]: value } } as T;
    if (key === 'anchorParameter' && current.anchor.type === 'object') return { ...current, anchor: { ...current.anchor, parameter: Number(value) } } as T;
  }
  if (current.objectType === 'mark') {
    if (key === 'markCount') return { ...current, count: Number(value) } as T;
    if (key === 'tickDistance') return { ...current, spacing: Number(value) } as T;
    if (key === 'minorTickCount') return { ...current, subdivisions: Number(value) } as T;
  }
  return object;
}

/** Texto de anotaciones o cotas. */
export function elementText(object: DiagramObject): string | undefined {
  if (object.objectType === 'annotation') return object.content.text;
  if (object.objectType === 'path' && object.geometry.type === 'dimension') return object.geometry.text;
  return undefined;
}

export function withElementText<T extends DiagramObject>(object: T, text: string): T {
  const current = object as DiagramObject;
  if (current.objectType === 'annotation') return { ...current, content: { ...current.content, text } } as T;
  if (current.objectType === 'path' && current.geometry.type === 'dimension') {
    const geometry = omitKeys(current.geometry, 'text');
    return { ...current, geometry: text ? { ...geometry, text } : geometry } as T;
  }
  return object;
}

export function elementTextRules(object: DiagramObject): DiagramTextRule[] | undefined {
  return object.objectType === 'annotation' ? object.content.rules : undefined;
}

export function withElementTextRules<T extends DiagramObject>(object: T, rules: DiagramTextRule[] | undefined): T {
  const current = object as DiagramObject;
  if (current.objectType !== 'annotation') return object;
  const content = omitKeys(current.content, 'rules');
  return { ...current, content: rules?.length ? { ...content, rules } : content } as T;
}

/** Expresión de cálculo de una anotación. */
export function elementExpression(object: DiagramObject): string | undefined {
  return object.objectType === 'annotation' ? object.content.expression : undefined;
}

/*
 * Actualizaciones diferidas: el inspector entrega transformaciones que se
 * aplican sobre el objeto vigente. Los valores del evento se leen al crear la
 * transformación, nunca después.
 */
export function stylePatch(patch: Partial<DiagramVisualStyle>) {
  return <T extends DiagramObject>(current: T): T => withObjectStylePatch(current, patch);
}

export function settingPatch(key: SettingKey, value: number | string) {
  return <T extends DiagramObject>(current: T): T => withSetting(current, key, value);
}

export function dashedPatch(dashed: boolean) {
  return <T extends DiagramObject>(current: T): T => withObjectDashed(current, dashed);
}

export function labelVisiblePatch(visible: boolean | undefined) {
  return <T extends DiagramObject>(current: T): T => withObjectLabelVisible(current, visible);
}
