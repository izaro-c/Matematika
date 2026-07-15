export interface GraphWorkerProof {
  id: string;
  dependencies: string[];
}

export interface GraphWorkerNode {
  id: string;
  type: string;
  alternativeGroup?: string;
  subtype?: string;
  title: string;
  description: string;
  proofs: GraphWorkerProof[];
  directDependencies: string[];
}

export interface GraphWorkerStructure {
  topologicalOrder: string[];
  nodes: Record<string, GraphWorkerNode>;
}

export interface FlowNodeData {
  label: string;
  nodeType: string;
  subtype?: string;
  description: string;
  isActive: boolean;
  scale: number;
  isHighlighted: boolean;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FlowNodeData;
  width: number;
  height: number;
  style: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: Record<string, unknown>;
  markerEnd?: Record<string, unknown>;
  data?: { points: Array<{ x: number; y: number }> };
}

export interface GraphWorkerOutput {
  nodes: FlowNode[];
  edges: FlowEdge[];
  adjacency: Record<string, string[]>;
  activeStates: Record<string, boolean>;
  dependsOn: Record<string, string[]>;
}

export interface GraphWorkerEvaluationOutput {
  changedActiveStates: Record<string, boolean>;
}

export interface GraphWorkerInitializeRequest {
  type: 'initialize-graph';
  requestId: number;
  payload: {
    graphData: GraphWorkerStructure;
    disabledAxioms: string[];
  };
}

export interface GraphWorkerEvaluateRequest {
  type: 'evaluate-graph';
  requestId: number;
  payload: {
    disabledAxioms: string[];
  };
}

export type GraphWorkerRequest = GraphWorkerInitializeRequest | GraphWorkerEvaluateRequest;

export type GraphWorkerErrorCode =
  | 'INVALID_REQUEST'
  | 'INCONSISTENT_AXIOMS'
  | 'NOT_INITIALIZED'
  | 'COMPUTE_ERROR'
  | 'WORKER_ERROR'
  | 'TIMEOUT';

export interface GraphWorkerError {
  code: GraphWorkerErrorCode;
  message: string;
}

export interface GraphWorkerInitializedResponse {
  type: 'initialized';
  requestId: number;
  result: GraphWorkerOutput;
}

export interface GraphWorkerEvaluatedResponse {
  type: 'evaluated';
  requestId: number;
  result: GraphWorkerEvaluationOutput;
}

export interface GraphWorkerErrorResponse {
  type: 'error';
  requestId: number | null;
  error: GraphWorkerError;
}

export type GraphWorkerSuccessResponse = GraphWorkerInitializedResponse | GraphWorkerEvaluatedResponse;

export type GraphWorkerResponse = GraphWorkerSuccessResponse | GraphWorkerErrorResponse;

export type GraphWorkerRequestParseResult =
  | { ok: true; value: GraphWorkerRequest }
  | { ok: false; requestId: number | null; error: GraphWorkerError };

