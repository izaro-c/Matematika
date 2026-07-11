import type { EditorApiClient } from './editorApiClient';
import { PersistenceFailure } from './persistenceErrors';
import type { EditorDraftSnapshot, EditorFileIdentity } from './persistenceContracts';

export class DraftRepository {
  constructor(private readonly client: EditorApiClient) {}
  async read(file: EditorFileIdentity, signal?: AbortSignal) {
    const response = await this.client.readDraft(file, signal);
    if (response.path !== file.path) throw new PersistenceFailure({ kind: 'invalid-response', message: 'Draft response path mismatch', payload: response });
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
      throw new PersistenceFailure({ kind: 'invalid-response', message: 'Draft response does not match requested snapshot', payload: response });
    }
    return response;
  }
}
