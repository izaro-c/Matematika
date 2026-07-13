import { computeFingerprint, parseEditorDocument, type SourceRange, type ProjectedBlock } from '../document';

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
  originalRange: SourceRange;
  candidateRange: SourceRange;
  operationId?: string;
  blockId?: string;
}

export interface DiffReview {
  id: string;
  documentId: string;
  baseRevision: number;
  baseVersion: string | null;
  baseSourceHash: string;
  candidateSourceHash: string;
  status: 'clean' | 'reviewable' | 'blocked' | 'stale';
  title: string;
  summary: string;
  changes: DiffLineChange[];
  hunks: DiffHunk[];
  blockingChangeCount: number;
  expectedRanges: ExpectedDiffRange[];
  operationIds: string[];
}

export interface DiffHunk {
  id: string;
  originalRange: SourceRange;
  candidateRange: SourceRange;
  originalText: string;
  candidateText: string;
  expected: boolean;
  operationId?: string;
  blockId?: string;
  reason: string;
  classification: DiffClassification;
}

export interface ExpectedDiffRange extends SourceRange {
  reason: string;
  operationId: string;
  blockId?: string;
}

export interface ApprovedDiff {
  documentId: string;
  baseVersion: string | null;
  baseSourceHash: string;
  candidateSourceHash: string;
  revision: number;
  expectedRanges: ExpectedDiffRange[];
  operationIds: string[];
}

interface BuildDiffReviewInput {
  documentId: string;
  baseSource: string;
  candidateSource: string;
  localRevision: number;
  baseVersion: string | null;
  expectedRanges?: ExpectedDiffRange[];
}

const BLOCKING_CLASSIFICATIONS: DiffClassification[] = ['outside-edited-range', 'unknown', 'blocking'];

