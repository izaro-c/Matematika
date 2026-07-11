import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BackendError, EditorPersistenceBackend, contentHash, contentVersion } from '../../../../scripts/editor/editorPersistenceBackend';

const relativePath = 'database/content/test.mdx';
let root: string;
let srcRoot: string;
let contentRoot: string;
let file: string;

function backend(overrides: Partial<ConstructorParameters<typeof EditorPersistenceBackend>[0]> = {}) {
  return new EditorPersistenceBackend({
    srcRoot, storageRoot: path.join(root, 'storage'), allowedRoots: [contentRoot],
    validateSource: (_path, source) => { if (source.includes('INVALID')) throw new BackendError(400, { message: 'Invalid source' }); },
    ...overrides
  });
}
function applyRequest(source: string, expectedVersion = contentVersion('original')) {
  return { path: relativePath, source, sourceHash: contentHash(source), expectedVersion, localRevision: 1 };
}

beforeEach(async () => {
  root = path.join(process.cwd(), '.matematika', `test-editor-persistence-${process.pid}`);
  await fs.promises.rm(root, { recursive: true, force: true });
  srcRoot = path.join(root, 'src');
  contentRoot = path.join(srcRoot, 'database/content');
  file = path.join(contentRoot, 'test.mdx');
  await fs.promises.mkdir(contentRoot, { recursive: true });
  await fs.promises.writeFile(file, 'original', 'utf8');
});
afterEach(async () => fs.promises.rm(root, { recursive: true, force: true }));

