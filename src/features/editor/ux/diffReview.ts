import { parseEditorDocument } from '../document';

export type DiffClassification =
  | 'expected'
  | 'format-only-verified'
  | 'outside-edited-range'
  | 'unknown'
  | 'blocking';

export interface DiffLineChange {
  id: string;
  classification: DiffClassification;
  beforeLine: number | null;
  afterLine: number | null;
  beforeText: string;
  afterText: string;
  reason: string;
}

export interface DiffReview {
  id: string;
  baseRevision: number;
  baseVersion: string | null;
  status: 'clean' | 'reviewable' | 'blocked' | 'stale';
  title: string;
  summary: string;
  changes: DiffLineChange[];
  blockingChangeCount: number;
}

interface BuildDiffReviewInput {
  baseSource: string;
  candidateSource: string;
  localRevision: number;
  baseVersion: string | null;
  expectedRanges?: Array<{ start: number; end: number; reason: string }>;
}

const BLOCKING_CLASSIFICATIONS: DiffClassification[] = ['outside-edited-range', 'unknown', 'blocking'];

function lineStarts(source: string): number[] {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

function lineRange(starts: number[], lineIndex: number, source: string) {
  const start = starts[lineIndex] ?? source.length;
  const end = starts[lineIndex + 1] ?? source.length;
  return { start, end };
}

function overlaps(a: { start: number; end: number }, b: { start: number; end: number }): boolean {
  return a.start <= b.end && b.start <= a.end;
}

function classifyChange(
  range: { start: number; end: number },
  expectedRanges: BuildDiffReviewInput['expectedRanges'],
): { classification: DiffClassification; reason: string } {
  if (!expectedRanges || expectedRanges.length === 0) {
    return {
      classification: 'expected',
      reason: 'Cambio manual de código fuente revisado explícitamente por el usuario.',
    };
  }
  const match = expectedRanges.find(expected => overlaps(range, expected));
  if (match) return { classification: 'expected', reason: match.reason };
  return {
    classification: 'outside-edited-range',
    reason: 'El cambio cae fuera de los rangos autorizados por la operación visual.',
  };
}

export function buildDiffReview(input: BuildDiffReviewInput): DiffReview {
  const id = `${input.baseVersion ?? 'no-version'}:${input.localRevision}:${input.baseSource.length}:${input.candidateSource.length}`;
  if (input.baseSource === input.candidateSource) {
    return {
      id,
      baseRevision: input.localRevision,
      baseVersion: input.baseVersion,
      status: 'clean',
      title: 'Sin cambios',
      summary: 'El candidato coincide con el archivo base.',
      changes: [],
      blockingChangeCount: 0,
    };
  }

  const baseParse = parseEditorDocument(input.candidateSource);
  if (baseParse.compatibility === 'unsupported') {
    return {
      id,
      baseRevision: input.localRevision,
      baseVersion: input.baseVersion,
      status: 'blocked',
      title: 'Diff bloqueado por validación',
      summary: 'El candidato no puede analizarse de forma segura como MDX.',
      changes: [{
        id: 'blocking-parse',
        classification: 'blocking',
        beforeLine: null,
        afterLine: null,
        beforeText: '',
        afterText: '',
        reason: baseParse.compatibilityReasons.join(' ') || 'Parseo MDX no soportado.',
      }],
      blockingChangeCount: 1,
    };
  }

  const beforeLines = input.baseSource.split('\n');
  const afterLines = input.candidateSource.split('\n');
  const starts = lineStarts(input.baseSource);
  const max = Math.max(beforeLines.length, afterLines.length);
  const changes: DiffLineChange[] = [];

  for (let index = 0; index < max; index += 1) {
    const beforeText = beforeLines[index] ?? '';
    const afterText = afterLines[index] ?? '';
    if (beforeText === afterText) continue;
    const range = lineRange(starts, Math.min(index, beforeLines.length - 1), input.baseSource);
    const classification = classifyChange(range, input.expectedRanges);
    changes.push({
      id: `line-${index + 1}`,
      classification: classification.classification,
      beforeLine: index < beforeLines.length ? index + 1 : null,
      afterLine: index < afterLines.length ? index + 1 : null,
      beforeText,
      afterText,
      reason: classification.reason,
    });
  }

  const blockingChangeCount = changes.filter(change => BLOCKING_CLASSIFICATIONS.includes(change.classification)).length;

  return {
    id,
    baseRevision: input.localRevision,
    baseVersion: input.baseVersion,
    status: blockingChangeCount > 0 ? 'blocked' : 'reviewable',
    title: blockingChangeCount > 0 ? 'Diff con cambios bloqueantes' : 'Diff listo para aplicar',
    summary: `${changes.length} cambio(s) detectado(s); ${blockingChangeCount} bloqueante(s).`,
    changes,
    blockingChangeCount,
  };
}

export function isDiffReviewStale(review: DiffReview, localRevision: number, baseVersion: string | null): boolean {
  return review.baseRevision !== localRevision || review.baseVersion !== baseVersion;
}

