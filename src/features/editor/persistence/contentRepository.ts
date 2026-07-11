import type { EditorApiClient } from './editorApiClient';
import { PersistenceFailure } from './persistenceErrors';
import type { EditorFileIdentity, EditorSaveSnapshot, RestoreBackupRequest } from './persistenceContracts';

export class ContentRepository {
  constructor(private readonly client: EditorApiClient) {}
  async read(file: EditorFileIdentity, signal?: AbortSignal) {
    const response = await this.client.readContent(file, signal);
    if (response.path !== file.path) throw new PersistenceFailure({ kind: 'invalid-response', message: 'Read response path mismatch', payload: response });
    return response;
  }
  async apply(snapshot: EditorSaveSnapshot, signal?: AbortSignal) {
    const response = await this.client.applyContent({
      path: snapshot.file.path, source: snapshot.source, sourceHash: snapshot.sourceHash,
      expectedVersion: snapshot.baseVersion, localRevision: snapshot.localRevision
    }, signal);
    if (response.path !== snapshot.file.path || response.localRevision !== snapshot.localRevision || response.sourceHash !== snapshot.sourceHash) {
      throw new PersistenceFailure({ kind: 'invalid-response', message: 'Apply response does not match requested snapshot', payload: response });
    }
    return response;
  }
  async restore(request: RestoreBackupRequest, signal?: AbortSignal) {
    const response = await this.client.restoreBackup(request, signal);
    if (response.path !== request.path || response.restoredBackupId !== request.backupId) {
      throw new PersistenceFailure({ kind: 'invalid-response', message: 'Restore response does not match request', payload: response });
    }
    return response;
  }
}