describe('EditorPersistenceBackend', () => {
  it('returns source, cryptographic hash and opaque version', async () => {
    await expect(backend().readContent(relativePath)).resolves.toEqual({ path: relativePath, source: 'original',
      sourceHash: contentHash('original'), version: contentVersion('original') });
  });

  it.each([
    ['path traversal', '../secret.mdx'],
    ['absolute path', path.join(path.sep, 'outside', 'secret.mdx')],
    ['extension', 'database/content/secret.json']
  ])('rejects %s', async (_name, candidate) => {
    await expect(backend().readContent(candidate)).rejects.toBeInstanceOf(BackendError);
  });

  it('returns 409 on an obsolete version without modifying the file', async () => {
    await expect(backend().applyContent(applyRequest('new', 'obsolete'))).rejects.toMatchObject({ status: 409 });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
  });

  it('rejects incoherent source hash and invalid source without modifying the file', async () => {
    await expect(backend().applyContent({ ...applyRequest('new'), sourceHash: 'wrong' })).rejects.toMatchObject({ status: 400 });
    await expect(backend().applyContent(applyRequest('INVALID'))).rejects.toMatchObject({ status: 400 });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
  });

  it('backup failure and temporary write failure preserve the original', async () => {
    await expect(backend({ beforeBackup: () => { throw new Error('backup failed'); } }).applyContent(applyRequest('new'))).rejects.toThrow('backup failed');
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
    await expect(backend({ beforeTempWrite: () => { throw new Error('temp failed'); } }).applyContent(applyRequest('new'))).rejects.toThrow('temp failed');
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
  });

  it('validates the temporary and cleans it when validation fails', async () => {
    let validations = 0;
    const service = backend({ validateSource: () => { validations += 1; if (validations === 2) throw new Error('temporary invalid'); } });
    await expect(service.applyContent(applyRequest('new'))).rejects.toThrow('temporary invalid');
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
    expect((await fs.promises.readdir(contentRoot)).filter(name => name.endsWith('.tmp'))).toHaveLength(0);
  });

  it('atomically applies and creates a backup first', async () => {
    const result = await backend().applyContent(applyRequest('new'));
    expect(result).toMatchObject({ previousVersion: contentVersion('original'), version: contentVersion('new'), sourceHash: contentHash('new') });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('new');
    const backup = JSON.parse(await fs.promises.readFile(path.join(root, 'storage/backups', `${result.backupId}.json`), 'utf8'));
    expect(backup).toMatchObject({ path: relativePath, source: 'original' });
  });

  it('allows exactly one of two concurrent applies against the same base version', async () => {
    let release!: () => void;
    const barrier = new Promise<void>(resolve => { release = resolve; });
    let firstArrived!: () => void;
    const firstArrival = new Promise<void>(resolve => { firstArrived = resolve; });
    let blocked = false;
    const service = backend({
      beforeBackup: async () => {
        if (!blocked) {
          blocked = true;
          firstArrived();
          await barrier;
        }
      }
    });

    const first = service.applyContent(applyRequest('client-a'));
    await firstArrival;
    const second = service.applyContent(applyRequest('client-b'));
    await Promise.resolve();
    release();
    const results = await Promise.allSettled([first, second]);
    const fulfilled = results.filter(result => result.status === 'fulfilled');
    const conflicts = results.filter(result => result.status === 'rejected' && result.reason instanceof BackendError && result.reason.status === 409);
    expect(fulfilled).toHaveLength(1);
    expect(conflicts).toHaveLength(1);
    const winner = (fulfilled[0] as PromiseFulfilledResult<Awaited<ReturnType<typeof service.applyContent>>>).value;
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe(winner.sourceHash === contentHash('client-a') ? 'client-a' : 'client-b');
    const backup = JSON.parse(await fs.promises.readFile(path.join(root, 'storage/backups', `${winner.backupId}.json`), 'utf8'));
    expect(backup.source).toBe('original');
    expect((await fs.promises.readdir(contentRoot)).filter(name => name.endsWith('.tmp'))).toHaveLength(0);
  });

  it('allows exactly one of three concurrent applies against the same base version', async () => {
    const service = backend();
    const results = await Promise.allSettled(['a', 'b', 'c'].map(candidate => service.applyContent(applyRequest(candidate))));
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(result => result.status === 'rejected' && result.reason instanceof BackendError
      && result.reason.status === 409)).toHaveLength(2);
  });

  it('does not serialize writes to different paths', async () => {
    const secondPath = 'database/content/second.mdx';
    await fs.promises.writeFile(path.join(contentRoot, 'second.mdx'), 'original', 'utf8');
    let arrivals = 0;
    let release!: () => void;
    const bothArrived = new Promise<void>(resolve => { release = resolve; });
    const service = backend({ beforeBackup: async () => {
      arrivals += 1;
      if (arrivals === 2) release();
      await bothArrived;
    } });
    await Promise.all([
      service.applyContent(applyRequest('first-path')),
      service.applyContent({ ...applyRequest('second-path'), path: secondPath })
    ]);
    expect(arrivals).toBe(2);
  });

  it('releases the path lock after an exception', async () => {
    let attempts = 0;
    const service = backend({ beforeTempWrite: () => {
      attempts += 1;
      if (attempts === 1) throw new Error('first write fails');
    } });
    await expect(service.applyContent(applyRequest('failed'))).rejects.toThrow('first write fails');
    await expect(service.applyContent(applyRequest('recovered'))).resolves.toMatchObject({ version: contentVersion('recovered') });
  });

  it('creates a new TSX atomically and refuses a concurrent overwrite', async () => {
    const target = 'database/content/new.tsx';
    const source = 'export const A = 1;';
    const service = backend();
    await expect(service.createContent({ path: target, source, sourceHash: contentHash(source), localRevision: 0 }))
      .resolves.toMatchObject({ previousVersion: 'missing', version: contentVersion(source) });
    await expect(fs.promises.readFile(path.join(contentRoot, 'new.tsx'), 'utf8')).resolves.toBe(source);
    await expect(service.createContent({ path: target, source: 'other', sourceHash: contentHash('other'), localRevision: 0 }))
      .rejects.toMatchObject({ status: 409 });
  });

  it('stores and recovers a separate revisioned draft without changing the real file', async () => {
    const service = backend();
    const source = 'draft';
    const saved = await service.saveDraft({ path: relativePath, source, sourceHash: contentHash(source),
      baseVersion: contentVersion('original'), localRevision: 4, editorSessionId: 'session-a' });
    expect(saved).toMatchObject({ path: relativePath, sourceHash: contentHash(source), baseVersion: contentVersion('original'), localRevision: 4 });
    await expect(service.readDraft(relativePath)).resolves.toMatchObject({ source: 'draft', localRevision: 4 });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
  });

  it('does not let an older draft completion replace a newer revision', async () => {
    let releaseOld!: () => void;
    const oldBlocked = new Promise<void>(resolve => { releaseOld = resolve; });
    let oldArrived!: () => void;
    const oldArrival = new Promise<void>(resolve => { oldArrived = resolve; });
    const service = backend({ validateSource: async (_path, candidate) => {
      if (candidate === 'draft-old') { oldArrived(); await oldBlocked; }
    } });
    const baseVersion = contentVersion('original');
    const oldSave = service.saveDraft({ path: relativePath, source: 'draft-old', sourceHash: contentHash('draft-old'),
      baseVersion, localRevision: 1, editorSessionId: 'session-a' });
    await oldArrival;
    const newSave = service.saveDraft({ path: relativePath, source: 'draft-new', sourceHash: contentHash('draft-new'),
      baseVersion, localRevision: 2, editorSessionId: 'session-a' });
    await Promise.resolve();
    releaseOld();
    await Promise.all([oldSave, newSave]);
    await expect(service.readDraft(relativePath)).resolves.toMatchObject({ source: 'draft-new', localRevision: 2 });
  });

  it('does not resurrect an in-flight obsolete draft after applying the file', async () => {
    let releaseDraft!: () => void;
    const draftBlocked = new Promise<void>(resolve => { releaseDraft = resolve; });
    let draftArrived!: () => void;
    const draftArrival = new Promise<void>(resolve => { draftArrived = resolve; });
    const service = backend({ validateSource: async (_path, candidate) => {
      if (candidate === 'draft-old') { draftArrived(); await draftBlocked; }
    } });
    const baseVersion = contentVersion('original');
    const oldSave = service.saveDraft({ path: relativePath, source: 'draft-old', sourceHash: contentHash('draft-old'),
      baseVersion, localRevision: 1, editorSessionId: 'session-a' });
    await draftArrival;
    const apply = service.applyContent(applyRequest('applied'));
    await Promise.resolve();
    releaseDraft();
    await Promise.all([oldSave, apply]);
    await expect(service.readDraft(relativePath)).rejects.toMatchObject({ status: 404 });
  });

  it('distinguishes stale, conflicting and cross-session draft revisions', async () => {
    const service = backend();
    const baseVersion = contentVersion('original');
    const request = { path: relativePath, source: 'session-a-r2', sourceHash: contentHash('session-a-r2'),
      baseVersion, localRevision: 2, editorSessionId: 'session-a' };
    await service.saveDraft(request);
    await expect(service.saveDraft({ ...request, source: 'session-a-r1', sourceHash: contentHash('session-a-r1'), localRevision: 1 }))
      .resolves.toMatchObject({ disposition: 'ignored-stale', localRevision: 2 });
    await expect(service.saveDraft({ ...request, source: 'different', sourceHash: contentHash('different') }))
      .rejects.toMatchObject({ status: 409 });
    await expect(service.saveDraft({ ...request, source: 'session-b-r1', sourceHash: contentHash('session-b-r1'),
      localRevision: 1, editorSessionId: 'session-b' })).resolves.toMatchObject({ disposition: 'accepted',
        editorSessionId: 'session-b', localRevision: 1 });
  });

  it('reports a draft as stale when the file version changed externally', async () => {
    const service = backend();
    await service.saveDraft({ path: relativePath, source: 'draft', sourceHash: contentHash('draft'),
      baseVersion: contentVersion('original'), localRevision: 1, editorSessionId: 'session-a' });
    await fs.promises.writeFile(file, 'external', 'utf8');
    await expect(service.readDraft(relativePath)).resolves.toMatchObject({ status: 'stale',
      currentVersion: contentVersion('external') });
  });

  it('restores a backup atomically and backs up the replaced state', async () => {
    const service = backend();
    const applied = await service.applyContent(applyRequest('new'));
    const restored = await service.restoreBackup({ path: relativePath, backupId: applied.backupId, expectedVersion: applied.version });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
    expect(restored).toMatchObject({ restoredBackupId: applied.backupId, previousVersion: applied.version,
      version: contentVersion('original') });
    await expect(fs.promises.access(path.join(root, 'storage/backups', `${restored.backupId}.json`))).resolves.toBeUndefined();
  });

  it('rejects restore with an obsolete version', async () => {
    const service = backend();
    const applied = await service.applyContent(applyRequest('new'));
    await expect(service.restoreBackup({ path: relativePath, backupId: applied.backupId, expectedVersion: 'old' }))
      .rejects.toMatchObject({ status: 409 });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('new');
  });

  it('serializes restore and apply against the same current version', async () => {
    const service = backend();
    const applied = await service.applyContent(applyRequest('base-for-race'));
    const results = await Promise.allSettled([
      service.restoreBackup({ path: relativePath, backupId: applied.backupId, expectedVersion: applied.version }),
      service.applyContent(applyRequest('concurrent-apply', applied.version))
    ]);
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(result => result.status === 'rejected' && result.reason instanceof BackendError
      && result.reason.status === 409)).toHaveLength(1);
  });

  it('handles concurrent applyContent requests using multiple aliases of the same file path', async () => {
    const service = backend();
    const alias1 = 'database/content/test.mdx';
    const alias2 = 'database/content/./test.mdx';
    const alias3 = 'database//content/test.mdx';

    const req1 = { path: alias1, source: 'payload-1', sourceHash: contentHash('payload-1'), expectedVersion: contentVersion('original'), localRevision: 1 };
    const req2 = { path: alias2, source: 'payload-2', sourceHash: contentHash('payload-2'), expectedVersion: contentVersion('original'), localRevision: 1 };
    const req3 = { path: alias3, source: 'payload-3', sourceHash: contentHash('payload-3'), expectedVersion: contentVersion('original'), localRevision: 1 };

    const results = await Promise.allSettled([
      service.applyContent(req1),
      service.applyContent(req2),
      service.applyContent(req3)
    ]);

    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected409 = results.filter(r => r.status === 'rejected' && r.reason instanceof BackendError && r.reason.status === 409);

    expect(fulfilled).toHaveLength(1);
    expect(rejected409).toHaveLength(2);

    const winner = (fulfilled[0] as PromiseFulfilledResult<Awaited<ReturnType<EditorPersistenceBackend['applyContent']>>>).value;
    let expectedSource = 'payload-3';
    if (winner.sourceHash === contentHash('payload-1')) {
      expectedSource = 'payload-1';
    } else if (winner.sourceHash === contentHash('payload-2')) {
      expectedSource = 'payload-2';
    }

    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe(expectedSource);
    await expect(fs.promises.access(path.join(root, 'storage/backups', `${winner.backupId}.json`))).resolves.toBeUndefined();

    const backupsDir = path.join(root, 'storage/backups');
    const backups = await fs.promises.readdir(backupsDir);
    expect(backups.filter(b => b.endsWith('.json'))).toHaveLength(1);

    const contentFiles = await fs.promises.readdir(contentRoot);
    expect(contentFiles.filter(name => name.endsWith('.tmp'))).toHaveLength(0);
  });

  it('serializes restoreBackup and applyContent against same file using aliases', async () => {
    const service = backend();
    const applied = await service.applyContent(applyRequest('base-for-race'));
    const alias1 = 'database/content/test.mdx';
    const alias2 = 'database/content/./test.mdx';

    const results = await Promise.allSettled([
      service.restoreBackup({ path: alias1, backupId: applied.backupId, expectedVersion: applied.version }),
      service.applyContent({ path: alias2, source: 'concurrent-apply', sourceHash: contentHash('concurrent-apply'), expectedVersion: applied.version, localRevision: 2 })
    ]);

    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(r => r.status === 'rejected' && r.reason instanceof BackendError && r.reason.status === 409)).toHaveLength(1);
  });

  it('serializes concurrent write/apply using a symlink alias', async () => {
    const symlinkPath = path.join(contentRoot, 'symlink.mdx');
    await fs.promises.symlink('test.mdx', symlinkPath);

    const service = backend();
    const alias1 = 'database/content/test.mdx';
    const alias2 = 'database/content/symlink.mdx';

    const req1 = { path: alias1, source: 'payload-1', sourceHash: contentHash('payload-1'), expectedVersion: contentVersion('original'), localRevision: 1 };
    const req2 = { path: alias2, source: 'payload-2', sourceHash: contentHash('payload-2'), expectedVersion: contentVersion('original'), localRevision: 1 };

    const results = await Promise.allSettled([
      service.applyContent(req1),
      service.applyContent(req2)
    ]);

    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(r => r.status === 'rejected' && r.reason instanceof BackendError && r.reason.status === 409)).toHaveLength(1);
  });

  it('ensures separate sessions do not delete each other\'s draft revisions and global latest represents the latest accepted draft', async () => {
    const service = backend();
    const baseVersion = contentVersion('original');

    const draftA1 = await service.saveDraft({
      path: relativePath, source: 'draft-a-1', sourceHash: contentHash('draft-a-1'),
      baseVersion, localRevision: 1, editorSessionId: 'session-a'
    });

    const draftB1 = await service.saveDraft({
      path: relativePath, source: 'draft-b-1', sourceHash: contentHash('draft-b-1'),
      baseVersion, localRevision: 1, editorSessionId: 'session-b'
    });

    const draftDir = path.join(root, 'storage/drafts', service['safeId'](file));
    const revisionsDir = path.join(draftDir, 'revisions');
    const files = await fs.promises.readdir(revisionsDir);
    expect(files).toContain(`${draftA1.draftId}.json`);
    expect(files).toContain(`${draftB1.draftId}.json`);

    const latest = await service.readJsonIfPresent<DraftRecord>(path.join(draftDir, 'latest.json'));
    expect(latest).toMatchObject({ editorSessionId: 'session-b', localRevision: 1, source: 'draft-b-1' });

    const draftA2 = await service.saveDraft({
      path: relativePath, source: 'draft-a-2', sourceHash: contentHash('draft-a-2'),
      baseVersion, localRevision: 2, editorSessionId: 'session-a'
    });

    const filesAfterA2 = await fs.promises.readdir(revisionsDir);
    expect(filesAfterA2).toContain(`${draftA2.draftId}.json`);

    const latest2 = await service.readJsonIfPresent<DraftRecord>(path.join(draftDir, 'latest.json'));
    expect(latest2).toMatchObject({ editorSessionId: 'session-a', localRevision: 2, source: 'draft-a-2' });

    const sessionPointerA = path.join(draftDir, `${service['safeId']('session-a')}.latest.json`);
    const sessionPointerB = path.join(draftDir, `${service['safeId']('session-b')}.latest.json`);
    await expect(fs.promises.access(sessionPointerA)).resolves.toBeUndefined();
    await expect(fs.promises.access(sessionPointerB)).resolves.toBeUndefined();
  });
});
