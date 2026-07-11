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
      baseVersion: contentVersion('original'), localRevision: 4 });
    expect(saved).toMatchObject({ path: relativePath, sourceHash: contentHash(source), baseVersion: contentVersion('original'), localRevision: 4 });
    await expect(service.readDraft(relativePath)).resolves.toMatchObject({ source: 'draft', localRevision: 4 });
    await expect(fs.promises.readFile(file, 'utf8')).resolves.toBe('original');
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
});
