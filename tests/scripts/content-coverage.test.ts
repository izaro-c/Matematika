import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateContentCoverage } from '../../scripts/core/generate-content-coverage.ts';

describe('generateContentCoverage', () => {
  it('tracks diagram exports and proof steps', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-coverage-'));
    const contentDir = path.join(root, 'content');
    const demoDir = path.join(contentDir, 'demonstrations');
    fs.mkdirSync(demoDir, { recursive: true });
    fs.writeFileSync(
      path.join(demoDir, 'demo-test.mdx'),
      [
        'export const metadata = {',
        '  "id": "demo-test",',
        '  "type": "demostracion",',
        '  "title": "Demo test",',
        '  "parentTheorem": "teorema-test",',
        '  "hasSimulation": true,',
        '  "sources": [{ "title": "Reference" }]',
        '};',
        'export const Simulation = DemoTest;',
        '<ProofStep number={1}>Paso</ProofStep>',
      ].join('\n'),
      'utf-8',
    );

    const coverage = generateContentCoverage({
      contentDir,
      outputPath: path.join(root, 'contentCoverage.json'),
    });

    expect(coverage.summary.total).toBe(1);
    expect(coverage.summary.demonstrations.total).toBe(1);
    expect(coverage.items[0]).toMatchObject({
      id: 'demo-test',
      diagramStatus: 'exported',
      proofSteps: 1,
    });
  });
});
