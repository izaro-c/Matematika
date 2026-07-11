import { act, renderHook, waitFor } from '@testing-library/react';
import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorCore, VISUAL_SAVE_POLICY } from '@/features/editor/core/useEditorCore';

const source = `import X from './x';

export const metadata = {
  title: 'Segmento'
};

## Título

Un cuerpo que debe conservarse.

export const value = { nested: true };`;

function response(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } });
}
function readResponse(value: string, path = 'content/test.mdx') {
  const sourceHash = createHash('sha256').update(value, 'utf8').digest('hex');
  return response({ path, source: value, sourceHash, version: `sha256:${sourceHash}` });
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  return { promise: new Promise<T>(yes => { resolve = yes; }), resolve };
}
function digest(byte: number): ArrayBuffer {
  return Uint8Array.from({ length: 32 }, () => byte).buffer;
}

describe('useEditorCore lossless integration', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('keeps visual persistence disabled and opens MDX in code mode with full source', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(readResponse(source));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    expect(VISUAL_SAVE_POLICY).toBe('disabled');
    expect(result.current.editorMode).toBe('code');
    expect(result.current.rawBody).toBe(source);
    expect(result.current.blocks).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('changes code to visual to code without changing one byte', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(readResponse(source));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    act(() => result.current.toggleEditorMode());
    expect(result.current.editorMode).toBe('visual');
    act(() => result.current.toggleEditorMode());
    expect(result.current.editorMode).toBe('code');
    expect(result.current.rawBody).toBe(source);
  });

  it('never enters visual mode for unsupported MDX and preserves its body', async () => {
    const unsupported = `export const metadata = {};\n\nCuerpo { no es JS }`;
    vi.mocked(fetch).mockResolvedValueOnce(readResponse(unsupported, 'content/broken.mdx'));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/broken.mdx'));
    act(() => result.current.toggleEditorMode());
    expect(result.current.editorMode).toBe('code');
    expect(result.current.rawBody).toBe(unsupported);
    expect(result.current.message).toContain('bloqueado');
  });

  it('applies a localized heading edit and preserves its depth and envelope', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(readResponse(source));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    act(() => result.current.toggleEditorMode());
    const heading = result.current.blocks[0];
    act(() => result.current.updateBlock(heading.id, 'Nuevo título'));
    await waitFor(() => expect(result.current.rawBody).toContain('## Nuevo título'));
    act(() => result.current.toggleEditorMode());
    expect(result.current.rawBody).toBe(source.replace('## Título', '## Nuevo título'));
    expect(result.current.rawBody).toContain(`import X from './x';`);
    expect(result.current.rawBody).toContain('export const value = { nested: true };');
  });

  it('blocks destructive visual operations and visual save', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(readResponse(source));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    act(() => result.current.toggleEditorMode());
    const before = result.current.rawBody;
    act(() => result.current.removeBlock(result.current.blocks[0].id));
    expect(result.current.rawBody).toBe(before);
    expect(result.current.message).toContain('bloqueada');
    let saved = true;
    await act(async () => { saved = await result.current.saveCurrentFile(); });
    expect(saved).toBe(false);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it('manual code save sends the exact current source and checks HTTP status', async () => {
    const fetchMock = vi.mocked(fetch)
      .mockResolvedValueOnce(readResponse(source))
      .mockImplementationOnce(async (_url, init) => {
        const request = JSON.parse(String(init?.body));
        return response({ path: request.path, sourceHash: request.sourceHash, previousVersion: request.expectedVersion,
          version: `sha256:${request.sourceHash}`, confirmedRevision: request.localRevision, backupId: 'backup-1' });
      });
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    const changed = source.replace('Un cuerpo', 'El cuerpo');
    act(() => result.current.updateRawBody(changed));
    await waitFor(() => expect(result.current.rawBody).toBe(changed));
    let saved = false;
    await act(async () => { saved = await result.current.saveCurrentFile(); });
    expect(saved).toBe(true);
    const payload = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body));
    expect(payload.source).toBe(changed);
    expect(payload.expectedVersion).toMatch(/^sha256:/);

    fetchMock.mockResolvedValueOnce(response({ message: 'server error' }, 500));
    act(() => result.current.updateRawBody(`${changed}\n`));
    await waitFor(() => expect(result.current.rawBody).toBe(`${changed}\n`));
    await act(async () => { saved = await result.current.saveCurrentFile(); });
    expect(saved).toBe(false);
    expect(result.current.dirtyState).toBe('dirty');
  });

  it('binds source and revision before the asynchronous save hash resolves', async () => {
    const saveHash = deferred<ArrayBuffer>();
    const newerHash = deferred<ArrayBuffer>();
    const nativeDigest = globalThis.crypto.subtle.digest.bind(globalThis.crypto.subtle);
    const digestSpy = vi.spyOn(globalThis.crypto.subtle, 'digest')
      .mockImplementationOnce(nativeDigest)
      .mockReturnValueOnce(Promise.resolve(digest(1)))
      .mockReturnValueOnce(saveHash.promise)
      .mockReturnValueOnce(newerHash.promise);
    let sentRequest: Record<string, unknown> | undefined;
    vi.mocked(fetch)
      .mockResolvedValueOnce(readResponse(source))
      .mockImplementationOnce(async (_url, init) => {
        sentRequest = JSON.parse(String(init?.body));
        return response({
          path: sentRequest.path,
          sourceHash: sentRequest.sourceHash,
          previousVersion: sentRequest.expectedVersion,
          version: `sha256:${sentRequest.sourceHash}`,
          confirmedRevision: sentRequest.localRevision,
          backupId: 'backup-r1'
        });
      });
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));

    const revision1 = source.replace('Un cuerpo', 'Revisión uno');
    act(() => result.current.updateRawBody(revision1));
    await waitFor(() => expect(result.current.rawBody).toBe(revision1));

    let saving!: Promise<boolean>;
    act(() => { saving = result.current.saveCurrentFile(); });
    const revision2 = revision1.replace('Revisión uno', 'Revisión dos');
    act(() => result.current.updateRawBody(revision2));
    await act(async () => { saveHash.resolve(digest(2)); await Promise.resolve(); });
    await act(async () => { await saving; });

    if (sentRequest) expect(sentRequest).toMatchObject({ source: revision1, localRevision: 1 });
    expect(result.current.dirtyState).toBe('dirty');
    expect(result.current.persistenceStatus.kind).not.toBe('saved');
    newerHash.resolve(digest(3));
    digestSpy.mockRestore();
  });

  it('ignores a late response from the previously opened file', async () => {
    let resolveA!: (response: Response) => void;
    let resolveB!: (response: Response) => void;
    vi.mocked(fetch).mockImplementation((url) => new Promise<Response>(resolve => {
      if (String(url).includes('a.mdx')) resolveA = resolve;
      else resolveB = resolve;
    }));
    const { result } = renderHook(() => useEditorCore());
    let first!: Promise<void>;
    act(() => { first = result.current.openFile('content/a.mdx'); });
    let second!: Promise<void>;
    act(() => { second = result.current.openFile('content/b.mdx'); });
    resolveB(readResponse('B', 'content/b.mdx'));
    await act(async () => second);
    resolveA(readResponse('A', 'content/a.mdx'));
    await act(async () => first);
    expect(result.current.currentFile).toBe('content/b.mdx');
    expect(result.current.rawBody).toBe('B');
  });

  it('shows conflict and never reports saved for a 409', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(readResponse(source));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    act(() => result.current.updateRawBody(`${source}\n`));
    await waitFor(() => expect(result.current.rawBody).toBe(`${source}\n`));
    fetchMock.mockResolvedValueOnce(response({ kind: 'content-conflict', path: 'content/test.mdx', expectedVersion: 'v1',
      actualVersion: 'v2', localRevision: 1 }, 409));
    let saved = true;
    await act(async () => { saved = await result.current.saveCurrentFile(); });
    expect(saved).toBe(false);
    expect(result.current.persistenceStatus.kind).toBe('conflict');
    expect(result.current.persistenceLabel).toBe('Conflicto');
  });

  it('blocks file switching while local changes remain unconfirmed', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(readResponse(source, 'content/a.mdx'));
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/a.mdx'));
    act(() => result.current.updateRawBody(`${source}\n`));
    await waitFor(() => expect(result.current.dirtyState).toBe('dirty'));
    await act(() => result.current.openFile('content/b.mdx'));
    expect(result.current.currentFile).toBe('content/a.mdx');
    expect(result.current.message).toContain('bloqueado');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
