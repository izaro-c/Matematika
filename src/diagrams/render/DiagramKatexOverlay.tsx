import React from 'react';
import type {DiagramColorToken, DiagramObject, DiagramSpec} from '@/diagrams/model';
import {evaluateMathExpression, interpolateDiagramTemplate, isControlObject, isPositionedPoint, objectKind, pointIsImmovable} from '@/diagrams/model'
import {evaluateStepOverlayContent, sceneReferences} from '@/diagrams/geometry';
import { DiagramInfoPanel } from '@/components/ui/DiagramOverlay';
import { KatexText } from '@/components/ui/KatexText';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import {
  annotationTextHtml,
  evaluatedValue,
  measurementText,
  reactiveText,
  reactiveTextSource,
} from '@/diagrams/render/diagramRuntimeUtils';

type HeaderScene = Pick<DiagramSpec, 'objects' | 'header'>;

/** Objetos que pueden aportar lecturas: cualquiera salvo puntos con posición propia y controles. */
function readingCandidates(spec: Pick<DiagramSpec, 'objects'>): DiagramObject[] {
  return spec.objects.filter(item => !isPositionedPoint(item) && !isControlObject(item));
}

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

export interface HeaderReadingPresentation {
  id: string;
  itemIds: string[];
  text: string;
  visibility: 'any' | 'all';
}

function automaticHeaderReadingItems(spec: HeaderScene): DiagramObject[] {
  const candidates = readingCandidates(spec);
  const dynamicPanels = candidates.filter(item => item.objectType === 'annotation' && item.variant === 'panel' && item.content.expression);
  if (dynamicPanels.length > 0) return dynamicPanels;
  return candidates
    .filter(item => {
      const kind = objectKind(item);
      return (kind === 'measurement' || kind === 'dimensionLine')
        && (reactiveTextSource(item).expression || sceneReferences(spec, item).length >= 2);
    })
    .slice(0, 4);
}

export function headerReadingItems(spec: HeaderScene): DiagramObject[] {
  if (spec.header?.readingsMode === 'hidden') return [];
  if (spec.header?.readingsMode !== 'custom') return automaticHeaderReadingItems(spec);
  const byId = new Map(readingCandidates(spec).map(item => [item.id, item]));
  return [...new Set(spec.header.readings.flatMap(reading => reading.sourceIds))]
    .map(id => byId.get(id))
    .filter((item): item is DiagramObject => Boolean(item));
}

export function headerReadingText(item: DiagramObject, variables: Record<string, number>, spec?: Pick<DiagramSpec, 'objects'>): string | null {
  const source = reactiveTextSource(item);
  const refs = spec ? sceneReferences(spec, item) : sceneReferences({ objects: [item] }, item);
  let value: number | undefined;
  try {
    if (source.expression) {
      value = evaluateMathExpression(source.expression, variables);
    } else if (refs.length >= 2) {
      const [a, b] = refs;
      const ax = variables[`${a}.x`];
      const ay = variables[`${a}.y`];
      const bx = variables[`${b}.x`];
      const by = variables[`${b}.y`];
      if ([ax, ay, bx, by].every(Number.isFinite)) value = Math.hypot(bx - ax, by - ay);
    } else if (refs.length === 1) {
      const refId = refs[0];
      if (Number.isFinite(variables[`${refId}.length`])) {
        value = variables[`${refId}.length`];
      }
    }
  } catch {
    return null;
  }
  if (value === undefined || !Number.isFinite(value)) return null;
  const precision = source.precision ?? 2;
  const unit = source.unit ? ` ${source.unit}` : '';
  const title = item.objectType === 'annotation' ? item.content.title : undefined;
  const displayLabel = item.label || title || item.id;
  const template = source.text || `${displayLabel}: {value}`;
  const rendered = interpolateDiagramTemplate(template, variables, {
    expression: source.expression,
    precision,
    unit: source.unit,
  });
  return rendered.split('{value}').join(`${value.toFixed(precision)}${unit}`);
}

