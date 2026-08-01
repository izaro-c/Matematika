import type { EditorApiClient } from './editorApiClient';
import { PersistenceFailure } from './persistenceErrors';
import type { EditorFileIdentity, EditorSaveSnapshot, RestoreBackupRequest } from './persistenceContracts';
import { hashSource } from './revision';

function protocol(message: string, details: unknown): never {
  throw new PersistenceFailure({ kind: 'protocol-error', message, details });
}

function versionForHash(hash: string): string { return `sha256:${hash}`; }

export class ContentRepository {
  constructor(private readonly client: EditorApiClient) {}
  async read(file: EditorFileIdentity, signal?: AbortSignal) {
    const response = await this.client.readContent(file, signal);
    const actualHash = await hashSource(response.source);
    if (response.path !== file.path || response.sourceHash !== actualHash || response.version !== versionForHash(actualHash)) {
      protocol('Read response is not coherent with the requested source', response);
    }
    return response;
  }
  async apply(snapshot: EditorSaveSnapshot, signal?: AbortSignal) {
    const actualHash = await hashSource(snapshot.source);
    if (snapshot.sourceHash !== actualHash) protocol('Save snapshot hash does not match its source', snapshot);
    const response = await this.client.applyContent({
      path: snapshot.file.path, source: snapshot.source, sourceHash: snapshot.sourceHash,
      expectedVersion: snapshot.baseVersion, localRevision: snapshot.localRevision
    }, signal);
    if (response.path !== snapshot.file.path || response.confirmedRevision !== snapshot.localRevision
      || response.sourceHash !== snapshot.sourceHash || response.previousVersion !== snapshot.baseVersion
      || response.version !== versionForHash(snapshot.sourceHash)) {
      protocol('Apply response does not match requested snapshot', response);
    }
    return response;
  }
  async restore(request: RestoreBackupRequest, signal?: AbortSignal) {
    const response = await this.client.restoreBackup(request, signal);
    if (response.path !== request.path || response.restoredBackupId !== request.backupId) {
      protocol('Restore response does not match request', response);
    }
    if (response.previousVersion !== request.expectedVersion || response.version !== versionForHash(response.sourceHash)) {
      protocol('Restore response has incoherent versions', response);
    }
    return response;
  }
}
