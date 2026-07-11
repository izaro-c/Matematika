import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  ApplyContentRequest, ApplyContentResponse, ReadContentResponse, ReadDraftResponse,
  RestoreBackupRequest, RestoreBackupResponse, SaveDraftRequest, SaveDraftResponse
} from '../../src/features/editor/persistence/persistenceContracts';

export class BackendError extends Error {
  readonly status: number;
  readonly payload: Record<string, unknown>;
  constructor(status: number, payload: Record<string, unknown>) {
    super(String(payload.message ?? `HTTP ${status}`));
    this.status = status;
    this.payload = payload;
  }
}

export interface PersistenceBackendOptions {
  srcRoot: string;
  storageRoot: string;
  allowedRoots: string[];
  readRoots?: string[];
  validateSource(path: string, source: string): void | Promise<void>;
  beforeBackup?: () => void | Promise<void>;
  beforeTempWrite?: () => void | Promise<void>;
}

interface BackupRecord { id: string; path: string; source: string; sourceHash: string; version: string }
interface DraftRecord extends SaveDraftResponse { source: string }

function sourceHash(source: string): string {
  return crypto.createHash('sha256').update(source, 'utf8').digest('hex');
}
function versionOf(source: string): string { return `sha256:${sourceHash(source)}`; }
function inside(candidate: string, root: string): boolean { return candidate === root || candidate.startsWith(`${root}${path.sep}`); }

export interface ResolvedPersistenceTarget {
  file: string;
  lockKey: string;
}

export class EditorPersistenceBackend {
  private readonly backupRoot: string;
  private readonly draftRoot: string;
  private readonly pathLocks = new Map<string, Promise<void>>();

  private readonly options: PersistenceBackendOptions;
  constructor(options: PersistenceBackendOptions) {
    this.options = options;
    this.backupRoot = path.join(options.storageRoot, 'backups');
    this.draftRoot = path.join(options.storageRoot, 'drafts');
  }

  async readContent(relativePath: string): Promise<ReadContentResponse> {
    const target = await this.resolvePersistenceTarget(relativePath, false, this.options.readRoots ?? this.options.allowedRoots);
    let source: string;
    try { source = await fs.promises.readFile(target.file, 'utf8'); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new BackendError(404, { message: 'File not found' });
      throw error;
    }
    return { path: relativePath, source, sourceHash: sourceHash(source), version: versionOf(source) };
  }

  async saveDraft(request: SaveDraftRequest): Promise<SaveDraftResponse> {
    const target = await this.resolvePersistenceTarget(request.path, false);
    return this.withPathLock(target.lockKey, async () => {
      this.assertHash(request.source, request.sourceHash);
      await this.options.validateSource(request.path, request.source);
      const currentVersion = versionOf(await fs.promises.readFile(target.file, 'utf8'));
      if (currentVersion !== request.baseVersion) {
        throw new BackendError(409, { kind: 'draft-conflict', path: request.path,
          expectedVersion: request.baseVersion, actualVersion: currentVersion,
          localRevision: request.localRevision, editorSessionId: request.editorSessionId });
      }

      const directory = this.draftDirectory(target.lockKey);
      const sessionPointer = path.join(directory, `${this.safeId(request.editorSessionId)}.latest.json`);
      const existing = await this.readJsonIfPresent<DraftRecord>(sessionPointer);
      if (existing && request.localRevision < existing.localRevision) {
        return { ...this.draftResponse(existing), disposition: 'ignored-stale' };
      }
      if (existing && request.localRevision === existing.localRevision) {
        if (request.sourceHash !== existing.sourceHash) {
          throw new BackendError(409, {
            kind: 'draft-conflict',
            path: request.path,
            expectedVersion: request.baseVersion,
            actualVersion: currentVersion,
            localRevision: request.localRevision,
            editorSessionId: request.editorSessionId,
            message: 'Same draft revision has different source',
            reason: 'revision-source-mismatch'
          });
        }
        return this.draftResponse(existing);
      }

      await fs.promises.mkdir(path.join(directory, 'revisions'), { recursive: true });
      const draftKey = [request.editorSessionId, request.localRevision, request.sourceHash].join(':');
      const draftId = `draft-${this.safeId(draftKey)}`;
      const record: DraftRecord = { ...request, draftId, disposition: 'accepted', savedAt: new Date().toISOString() };
      await this.writeJsonAtomic(path.join(directory, 'revisions', `${draftId}.json`), record);
      await this.writeJsonAtomic(sessionPointer, record);
      await this.writeJsonAtomic(path.join(directory, 'latest.json'), record);
      return this.draftResponse(record);
    });
  }

