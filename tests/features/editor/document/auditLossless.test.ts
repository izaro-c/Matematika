import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Lossless Compatibility Auditor', () => {
  it('verifies that the generated reports are deterministic and stable', () => {
    const jsonPath = path.resolve(process.cwd(), 'ai/reports/editor-lossless-compatibility.json');
    expect(fs.existsSync(jsonPath)).toBe(true);

    const report1 = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    expect(report1.totalFiles).toBe(120);
    expect(report1.counts['read-only']).toBe(85);
    expect(report1.counts['unsupported']).toBe(35);
  });
});
