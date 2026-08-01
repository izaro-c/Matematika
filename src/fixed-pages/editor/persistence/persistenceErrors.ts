export type PersistenceError =
  | { kind: 'network-error'; cause?: unknown }
  | { kind: 'validation-error'; message: string; details?: unknown }
  | { kind: 'content-conflict'; expectedVersion: string; actualVersion: string }
  | { kind: 'draft-conflict'; expectedVersion: string; actualVersion: string; localRevision: number; editorSessionId: string; reason?: 'base-version-mismatch' | 'revision-source-mismatch' | 'stale-revision' }
  | { kind: 'unauthorized'; message: string }
  | { kind: 'not-found'; message: string }
  | { kind: 'server-error'; status: number; message: string }
  | { kind: 'invalid-response'; message: string; payload?: unknown }
  | { kind: 'protocol-error'; message: string; details?: unknown }
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