  async readDraft(relativePath: string): Promise<ReadDraftResponse> {
    const target = await this.resolvePersistenceTarget(relativePath, false);
    return this.withPathLock(target.lockKey, async () => {
      const currentVersion = versionOf(await fs.promises.readFile(target.file, 'utf8'));
      const record = await this.readJsonIfPresent<DraftRecord>(path.join(this.draftDirectory(target.lockKey), 'latest.json'));
      if (!record) throw new BackendError(404, { message: 'Draft not found' });
      return { ...record, status: record.baseVersion === currentVersion ? 'current' : 'stale', currentVersion };
    });
  }

  async applyContent(request: ApplyContentRequest): Promise<ApplyContentResponse> {
    const target = await this.resolvePersistenceTarget(request.path, false);
    return this.withPathLock(target.lockKey, async () => {
      this.assertHash(request.source, request.sourceHash);
      await this.options.validateSource(request.path, request.source);
      const current = await fs.promises.readFile(target.file, 'utf8');
      const currentVersion = versionOf(current);
      if (currentVersion !== request.expectedVersion) this.conflict(request.path, request.expectedVersion, currentVersion, request.localRevision);
      const backupId = await this.createBackup(request.path, current);
      await this.replaceAtomically(target.file, request.path, request.source);
      await this.removeDraft(target.lockKey);
      return { path: request.path, sourceHash: request.sourceHash, previousVersion: currentVersion,
        version: versionOf(request.source), confirmedRevision: request.localRevision, backupId };
    });
  }

  async createContent(request: Omit<ApplyContentRequest, 'expectedVersion'>): Promise<ApplyContentResponse> {
    const target = await this.resolvePersistenceTarget(request.path, true);
    return this.withPathLock(target.lockKey, async () => {
      this.assertHash(request.source, request.sourceHash);
      await this.options.validateSource(request.path, request.source);
      try {
        await fs.promises.access(target.file);
        this.conflict(request.path, 'missing', versionOf(await fs.promises.readFile(target.file, 'utf8')), request.localRevision);
      } catch (error) {
        if (error instanceof BackendError) throw error;
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      const temporary = path.join(path.dirname(target.file), `.${path.basename(target.file)}.${crypto.randomUUID()}.tmp`);
      try {
        await fs.promises.writeFile(temporary, request.source, { encoding: 'utf8', flag: 'wx' });
        await this.options.validateSource(request.path, await fs.promises.readFile(temporary, 'utf8'));
        await fs.promises.link(temporary, target.file);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'EEXIST') this.conflict(request.path, 'missing', 'file-created-concurrently', request.localRevision);
        throw error;
      } finally {
        await fs.promises.rm(temporary, { force: true }).catch(() => undefined);
      }
      return { path: request.path, sourceHash: request.sourceHash, previousVersion: 'missing', version: versionOf(request.source),
        confirmedRevision: request.localRevision, backupId: `created-${crypto.randomUUID()}` };
    });
  }

  async restoreBackup(request: RestoreBackupRequest): Promise<RestoreBackupResponse> {
    const target = await this.resolvePersistenceTarget(request.path, false);
    return this.withPathLock(target.lockKey, async () => {
      const current = await fs.promises.readFile(target.file, 'utf8');
      const currentVersion = versionOf(current);
      if (currentVersion !== request.expectedVersion) this.conflict(request.path, request.expectedVersion, currentVersion, 0);
      const restored = await this.readBackup(request.backupId);
      const restoredTarget = await this.resolvePersistenceTarget(restored.path, false);
      if (restoredTarget.file !== target.file) throw new BackendError(400, { message: 'Backup does not belong to requested file' });
      await this.options.validateSource(request.path, restored.source);
      const backupId = await this.createBackup(request.path, current);
      await this.replaceAtomically(target.file, request.path, restored.source);
      await this.removeDraft(target.lockKey);
      return { path: request.path, sourceHash: restored.sourceHash, previousVersion: currentVersion,
        version: versionOf(restored.source), backupId, restoredBackupId: request.backupId };
    });
  }

  private async withPathLock<T>(lockKey: string, operation: () => Promise<T>): Promise<T> {
    const key = lockKey.replaceAll('\\', '/');
    const previous = this.pathLocks.get(key) ?? Promise.resolve();
    let release!: () => void;
    const active = new Promise<void>(resolve => { release = resolve; });
    const tail = previous.then(() => active);
    this.pathLocks.set(key, tail);
    await previous;
    try {
      return await operation();
    } finally {
      release();
      if (this.pathLocks.get(key) === tail) this.pathLocks.delete(key);
    }
  }

