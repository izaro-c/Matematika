import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  applyVisualOperation,
  enterVisualMode,
  leaveVisualMode,
  openEditorDocument,
  serializeCurrentSource,
  type EditorDiagnostic,
  type EditorDocument,
  type VisualCompatibility
} from '../../src/features/editor/document/index';

export type RoundTripClassification = 'exact' | 'format-only' | 'semantic-risk' | 'non-idempotent' | 'parse-error' | 'unknown';

export interface CorpusAuditEntry {
  path: string;
  originalHash: string;
  finalHash: string;
  compatibility: VisualCompatibility;
  diagnostics: EditorDiagnostic[];
  exact: boolean;
  idempotent: boolean;
  envelopePreserved: boolean;
  bodyPreserved: boolean;
  classification: RoundTripClassification;
  compatibilityStable: boolean;
  diagnosticsStable: boolean;
  cycles: number;
  authorizedOperations: string[];
  reversibleOperationExact: boolean | null;
}

export interface CorpusAuditReport {
  schemaVersion: 3;
  corpusRoot: string;
  totalFiles: number;
  counts: Record<VisualCompatibility, number>;
  files: CorpusAuditEntry[];
}

export function hashSource(source: string): string {
  return crypto.createHash('sha256').update(source, 'utf8').digest('hex');
}

export function discoverMdxFiles(root: string): string[] {
  const discovered: string[] = [];
  const visit = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && entry.name.endsWith('.mdx')) discovered.push(absolute);
    }
  };
  visit(root);
  return discovered.sort();
}

function envelopeSlices(document: EditorDocument): string[] {
  const ranges = [
    ...document.envelope.importRanges,
    ...document.envelope.exportRanges
  ].sort((left, right) => left.start - right.start);
  return ranges.map(range => document.source.slice(range.start, range.end));
}

function cycle(source: string) {
  const opened = openEditorDocument(source);
  const visual = enterVisualMode(opened);
  return leaveVisualMode(visual);
}

function reversibleEdit(source: string): { exact: boolean | null; operationIds: string[] } {
  let session = enterVisualMode(openEditorDocument(source));
  const block = session.document.bodyBlocks.find(candidate => candidate.kind === 'editable');
  if (session.mode !== 'visual' || !block || block.kind !== 'editable') return { exact: null, operationIds: [] };
  const changedText = `${block.originalSource}\u2060`;
  session = applyVisualOperation(session, { operationId: 'audit-edit', blockId: block.id, range: block.editRange,
    expectedSource: block.originalSource, replacement: changedText });
  const changedBlock = session.document.bodyBlocks.find(candidate => candidate.id === block.id);
  if (!changedBlock || changedBlock.kind !== 'editable') return { exact: false, operationIds: session.appliedOperationIds };
  session = applyVisualOperation(session, { operationId: 'audit-revert', blockId: changedBlock.id, range: changedBlock.editRange,
    expectedSource: changedBlock.originalSource, replacement: block.originalSource });
  return { exact: serializeCurrentSource(leaveVisualMode(session)) === source, operationIds: session.appliedOperationIds };
}

function classifyRoundTrip(opening: EditorDocument, finalDocument: EditorDocument, exact: boolean,
  idempotent: boolean): RoundTripClassification {
  if (!idempotent) return 'non-idempotent';
  if (opening.diagnostics.some(item => item.code === 'PARSE_EXCEPTION')) return 'parse-error';
  if (exact) return 'exact';
  if (opening.source === finalDocument.source) return 'format-only';
  return 'semantic-risk';
}

export function auditSource(source: string, relativePath: string): CorpusAuditEntry {
  const openingSession = openEditorDocument(source);
  const opening = openingSession.document;
  // Projection is deliberately consumed: an unsupported document may have no
  // blocks, but its source remains authoritative.
  for (const block of opening.bodyBlocks) {
    if (!block.id) throw new Error(`Projected block without id in ${relativePath}`);
  }

  const firstSession = cycle(source);
  const firstCycle = serializeCurrentSource(firstSession);
  const secondSession = cycle(firstCycle);
  const secondCycle = serializeCurrentSource(secondSession);
  const thirdSession = cycle(secondCycle);
  const thirdCycle = serializeCurrentSource(thirdSession);
  const finalDocument = thirdSession.document;
  const compatibilityStable = [firstSession, secondSession, thirdSession]
    .every(session => session.document.compatibility === opening.compatibility);
  const openingDiagnostics = JSON.stringify(opening.diagnostics);
  const diagnosticsStable = [firstSession, secondSession, thirdSession]
    .every(session => JSON.stringify(session.document.diagnostics) === openingDiagnostics);
  const reversible = reversibleEdit(source);

  const originalEnvelope = envelopeSlices(opening);
  const finalEnvelope = envelopeSlices(finalDocument);
  const originalBody = opening.source.slice(opening.bodyRange.start, opening.bodyRange.end);
  const finalBody = finalDocument.source.slice(finalDocument.bodyRange.start, finalDocument.bodyRange.end);

  const exact = source === thirdCycle;
  const idempotent = firstCycle === secondCycle && secondCycle === thirdCycle;
  const classification = classifyRoundTrip(opening, finalDocument, exact, idempotent);

  return {
    path: relativePath,
    originalHash: hashSource(source),
    finalHash: hashSource(thirdCycle),
    compatibility: opening.compatibility,
    diagnostics: opening.diagnostics,
    exact,
    idempotent,
    envelopePreserved: JSON.stringify(originalEnvelope) === JSON.stringify(finalEnvelope),
    bodyPreserved: originalBody === finalBody,
    classification,
    compatibilityStable,
    diagnosticsStable,
    cycles: 3,
    authorizedOperations: reversible.operationIds,
    reversibleOperationExact: reversible.exact
  };
}

export function runCorpusAudit(
  repositoryRoot = process.cwd(),
  corpusRoot = path.join(repositoryRoot, 'src/database/content')
): CorpusAuditReport {
  const files = discoverMdxFiles(corpusRoot);
  const counts: Record<VisualCompatibility, number> = {
    'fully-editable': 0,
    'partially-editable': 0,
    'read-only': 0,
    unsupported: 0
  };
  const entries = files.map(absolute => {
    const relative = path.relative(repositoryRoot, absolute).split(path.sep).join('/');
    const result = auditSource(fs.readFileSync(absolute, 'utf8'), relative);
    counts[result.compatibility] += 1;
    return result;
  });
  return {
    schemaVersion: 3,
    corpusRoot: path.relative(repositoryRoot, corpusRoot).split(path.sep).join('/'),
    totalFiles: entries.length,
    counts,
    files: entries
  };
}

export function assertSafeReport(report: CorpusAuditReport): void {
  const unsafe = report.files.filter(entry =>
    !entry.exact || !entry.idempotent || !entry.envelopePreserved || !entry.bodyPreserved
      || !entry.compatibilityStable || !entry.diagnosticsStable || entry.reversibleOperationExact === false
  );
  if (unsafe.length > 0) {
    throw new Error(`Corpus preservation failed for: ${unsafe.map(entry => entry.path).join(', ')}`);
  }
}
