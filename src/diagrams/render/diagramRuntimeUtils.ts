import { renderKatexTextToHtml } from '@/components/ui/KatexText';
import type {ControlObject, DiagramObject, DiagramSpec, DiagramTextRule, MarkObject} from '@/diagrams/model';
import {
  angleSweep,
  evaluateMathExpression,
  findObject,
  interpolateDiagramTemplate,
  isControlObject,
  isMeasurableAngle,
  isPositionedPoint,
  objectConstructionReferences,
  objectKind,
  resolveInfoPanelBlock,
} from '@/diagrams/model'
import {angleMeasureRadians, sceneReferences} from '@/diagrams/geometry';
import { hasCoordinates, type JxgElementAdapter, type JxgElementMap } from '@/diagrams/render/jsxgraphAdapter';

type RuntimeScene = Pick<DiagramSpec, 'objects'>;

/** Texto reactivo de anotaciones y cotas, con su cálculo opcional. */
export interface ReactiveTextSource {
  text?: string;
  expression?: string;
  unit?: string;
  precision?: number;
  rules?: DiagramTextRule[];
}

export function reactiveTextSource(item: DiagramObject): ReactiveTextSource {
  if (item.objectType === 'annotation') return item.content;
  if (item.objectType === 'path' && item.geometry.type === 'dimension') {
    return { text: item.geometry.text, unit: item.geometry.unit, precision: item.geometry.precision };
  }
  return {};
}

export function outsideSegmentExtension(baseA: JxgElementAdapter | undefined, baseB: JxgElementAdapter | undefined, foot: JxgElementAdapter | undefined): boolean {
  if (!hasCoordinates(baseA) || !hasCoordinates(baseB) || !hasCoordinates(foot)) return false;
  const dx = baseB.X() - baseA.X();
  const dy = baseB.Y() - baseA.Y();
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-10) return false;
  const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / lengthSquared;
  return t < -0.001 || t > 1.001;
}

export function intersectionBelongsToSupports(
  item: DiagramObject,
  intersection: JxgElementAdapter | undefined,
  elements: JxgElementMap,
  spec: RuntimeScene,
): boolean {
  if (item.objectType !== 'point' || item.definition.type !== 'intersection' || item.definition.restrictToSupports !== true) return true;
  if (!hasCoordinates(intersection) || !Number.isFinite(intersection.X()) || !Number.isFinite(intersection.Y())) return false;
  return item.definition.supports.every(supportId => {
    const supportSpec = findObject(spec, supportId);
    const supportKind = supportSpec ? objectKind(supportSpec) : undefined;
    if (!supportKind || !['segment', 'ray', 'angleBisector'].includes(supportKind)) return true;
    const support = elements[supportId];
    const start = support?.point1;
    const end = support?.point2;
    if (!hasCoordinates(start) || !hasCoordinates(end)) return false;
    const dx = end.X() - start.X();
    const dy = end.Y() - start.Y();
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared < 1e-10) return false;
    const t = ((intersection.X() - start.X()) * dx + (intersection.Y() - start.Y()) * dy) / lengthSquared;
    if (supportKind === 'segment') return t >= -0.001 && t <= 1.001;
    return t >= -0.001;
  });
}

export function refsFor<T extends object>(item: DiagramObject, elements: Record<string, T | undefined>): T[] {
  return objectConstructionReferences(item).map(ref => elements[ref]).filter((element): element is T => Boolean(element));
}

export function liveVariables(elements: JxgElementMap, spec: RuntimeScene): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.objects.forEach(point => {
    if (!isPositionedPoint(point)) return;
    const element = elements[point.id];
    if (!hasCoordinates(element)) return;
    variables[`${point.id}.x`] = element.X();
    variables[`${point.id}.y`] = element.Y();
  });
  spec.objects.forEach(control => {
    if (!isControlObject(control)) return;
    const element = elements[control.id];
    variables[control.id] = element?.Value?.() ?? control.value;
  });
  spec.objects.forEach(item => {
    if (isPositionedPoint(item) || isControlObject(item)) return;
    const element = elements[item.id];
    if (hasCoordinates(element)) {
      variables[`${item.id}.x`] = element.X();
      variables[`${item.id}.y`] = element.Y();
    }
    const refs = sceneReferences(spec, item);
    if (refs.length >= 2) {
      const a = elements[refs[0]];
      const b = elements[refs[1]];
      if (a?.Dist && b) variables[`${item.id}.length`] = a.Dist(b);
    }
    if (isMeasurableAngle(item)) {
      const first = elements[item.points[0]];
      const vertex = elements[item.points[1]];
      const second = elements[item.points[2]];
      const radians = hasCoordinates(first) && hasCoordinates(vertex) && hasCoordinates(second)
        ? angleMeasureRadians(
            angleSweep(item),
            { x: first.X(), y: first.Y() },
            { x: vertex.X(), y: vertex.Y() },
            { x: second.X(), y: second.Y() },
          )
        : undefined;
      if (radians !== undefined) {
        variables[`${item.id}.value`] = radians;
        variables[`${item.id}.radians`] = radians;
        variables[`${item.id}.degrees`] = radians * 180 / Math.PI;
      }
    }
  });
  return variables;
}

