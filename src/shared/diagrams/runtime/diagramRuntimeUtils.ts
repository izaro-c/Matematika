import { renderKatexTextToHtml } from '@/shared/ui/KatexText';
import type {
  DiagramElement,
  DiagramSceneItem,
  DiagramSlider,
  DiagramSpecV2,
} from '../spec';
import {
  angleMeasureRadians,
  evaluateMathExpression,
  interpolateDiagramTemplate,
  resolveInfoPanelBlock,
} from '../spec';
import { hasCoordinates, type JxgElementAdapter, type JxgElementMap } from './jsxgraphAdapter';

export function outsideBaseExtension(baseA: JxgElementAdapter | undefined, baseB: JxgElementAdapter | undefined, foot: JxgElementAdapter | undefined): boolean {
  if (!hasCoordinates(baseA) || !hasCoordinates(baseB) || !hasCoordinates(foot)) return false;
  const dx = baseB.X() - baseA.X();
  const dy = baseB.Y() - baseA.Y();
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-10) return false;
  const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / lengthSquared;
  return t < -0.001 || t > 1.001;
}

export function intersectionBelongsToSupports(
  item: DiagramElement,
  intersection: JxgElementAdapter | undefined,
  elements: JxgElementMap,
  spec: DiagramSpecV2,
): boolean {
  if (item.kind !== 'intersection' || item.properties?.restrictToSupports !== true) return true;
  if (!hasCoordinates(intersection) || !Number.isFinite(intersection.X()) || !Number.isFinite(intersection.Y())) return false;
  return item.refs.every(supportId => {
    const supportSpec = spec.elements.find(candidate => candidate.id === supportId);
    if (!supportSpec || !['segment', 'ray', 'angleBisector'].includes(supportSpec.kind)) return true;
    const support = elements[supportId];
    const start = support?.point1;
    const end = support?.point2;
    if (!hasCoordinates(start) || !hasCoordinates(end)) return false;
    const dx = end.X() - start.X();
    const dy = end.Y() - start.Y();
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared < 1e-10) return false;
    const t = ((intersection.X() - start.X()) * dx + (intersection.Y() - start.Y()) * dy) / lengthSquared;
    if (supportSpec.kind === 'segment') return t >= -0.001 && t <= 1.001;
    return t >= -0.001;
  });
}

export function refsFor<T extends object>(item: DiagramElement, elements: Record<string, T | undefined>): T[] {
  return item.refs.map(ref => elements[ref]).filter((element): element is T => Boolean(element));
}

