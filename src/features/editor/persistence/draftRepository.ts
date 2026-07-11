import type { EditorApiClient } from './editorApiClient';
import { PersistenceFailure } from './persistenceErrors';
import type { EditorFileIdentity, EditorSaveSnapshot } from './persistenceContracts';

export class DraftRepository {
  constructor(private readonly client: EditorApiClient) {}
  async read(file: EditorFileIdentity, signal?: AbortSignal) {
    const response = await this.client.readDraft(file, signal);
    if (response.path !== file.path) throw new PersistenceFailure({ kind: 'invalid-response', message: 'Draft response path mismatch', payload: response });
    return response;
  }
  async save(snapshot: EditorSaveSnapshot, signal?: AbortSignal) {
    const response = await this.client.saveDraft({
      path: snapshot.file.path, source: snapshot.source, sourceHash: snapshot.sourceHash,
      baseVersion: snapshot.baseVersion, localRevision: snapshot.localRevision
    }, signal);
    if (response.path !== snapshot.file.path || response.localRevision !== snapshot.localRevision ||
        response.sourceHash !== snapshot.sourceHash || response.baseVersion !== snapshot.baseVersion) {
      throw new PersistenceFailure({ kind: 'invalid-response', message: 'Draft response does not match requested snapshot', payload: response });
    }
    return response;
  }
}
