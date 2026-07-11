import { describe, expect, it } from 'vitest';
import { auditSource, discoverMdxFiles, runCorpusAudit } from '../../../../scripts/editor/corpusAuditCore';
import path from 'node:path';

describe('lossless corpus oracle', () => {
  it('executes three real cycles without changing unsupported source', () => {
    const source = `export const metadata = { title: 'T' };\n\nTexto { no es JS }`;
    const entry = auditSource(source, 'unsupported.mdx');
    expect(entry.compatibility).toBe('unsupported');
    expect(entry.exact).toBe(true);
    expect(entry.bodyPreserved).toBe(true);
    expect(entry.idempotent).toBe(true);
  });

  it('discovers the corpus recursively and audits every discovered MDX', () => {
    const root = path.resolve('src/database/content');
    const discovered = discoverMdxFiles(root);
    const report = runCorpusAudit();
    expect(discovered).toHaveLength(120);
    expect(report.totalFiles).toBe(discovered.length);
    expect(report.files.every(file => file.exact && file.idempotent && file.envelopePreserved && file.bodyPreserved)).toBe(true);
  }, 20_000);
});
