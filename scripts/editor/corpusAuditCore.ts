import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  parseEditorDocument,
  type EditorDiagnostic,
  type EditorDocument,
  type VisualCompatibility
} from '../../src/features/editor/document/index';

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
}

export interface CorpusAuditReport {
  schemaVersion: 2;
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

export function auditSource(source: string, relativePath: string): CorpusAuditEntry {
  const opening = parseEditorDocument(source);
  // Projection is deliberately consumed: an unsupported document may have no
  // blocks, but its source remains authoritative.
  for (const block of opening.bodyBlocks) {
    if (!block.id) throw new Error(`Projected block without id in ${relativePath}`);
  }

  const visualToCode = opening.source;
  const codeToVisual = parseEditorDocument(visualToCode);
  const sourceCandidate = codeToVisual.source;
  const firstCycle = parseEditorDocument(sourceCandidate).source;
  const secondCycle = parseEditorDocument(firstCycle).source;
  const thirdCycle = parseEditorDocument(secondCycle).source;
  const finalDocument = parseEditorDocument(thirdCycle);

  const originalEnvelope = envelopeSlices(opening);
  const finalEnvelope = envelopeSlices(finalDocument);
  const originalBody = opening.source.slice(opening.bodyRange.start, opening.bodyRange.end);
  const finalBody = finalDocument.source.slice(finalDocument.bodyRange.start, finalDocument.bodyRange.end);

  return {
    path: relativePath,
    originalHash: hashSource(source),
    finalHash: hashSource(thirdCycle),
    compatibility: opening.compatibility,
    diagnostics: opening.diagnostics,
    exact: source === thirdCycle,
    idempotent: firstCycle === secondCycle && secondCycle === thirdCycle,
    envelopePreserved: JSON.stringify(originalEnvelope) === JSON.stringify(finalEnvelope),
    bodyPreserved: originalBody === finalBody
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
    schemaVersion: 2,
    corpusRoot: path.relative(repositoryRoot, corpusRoot).split(path.sep).join('/'),
    totalFiles: entries.length,
    counts,
    files: entries
  };
}

export function assertSafeReport(report: CorpusAuditReport): void {
  const unsafe = report.files.filter(entry =>
    !entry.exact || !entry.idempotent || !entry.envelopePreserved || !entry.bodyPreserved
  );
  if (unsafe.length > 0) {
    throw new Error(`Corpus preservation failed for: ${unsafe.map(entry => entry.path).join(', ')}`);
  }
}
