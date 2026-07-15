import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  parseGraphWorkerRequest,
  type GraphWorkerOutput,
  type GraphWorkerResponse,
} from '@/features/graph/lib/graphWorkerContract';

class FakeWorker {
  static readonly instances: FakeWorker[] = [];

  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  readonly postedMessages: unknown[] = [];

  constructor() {
    FakeWorker.instances.push(this);
  }

  postMessage(message: unknown): void {
    this.postedMessages.push(message);
  }

  terminate(): void {
    return;
  }

  emitMessage(response: GraphWorkerResponse): void {
    this.onmessage?.(new MessageEvent('message', { data: response }));
  }
}

function makeOutput(id: string): GraphWorkerOutput {
  return {
    nodes: [{
      id,
      type: 'mathNode',
      position: { x: 0, y: 0 },
      data: {
        label: id,
        nodeType: 'axioma',
        description: '',
        isActive: true,
        scale: 1,
        isHighlighted: false,
      },
      width: 150,
      height: 150,
      style: {},
    }],
    edges: [],
    adjacency: { [id]: [] },
    activeStates: { [id]: true },
    dependsOn: { [id]: [] },
  };
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe('GraphStore worker coordination', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    FakeWorker.instances.splice(0);
    vi.stubGlobal('Worker', FakeWorker);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('preserves the existing public consumer shape and applies a valid result', async () => {
    const { useGraphStore } = await import('@/features/graph/GraphStore');
    const initial = useGraphStore.getState();

    expect(initial).toEqual(expect.objectContaining({
      baseNodes: [],
      edges: [],
      adjacency: {},
      dependsOn: {},
      activeStates: {},
      disabledAxioms: [],
      isLoading: true,
      toggleAxiom: expect.any(Function),
      setActiveAxioms: expect.any(Function),
      toggleModel: expect.any(Function),
      toggleSystem: expect.any(Function),
      initWorker: expect.any(Function),
      getAdjacency: expect.any(Function),
      getDependsOn: expect.any(Function),
    }));

    initial.initWorker();
    const worker = FakeWorker.instances[0];
    const parsedRequest = parseGraphWorkerRequest(worker.postedMessages[0]);
    expect(parsedRequest.ok).toBe(true);
    if (!parsedRequest.ok) return;

    worker.emitMessage({
      type: 'initialized',
      requestId: parsedRequest.value.requestId,
      result: makeOutput('latest'),
    });
    await flushPromises();

    expect(useGraphStore.getState()).toEqual(expect.objectContaining({
      baseNodes: expect.arrayContaining([
        expect.objectContaining({ id: 'latest' }),
      ]),
      isLoading: false,
      status: 'success',
      error: null,
    }));
  });

  it('keeps the layout cached and coalesces rapid logical evaluations', async () => {
    const { useGraphStore } = await import('@/features/graph/GraphStore');
    useGraphStore.getState().initWorker();

    const worker = FakeWorker.instances[0];
    const initialization = parseGraphWorkerRequest(worker.postedMessages[0]);
    expect(initialization.ok).toBe(true);
    if (!initialization.ok) return;

    worker.emitMessage({
      type: 'initialized',
      requestId: initialization.value.requestId,
      result: makeOutput('stable-layout'),
    });
    await flushPromises();

    useGraphStore.getState().toggleAxiom('axioma-incidencia-1');
    await flushPromises();
    useGraphStore.getState().toggleAxiom('axioma-incidencia-2');

    expect(worker.postedMessages).toHaveLength(2);
    const firstEvaluation = parseGraphWorkerRequest(worker.postedMessages[1]);
    expect(firstEvaluation.ok).toBe(true);
    if (!firstEvaluation.ok) return;
    expect(firstEvaluation.value.type).toBe('evaluate-graph');
    expect(firstEvaluation.value.payload).not.toHaveProperty('graphData');

    worker.emitMessage({
      type: 'evaluated',
      requestId: firstEvaluation.value.requestId,
      result: { changedActiveStates: { 'axioma-incidencia-1': false } },
    });
    await flushPromises();

    expect(worker.postedMessages).toHaveLength(3);
    const latestEvaluation = parseGraphWorkerRequest(worker.postedMessages[2]);
    expect(latestEvaluation.ok).toBe(true);
    if (!latestEvaluation.ok) return;
    expect(latestEvaluation.value).toEqual(expect.objectContaining({
      type: 'evaluate-graph',
      payload: {
        disabledAxioms: expect.arrayContaining([
          'axioma-incidencia-1',
          'axioma-incidencia-2',
        ]),
      },
    }));

    worker.emitMessage({
      type: 'evaluated',
      requestId: latestEvaluation.value.requestId,
      result: { changedActiveStates: { 'axioma-incidencia-2': false } },
    });
    await flushPromises();

    expect(useGraphStore.getState().baseNodes.map((node) => node.id)).toEqual(['stable-layout']);
    expect(useGraphStore.getState().activeStates).toEqual(expect.objectContaining({
      'axioma-incidencia-1': false,
      'axioma-incidencia-2': false,
    }));
    expect(useGraphStore.getState().status).toBe('success');
  });

  it('represents the empty universe in the main store without a secondary mode', async () => {
    const { useGraphStore } = await import('@/features/graph/GraphStore');
    const axiomIds = useGraphStore.getState().axioms;

    useGraphStore.getState().setActiveAxioms([]);

    const worker = FakeWorker.instances[0];
    const initialization = parseGraphWorkerRequest(worker.postedMessages[0]);
    expect(initialization.ok).toBe(true);
    if (!initialization.ok || initialization.value.type !== 'initialize-graph') return;

    expect(initialization.value.payload.disabledAxioms).toEqual(axiomIds);
    expect(useGraphStore.getState().inactiveModels).toHaveLength(
      useGraphStore.getState().models.length,
    );
    expect(useGraphStore.getState().inactiveSystems).toHaveLength(
      useGraphStore.getState().systems.length,
    );

    worker.emitMessage({
      type: 'initialized',
      requestId: initialization.value.requestId,
      result: makeOutput('empty-universe'),
    });
    await flushPromises();

    expect(useGraphStore.getState().status).toBe('success');
  });

  it('stores a normalized initialization error and clears loading', async () => {
    const { useGraphStore } = await import('@/features/graph/GraphStore');

    useGraphStore.getState().toggleAxiom('axioma-incidencia-1');
    const worker = FakeWorker.instances[0];
    const request = parseGraphWorkerRequest(worker.postedMessages[0]);
    expect(request.ok).toBe(true);
    if (!request.ok) return;

    worker.emitMessage({
      type: 'error',
      requestId: request.value.requestId,
      error: {
        code: 'COMPUTE_ERROR',
        message: 'initialization failed',
      },
    });
    await flushPromises();

    expect(useGraphStore.getState()).toEqual(expect.objectContaining({
      isLoading: false,
      status: 'error',
      error: {
        code: 'COMPUTE_ERROR',
        message: 'initialization failed',
      },
    }));
  });
});
