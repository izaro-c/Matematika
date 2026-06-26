import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateContentCoverage } from '../../scripts/core/generate-content-coverage.ts';

describe('generateContentCoverage', () => {
  it('tracks diagram exports, Lean status, proof steps, and mapped Lean blocks', () => {
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
        '  "leanId": "Matematika.Test.demo",',
        '  "sources": [{ "title": "Reference" }],',
        '  "stepTacticMap": { "1": ["test-step"] }',
        '};',
        'export const Simulation = DemoTest;',
        '<ProofStep number={1} leanBlocks={metadata.stepTacticMap["1"]}>Paso</ProofStep>',
      ].join('\n'),
      'utf-8',
    );

    const leanGraphPath = path.join(root, 'lean_graph.json');
    fs.writeFileSync(
      leanGraphPath,
      JSON.stringify({
        generatedAt: null,
        nodes: [{
          leanId: 'Matematika.Test.demo',
          matematikaId: 'demo-test',
          kind: 'theorem',
          verificationStatus: 'lean-checked',
          declaredDeps: [],
          proofIds: ['test-step'],
        }],
      }),
      'utf-8',
    );

    const coverage = generateContentCoverage({
      contentDir,
      leanGraphPath,
      outputPath: path.join(root, 'contentCoverage.json'),
    });

    expect(coverage.summary.total).toBe(1);
    expect(coverage.summary.lean['lean-checked']).toBe(1);
    expect(coverage.summary.demonstrations.withMappedProofSteps).toBe(1);
    expect(coverage.items[0]).toMatchObject({
      id: 'demo-test',
      diagramStatus: 'exported',
      leanVerified: true,
      verificationStatus: 'lean-checked',
      proofSteps: 1,
      mappedProofSteps: ['1'],
    });
  });
});