export function sliderMaximum(item: ControlObject, elements: JxgElementMap, spec: RuntimeScene): number {
  if (!item.range.maxExpression) return item.range.max;
  try {
    const evaluated = evaluateMathExpression(item.range.maxExpression, liveVariables(elements, spec));
    return evaluated > item.range.min ? evaluated : item.range.max;
  } catch {
    return item.range.max;
  }
}

export function conditionAllows(item: DiagramObject, elements: JxgElementMap, spec: RuntimeScene): boolean {
  if (!item.visibleWhen) return true;
  try {
    return evaluateMathExpression(item.visibleWhen, liveVariables(elements, spec)) !== 0;
  } catch {
    return true;
  }
}

export function tickDistance(item: MarkObject, elements: JxgElementMap, spec: RuntimeScene): number {
  if (!item.spacingExpression) return item.spacing ?? 1;
  try {
    const evaluated = evaluateMathExpression(item.spacingExpression, liveVariables(elements, spec));
    return evaluated > 0 ? evaluated : (item.spacing ?? 1);
  } catch {
    return item.spacing ?? 1;
  }
}

export function evaluatedValue(item: DiagramObject, elements: JxgElementMap, spec: RuntimeScene): number | undefined {
  const expression = reactiveTextSource(item).expression;
  try {
    if (expression) return evaluateMathExpression(expression, liveVariables(elements, spec));
    const refs = refsFor(item, elements);
    if (refs.length >= 2 && refs[0]?.Dist) return refs[0].Dist(refs[1]);
    return undefined;
  } catch {
    return undefined;
  }
}

function formatLegacyValue(value: number | undefined, precision: number, unit?: string): string {
  if (value === undefined) return 'valor no definido';
  const suffix = unit ? ` ${unit}` : '';
  return `${value.toFixed(precision)}${suffix}`;
}

function renderElementTemplate(
  item: DiagramObject,
  template: string,
  elements: JxgElementMap,
  spec: RuntimeScene,
): string {
  const source = reactiveTextSource(item);
  const variables = liveVariables(elements, spec);
  const fallbackValue = evaluatedValue(item, elements, spec);
  const precision = source.precision ?? 2;
  const unit = source.unit;
  const legacyValue = formatLegacyValue(fallbackValue, precision, unit);
  return interpolateDiagramTemplate(template, variables, {
    expression: source.expression,
    precision,
    unit,
    undefinedValue: legacyValue,
  }).split('{value}').join(legacyValue);
}

export function measurementText(item: DiagramObject, elements: JxgElementMap, spec: RuntimeScene): string {
  const text = reactiveTextSource(item).text || `${item.label}: {value}`;
  return renderElementTemplate(item, text, elements, spec);
}

export function reactiveText(item: DiagramObject, elements: JxgElementMap, spec: RuntimeScene): string | undefined {
  const variables = liveVariables(elements, spec);
  const rule = reactiveTextSource(item).rules?.find(candidate => {
    try { return evaluateMathExpression(candidate.when, variables) !== 0; } catch { return false; }
  });
  return rule ? renderElementTemplate(item, rule.text, elements, spec) : undefined;
}

export function annotationTextHtml(item: DiagramObject, elements: JxgElementMap, spec: RuntimeScene): string {
  const source = reactiveTextSource(item);
  const content = item.objectType === 'annotation' ? item.content : undefined;
  const isPanel = item.objectType === 'annotation' && item.variant === 'panel';
  const isMeasurement = item.objectType === 'annotation' && item.variant === 'measurement';
  const hasBraces = typeof source.text === 'string' && source.text.includes('{') && source.text.includes('}');
  const defaultText = isPanel ? (source.text || '') : (source.text || item.label);
  const body = reactiveText(item, elements, spec) ?? (isMeasurement || source.expression || hasBraces
    ? measurementText(item, elements, spec)
    : defaultText);
  if (!isPanel) return renderKatexTextToHtml(body);
  const title = content?.title
    ? `<strong class="matematika-info-panel__title">${renderKatexTextToHtml(content.title)}</strong>`
    : '';
  const subtitle = content?.subtitle
    ? `<em class="matematika-info-panel__subtitle">${renderKatexTextToHtml(content.subtitle)}</em>`
    : '';
  const intro = body ? `<div class="matematika-info-panel__intro">${renderKatexTextToHtml(body)}</div>` : '';
  const blocks = content?.blocks;
  if (!blocks?.length) return `${title}${subtitle}${intro}`;
  const variables = liveVariables(elements, spec);
  const layout = content?.layout ?? 'stack';
  const blockHtml = blocks.map(block => {
    const resolved = resolveInfoPanelBlock(block, variables);
    const blockTitle = resolved.title
      ? `<strong class="matematika-info-panel__block-title">${renderKatexTextToHtml(resolved.title)}</strong>`
      : '';
    const colorClass = resolved.color ? ` matematika-info-panel__block--${resolved.color}` : '';
    return `<div class="matematika-info-panel__block${colorClass}" data-info-panel-block="${block.id}">${blockTitle}<span>${renderKatexTextToHtml(resolved.text)}</span></div>`;
  }).join('');
  return `${title}${subtitle}${intro}<div class="matematika-info-panel__blocks" data-info-panel-layout="${layout}">${blockHtml}</div>`;
}