const ERROR_CODES = new Set<GraphWorkerErrorCode>([
  'INVALID_REQUEST',
  'INCONSISTENT_AXIOMS',
  'NOT_INITIALIZED',
  'COMPUTE_ERROR',
  'WORKER_ERROR',
  'TIMEOUT',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRequestId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function isGraphWorkerProof(value: unknown): value is GraphWorkerProof {
  return isRecord(value)
    && typeof value.id === 'string'
    && isStringArray(value.dependencies);
}

function isGraphWorkerNode(value: unknown): value is GraphWorkerNode {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.type === 'string'
    && (value.alternativeGroup === undefined || typeof value.alternativeGroup === 'string')
    && (value.subtype === undefined || typeof value.subtype === 'string')
    && typeof value.title === 'string'
    && typeof value.description === 'string'
    && Array.isArray(value.proofs)
    && value.proofs.every(isGraphWorkerProof)
    && isStringArray(value.directDependencies);
}

export function isGraphWorkerStructure(value: unknown): value is GraphWorkerStructure {
  if (!isRecord(value) || !isStringArray(value.topologicalOrder) || !isRecord(value.nodes)) {
    return false;
  }

  return Object.values(value.nodes).every(isGraphWorkerNode);
}

function isStringArrayRecord(value: unknown): value is Record<string, string[]> {
  return isRecord(value) && Object.values(value).every(isStringArray);
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'boolean');
}

function isFlowNode(value: unknown): value is FlowNode {
  if (!isRecord(value) || !isRecord(value.position) || !isRecord(value.data)) {
    return false;
  }

  return typeof value.id === 'string'
    && typeof value.type === 'string'
    && typeof value.position.x === 'number'
    && typeof value.position.y === 'number'
    && typeof value.data.label === 'string'
    && typeof value.data.nodeType === 'string'
    && typeof value.data.description === 'string'
    && typeof value.data.isActive === 'boolean'
    && typeof value.data.scale === 'number'
    && typeof value.data.isHighlighted === 'boolean'
    && typeof value.width === 'number'
    && typeof value.height === 'number'
    && isRecord(value.style);
}

function isFlowEdge(value: unknown): value is FlowEdge {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.source === 'string'
    && typeof value.target === 'string';
}

export function isGraphWorkerOutput(value: unknown): value is GraphWorkerOutput {
  return isRecord(value)
    && Array.isArray(value.nodes)
    && value.nodes.every(isFlowNode)
    && Array.isArray(value.edges)
    && value.edges.every(isFlowEdge)
    && isStringArrayRecord(value.adjacency)
    && isBooleanRecord(value.activeStates)
    && isStringArrayRecord(value.dependsOn);
}

export function isGraphWorkerEvaluationOutput(value: unknown): value is GraphWorkerEvaluationOutput {
  return isRecord(value) && isBooleanRecord(value.changedActiveStates);
}

export function normalizeGraphWorkerError(
  error: unknown,
  code: GraphWorkerErrorCode = 'COMPUTE_ERROR',
): GraphWorkerError {
  if (isGraphWorkerError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return { code, message: error.message || 'Unknown graph worker error' };
  }

  if (typeof error === 'string' && error.length > 0) {
    return { code, message: error };
  }

  if (isRecord(error) && typeof error.message === 'string' && error.message.length > 0) {
    return { code, message: error.message };
  }

  return { code, message: 'Unknown graph worker error' };
}

export function isGraphWorkerError(value: unknown): value is GraphWorkerError {
  return isRecord(value)
    && typeof value.code === 'string'
    && ERROR_CODES.has(value.code as GraphWorkerErrorCode)
    && typeof value.message === 'string';
}

export function createGraphWorkerInitializeRequest(
  requestId: number,
  graphData: GraphWorkerStructure,
  disabledAxioms: string[],
): GraphWorkerInitializeRequest {
  return {
    type: 'initialize-graph',
    requestId,
    payload: { graphData, disabledAxioms },
  };
}

export function createGraphWorkerEvaluateRequest(
  requestId: number,
  disabledAxioms: string[],
): GraphWorkerEvaluateRequest {
  return {
    type: 'evaluate-graph',
    requestId,
    payload: { disabledAxioms },
  };
}

export function parseGraphWorkerRequest(value: unknown): GraphWorkerRequestParseResult {
  const requestId = isRecord(value) && isRequestId(value.requestId)
    ? value.requestId
    : null;

  if (
    !isRecord(value)
    || (value.type !== 'initialize-graph' && value.type !== 'evaluate-graph')
    || requestId === null
    || !isRecord(value.payload)
    || !isStringArray(value.payload.disabledAxioms)
  ) {
    return {
      ok: false,
      requestId,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid graph worker request',
      },
    };
  }

  if (value.type === 'initialize-graph') {
    if (!isGraphWorkerStructure(value.payload.graphData)) {
      return {
        ok: false,
        requestId,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid graph worker request',
        },
      };
    }

    return {
      ok: true,
      value: {
        type: 'initialize-graph',
        requestId,
        payload: {
          graphData: value.payload.graphData,
          disabledAxioms: value.payload.disabledAxioms,
        },
      },
    };
  }

  return {
    ok: true,
    value: {
      type: 'evaluate-graph',
      requestId,
      payload: { disabledAxioms: value.payload.disabledAxioms },
    },
  };
}

export function parseGraphWorkerResponse(value: unknown): GraphWorkerResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    value.type === 'initialized'
    && isRequestId(value.requestId)
    && isGraphWorkerOutput(value.result)
  ) {
    return {
      type: 'initialized',
      requestId: value.requestId,
      result: value.result,
    };
  }

  if (
    value.type === 'evaluated'
    && isRequestId(value.requestId)
    && isGraphWorkerEvaluationOutput(value.result)
  ) {
    return {
      type: 'evaluated',
      requestId: value.requestId,
      result: value.result,
    };
  }

  let errorRequestId: number | null | undefined;
  if (value.requestId === null) {
    errorRequestId = null;
  } else if (isRequestId(value.requestId)) {
    errorRequestId = value.requestId;
  }

  if (
    value.type === 'error'
    && errorRequestId !== undefined
    && isGraphWorkerError(value.error)
  ) {
    return {
      type: 'error',
      requestId: errorRequestId,
      error: value.error,
    };
  }

  return null;
}
