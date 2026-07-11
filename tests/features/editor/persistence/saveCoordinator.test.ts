import { describe, expect, it, vi } from 'vitest';
import { SaveCoordinator, type ContentRepository, type DraftRepository, type EditorDraftSnapshot, type SaveCoordinatorEvent } from '@/features/editor/persistence';

const snapshot = (revision: number): EditorDraftSnapshot => ({ file: { path: 'database/content/a.mdx' }, source: `s${revision}`,
  sourceHash: `h${revision}`, baseVersion: 'v1', localRevision: revision, editorSessionId: 'session-a' });
function deferred<T>() { let resolve!: (value: T) => void; let reject!: (error: unknown) => void;
  return { promise: new Promise<T>((yes, no) => { resolve = yes; reject = no; }), resolve, reject }; }

describe('SaveCoordinator', () => {
  it('debounces and replaces an older scheduled draft', async () => {
    vi.useFakeTimers();
    const save = vi.fn().mockResolvedValue({ draftId: 'd2' });
    const events: unknown[] = [];
    const coordinator = new SaveCoordinator({} as ContentRepository, { save } as unknown as DraftRepository, event => events.push(event), 50);
    coordinator.scheduleDraft(snapshot(1));
    coordinator.scheduleDraft(snapshot(2));
    await vi.advanceTimersByTimeAsync(50);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].localRevision).toBe(2);
    expect(events).toHaveLength(2);
    vi.useRealTimers();
  });

  it('cancels timers on file switch and dispose is idempotent', async () => {
    vi.useFakeTimers();
    const save = vi.fn();
    const coordinator = new SaveCoordinator({} as ContentRepository, { save } as unknown as DraftRepository, vi.fn(), 20);
    coordinator.scheduleDraft(snapshot(1));
    coordinator.cancelForFile(snapshot(1).file);
    coordinator.dispose();
    coordinator.dispose();
    await vi.advanceTimersByTimeAsync(20);
    expect(save).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('crossed apply responses cannot make the older request authoritative', async () => {
    const first = deferred<{ version: string; backupId: string }>();
    const second = deferred<{ version: string; backupId: string }>();
    const apply = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const events: SaveCoordinatorEvent[] = [];
    const coordinator = new SaveCoordinator({ apply } as unknown as ContentRepository, {} as DraftRepository, event => events.push(event));
    const p1 = coordinator.applyNow(snapshot(1));
    const p2 = coordinator.applyNow(snapshot(2));
    second.resolve({ version: 'v2', backupId: 'b2' });
    await p2;
    first.resolve({ version: 'old', backupId: 'b1' });
    await p1;
    expect(events.filter(event => event.type === 'apply-succeeded').map(event => event.snapshot.localRevision)).toEqual([2]);
  });

  it('late responses after dispose produce no state update', async () => {
    const pending = deferred<{ version: string; backupId: string }>();
    const events: SaveCoordinatorEvent[] = [];
    const coordinator = new SaveCoordinator({ apply: () => pending.promise } as unknown as ContentRepository, {} as DraftRepository, event => events.push(event));
    const operation = coordinator.applyNow(snapshot(1));
    coordinator.dispose();
    pending.resolve({ version: 'v2', backupId: 'b' });
    await operation;
    expect(events.map(event => event.type)).toEqual(['apply-started']);
  });

  it('aborts are not reported as server failures', async () => {
    const apply = vi.fn((_snapshot, signal: AbortSignal) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    const events: SaveCoordinatorEvent[] = [];
    const coordinator = new SaveCoordinator({ apply } as unknown as ContentRepository, {} as DraftRepository, event => events.push(event));
    const first = coordinator.applyNow(snapshot(1));
    coordinator.applyNow(snapshot(2)).catch(() => undefined);
    await first;
    expect(events.some(event => event.type === 'apply-failed' && event.snapshot.localRevision === 1)).toBe(false);
  });
});
