import { describe, it, expect } from 'vitest';
import {
  compareLeanGraphToContent,
  extractLeanArtifacts,
  type ContentMetadataEntry,
  type LeanGraph,
  type ProofBlockRegistry,
} from '../../scripts/core/lean-graph-utils.ts';
import { generateContentIndex } from '../../scripts/core/generate-content-index.ts';
import fs from 'fs';
import os from 'os';
import path from 'path';

function entry(id: string, metadata: Record<string, unknown>): ContentMetadataEntry {
  return { id, filePath: `${id}.mdx`, metadata: { id, ...metadata } };
}

describe('Lean graph bridge utilities', () => {
  const graph: LeanGraph = {
    generatedAt: null,
    nodes: [
      {
        matematikaId: 'teorema-congruencia-ala',
        leanId: 'Matematika.Geometry.congruence_ala',
        kind: 'theorem',
        declaredDeps: ['axioma-congruencia-1'],
        proofIds: ['ala-step1-transport'],
      },
    ],
  };

  const proofBlocks: ProofBlockRegistry = {
    generatedAt: null,
    blocks: [
      {
        id: 'ala-step1-transport',
        leanId: 'Matematika.Geometry.congruence_ala',
        sourceFile: 'lean/Matematika/Geometry/Basic.lean',
        startLine: 1,
        endLine: 3,
        code: 'exact h',
      },
    ],
  };

  it('reports missing MDX nodes', () => {
    const issues = compareLeanGraphToContent(graph, new Map(), proofBlocks);
    expect(issues.map(issue => issue.code)).toContain('missing-mdx');
  });

  it('reports leanId mismatches', () => {
    const content = new Map([
      ['teorema-congruencia-ala', entry('teorema-congruencia-ala', { leanId: 'Wrong.Id' })],
    ]);
    const issues = compareLeanGraphToContent(graph, content, proofBlocks);
    expect(issues.map(issue => issue.code)).toContain('lean-id-mismatch');
  });

  it('reports missing proof blocks from stepTacticMap', () => {
    const content = new Map([
      [
        'teorema-congruencia-ala',
        entry('teorema-congruencia-ala', {
          leanId: 'Matematika.Geometry.congruence_ala',
          stepTacticMap: { '1': ['missing-block'] },
        }),
      ],
    ]);
    const issues = compareLeanGraphToContent(graph, content, proofBlocks);
    expect(issues.map(issue => issue.code)).toContain('missing-proof-block');
  });

  it('reports dependencies declared in MDX but absent from Lean graph', () => {
    const content = new Map([
      [
        'teorema-congruencia-ala',
        entry('teorema-congruencia-ala', {
          leanId: 'Matematika.Geometry.congruence_ala',
          requires: ['axioma-congruencia-2'],
        }),
      ],
    ]);
    const issues = compareLeanGraphToContent(graph, content, proofBlocks);
    expect(issues.map(issue => issue.code)).toContain('dependency-divergence');
  });

  it('extracts Lean annotations and proof blocks', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-lean-'));
    const leanDir = path.join(root, 'lean', 'Matematika');
    fs.mkdirSync(leanDir, { recursive: true });
    fs.writeFileSync(
      path.join(leanDir, 'Pilot.lean'),
      [
        '-- @matematika-id "teorema-test" @lean-id "Matematika.Pilot.test" @kind "theorem" @deps ["axioma-test"]',
        'theorem test : True := by',
        '  -- @tactic-block-start "test-step"',
        '  trivial',
        '  -- @tactic-block-end "test-step"',
      ].join('\n'),
      'utf-8',
    );

    const artifacts = extractLeanArtifacts(path.join(root, 'lean'), root);
    expect(artifacts.graph.nodes[0].leanId).toBe('Matematika.Pilot.test');
    expect(artifacts.graph.nodes[0].proofIds).toEqual(['test-step']);
    expect(artifacts.proofBlocks.blocks[0].code).toContain('trivial');
  });
});

describe('generateContentIndex Lean verification', () => {
  it('sets leanVerified when leanId exists in lean_graph.json', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-index-'));
    const contentDir = path.join(root, 'content');
    const theoremDir = path.join(contentDir, 'theorems');
    fs.mkdirSync(theoremDir, { recursive: true });
    fs.writeFileSync(
      path.join(theoremDir, 'teorema-test.mdx'),
      [
        'export const metadata = {',
        '  "id": "teorema-test",',
        '  "type": "teorema",',
        '  "title": "Test",',
        '  "description": "Desc",',
        '  "leanId": "Matematika.Pilot.test"',
        '};',
      ].join('\n'),
      'utf-8',
    );
    const leanGraphPath = path.join(root, 'lean_graph.json');
    fs.writeFileSync(
      leanGraphPath,
      JSON.stringify({ nodes: [{ leanId: 'Matematika.Pilot.test', matematikaId: 'teorema-test' }] }),
      'utf-8',
    );

    const index = generateContentIndex({
      contentDir,
      outputPath: path.join(root, 'contentIndex.json'),
      leanGraphPath,
    });

    expect(index['teorema-test'].metadata.leanVerified).toBe(true);
  });
});
