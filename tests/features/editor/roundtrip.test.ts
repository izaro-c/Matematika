import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runAudit } from '../../../scripts/editor/audit-mdx-roundtrip';
import { parseMDX, stringifyMDX } from '../../../src/shared/lib/mdxParser';
import { parseBodyToBlocks, stringifyBlocksToBody } from '../../../src/features/editor/core/parser';

function executeCycles(originalContent: string) {
  const parsed1 = parseMDX(originalContent);
  const blocks1 = parseBodyToBlocks(parsed1.body);
  const body1 = stringifyBlocksToBody(blocks1);
  const cycle1 = stringifyMDX(parsed1.metadata, parsed1.imports, body1, parsed1.exports);

  const parsed2 = parseMDX(cycle1);
  const blocks2 = parseBodyToBlocks(parsed2.body);
  const body2 = stringifyBlocksToBody(blocks2);
  const cycle2 = stringifyMDX(parsed2.metadata, parsed2.imports, body2, parsed2.exports);

  const parsed3 = parseMDX(cycle2);
  const blocks3 = parseBodyToBlocks(parsed3.body);
  const body3 = stringifyBlocksToBody(blocks3);
  const cycle3 = stringifyMDX(parsed3.metadata, parsed3.imports, body3, parsed3.exports);

  return { originalContent, cycle1, cycle2, cycle3 };
}

describe('MDX Round-Trip Auditor', () => {
  it('performs deterministic audits and produces stable reports', () => {
    const report1 = runAudit();
    const report2 = runAudit();

    // Determinism: stable counts and total files
    expect(report1.totalFiles).toBe(report2.totalFiles);
    expect(report1.counts).toEqual(report2.counts);
    expect(report1.files).toHaveLength(report2.files.length);

    // Order: lexicographical
    const paths1 = report1.files.map(f => f.path);
    const pathsSorted = [...paths1].sort();
    expect(paths1).toEqual(pathsSorted);

    // Stable hashes across runs
    for (let i = 0; i < report1.files.length; i++) {
      expect(report1.files[i].originalHash).toBe(report2.files[i].originalHash);
      expect(report1.files[i].cycle1Hash).toBe(report2.files[i].cycle1Hash);
    }
  });

  it('correctly maps relative paths and prevents absolute path leaks', () => {
    const report = runAudit();
    for (const file of report.files) {
      expect(file.path.startsWith('src/')).toBe(true);
      expect(path.isAbsolute(file.path)).toBe(false);
    }
    expect(report.corpusRoot).toBe('src/database/content');
  });

  it('detects known JSX problems, object/array props, and indentation drift on the regression fixtures', () => {
    const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures/editor');

    // Helper to load fixture content
    const loadFixture = (name: string) => fs.readFileSync(path.join(fixturesDir, name), 'utf8');

    // 1. Nested components test (nested-components.mdx)
    const nestedRes = executeCycles(loadFixture('nested-components.mdx'));
    expect(nestedRes.originalContent).not.toBe(nestedRes.cycle1);

    // 2. Object prop test (object-prop.mdx)
    const objRes = executeCycles(loadFixture('object-prop.mdx'));
    expect(objRes.originalContent).not.toBe(objRes.cycle1);

    // 3. Array prop test (array-prop.mdx)
    const arrRes = executeCycles(loadFixture('array-prop.mdx'));
    expect(arrRes.originalContent).not.toBe(arrRes.cycle1);

    // 4. Repeated indentation drift (repeated-indentation.mdx)
    const indentRes = executeCycles(loadFixture('repeated-indentation.mdx'));
    expect(indentRes.originalContent).not.toBe(indentRes.cycle1);

    // 5. Imports and exports (imports-exports.mdx)
    const impExpRes = executeCycles(loadFixture('imports-exports.mdx'));
    expect(impExpRes.originalContent).not.toBe(impExpRes.cycle1);
  });

  it('preserves clean corpus state and does not write files during audit', () => {
    const repoRoot = process.cwd();
    const corpusDir = path.join(repoRoot, 'src/database/content');
    
    // Get initial file modification times
    const list = fs.readdirSync(corpusDir);
    const mtimesBefore: Record<string, number> = {};
    for (const file of list) {
      const filePath = path.join(corpusDir, file);
      if (fs.statSync(filePath).isFile()) {
        mtimesBefore[filePath] = fs.statSync(filePath).mtimeMs;
      }
    }

    // Run audit
    runAudit();

    // Verify mtimes are identical
    for (const file of list) {
      const filePath = path.join(corpusDir, file);
      if (fs.statSync(filePath).isFile()) {
        expect(fs.statSync(filePath).mtimeMs).toBe(mtimesBefore[filePath]);
      }
    }
  });
});
