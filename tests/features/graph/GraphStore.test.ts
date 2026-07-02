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
      type: 'success',
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

  it('ignores an obsolete response and applies the most recent response', async () => {
    const { useGraphStore } = await import('@/features/graph/GraphStore');

    useGraphStore.getState().toggleAxiom('axioma-incidencia-1');
    useGraphStore.getState().toggleAxiom('axioma-incidencia-2');

    const worker = FakeWorker.instances[0];
    const firstRequest = parseGraphWorkerRequest(worker.postedMessages[0]);
    const latestRequest = parseGraphWorkerRequest(worker.postedMessages[1]);
    expect(firstRequest.ok).toBe(true);
    expect(latestRequest.ok).toBe(true);
    if (!firstRequest.ok || !latestRequest.ok) return;

    worker.emitMessage({
      type: 'success',
      requestId: latestRequest.value.requestId,
      result: makeOutput('latest'),
    });
    await flushPromises();
    worker.emitMessage({
      type: 'success',
      requestId: firstRequest.value.requestId,
      result: makeOutput('obsolete'),
    });
    await flushPromises();

    expect(useGraphStore.getState().baseNodes.map((node) => node.id)).toEqual(['latest']);
    expect(useGraphStore.getState().status).toBe('success');
  });

  it('stores a normalized latest-request error and clears loading', async () => {
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
        message: 'layout failed',
      },
    });
    await flushPromises();

    expect(useGraphStore.getState()).toEqual(expect.objectContaining({
      isLoading: false,
      status: 'error',
      error: {
        code: 'COMPUTE_ERROR',
        message: 'layout failed',
      },
    }));
  });
});
