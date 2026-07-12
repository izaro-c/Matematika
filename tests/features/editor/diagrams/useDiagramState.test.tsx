import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDiagramState } from '../../../../src/features/editor/diagrams/hooks/useDiagramState';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';
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

  it('blocks unsupported source without creating an editable fallback model', async () => {
    const model = createTemplateModel('circunferencia', 'Unsupported', 'definicion');
    const manualSource = 'export const Unsupported = () => <svg><path d="M0 0 L1 1" /></svg>;\n';
    readDiagram.mockResolvedValueOnce({ source: 'original', model, version: 'v1' });
    vi.mocked(fetch).mockResolvedValueOnce(parseResponse({
      status: 'unsupported',
      diagnostics: [{
        code: 'unsupported-source',
        severity: 'warning',
        message: 'No visual model could be extracted.',
        source: 'source',
      }],
    }));
    const { result } = renderHook(() => useDiagramState());

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

    expect(saved).toBe(false);
    expect(saveDiagram).not.toHaveBeenCalled();
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
});
