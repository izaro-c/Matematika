import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorCore, VISUAL_SAVE_POLICY } from '@/features/editor/core/useEditorCore';

const source = `import X from './x';

export const metadata = {
  title: 'Segmento'
};

## Título

Un cuerpo que debe conservarse.

export const value = { nested: true };`;

function response(text: string, ok = true) {
  return { ok, text: async () => text, json: async () => [] };
}

describe('useEditorCore lossless integration', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('keeps visual persistence disabled and opens MDX in code mode with full source', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(response(source) as Response);
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    expect(VISUAL_SAVE_POLICY).toBe('disabled');
    expect(result.current.editorMode).toBe('code');
    expect(result.current.rawBody).toBe(source);
    expect(result.current.blocks).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('changes code to visual to code without changing one byte', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response(source) as Response);
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
    vi.mocked(fetch).mockResolvedValueOnce(response(unsupported) as Response);
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/broken.mdx'));
    act(() => result.current.toggleEditorMode());
    expect(result.current.editorMode).toBe('code');
    expect(result.current.rawBody).toBe(unsupported);
    expect(result.current.message).toContain('bloqueado');
  });

  it('applies a localized heading edit and preserves its depth and envelope', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response(source) as Response);
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    act(() => result.current.toggleEditorMode());
    const heading = result.current.blocks[0];
    act(() => result.current.updateBlock(heading.id, 'Nuevo título'));
    act(() => result.current.toggleEditorMode());
    expect(result.current.rawBody).toBe(source.replace('## Título', '## Nuevo título'));
    expect(result.current.rawBody).toContain(`import X from './x';`);
    expect(result.current.rawBody).toContain('export const value = { nested: true };');
  });

  it('blocks destructive visual operations and visual save', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response(source) as Response);
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
      .mockResolvedValueOnce(response(source) as Response)
      .mockResolvedValueOnce(response('ok') as Response);
    const { result } = renderHook(() => useEditorCore());
    await act(() => result.current.openFile('content/test.mdx'));
    const changed = source.replace('Un cuerpo', 'El cuerpo');
    act(() => result.current.updateRawBody(changed));
    let saved = false;
    await act(async () => { saved = await result.current.saveCurrentFile(); });
    expect(saved).toBe(true);
    const payload = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body));
    expect(payload.content).toBe(changed);

    fetchMock.mockResolvedValueOnce(response('server error', false) as Response);
    act(() => result.current.updateRawBody(`${changed}\n`));
    await act(async () => { saved = await result.current.saveCurrentFile(); });
    expect(saved).toBe(false);
    expect(result.current.dirtyState).toBe('dirty');
  });
});