function lineStarts(source: string): number[] {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

function contains(outer: SourceRange, inner: SourceRange): boolean {
  return outer.start <= inner.start && inner.end <= outer.end;
}

function includeAdjacentWhitespace(source: string, range: ExpectedDiffRange): ExpectedDiffRange {
  let start = range.start;
  let end = range.end;
  while (start > 0 && /\s/.test(source[start - 1])) start -= 1;
  while (end < source.length && /\s/.test(source[end])) end += 1;
  return { ...range, start, end };
}

function classifyChange(
  range: SourceRange,
  expectedRanges: BuildDiffReviewInput['expectedRanges'],
  compatibility?: string,
  bodyBlocks?: ProjectedBlock[],
): { classification: DiffClassification; reason: string; operationId?: string; blockId?: string } {
  if (expectedRanges && expectedRanges.length > 0) {
    const match = expectedRanges.find(expected => expected.operationId && contains(expected, range));
    if (match) {
      return {
        classification: 'expected',
        reason: match.reason,
        operationId: match.operationId,
        blockId: match.blockId,
      };
    }
  }
  if (!expectedRanges || expectedRanges.length === 0) {
    return {
      classification: 'unknown',
      reason: compatibility === 'fully-editable'
        ? 'El documento es estructuralmente compatible, pero el cambio no está ligado a una operación localizada.'
        : 'La revisión no declara rangos esperados ni operaciones de usuario verificables.',
    };
  }
  if (compatibility === 'partially-editable' && bodyBlocks) {
    const containingBlock = bodyBlocks.find(
      block => block.kind === 'editable' && contains(block.editRange, range)
    );
    if (containingBlock) {
      return {
        classification: 'outside-edited-range',
        reason: `El cambio cae dentro del bloque editable '${containingBlock.id}', pero no coincide con una operación visual autorizada.`,
      };
    }
  }
  if (!expectedRanges || expectedRanges.length === 0) {
    return {
      classification: 'unknown',
      reason: 'La revisión no declara rangos esperados ni operaciones de usuario verificables.',
    };
  }
  return {
    classification: 'outside-edited-range',
    reason: 'El cambio cae fuera de los rangos autorizados por la operación visual.',
  };
}

function trimSharedEdges(
  originalText: string,
  candidateText: string,
  originalRange: SourceRange,
  candidateRange: SourceRange,
): { originalText: string; candidateText: string; originalRange: SourceRange; candidateRange: SourceRange } {
  let prefix = 0;
  while (prefix < originalText.length && prefix < candidateText.length
    && originalText[prefix] === candidateText[prefix]) {
    prefix += 1;
  }

  let suffix = 0;
  while (suffix < originalText.length - prefix && suffix < candidateText.length - prefix
    && originalText[originalText.length - 1 - suffix] === candidateText[candidateText.length - 1 - suffix]) {
    suffix += 1;
  }

  return {
    originalText: originalText.slice(prefix, originalText.length - suffix),
    candidateText: candidateText.slice(prefix, candidateText.length - suffix),
    originalRange: {
      start: originalRange.start + prefix,
      end: originalRange.end - suffix,
    },
    candidateRange: {
      start: candidateRange.start + prefix,
      end: candidateRange.end - suffix,
    },
  };
}

// The LCS walk is deliberately local to the diff engine and keeps insertions aligned.
// eslint-disable-next-line sonarjs/cognitive-complexity
function buildLineHunks(baseSource: string, candidateSource: string): Array<{
  originalRange: SourceRange;
  candidateRange: SourceRange;
  originalText: string;
  candidateText: string;
  beforeLine: number | null;
  afterLine: number | null;
}> {
  const beforeLines = baseSource.split('\n');
  const afterLines = candidateSource.split('\n');
  const beforeStarts = lineStarts(baseSource);
  const afterStarts = lineStarts(candidateSource);
  const hunks: Array<{
    originalRange: SourceRange;
    candidateRange: SourceRange;
    originalText: string;
    candidateText: string;
    beforeLine: number | null;
    afterLine: number | null;
  }> = [];

  // LCS aligns unchanged lines first. This prevents one insertion or move from
  // making every following line look modified.
  const rows = beforeLines.length + 1;
  const columns = afterLines.length + 1;
  const lcs = Array.from({ length: rows }, () => new Uint32Array(columns));
  for (let before = beforeLines.length - 1; before >= 0; before -= 1) {
    for (let after = afterLines.length - 1; after >= 0; after -= 1) {
      lcs[before][after] = beforeLines[before] === afterLines[after]
        ? lcs[before + 1][after + 1] + 1
        : Math.max(lcs[before + 1][after], lcs[before][after + 1]);
    }
  }

  let before = 0;
  let after = 0;
  while (before < beforeLines.length || after < afterLines.length) {
    if (before < beforeLines.length && after < afterLines.length && beforeLines[before] === afterLines[after]) {
      before += 1;
      after += 1;
      continue;
    }
    const beforeStart = before;
    const afterStart = after;
    while (before < beforeLines.length || after < afterLines.length) {
      if (before < beforeLines.length && after < afterLines.length && beforeLines[before] === afterLines[after]) break;
      if (after >= afterLines.length || (before < beforeLines.length && lcs[before + 1][after] >= lcs[before][after + 1])) before += 1;
      else after += 1;
    }

    const removed = beforeLines.slice(beforeStart, before);
    const added = afterLines.slice(afterStart, after);
    const originalRange = {
      start: beforeStarts[beforeStart] ?? baseSource.length,
      end: before > beforeStart
        ? (beforeStarts[before - 1] ?? baseSource.length) + (beforeLines[before - 1]?.length ?? 0)
        : beforeStarts[beforeStart] ?? baseSource.length,
    };
    const candidateRange = {
      start: afterStarts[afterStart] ?? candidateSource.length,
      end: after > afterStart
        ? (afterStarts[after - 1] ?? candidateSource.length) + (afterLines[after - 1]?.length ?? 0)
        : afterStarts[afterStart] ?? candidateSource.length,
    };
    const originalText = removed.join('\n');
    const candidateText = added.join('\n');
    const exact = removed.length === 1 && added.length === 1
      ? trimSharedEdges(originalText, candidateText, originalRange, candidateRange)
      : { originalText, candidateText, originalRange, candidateRange };
    hunks.push({
      ...exact,
      beforeLine: removed.length > 0 ? beforeStart + 1 : null,
      afterLine: added.length > 0 ? afterStart + 1 : null,
    });
  }
  return hunks;
}

export function buildDiffReview(input: BuildDiffReviewInput): DiffReview {
  const baseSourceHash = computeFingerprint(input.baseSource);
  const candidateSourceHash = computeFingerprint(input.candidateSource);
  const expectedRanges = input.expectedRanges ?? [];
  const classificationRanges = expectedRanges.map(range => includeAdjacentWhitespace(input.baseSource, range));
  const operationIds = [...new Set(expectedRanges.map(range => range.operationId).filter(Boolean))].sort();
  const id = `${input.documentId}:${input.baseVersion ?? 'no-version'}:${input.localRevision}:${baseSourceHash}:${candidateSourceHash}:${operationIds.join(',')}`;
  if (input.baseSource === input.candidateSource) {
    return {
      id,
      documentId: input.documentId,
      baseRevision: input.localRevision,
      baseVersion: input.baseVersion,
      baseSourceHash,
      candidateSourceHash,
      status: 'clean',
      title: 'Sin cambios',
      summary: 'El candidato coincide con el archivo base.',
      changes: [],
      hunks: [],
      blockingChangeCount: 0,
      expectedRanges,
      operationIds,
    };
  }

  const baseParse = parseEditorDocument(input.candidateSource);
  if (baseParse.compatibility === 'unsupported') {
    return {
      id,
      documentId: input.documentId,
      baseRevision: input.localRevision,
      baseVersion: input.baseVersion,
      baseSourceHash,
      candidateSourceHash,
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
        originalRange: { start: 0, end: input.baseSource.length },
        candidateRange: { start: 0, end: input.candidateSource.length },
        reason: baseParse.compatibilityReasons.join(' ') || 'Parseo MDX no soportado.',
      }],
      hunks: [{
        id: 'blocking-parse',
        originalRange: { start: 0, end: input.baseSource.length },
        candidateRange: { start: 0, end: input.candidateSource.length },
        originalText: input.baseSource,
        candidateText: input.candidateSource,
        expected: false,
        reason: baseParse.compatibilityReasons.join(' ') || 'Parseo MDX no soportado.',
        classification: 'blocking',
      }],
      blockingChangeCount: 1,
      expectedRanges,
      operationIds,
    };
  }

  const lineHunks = buildLineHunks(input.baseSource, input.candidateSource);
  const hunks: DiffHunk[] = lineHunks
    .map((hunk, index) => {
      const classification = classifyChange(hunk.originalRange, classificationRanges, baseParse.compatibility, baseParse.bodyBlocks);
      return {
        id: `hunk-${index + 1}`,
        originalRange: hunk.originalRange,
        candidateRange: hunk.candidateRange,
        originalText: hunk.originalText,
        candidateText: hunk.candidateText,
        expected: classification.classification === 'expected',
        operationId: classification.operationId,
        blockId: classification.blockId,
        reason: classification.reason,
        classification: classification.classification,
      };
    });
  const changes: DiffLineChange[] = hunks.map((hunk, index) => {
    const line = lineHunks[index];
    return {
      id: hunk.id,
      classification: hunk.classification,
      beforeLine: line?.beforeLine ?? null,
      afterLine: line?.afterLine ?? null,
      beforeText: hunk.originalText,
      afterText: hunk.candidateText,
      originalRange: hunk.originalRange,
      candidateRange: hunk.candidateRange,
      operationId: hunk.operationId,
      blockId: hunk.blockId,
      reason: hunk.reason,
    };
  });

  const blockingChangeCount = changes.filter(change => BLOCKING_CLASSIFICATIONS.includes(change.classification)).length;

  return {
    id,
    documentId: input.documentId,
    baseRevision: input.localRevision,
    baseVersion: input.baseVersion,
    baseSourceHash,
    candidateSourceHash,
    status: blockingChangeCount > 0 ? 'blocked' : 'reviewable',
    title: blockingChangeCount > 0 ? 'Diff con cambios bloqueantes' : 'Diff listo para aplicar',
    summary: `${changes.length} cambio(s) detectado(s); ${blockingChangeCount} bloqueante(s).`,
    changes,
    hunks,
    blockingChangeCount,
    expectedRanges,
    operationIds,
  };
}

