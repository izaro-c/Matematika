import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { validateBridgePhase } from '../../scripts/core/validate-bridge-phase.ts';

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

describe('validateBridgePhase', () => {
  it('passes when coverage is complete and every bridge has explicit debt', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-bridge-'));
    const leanGraphPath = path.join(root, 'lean_graph.json');
    const contentCoveragePath = path.join(root, 'contentCoverage.json');
    const bridgeDebtPath = path.join(root, 'bridge-debt.json');

    writeJson(leanGraphPath, {
      generatedAt: null,
      nodes: [{
        leanId: 'Matematika.Geometry.bridge_test',
        matematikaId: 'teorema-test',
        kind: 'theorem',
        foundation: 'bridge',
        declaredDeps: [],
        proofIds: ['test-step'],
      }],
    });
    writeJson(contentCoveragePath, {
      summary: {
        theoremLike: { total: 1, leanLinked: 1 },
        demonstrations: { total: 1, leanLinked: 1, withMappedProofSteps: 1 },
      },
    });
    writeJson(bridgeDebtPath, {
      version: 1,
      policy: 'test',
      entries: [{
        matematikaId: 'teorema-test',
        leanId: 'Matematika.Geometry.bridge_test',
        targetStatus: 'lean-checked',
        priority: 'P0',
        strategy: 'Replace the bridge with a direct proof.',
        blockedBy: [],
      }],
    });

    expect(validateBridgePhase({ leanGraphPath, contentCoveragePath, bridgeDebtPath })).toEqual([]);
  });

  it('fails closed mode while bridge declarations remain', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-bridge-closed-'));
    const leanGraphPath = path.join(root, 'lean_graph.json');
    const contentCoveragePath = path.join(root, 'contentCoverage.json');
    const bridgeDebtPath = path.join(root, 'bridge-debt.json');

    writeJson(leanGraphPath, {
      generatedAt: null,
      nodes: [{
        leanId: 'Matematika.Geometry.bridge_test',
        matematikaId: 'teorema-test',
        kind: 'theorem',
        foundation: 'bridge',
        declaredDeps: [],
        proofIds: [],
      }],
    });
    writeJson(contentCoveragePath, {
      summary: {
        theoremLike: { total: 1, leanLinked: 1 },
        demonstrations: { total: 0, leanLinked: 0, withMappedProofSteps: 0 },
      },
    });
    writeJson(bridgeDebtPath, {
      version: 1,
      policy: 'test',
      entries: [{
        matematikaId: 'teorema-test',
        leanId: 'Matematika.Geometry.bridge_test',
        targetStatus: 'lean-checked',
        priority: 'P0',
        strategy: 'Replace the bridge with a direct proof.',
        blockedBy: [],
      }],
    });

    const issues = validateBridgePhase({
      leanGraphPath,
      contentCoveragePath,
      bridgeDebtPath,
      requireClosed: true,
    });

    expect(issues.map(issue => issue.code)).toContain('remaining-bridge');
  });
});
