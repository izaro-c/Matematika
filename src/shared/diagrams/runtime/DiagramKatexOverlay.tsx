import React from 'react';
import type {
  DiagramColorToken,
  DiagramElement,
  DiagramSpecV2,
} from '../spec';
import {
  evaluateMathExpression,
  evaluateStepOverlayContent,
} from '../spec';
import { DiagramInfoPanel } from '@/shared/ui/DiagramOverlay';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import {
  annotationTextHtml,
  evaluatedValue,
  measurementText,
  reactiveText,
} from './diagramRuntimeUtils';

export {
  annotationTextHtml,
  evaluatedValue,
  measurementText,
  reactiveText,
};

export interface MovableCueLabel {
  label: string;
  color: DiagramColorToken;
}

export function headerReadingItems(spec: DiagramSpecV2): DiagramElement[] {
  const dynamicPanels = spec.elements.filter(item => item.kind === 'infoPanel' && item.properties?.expression);
  if (dynamicPanels.length > 0) return dynamicPanels;
  return spec.elements
    .filter(item => (item.kind === 'measurement' || item.kind === 'dimensionLine') && (item.properties?.expression || item.refs.length >= 2))
    .slice(0, 4);
}

export function headerReadingText(item: DiagramElement, variables: Record<string, number>): string | null {
  let value: number | undefined;
  try {
    if (item.properties?.expression) {
      value = evaluateMathExpression(item.properties.expression, variables);
    } else if (item.refs.length >= 2) {
      const [a, b] = item.refs;
      const ax = variables[`${a}.x`];
      const ay = variables[`${a}.y`];
      const bx = variables[`${b}.x`];
      const by = variables[`${b}.y`];
      if ([ax, ay, bx, by].every(Number.isFinite)) value = Math.hypot(bx - ax, by - ay);
    }
  } catch {
    return null;
  }
  if (value === undefined || !Number.isFinite(value)) return null;
  const precision = item.properties?.precision ?? 2;
  const unit = item.properties?.unit ? ` ${item.properties.unit}` : '';
  return (item.text || `${item.label}: {value}`).split('{value}').join(`${value.toFixed(precision)}${unit}`);
}

export function movableCueLabels(spec: DiagramSpecV2): MovableCueLabel[] {
  const labels = new Map<string, DiagramColorToken>();
  [
    ...spec.points.filter(point => point.selection.selectable && !point.fixed && !point.locked && point.constraint !== 'derived'),
    ...spec.sliders.filter(slider => slider.selection.selectable && !slider.locked),
  ].forEach(item => {
    const label = item.label.trim();
    if (label && !labels.has(label)) labels.set(label, item.color);
  });
  return [...labels].map(([label, color]) => ({ label, color }))
    .sort((left, right) => right.label.length - left.label.length);
}

export function cueLabelRanges(text: string, labels: readonly MovableCueLabel[]): Array<{ start: number; end: number; color: DiagramColorToken }> {
  const ranges: Array<{ start: number; end: number; color: DiagramColorToken }> = [];
  const isWordCharacter = (character: string | undefined) => Boolean(character && /[\p{L}\p{N}_]/u.test(character));

  labels.forEach(({ label, color }) => {
    let offset = 0;
    while (offset < text.length) {
      const start = text.indexOf(label, offset);
      if (start < 0) break;
      const end = start + label.length;
      const overlaps = ranges.some(range => start < range.end && end > range.start);
      if (!overlaps && !isWordCharacter(text[start - 1]) && !isWordCharacter(text[end])) {
        ranges.push({ start, end, color });
      }
      offset = end;
    }
  });

  return ranges.sort((left, right) => left.start - right.start);
}

export function ExplorationCue({ children, labels }: { children: string; labels: readonly MovableCueLabel[] }) {
  const ranges = cueLabelRanges(children, labels);
  if (ranges.length === 0) return <>{children}</>;

  const fragments: React.ReactNode[] = [];
  let offset = 0;
  ranges.forEach(({ start, end, color }) => {
    if (start > offset) fragments.push(children.slice(offset, start));
    fragments.push(
      <strong
        key={`${start}-${end}`}
        className="font-semibold"
        style={{ color: `var(--theme-${color})` }}
        data-interactive-label={children.slice(start, end)}
        data-interactive-color={color}
      >
        {children.slice(start, end)}
      </strong>,
    );
    offset = end;
  });
  if (offset < children.length) fragments.push(children.slice(offset));
  return <>{fragments}</>;
}

export function compactHeaderReadings(entries: Array<{ item: DiagramElement; text: string }>): Array<{ id: string; itemIds: string[]; text: string }> {
  const compacted: Array<{ id: string; itemIds: string[]; text: string }> = [];
  for (let index = 0; index < entries.length; index += 1) {
    const current = entries[index];
    const next = entries[index + 1];
    if (current.item.kind === 'dimensionLine' && next?.item.kind === 'dimensionLine') {
      const currentParts = current.text.split('=');
      const nextParts = next.text.split('=');
      const currentValue = currentParts.slice(1).join('=').trim();
      const nextValue = nextParts.slice(1).join('=').trim();
      if (currentValue && currentValue === nextValue) {
        compacted.push({
          id: `${current.item.id}-${next.item.id}`,
          itemIds: [current.item.id, next.item.id],
          text: `${currentParts[0].trim()} = ${nextParts[0].trim()} = ${currentValue}`,
        });
        index += 1;
        continue;
      }
    }
    compacted.push({ id: current.item.id, itemIds: [current.item.id], text: current.text });
  }
  return compacted;
}

export function StepOverlayPanels({
  spec,
  activeStepId,
  variables,
}: {
  spec: DiagramSpecV2;
  activeStepId?: string;
  variables: Record<string, number>;
}) {
  const rawStoreStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`] ?? state.variables?.['step']);
  const storeStep = Array.isArray(rawStoreStep)
    ? (rawStoreStep.find(item => typeof item === 'string' && spec.steps.some(step => step.id === item)) ?? rawStoreStep[0])
    : rawStoreStep;
  const stepId = activeStepId
    ?? ((typeof storeStep === 'string' ? storeStep.replace(`${spec.componentId}:`, '') : '') || spec.steps[0]?.id);
  const step = spec.steps.find(item => item.id === stepId);
  const overlays = Object.entries(step?.objectStates ?? {})
    .map(([objectId, state]) => ({ objectId, overlay: state.overlay }))
    .filter((entry): entry is { objectId: string; overlay: NonNullable<typeof entry.overlay> } => (
      Boolean(entry.overlay?.visible)
      && !headerReadingItems(spec).some(item => item.id === entry.objectId)
    ));
  if (overlays.length === 0) return null;
  const grouped = new Map<string, typeof overlays>();
  overlays.forEach(entry => {
    const position = entry.overlay.position ?? 'bottom-right';
    grouped.set(position, [...(grouped.get(position) ?? []), entry]);
  });
  return <>{[...grouped.entries()].map(([position, entries]) => (
    <DiagramInfoPanel key={position} title={step?.label ?? 'Información del paso'} position={position as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'}>
      <div className="space-y-2" aria-live="polite">
        {entries.map(({ objectId, overlay }) => {
          return (
            <div key={objectId} data-step-overlay={objectId}>
              {overlay.title && <strong className="block">{overlay.title}</strong>}
              <span>{evaluateStepOverlayContent(overlay, variables)}</span>
            </div>
          );
        })}
      </div>
    </DiagramInfoPanel>
  ))}</>;
}

export const DiagramKatexOverlay = StepOverlayPanels;