export function isDiffReviewStale(review: DiffReview, localRevision: number, baseVersion: string | null): boolean {
  return review.baseRevision !== localRevision || review.baseVersion !== baseVersion;
}

export function approveDiffReview(review: DiffReview): ApprovedDiff | null {
  if (review.status !== 'reviewable' || review.blockingChangeCount > 0) return null;
  return {
    documentId: review.documentId,
    baseVersion: review.baseVersion,
    baseSourceHash: review.baseSourceHash,
    candidateSourceHash: review.candidateSourceHash,
    revision: review.baseRevision,
    expectedRanges: review.expectedRanges,
    operationIds: review.operationIds,
  };
}

export function isApprovedDiffValid(approval: ApprovedDiff | null | undefined, review: DiffReview): boolean {
  if (!approval || review.status !== 'reviewable') return false;
  return approval.documentId === review.documentId
    && approval.baseVersion === review.baseVersion
    && approval.baseSourceHash === review.baseSourceHash
    && approval.candidateSourceHash === review.candidateSourceHash
    && approval.revision === review.baseRevision
    && approval.operationIds.join('\0') === review.operationIds.join('\0')
    && approval.expectedRanges.length === review.expectedRanges.length
    && approval.expectedRanges.every((range, index) => {
      const expected = review.expectedRanges[index];
      return expected
        && range.start === expected.start
        && range.end === expected.end
        && range.operationId === expected.operationId
        && range.blockId === expected.blockId
        && range.reason === expected.reason;
    });
}
