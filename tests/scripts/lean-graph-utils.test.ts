import { describe, it, expect } from 'vitest';
import {
  compareLeanGraphToContent,
  extractLeanArtifacts,
  validateLeanDeclarationNames,
  type ContentMetadataEntry,
  type LeanGraph,
  type LogicalGraphStructure,
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
        status: 'bridge',
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

  it('requires theorem declarations to cover dependencies from the logical graph', () => {
    const logicalGraph: LogicalGraphStructure = {
      nodes: {
        'teorema-congruencia-ala': {
          directDependencies: ['angulo'],
          proofs: [{ id: 'demo-congruencia-ala', dependencies: ['axioma-congruencia-5'] }],
        },
      },
    };
    const content = new Map([
      ['teorema-congruencia-ala', entry('teorema-congruencia-ala', {
        leanId: 'Matematika.Geometry.congruence_ala',
      })],
    ]);

    const issues = compareLeanGraphToContent(graph, content, proofBlocks, logicalGraph);
    expect(issues.map(issue => issue.code)).toContain('dependency-divergence');
  });

  it('requires sources and an axiom system for Lean-linked axioms', () => {
    const axiomGraph: LeanGraph = {
      generatedAt: null,
      nodes: [{
        matematikaId: 'axioma-test',
        leanId: 'Matematika.Geometry.Hilbert.test',
        kind: 'axiom',
        status: 'axiomatic',
        declaredDeps: [],
        proofIds: [],
      }],
    };
    const content = new Map([
      ['axioma-test', entry('axioma-test', {
        type: 'axioma',
        leanId: 'Matematika.Geometry.Hilbert.test',
      })],
    ]);

    const issues = compareLeanGraphToContent(axiomGraph, content);
    expect(issues.map(issue => issue.code)).toContain('missing-source');
    expect(issues.map(issue => issue.code)).toContain('missing-axiom-system');
  });

  it('rejects hypothesis prose embedded in an initial Formula block', () => {
    const content = new Map([
      ['teorema-congruencia-ala', {
        ...entry('teorema-congruencia-ala', {
          type: 'teorema',
          leanId: 'Matematika.Geometry.congruence_ala',
          sources: [{ title: 'Greenberg' }],
        }),
        content: '<Formula>\n$$ \\text{Sean } A \\text{ Entonces } B $$\n</Formula>',
      }],
    ]);

    const issues = compareLeanGraphToContent(graph, content);
    expect(issues.map(issue => issue.code)).toContain('mixed-statement-formula');
  });

  it('requires mapped proof steps to pass their Lean blocks to ProofStep', () => {
    const content = new Map([
      ['teorema-congruencia-ala', entry('teorema-congruencia-ala', {
        leanId: 'Matematika.Geometry.congruence_ala',
        sources: [{ title: 'Greenberg' }],
      })],
      ['demo-congruencia-ala', {
        ...entry('demo-congruencia-ala', {
          type: 'demostracion',
          leanId: 'Matematika.Geometry.congruence_ala',
          sources: [{ title: 'Greenberg' }],
          stepTacticMap: { '1': ['ala-step1-transport'] },
        }),
        content: '<ProofStep number={1} title="Transporte">Contenido</ProofStep>',
      }],
    ]);

    const issues = compareLeanGraphToContent(graph, content, proofBlocks);
    expect(issues.map(issue => issue.code)).toContain('missing-step-tactic-binding');
  });

  it('extracts Lean annotations and proof blocks', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-lean-'));
    const leanDir = path.join(root, 'lean', 'Matematika');
    fs.mkdirSync(leanDir, { recursive: true });
    fs.writeFileSync(
      path.join(leanDir, 'Pilot.lean'),
      [
        '-- @matematika-id "teorema-test" @lean-id "Matematika.Pilot.test" @kind "theorem" @status "proved" @deps ["axioma-test"]',
        'theorem test : True := by',
        '  -- @tactic-block-start "test-step"',
        '  trivial',
        '  -- @tactic-block-end "test-step"',
      ].join('\n'),
      'utf-8',
    );

    const artifacts = extractLeanArtifacts(path.join(root, 'lean'), root);
    expect(artifacts.graph.nodes[0].leanId).toBe('Matematika.Pilot.test');
    expect(artifacts.graph.nodes[0].status).toBe('proved');
    expect(artifacts.graph.nodes[0].proofIds).toEqual(['test-step']);
    expect(artifacts.proofBlocks.blocks[0].code).toContain('trivial');
  });

  it('reports annotated declarations missing from Lean\'s compiled environment', () => {
    expect(
      validateLeanDeclarationNames(graph.nodes, new Set()),
    ).toEqual(['Matematika.Geometry.congruence_ala']);
    expect(
      validateLeanDeclarationNames(
        graph.nodes,
        new Set(['Matematika.Geometry.congruence_ala']),
      ),
    ).toEqual([]);
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
      JSON.stringify({ nodes: [{ leanId: 'Matematika.Pilot.test', matematikaId: 'teorema-test', status: 'bridge' }] }),
      'utf-8',
    );

    const index = generateContentIndex({
      contentDir,
      outputPath: path.join(root, 'contentIndex.json'),
      leanGraphPath,
    });

    expect(index['teorema-test'].metadata.leanVerified).toBe(true);
    expect(index['teorema-test'].metadata.formalizationStatus).toBe('bridge');
  });
});
