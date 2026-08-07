import React, { StrictMode, useEffect, useMemo } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SaveCoordinator, type ContentRepository, type DraftRepository } from '@/fixed-pages/editor/save';

describe('StrictMode SaveCoordinator ownership', () => {
  it('dispose() in effect cleanup leaves memoized coordinator dead', async () => {
    const apply = vi.fn().mockResolvedValue({ version: 'v2', backupId: 'b1' });
    const content = { apply } as unknown as ContentRepository;
    let latest: SaveCoordinator | null = null;

    function Broken() {
      const coordinator = useMemo(
        () => new SaveCoordinator(content, {} as DraftRepository, () => undefined),
        [],
      );
      useEffect(() => () => coordinator.dispose(), [coordinator]);
      useEffect(() => { latest = coordinator; }, [coordinator]);
      return null;
    }

    render(<StrictMode><Broken /></StrictMode>);
    const result = await latest!.applyNow({
      file: { path: 'content/x.mdx' },
      source: 'body',
      sourceHash: 'hash',
      localRevision: 1,
      baseVersion: 'v1',
    });
    expect(apply).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false });
  });

  it('cancelAll() in effect cleanup keeps applyNow usable (useEditorCore pattern)', async () => {
    const apply = vi.fn().mockResolvedValue({ version: 'v2', backupId: 'b1' });
    const content = { apply } as unknown as ContentRepository;
    let latest: SaveCoordinator | null = null;

    function Fixed() {
      const coordinator = useMemo(
        () => new SaveCoordinator(content, {} as DraftRepository, () => undefined),
        [],
      );
      useEffect(() => () => coordinator.cancelAll(), [coordinator]);
      useEffect(() => { latest = coordinator; }, [coordinator]);
      return null;
    }

    render(<StrictMode><Fixed /></StrictMode>);
    const result = await latest!.applyNow({
      file: { path: 'content/x.mdx' },
      source: 'body',
      sourceHash: 'hash',
      localRevision: 1,
      baseVersion: 'v1',
    });
    expect(apply).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true });
  });
});