  private async resolvePersistenceTarget(relativePath: string, allowMissing: boolean, roots = this.options.allowedRoots): Promise<ResolvedPersistenceTarget> {
    if (!relativePath || path.isAbsolute(relativePath) || relativePath.includes('\0') || relativePath.split(/[\\/]+/).includes('..')) {
      throw new BackendError(400, { message: 'Invalid path' });
    }
    if (!['.mdx', '.tsx'].includes(path.extname(relativePath))) throw new BackendError(400, { message: 'Extension not allowed' });
    const absolute = path.resolve(this.options.srcRoot, relativePath);
    const parentDir = path.dirname(absolute);
    let parentReal: string;
    try {
      parentReal = await fs.promises.realpath(parentDir);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new BackendError(404, { message: 'Parent directory not found' });
      throw error;
    }
    if (!roots.some(root => inside(parentReal, path.resolve(root)))) throw new BackendError(403, { message: 'Symlink escapes allowed roots' });

    try {
      const real = await fs.promises.realpath(absolute);
      if (!roots.some(root => inside(real, path.resolve(root)))) throw new BackendError(403, { message: 'Symlink escapes allowed roots' });
      return { file: real, lockKey: real };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        if (!allowMissing) throw new BackendError(404, { message: 'File not found' });
        const normalized = path.join(parentReal, path.basename(absolute));
        return { file: normalized, lockKey: normalized };
      }
      throw error;
    }
  }

  private assertHash(source: string, expected: string): void {
    const actual = sourceHash(source);
    if (actual !== expected) throw new BackendError(400, { message: 'Source hash mismatch', expected, actual });
  }

  private conflict(filePath: string, expectedVersion: string, actualVersion: string, localRevision: number): never {
    throw new BackendError(409, { kind: 'content-conflict', path: filePath, expectedVersion, actualVersion, localRevision });
  }

  private async createBackup(relativePath: string, source: string): Promise<string> {
    await this.options.beforeBackup?.();
    await fs.promises.mkdir(this.backupRoot, { recursive: true });
    const id = crypto.randomUUID();
    const record: BackupRecord = { id, path: relativePath, source, sourceHash: sourceHash(source), version: versionOf(source) };
    await fs.promises.writeFile(path.join(this.backupRoot, `${id}.json`), JSON.stringify(record), { encoding: 'utf8', flag: 'wx' });
    return id;
  }

  private async readBackup(id: string): Promise<BackupRecord> {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new BackendError(400, { message: 'Invalid backup id' });
    try { return JSON.parse(await fs.promises.readFile(path.join(this.backupRoot, `${id}.json`), 'utf8')) as BackupRecord; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new BackendError(404, { message: 'Backup not found' });
      throw error;
    }
  }

  private async replaceAtomically(file: string, relativePath: string, source: string): Promise<void> {
    const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${crypto.randomUUID()}.tmp`);
    try {
      await this.options.beforeTempWrite?.();
      await fs.promises.writeFile(temporary, source, { encoding: 'utf8', flag: 'wx' });
      const temporarySource = await fs.promises.readFile(temporary, 'utf8');
      await this.options.validateSource(relativePath, temporarySource);
      if (temporarySource !== source) throw new BackendError(500, { message: 'Temporary verification mismatch' });
      await fs.promises.rename(temporary, file);
    } catch (error) {
      await fs.promises.rm(temporary, { force: true }).catch(() => undefined);
      throw error;
    }
  }

  private async writeJsonAtomic(file: string, value: unknown): Promise<void> {
    const temporary = `${file}.${crypto.randomUUID()}.tmp`;
    try {
      await fs.promises.writeFile(temporary, JSON.stringify(value), { encoding: 'utf8', flag: 'wx' });
      await fs.promises.rename(temporary, file);
    } catch (error) {
      await fs.promises.rm(temporary, { force: true }).catch(() => undefined);
      throw error;
    }
  }

  private async readJsonIfPresent<T>(file: string): Promise<T | undefined> {
    try { return JSON.parse(await fs.promises.readFile(file, 'utf8')) as T; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
      throw error;
    }
  }

  private safeId(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private draftDirectory(lockKey: string): string {
    return path.join(this.draftRoot, this.safeId(lockKey));
  }

  private draftResponse(record: DraftRecord): SaveDraftResponse {
    const { path: draftPath, draftId, sourceHash: hash, baseVersion, localRevision,
      editorSessionId, disposition, savedAt } = record;
    return { path: draftPath, draftId, sourceHash: hash, baseVersion, localRevision,
      editorSessionId, disposition, savedAt };
  }

  private async removeDraft(lockKey: string): Promise<void> {
    await fs.promises.rm(this.draftDirectory(lockKey), { recursive: true, force: true });
  }
}

export const contentHash = sourceHash;
export const contentVersion = versionOf;
