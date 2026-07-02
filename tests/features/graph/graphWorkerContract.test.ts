import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createGraphWorkerRequest,
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
  it('accepts a valid typed request and produces a matching success response', async () => {
    const request = createGraphWorkerRequest(7, graphData, []);
    const parsedRequest = parseGraphWorkerRequest(request);
    const response = await processGraphWorkerMessage(request);

    expect(parsedRequest).toEqual({ ok: true, value: request });
    expect(response.type).toBe('success');
    expect(response.requestId).toBe(7);
    if (response.type === 'success') {
      expect(isGraphWorkerOutput(response.result)).toBe(true);
      expect(response.result.nodes.map((node) => node.id)).toEqual([
        'axioma-uno',
        'teorema-uno',
      ]);
    }
  });

  it('normalizes invalid messages and thrown values into a stable error shape', async () => {
    const response = await processGraphWorkerMessage({
      type: 'compute-graph',
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
      type: 'success',
      requestId: 3,
      result: { ...output, nodes: 'not-an-array' },
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
