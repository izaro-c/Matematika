import type { EditorApiClient } from './editorApiClient';
import { PersistenceFailure } from './persistenceErrors';
import type { EditorDraftSnapshot, EditorFileIdentity } from './persistenceContracts';
import { hashSource } from './revision';

function protocol(message: string, details: unknown): never {
  throw new PersistenceFailure({ kind: 'protocol-error', message, details });
}

export class DraftRepository {
  constructor(private readonly client: EditorApiClient) {}
  async read(file: EditorFileIdentity, signal?: AbortSignal) {
    const response = await this.client.readDraft(file, signal);
    const actualHash = await hashSource(response.source);
    const expectedStatus = response.baseVersion === response.currentVersion ? 'current' : 'stale';
    if (response.path !== file.path || response.sourceHash !== actualHash || response.status !== expectedStatus) {
      protocol('Draft response is semantically incoherent', response);
    }
    return response;
  }
  async save(snapshot: EditorDraftSnapshot, signal?: AbortSignal) {
    const response = await this.client.saveDraft({
      path: snapshot.file.path, source: snapshot.source, sourceHash: snapshot.sourceHash,
      baseVersion: snapshot.baseVersion, localRevision: snapshot.localRevision, editorSessionId: snapshot.editorSessionId
    }, signal);
    if (response.disposition === 'ignored-stale') {
      throw new PersistenceFailure({ kind: 'stale-draft', latestRevision: response.localRevision,
        editorSessionId: response.editorSessionId });
    }
    if (response.path !== snapshot.file.path || response.localRevision !== snapshot.localRevision ||
        response.sourceHash !== snapshot.sourceHash || response.baseVersion !== snapshot.baseVersion ||
        response.editorSessionId !== snapshot.editorSessionId) {
      protocol('Draft response does not match requested snapshot', response);
    }
    return response;
  }
}
