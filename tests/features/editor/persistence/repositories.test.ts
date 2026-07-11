import { describe, expect, it } from 'vitest';
import {
  ContentRepository,
  DraftRepository,
  EditorApiClient,
  PersistenceFailure,
  hashSource,
  type EditorSaveSnapshot
} from '@/features/editor/persistence';

const path = 'database/content/a.mdx';

async function snapshot(): Promise<EditorSaveSnapshot> {
  const source = 'Texto exacto.';
  return { file: { path }, source, sourceHash: await hashSource(source), baseVersion: 'sha256:base', localRevision: 7 };
}

async function expectProtocolFailure(operation: Promise<unknown>) {
  await expect(operation).rejects.toSatisfy((error: unknown) =>
    error instanceof PersistenceFailure && error.detail.kind === 'protocol-error');
}

describe('persistence repositories semantic contracts', () => {
  it.each([
    ['previous version', { previousVersion: 'sha256:wrong' }],
    ['canonical version', { version: 'sha256:wrong' }],
    ['path', { path: 'database/content/other.mdx' }],
    ['revision', { confirmedRevision: 8 }],
    ['source hash', { sourceHash: 'wrong' }]
  ])('rejects an incoherent apply response: %s', async (_name, override) => {
    const value = await snapshot();
    const client = {
      applyContent: async () => ({
        path,
        sourceHash: value.sourceHash,
        previousVersion: value.baseVersion,
        version: `sha256:${value.sourceHash}`,
        confirmedRevision: value.localRevision,
        backupId: 'backup',
        ...override
      })
    } as EditorApiClient;
    await expectProtocolFailure(new ContentRepository(client).apply(value));
  });

  it('rejects read content whose hash and version do not represent its source', async () => {
    const client = { readContent: async () => ({ path, source: 'A', sourceHash: 'wrong', version: 'sha256:wrong' }) } as EditorApiClient;
    await expectProtocolFailure(new ContentRepository(client).read({ path }));
  });

  it('rejects a draft acknowledgement that does not match the complete snapshot', async () => {
    const value = await snapshot();
    const client = { saveDraft: async () => ({ path, draftId: 'draft', sourceHash: value.sourceHash,
      baseVersion: value.baseVersion, localRevision: value.localRevision, editorSessionId: 'wrong-session',
      disposition: 'accepted', savedAt: new Date().toISOString() }) } as EditorApiClient;
    await expectProtocolFailure(new DraftRepository(client).save({ ...value, editorSessionId: 'session-a' }));
  });

  it('DraftRepository rejects save operation and does not call client if source and sourceHash do not match', async () => {
    const value = await snapshot();
    // Use an incoherent hash
    const incoherentValue = { ...value, sourceHash: 'wrong-hash', editorSessionId: 'session-a' };
    let clientCalled = false;
    const client = {
      saveDraft: async () => {
        clientCalled = true;
        return { path, draftId: 'draft', sourceHash: 'wrong-hash',
          baseVersion: value.baseVersion, localRevision: value.localRevision, editorSessionId: 'session-a',
          disposition: 'accepted', savedAt: new Date().toISOString() };
      }
    } as unknown as EditorApiClient;

    await expectProtocolFailure(new DraftRepository(client).save(incoherentValue));
    expect(clientCalled).toBe(false);
  });
});
