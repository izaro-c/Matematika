import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDiagramState } from '../../../../src/features/editor/diagrams/hooks/useDiagramState';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model';
import { PersistenceFailure } from '../../../../src/features/editor/persistence/persistenceErrors';

const repositoryMocks = vi.hoisted(() => ({
  readDiagram: vi.fn(),
  saveDiagram: vi.fn(),
  updateMdxImports: vi.fn(),
}));

vi.mock('../../../../src/features/editor/diagrams/persistence/repository', () => ({
  diagramRepository: {
    readDiagram: repositoryMocks.readDiagram,
    saveDiagram: repositoryMocks.saveDiagram,
    updateMdxImports: repositoryMocks.updateMdxImports,
  },
}));

const { readDiagram, saveDiagram, updateMdxImports } = repositoryMocks;

function parseResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('useDiagramState safety policy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn());
    readDiagram.mockReset();
    saveDiagram.mockReset();
    updateMdxImports.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('blocks diverged state when saveDiagram is invoked directly', async () => {
    const model = createTemplateModel('circunferencia', 'Diverged', 'definicion');
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Diverged.tsx', 'Diverged'));
    act(() => result.current.handleSourceEdit('manual source'));
    expect(result.current.state.status).toBe('source-authoritative');
    act(() => result.current.handleVisualEdit({ ...model, title: 'Visual change' }));
    expect(result.current.state.status).toBe('diverged');

    let saved = true;
    await act(async () => {
      saved = await result.current.saveDiagram();
    });

    expect(saved).toBe(false);
    expect(saveDiagram).not.toHaveBeenCalled();
  });

  it('creates template source only through explicit new-diagram loading', () => {
    const model = createTemplateModel('circunferencia', 'Nuevo', 'definicion');
    const { result } = renderHook(() => useDiagramState());

    act(() => result.current.loadNewDiagram('NuevoDiagrama', model));

    expect(result.current.state.filePath).toBeNull();
    expect(result.current.state.originalSource).toBe('');
    expect(result.current.state.currentSource).toContain('NuevoDiagrama');
    expect(result.current.state.currentModel).toEqual(model);
    expect(result.current.state.status).toBe('visual-authoritative');
    expect(readDiagram).not.toHaveBeenCalled();
  });

  it('replaces stale model errors after the visual correction becomes valid', async () => {
    const model = createTemplateModel('circunferencia', 'Validación visual', 'definicion');
    readDiagram.mockResolvedValueOnce({
      source: 'original',
      model,
      version: 'v1',
      parseStatus: 'visual-exact',
      diagnostics: [],
    });
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram(
      'src/shared/diagrams/ValidacionVisual.tsx',
      'ValidacionVisual',
    ));

    act(() => result.current.handleVisualEdit({
      ...model,
      points: [...model.points, { ...model.points[0] }],
    }));
    expect(result.current.state.diagnostics).toContainEqual(expect.objectContaining({
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      source: 'model',
    }));

    act(() => result.current.handleVisualEdit({ ...model, title: 'Validación corregida' }));

    expect(result.current.state.diagnostics).toEqual([]);
    expect(result.current.state.currentSource).toContain('Validación corregida');
    expect(result.current.state.status).toBe('visual-authoritative');
  });

  it('prepares a code-preview rewrite without touching its source and saves against the original version', async () => {
    const model = createTemplateModel('lienzo-inicial', 'Reescritura', 'definicion');
    const originalSource = 'export const Legacy = () => <svg data-legacy />;\n';
    readDiagram.mockResolvedValueOnce({
      source: originalSource,
      model: null,
      version: 'legacy-v1',
      parseStatus: 'code-preview',
      diagnostics: [],
    });
    saveDiagram.mockResolvedValueOnce({ version: 'visual-v2', backupId: 'backup-legacy' });
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagramForRewrite(
      'src/widgets/diagrams/Legacy.tsx',
      'Legacy',
      model,
    ));

    expect(result.current.state.originalSource).toBe(originalSource);
    expect(result.current.state.currentSource).toContain('createDiagramSpec');
    expect(result.current.state.currentModel).toEqual(model);
    expect(result.current.state.status).toBe('visual-authoritative');
    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      expect(await result.current.saveDiagram()).toBe(true);
    });
    expect(saveDiagram).toHaveBeenCalledWith(
      'src/widgets/diagrams/Legacy.tsx',
      expect.stringContaining('createDiagramSpec'),
      'legacy-v1',
    );
    expect(result.current.state.status).toBe('synced');
  });

  it('blocks conflict state after the first rejected save', async () => {
    const model = createTemplateModel('circunferencia', 'Conflict', 'definicion');
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    saveDiagram.mockRejectedValueOnce(new PersistenceFailure({
      kind: 'content-conflict',
      expectedVersion: 'v1',
      actualVersion: 'v2',
    }));
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Conflict.tsx', 'Conflict'));
    act(() => result.current.handleVisualEdit({ ...model, title: 'Changed' }));
    expect(result.current.state.status).toBe('visual-authoritative');

    let saved = true;
    await act(async () => {
      saved = await result.current.saveDiagram();
    });
    expect(saved).toBe(false);
    expect(result.current.state.status).toBe('conflict');

    await act(async () => {
      saved = await result.current.saveDiagram();
    });
    expect(saved).toBe(false);
    expect(saveDiagram).toHaveBeenCalledTimes(1);
  });

  it('blocks invalid-source state and preserves the exact source', async () => {
    const model = createTemplateModel('circunferencia', 'Invalid', 'definicion');
    const brokenSource = 'export const Invalid = () => <MathBoard';
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    vi.mocked(fetch).mockResolvedValueOnce(parseResponse({
      status: 'invalid',
      diagnostics: [{
        code: 'typescript-syntax-error',
        severity: 'error',
        message: 'Unterminated JSX contents.',
        source: 'source',
      }],
    }));
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Invalid.tsx', 'Invalid'));
    act(() => result.current.handleSourceEdit(brokenSource));
    await act(async () => {
      vi.advanceTimersByTime(600);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.state.status).toBe('invalid-source');

    let saved = true;
    await act(async () => {
      saved = await result.current.saveDiagram();
    });

    expect(saved).toBe(false);
    expect(result.current.state.currentSource).toBe(brokenSource);
    expect(saveDiagram).not.toHaveBeenCalled();
  });

  it('saves valid manual code without creating or regenerating an editable fallback model', async () => {
    const model = createTemplateModel('circunferencia', 'Unsupported', 'definicion');
    const manualSource = 'export const Unsupported = () => <svg><path d="M0 0 L1 1" /></svg>;\n';
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    vi.mocked(fetch).mockResolvedValueOnce(parseResponse({
      status: 'code-preview',
      diagnostics: [{
        code: 'code-preview',
        severity: 'warning',
        message: 'The complete source is authoritative.',
        source: 'source',
      }],
    }));
    const { result } = renderHook(() => useDiagramState());
    saveDiagram.mockResolvedValueOnce({ version: 'v2', backupId: 'backup-code' });

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Unsupported.tsx', 'Unsupported'));
    act(() => result.current.handleSourceEdit(manualSource));
    await act(async () => {
      vi.advanceTimersByTime(600);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.state.status).toBe('source-authoritative');

    expect(result.current.state.currentModel).toBeNull();
    expect(result.current.state.currentSource).toBe(manualSource);

    let saved = true;
    await act(async () => {
      saved = await result.current.saveDiagram();
    });

    expect(saved).toBe(true);
    expect(saveDiagram).toHaveBeenCalledWith(
      'src/shared/diagrams/Unsupported.tsx',
      manualSource,
      'v1',
    );
  });

  it('blocks save when the file revision is stale or missing', async () => {
    const model = createTemplateModel('circunferencia', 'Stale', 'definicion');
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: '' });
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Stale.tsx', 'Stale'));
    act(() => result.current.handleVisualEdit({ ...model, title: 'Changed' }));
    expect(result.current.state.status).toBe('visual-authoritative');

    let saved = true;
    await act(async () => {
      saved = await result.current.saveDiagram();
    });

    expect(saved).toBe(false);
    expect(saveDiagram).not.toHaveBeenCalled();
  });

  it('invalidates pending parse results when switching between diagrams', async () => {
    const modelA = createTemplateModel('circunferencia', 'A', 'definicion');
    const modelB = createTemplateModel('circunferencia', 'B', 'definicion');
    readDiagram
      .mockResolvedValueOnce({ source: 'source-a', model: modelA, version: 'v1' })
      .mockResolvedValueOnce({ source: 'source-b', model: modelB, version: 'v2' });
    vi.mocked(fetch).mockResolvedValueOnce(parseResponse({
      status: 'invalid',
      diagnostics: [{
        code: 'late-parse',
        severity: 'error',
        message: 'Late parse from previous diagram.',
        source: 'source',
      }],
    }));
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/A.tsx', 'A'));
    act(() => result.current.handleSourceEdit('broken-a'));
    await act(async () => result.current.loadDiagram('src/shared/diagrams/B.tsx', 'B'));
    await act(async () => {
      vi.advanceTimersByTime(600);
      await Promise.resolve();
    });

    expect(result.current.state.filePath).toBe('src/shared/diagrams/B.tsx');
    expect(result.current.state.currentSource).toBe('source-b');
    expect(result.current.state.currentModel?.title).toBe('B');
    expect(result.current.state.status).toBe('synced');
  });

  it('records repository load errors without leaking a previous diagram', async () => {
    readDiagram.mockRejectedValueOnce(new Error('disk unavailable'));
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Missing.tsx', 'Missing'));

    expect(result.current.state.status).toBe('invalid-source');
    expect(result.current.state.currentModel).toBeNull();
    expect(result.current.state.diagnostics.at(-1)).toMatchObject({
      code: 'save-error',
      severity: 'error',
    });
  });

  it('applies fresh supported parser responses after source edits', async () => {
    const model = createTemplateModel('circunferencia', 'Parsed', 'definicion');
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    vi.mocked(fetch)
      .mockResolvedValueOnce(parseResponse({
        status: 'visual-exact',
        model: { ...model, title: 'Parsed from source' },
        diagnostics: [{ code: 'supported', severity: 'info', message: 'ok' }],
      }));
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Parsed.tsx', 'Parsed'));
    act(() => result.current.handleSourceEdit('source parsed'));
    await act(async () => {
      vi.advanceTimersByTime(600);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.state.currentModel?.title).toBe('Parsed from source');
    expect(result.current.state.status).toBe('source-authoritative');

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('resolves divergence to visual authority and saves successful file revisions', async () => {
    const model = createTemplateModel('circunferencia', 'Save', 'definicion');
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    saveDiagram.mockResolvedValueOnce({ version: 'v2', backupId: 'backup-1' });
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Save.tsx', 'Save'));
    act(() => result.current.handleVisualEdit({ ...model, title: 'Changed' }));
    act(() => result.current.resolveDivergence('visual'));

    let saved = false;
    await act(async () => {
      saved = await result.current.saveDiagram();
    });

    expect(saved).toBe(true);
    expect(saveDiagram).toHaveBeenCalledWith(
      'src/shared/diagrams/Save.tsx',
      expect.stringContaining('Changed'),
      'v1',
    );
    expect(result.current.state.status).toBe('synced');
    expect(result.current.state.expectedVersion).toBe('v2');
  });

  it('resolves source authority through parsing and links diagrams to MDX pages', async () => {
    const model = createTemplateModel('circunferencia', 'Source', 'definicion');
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    vi.mocked(fetch).mockResolvedValueOnce(parseResponse({
      status: 'visual-exact',
      model: { ...model, title: 'Source parsed' },
      diagnostics: [],
    }));
    updateMdxImports.mockResolvedValueOnce({ success: true, modified: true });
    const { result } = renderHook(() => useDiagramState());

    await act(async () => result.current.loadDiagram('src/shared/diagrams/Source.tsx', 'Source'));
    act(() => result.current.handleSourceEdit('source authority'));
    act(() => result.current.resolveDivergence('source'));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(async () => result.current.linkToMdxPage('database/content/definitions/a.mdx', 'diagram'));

    expect(result.current.state.currentModel?.title).toBe('Source parsed');
    expect(updateMdxImports).toHaveBeenCalledWith(
      'database/content/definitions/a.mdx',
      'Source',
      'src/shared/diagrams/Source.tsx',
      'diagram',
    );
  });
});
