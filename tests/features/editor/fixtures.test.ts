import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditSource, discoverMdxFiles } from '../../../scripts/editor/corpusAuditCore';

const fixtureRoot = path.resolve('tests/fixtures/editor');
const expectations: Record<string, string> = {
  'array-prop.mdx': 'items={[',
  'capitular-first-paragraph.mdx': '<Capitular',
  'demonstration-section-jsx-prop.mdx': '={<',
  'imports-exports.mdx': 'export ',
  'multiline-expression.mdx': '(() =>',
  'nested-components.mdx': '<Outer',
  'object-prop.mdx': '={{',
  'proof-steps.mdx': '<ProofStep',
  'repeated-indentation.mdx': '  '
};

describe('editor fixture manifest', () => {
  const fixtures = discoverMdxFiles(fixtureRoot);
  const names = fixtures.map(file => path.basename(file));

  it('has an explicit expectation for every automatically discovered fixture', () => {
    expect(names).toEqual(Object.keys(expectations).sort());
  });

  it.each(fixtures)('preserves %s through productive transitions', file => {
    const source = fs.readFileSync(file, 'utf8');
    const name = path.basename(file);
    expect(source).toContain(expectations[name]);
    const result = auditSource(source, path.relative(process.cwd(), file));
    expect(result).toMatchObject({ exact: true, idempotent: true, cycles: 3,
      compatibilityStable: true, diagnosticsStable: true });
    expect(result.reversibleOperationExact).not.toBe(false);
  });

  it('preserves Unicode and CRLF byte for byte', () => {
    const source = '## Ángulo\r\n\r\nSea α ∈ ℝ. 😀\r\n';
    expect(auditSource(source, 'unicode-crlf.mdx')).toMatchObject({ exact: true, idempotent: true });
  });
});