export function liveVariables(elements: JxgElementMap, spec: DiagramSpecV2): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.points.forEach(point => {
    const element = elements[point.id];
    if (!hasCoordinates(element)) return;
    variables[`${point.id}.x`] = element.X();
    variables[`${point.id}.y`] = element.Y();
  });
  spec.sliders.forEach(slider => {
    const element = elements[slider.id];
    variables[slider.id] = element?.Value?.() ?? slider.value;
  });
  spec.elements.forEach(item => {
    const element = elements[item.id];
    if (hasCoordinates(element)) {
      variables[`${item.id}.x`] = element.X();
      variables[`${item.id}.y`] = element.Y();
    }
    if (item.refs.length >= 2) {
      const a = elements[item.refs[0]];
      const b = elements[item.refs[1]];
      if (a?.Dist && b) variables[`${item.id}.length`] = a.Dist(b);
    }
    if ((item.kind === 'angle' || item.kind === 'nonReflexAngle') && item.refs.length >= 3) {
      const first = elements[item.refs[0]];
      const vertex = elements[item.refs[1]];
      const second = elements[item.refs[2]];
      const radians = hasCoordinates(first) && hasCoordinates(vertex) && hasCoordinates(second)
        ? angleMeasureRadians(
            item.kind,
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

export function sliderMaximum(item: DiagramSlider, elements: JxgElementMap, spec: DiagramSpecV2): number {
  if (!item.maxExpression) return item.max;
  try {
    const evaluated = evaluateMathExpression(item.maxExpression, liveVariables(elements, spec));
    return evaluated > item.min ? evaluated : item.max;
  } catch {
    return item.max;
  }
}

export function conditionAllows(item: DiagramSceneItem, elements: JxgElementMap, spec: DiagramSpecV2): boolean {
  const elementCondition = 'kind' in item ? item.properties?.visibleWhen : undefined;
  const visibleWhen = item.visibleWhen ?? elementCondition;
  if (!visibleWhen) return true;
  try {
    return evaluateMathExpression(visibleWhen, liveVariables(elements, spec)) !== 0;
  } catch {
    return true;
  }
}

export function tickDistance(item: DiagramElement, elements: JxgElementMap, spec: DiagramSpecV2): number {
  if (!item.properties?.tickDistanceExpression) return item.properties?.tickDistance ?? 1;
  try {
    const evaluated = evaluateMathExpression(item.properties.tickDistanceExpression, liveVariables(elements, spec));
    return evaluated > 0 ? evaluated : (item.properties?.tickDistance ?? 1);
  } catch {
    return item.properties?.tickDistance ?? 1;
  }
}

export function evaluatedValue(item: DiagramElement, elements: JxgElementMap, spec: DiagramSpecV2): number | undefined {
  const expression = item.properties?.expression;
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
  item: DiagramElement,
  template: string,
  elements: JxgElementMap,
  spec: DiagramSpecV2,
): string {
  const variables = liveVariables(elements, spec);
  const fallbackValue = evaluatedValue(item, elements, spec);
  const precision = item.properties?.precision ?? 2;
  const unit = item.properties?.unit;
  const legacyValue = formatLegacyValue(fallbackValue, precision, unit);
  return interpolateDiagramTemplate(template, variables, {
    expression: item.properties?.expression,
    precision,
    unit,
    undefinedValue: legacyValue,
  }).split('{value}').join(legacyValue);
}

export function measurementText(item: DiagramElement, elements: JxgElementMap, spec: DiagramSpecV2): string {
  const text = item.text || `${item.label}: {value}`;
  return renderElementTemplate(item, text, elements, spec);
}

export function reactiveText(item: DiagramElement, elements: JxgElementMap, spec: DiagramSpecV2): string | undefined {
  const variables = liveVariables(elements, spec);
  const rule = item.properties?.textRules?.find(candidate => {
    try { return evaluateMathExpression(candidate.when, variables) !== 0; } catch { return false; }
  });
  return rule ? renderElementTemplate(item, rule.text, elements, spec) : undefined;
}

export function annotationTextHtml(item: DiagramElement, elements: JxgElementMap, spec: DiagramSpecV2): string {
  const hasBraces = typeof item.text === 'string' && item.text.includes('{') && item.text.includes('}');
  const defaultText = item.kind === 'infoPanel' ? (item.text || '') : (item.text || item.label);
  const body = reactiveText(item, elements, spec) ?? (item.kind === 'measurement' || item.properties?.expression || hasBraces
    ? measurementText(item, elements, spec)
    : defaultText);
  const blocks = item.kind === 'infoPanel' ? item.properties?.infoPanelBlocks : undefined;
  if (blocks?.length) {
    const variables = liveVariables(elements, spec);
    const layout = item.properties?.infoPanelLayout ?? 'stack';
    const intro = body ? `<div class="matematika-info-panel__intro">${renderKatexTextToHtml(body)}</div>` : '';
    const blockHtml = blocks.map(block => {
      const resolved = resolveInfoPanelBlock(block, variables);
      const title = resolved.title
        ? `<strong class="matematika-info-panel__block-title">${renderKatexTextToHtml(resolved.title)}</strong>`
        : '';
      const colorClass = resolved.color ? ` matematika-info-panel__block--${resolved.color}` : '';
      return `<div class="matematika-info-panel__block${colorClass}" data-info-panel-block="${block.id}">${title}<span>${renderKatexTextToHtml(resolved.text)}</span></div>`;
    }).join('');
    const title = item.properties?.title
      ? `<strong class="matematika-info-panel__title">${renderKatexTextToHtml(item.properties.title)}</strong>`
      : '';
    return `${title}${intro}<div class="matematika-info-panel__blocks" data-info-panel-layout="${layout}">${blockHtml}</div>`;
  }
  return item.kind === 'infoPanel' && item.properties?.title
    ? `<strong>${renderKatexTextToHtml(item.properties.title)}</strong><br/>${renderKatexTextToHtml(body)}`
    : renderKatexTextToHtml(body);
}
