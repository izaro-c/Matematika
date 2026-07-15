import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createGraphWorkerEvaluateRequest,
  createGraphWorkerInitializeRequest,
  isGraphWorkerOutput,
  normalizeGraphWorkerError,
  parseGraphWorkerRequest,
  parseGraphWorkerResponse,
  type GraphWorkerOutput,
  type GraphWorkerStructure,
} from '@/features/graph/lib/graphWorkerContract';
import { processGraphWorkerMessage } from '@/features/graph/graph.worker';

const graphData: GraphWorkerStructure = {
  topologicalOrder: ['axioma-uno', 'teorema-uno'],
  nodes: {
    'axioma-uno': {
      id: 'axioma-uno',
      type: 'axioma',
      title: 'Axioma uno',
      description: 'Axioma de prueba.',
      proofs: [],
      directDependencies: [],
    },
    'teorema-uno': {
      id: 'teorema-uno',
      type: 'teorema',
      title: 'Teorema uno',
      description: 'Teorema de prueba.',
      proofs: [{ id: 'demostracion-uno', dependencies: ['axioma-uno'] }],
      directDependencies: [],
    },
  },
};

const output: GraphWorkerOutput = {
  nodes: [],
  edges: [],
  adjacency: {},
  activeStates: {},
  dependsOn: {},
};

describe('graph worker message contract', () => {
  it('initializes once and returns only logical changes on later evaluations', async () => {
    const initialization = createGraphWorkerInitializeRequest(7, graphData, []);
    const parsedInitialization = parseGraphWorkerRequest(initialization);
    const initialized = await processGraphWorkerMessage(initialization);

    expect(parsedInitialization).toEqual({ ok: true, value: initialization });
    expect(initialized.type).toBe('initialized');
    expect(initialized.requestId).toBe(7);
    if (initialized.type === 'initialized') {
      expect(isGraphWorkerOutput(initialized.result)).toBe(true);
      expect(initialized.result.nodes.map((node) => node.id)).toEqual([
        'axioma-uno',
        'teorema-uno',
      ]);
    }

    const evaluation = createGraphWorkerEvaluateRequest(8, ['axioma-uno']);
    const parsedEvaluation = parseGraphWorkerRequest(evaluation);
    const evaluated = await processGraphWorkerMessage(evaluation);

    expect(parsedEvaluation).toEqual({ ok: true, value: evaluation });
    expect(evaluation.payload).not.toHaveProperty('graphData');
    expect(evaluated).toEqual({
      type: 'evaluated',
      requestId: 8,
      result: {
        changedActiveStates: {
          'axioma-uno': false,
          'teorema-uno': false,
        },
      },
    });

    expect(await processGraphWorkerMessage(createGraphWorkerEvaluateRequest(
      9,
      ['axioma-uno'],
    ))).toEqual({
      type: 'evaluated',
      requestId: 9,
      result: { changedActiveStates: {} },
    });
  });

  it('normalizes invalid messages and thrown values into a stable error shape', async () => {
    const response = await processGraphWorkerMessage({
      type: 'initialize-graph',
      requestId: 9,
      payload: { graphData: null, disabledAxioms: [] },
    });

    expect(response).toEqual({
      type: 'error',
      requestId: 9,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid graph worker request',
      },
    });
    expect(normalizeGraphWorkerError('layout failed')).toEqual({
      code: 'COMPUTE_ERROR',
      message: 'layout failed',
    });
  });

  it('rejects malformed worker responses instead of trusting their payload', () => {
    expect(parseGraphWorkerResponse({
      type: 'initialized',
      requestId: 3,
      result: { ...output, nodes: 'not-an-array' },
    })).toBeNull();
    expect(parseGraphWorkerResponse({
      type: 'evaluated',
      requestId: 4,
      result: { changedActiveStates: ['not-a-map'] },
    })).toBeNull();
  });

  it('keeps the pure contract free from DOM and React dependencies', () => {
    const contractPath = path.resolve(
      import.meta.dirname,
      '../../../src/features/graph/lib/graphWorkerContract.ts',
    );
    const source = fs.readFileSync(contractPath, 'utf8');

    expect(source).not.toMatch(/from\s+['"]react|\bwindow\b|\bdocument\b/);
  });
});
