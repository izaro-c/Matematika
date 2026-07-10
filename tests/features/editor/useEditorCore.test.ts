import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorCore, VISUAL_SAVE_POLICY } from '@/features/editor/core/useEditorCore';

const validDefinitionMdx = `export const metadata = {
  "id": "segmento",
  "type": "definicion",
  "title": "Segmento",
  "description": "Parte de una recta limitada por dos puntos.",
  "subtype": "nominal",
  "authors": []
};

Un segmento se define mediante dos extremos.`;

describe('useEditorCore - VisualSavePolicy', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('declares the containment policy as disabled', () => {
    expect(VISUAL_SAVE_POLICY).toBe('disabled');
  });

  it('keeps local status as dirty but blocks saveDraft from fetching when disabled', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useEditorCore());

    // Open file
    await act(async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: async () => validDefinitionMdx
      });
      await result.current.openFile('database/content/definitions/segmento.mdx');
    });

    expect(result.current.currentFile).toBe('database/content/definitions/segmento.mdx');
    expect(result.current.dirtyState).toBe('clean');

    // Trigger metadata change
    act(() => {
      result.current.setMetadata({
        id: 'segmento',
        type: 'definicion',
        title: 'Segmento Modificado',
        description: 'Parte de una recta limitada por dos puntos.',
        subtype: 'nominal',
        authors: [],
      });
    });

    // Check that dirtyState is updated to dirty
    expect(result.current.dirtyState).toBe('dirty');
    
    // Autosave should NOT fire /api/draft because VISUAL_SAVE_POLICY is disabled
    expect(fetchMock).not.toHaveBeenCalledWith('/api/draft', expect.anything());
  });

  it('blocks saveCurrentFile in visual mode but allows it in code mode', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useEditorCore());

    // Open file
    await act(async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: async () => validDefinitionMdx
      });
      await result.current.openFile('database/content/definitions/segmento.mdx');
    });

    // We are in visual mode by default for MDX files
    expect(result.current.editorMode).toBe('visual');

    // Try to save visual file
    let saveResult = false;
    await act(async () => {
      saveResult = await result.current.saveCurrentFile();
    });

    expect(saveResult).toBe(false);
    expect(result.current.dirtyState).toBe('dirty');
    expect(result.current.message).toContain('El guardado visual está desactivado');
    expect(fetchMock).not.toHaveBeenCalledWith('/api/content', expect.anything());

    // Switch to code mode
    act(() => {
      result.current.toggleEditorMode();
    });
    expect(result.current.editorMode).toBe('code');

    // Save in code mode
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Success'
    });
    await act(async () => {
      saveResult = await result.current.saveCurrentFile();
    });

    expect(saveResult).toBe(true);
    expect(result.current.dirtyState).toBe('clean');
    expect(result.current.message).toContain('Cambios aplicados');
    expect(fetchMock).toHaveBeenCalledWith('/api/content', expect.objectContaining({
      method: 'POST'
    }));
  });

  it('handles HTTP error in manual code save flow correctly without marking as saved', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useEditorCore());

    // Open file
    await act(async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: async () => validDefinitionMdx
      });
      await result.current.openFile('database/content/definitions/segmento.mdx');
    });

    // Switch to code mode
    act(() => {
      result.current.toggleEditorMode();
    });

    // Mock HTTP error (500)
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    let saveResult = true;
    await act(async () => {
      saveResult = await result.current.saveCurrentFile();
    });

    expect(saveResult).toBe(false);
    expect(result.current.dirtyState).toBe('dirty');
    expect(result.current.message).toContain('Error al aplicar cambios');
  });

  it('clears pending timers on openFile, toggleEditorMode, and unmount', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() => useEditorCore());

    // Open file
    await act(async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: async () => validDefinitionMdx
      });
      await result.current.openFile('database/content/definitions/segmento.mdx');
    });

    // Set dirty, which calls scheduleSave
    act(() => {
      result.current.updateRawBody('Some new body');
    });

    // Now a timer is pending (500ms).
    // Let's call openFile. It should clear the timer.
    await act(async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: async () => validDefinitionMdx
      });
      await result.current.openFile('database/content/definitions/segmento.mdx');
    });

    // Fast-forward timers. No saveDraft should have run because it was cleared!
    act(() => {
      vi.runAllTimers();
    });
    expect(fetchMock).not.toHaveBeenCalledWith('/api/draft', expect.anything());

    // Set dirty again
    act(() => {
      result.current.updateRawBody('Another new body');
    });

    // Toggle editor mode. It should clear the timer.
    act(() => {
      result.current.toggleEditorMode();
    });

    // Fast-forward timers.
    act(() => {
      vi.runAllTimers();
    });
    expect(fetchMock).not.toHaveBeenCalledWith('/api/draft', expect.anything());

    // Set dirty again
    act(() => {
      result.current.updateRawBody('Final new body');
    });

    // Unmount hook. It should clear the timer.
    unmount();

    // Fast-forward timers.
    act(() => {
      vi.runAllTimers();
    });
    expect(fetchMock).not.toHaveBeenCalledWith('/api/draft', expect.anything());

    vi.useRealTimers();
  });
});
