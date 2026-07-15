import {
  createGraphWorkerEvaluateRequest,
  createGraphWorkerInitializeRequest,
  normalizeGraphWorkerError,
  parseGraphWorkerResponse,
} from './graphWorkerContract';
import type {
  GraphWorkerError,
  GraphWorkerEvaluationOutput,
  GraphWorkerOutput,
  GraphWorkerRequest,
  GraphWorkerStructure,
  GraphWorkerSuccessResponse,
} from './graphWorkerContract';

const WORKER_TIMEOUT_MS = 15_000;

interface PendingRequest {
  resolve: (value: GraphWorkerSuccessResponse) => void;
  reject: (error: GraphWorkerError) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

/**
 * Frontera tipada con el Web Worker del grafo.
 *
 * Se ocupa exclusivamente del ciclo de vida, timeouts y validación de mensajes.
 * La política de coalescencia y la publicación de estado pertenecen al store.
 */
export class GraphWorkerClient {
  private worker: Worker | null = null;
  private requestCounter = 0;
  private readonly pendingRequests = new Map<number, PendingRequest>();

  async initialize(
    graphData: GraphWorkerStructure,
    disabledAxioms: string[],
  ): Promise<GraphWorkerOutput> {
    const response = await this.dispatch(createGraphWorkerInitializeRequest(
      this.nextRequestId(),
      graphData,
      disabledAxioms,
    ));

    if (response.type !== 'initialized') {
      throw new Error('Graph worker returned an evaluation during initialization');
    }
    return response.result;
  }

  async evaluate(disabledAxioms: string[]): Promise<GraphWorkerEvaluationOutput> {
    const response = await this.dispatch(createGraphWorkerEvaluateRequest(
      this.nextRequestId(),
      disabledAxioms,
    ));

    if (response.type !== 'evaluated') {
      throw new Error('Graph worker returned an initialization during evaluation');
    }
    return response.result;
  }

  private nextRequestId(): number {
    this.requestCounter += 1;
    return this.requestCounter;
  }

  private settle(requestId: number): PendingRequest | undefined {
    const pending = this.pendingRequests.get(requestId);
    if (pending) {
      clearTimeout(pending.timeoutId);
      this.pendingRequests.delete(requestId);
    }
    return pending;
  }

  private reset(error: GraphWorkerError): void {
    for (const [requestId, pending] of this.pendingRequests) {
      clearTimeout(pending.timeoutId);
      pending.reject(error);
      this.pendingRequests.delete(requestId);
    }
    this.worker?.terminate();
    this.worker = null;
  }

  private getWorker(): Worker | null {
    if (typeof window === 'undefined') return null;
    if (this.worker) return this.worker;

    this.worker = new Worker(new URL('../graph.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event: MessageEvent<unknown>) => {
      const response = parseGraphWorkerResponse(event.data);
      if (!response) {
        this.reset({ code: 'WORKER_ERROR', message: 'Invalid graph worker response' });
        return;
      }

      if (response.type === 'error') {
        if (response.requestId === null) {
          this.reset(response.error);
          return;
        }
        this.settle(response.requestId)?.reject(response.error);
        return;
      }

      this.settle(response.requestId)?.resolve(response);
    };
    this.worker.onerror = (event: ErrorEvent) => {
      this.reset(normalizeGraphWorkerError(event, 'WORKER_ERROR'));
    };
    this.worker.onmessageerror = () => {
      this.reset({
        code: 'WORKER_ERROR',
        message: 'Graph worker response could not be deserialized',
      });
    };
    return this.worker;
  }

  private async dispatch(request: GraphWorkerRequest): Promise<GraphWorkerSuccessResponse> {
    const worker = this.getWorker();
    if (!worker) {
      const { processGraphWorkerMessage } = await import('../graph.worker');
      const response = await processGraphWorkerMessage(request);
      if (response.type === 'error') throw response.error;
      return response;
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.reset({
          code: 'TIMEOUT',
          message: `Graph worker request ${request.requestId} timed out`,
        });
      }, WORKER_TIMEOUT_MS);

      this.pendingRequests.set(request.requestId, { resolve, reject, timeoutId });
      try {
        worker.postMessage(request);
      } catch (error: unknown) {
        this.settle(request.requestId);
        reject(normalizeGraphWorkerError(error, 'WORKER_ERROR'));
      }
    });
  }
}

export const graphWorkerClient = new GraphWorkerClient();