export function movableCueLabels(spec: Pick<DiagramSpec, 'objects'>): MovableCueLabel[] {
  const labels = new Map<string, DiagramColorToken>();
  [
    ...spec.objects.filter(point => isPositionedPoint(point) && point.selection.selectable && !pointIsImmovable(point) && !point.locked),
    ...spec.objects.filter(slider => isControlObject(slider) && slider.selection.selectable && !slider.locked),
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

function readingValue(text: string): string {
  const equalityIndex = text.lastIndexOf('=');
  if (equalityIndex >= 0) return text.slice(equalityIndex + 1).trim();
  const labelIndex = text.lastIndexOf(':');
  return labelIndex >= 0 ? text.slice(labelIndex + 1).trim() : text.trim();
}

function customHeaderReadings(
  entries: Array<{ item: DiagramObject; text: string }>,
  spec: HeaderScene,
): HeaderReadingPresentation[] {
  const entryById = new Map(entries.map(entry => [entry.item.id, entry]));
  return (spec.header?.readings ?? []).flatMap((reading): HeaderReadingPresentation[] => {
    const sources = reading.sourceIds
      .map(id => entryById.get(id))
      .filter((entry): entry is { item: DiagramObject; text: string } => Boolean(entry));
    if (sources.length === 0) return [];

    if (reading.presentation === 'value') {
      return sources.map((source, index) => ({
        id: sources.length === 1 ? reading.id : `${reading.id}-${source.item.id}-${index}`,
        itemIds: [source.item.id],
        text: readingValue(source.text),
        visibility: 'any' as const,
      }));
    }

    if (reading.presentation === 'equality') {
      const values = sources.map(source => readingValue(source.text));
      const allEqual = sources.length >= 2 && values.every(val => val === values[0]);
      if (allEqual) {
        const names = sources.map(entry => entry.item.label || entry.item.id).join(' = ');
        return [{
          id: reading.id,
          itemIds: sources.map(source => source.item.id),
          text: `${names} = ${values[0]}`,
          visibility: 'all' as const,
        }];
      }
      // Cuando los valores no son iguales (o solo hay 1 fuente), mostrar las lecturas separadas
      return sources.map((source, index) => ({
        id: `${reading.id}-${source.item.id}-${index}`,
        itemIds: [source.item.id],
        text: source.text,
        visibility: 'any' as const,
      }));
    }

    // Presentación 'label-value'
    return sources.map((source, index) => {
      const value = readingValue(source.text);
      const text = source.text.includes(':') || source.text.includes('=')
        ? source.text
        : `${source.item.label || source.item.id}: ${value}`;
      return {
        id: sources.length === 1 ? reading.id : `${reading.id}-${source.item.id}-${index}`,
        itemIds: [source.item.id],
        text,
        visibility: 'any' as const,
      };
    });
  });
}

export function compactHeaderReadings(
  entries: Array<{ item: DiagramObject; text: string }>,
  spec?: HeaderScene,
): HeaderReadingPresentation[] {
  if (spec?.header?.readingsMode === 'custom') return customHeaderReadings(entries, spec);
  const compacted: HeaderReadingPresentation[] = [];
  for (let index = 0; index < entries.length; index += 1) {
    const current = entries[index];
    const next = entries[index + 1];
    if (objectKind(current.item) === 'dimensionLine' && next && objectKind(next.item) === 'dimensionLine') {
      const currentParts = current.text.split('=');
      const nextParts = next.text.split('=');
      const currentValue = currentParts.slice(1).join('=').trim();
      const nextValue = nextParts.slice(1).join('=').trim();
      if (currentValue && currentValue === nextValue) {
        compacted.push({
          id: `${current.item.id}-${next.item.id}`,
          itemIds: [current.item.id, next.item.id],
          text: `${currentParts[0].trim()} = ${nextParts[0].trim()} = ${currentValue}`,
          visibility: 'any',
        });
        index += 1;
        continue;
      }
    }
    compacted.push({ id: current.item.id, itemIds: [current.item.id], text: current.text, visibility: 'any' });
  }
  return compacted;
}

export function StepOverlayPanels({
  spec,
  activeStepId,
  variables,
}: {
  spec: DiagramSpec;
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
              {overlay.title && <em className="diagram-info-panel__subtitle"><KatexText text={overlay.title} /></em>}
              <KatexText text={evaluateStepOverlayContent(overlay, variables)} />
            </div>
          );
        })}
      </div>
    </DiagramInfoPanel>
  ))}</>;
}

export const DiagramKatexOverlay = StepOverlayPanels;
