export type PersistenceError =
  | { kind: 'network-error'; cause?: unknown }
  | { kind: 'validation-error'; message: string; details?: unknown }
  | { kind: 'conflict'; expectedVersion: string; actualVersion: string }
  | { kind: 'unauthorized'; message: string }
  | { kind: 'not-found'; message: string }
  | { kind: 'server-error'; status: number; message: string }
  | { kind: 'invalid-response'; message: string; payload?: unknown }
  | { kind: 'stale-draft'; latestRevision: number; editorSessionId: string }
  | { kind: 'aborted' };

export class PersistenceFailure extends Error {
  constructor(public readonly detail: PersistenceError) {
    super(detail.kind);
    this.name = 'PersistenceFailure';
  }
}

export function asPersistenceError(error: unknown): PersistenceError {
  if (error instanceof PersistenceFailure) return error.detail;
  if (error instanceof DOMException && error.name === 'AbortError') return { kind: 'aborted' };
  return { kind: 'network-error', cause: error };
}
