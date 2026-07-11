import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditorApiClient, PersistenceFailure } from '@/features/editor/persistence';

const validRead = { path: 'database/content/a.mdx', source: 'Texto.', sourceHash: 'hash', version: 'v1' };
function response(payload: unknown, status = 200): Response {
  return new Response(typeof payload === 'string' ? payload : JSON.stringify(payload), {
    status, headers: { 'Content-Type': 'application/json' }
  });
}
async function errorKind(promise: Promise<unknown>) {
  try { await promise; return 'none'; }
  catch (error) { return error instanceof PersistenceFailure ? error.detail.kind : 'unknown'; }
}

describe('EditorApiClient', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('accepts a valid 200 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(validRead)));
    await expect(new EditorApiClient().readContent({ path: validRead.path })).resolves.toEqual(validRead);
  });

  it.each([
    ['invalid payload', response({ success: true }), 'invalid-response'],
    ['empty body', new Response('', { status: 200 }), 'invalid-response'],
    ['invalid JSON', response('{broken'), 'invalid-response'],
    ['bad request', response({ message: 'bad' }, 400), 'validation-error'],
    ['unauthorized', response({ message: 'no' }, 403), 'unauthorized'],
    ['not found', response({ message: 'missing' }, 404), 'not-found'],
    ['server error', response({ message: 'boom' }, 500), 'server-error']
  ])('maps %s', async (_name, result, kind) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(result));
    expect(await errorKind(new EditorApiClient().readContent({ path: validRead.path }))).toBe(kind);
  });

  it('maps a valid 409 payload to conflict', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ kind: 'content-conflict', path: validRead.path,
      expectedVersion: 'v1', actualVersion: 'v2', localRevision: 3 }, 409)));
    expect(await errorKind(new EditorApiClient().applyContent({ path: validRead.path, source: 'x', sourceHash: 'h',
      expectedVersion: 'v1', localRevision: 3 }))).toBe('conflict');
  });

  it('maps network and abort failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('offline'))
      .mockRejectedValueOnce(new DOMException('Aborted', 'AbortError')));
    const client = new EditorApiClient();
    expect(await errorKind(client.readContent({ path: validRead.path }))).toBe('network-error');
    expect(await errorKind(client.readContent({ path: validRead.path }))).toBe('aborted');
  });

  it('sends expectedVersion and supports AbortSignal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ path: validRead.path, sourceHash: 'h', previousVersion: 'v1',
      version: 'v2', confirmedRevision: 2, backupId: 'b' }));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    await new EditorApiClient().applyContent({ path: validRead.path, source: 'x', sourceHash: 'h', expectedVersion: 'v1', localRevision: 2 }, controller.signal);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(init.body))).toMatchObject({ expectedVersion: 'v1', localRevision: 2 });
    expect(init.signal).toBe(controller.signal);
  });
});
