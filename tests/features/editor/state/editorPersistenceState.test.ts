import { describe, expect, it } from 'vitest';
import { editorPersistenceReducer, initialEditorPersistenceState } from '@/features/editor/state';

const file = { path: 'database/content/a.mdx' };
const other = { path: 'database/content/b.mdx' };
function loaded() {
  const loading = editorPersistenceReducer(initialEditorPersistenceState, { type: 'FILE_LOAD_STARTED', file });
  return editorPersistenceReducer(loading, { type: 'FILE_LOAD_SUCCEEDED', file, source: 'A', sourceHash: 'h1', version: 'v1' });
}
function changed() {
  return editorPersistenceReducer(loaded(), { type: 'SOURCE_CHANGED', file, source: 'B', sourceHash: 'h2', localRevision: 1 });
}

describe('editorPersistenceReducer', () => {
  it('loads into a coherent clean state', () => expect(loaded().status.kind).toBe('ready-clean'));
  it('increments through explicit unique source revisions', () => {
    const first = changed();
    const second = editorPersistenceReducer(first, { type: 'SOURCE_CHANGED', file, source: 'C', sourceHash: 'h3', localRevision: 2 });
    expect(second).toMatchObject({ source: 'C', localRevision: 2, confirmedRevision: 0 });
    expect(second.status.kind).toBe('ready-dirty');
  });
  it('draft confirmation does not clean the file', () => {
    const result = editorPersistenceReducer(changed(), { type: 'DRAFT_SAVE_SUCCEEDED', file, localRevision: 1, draftId: 'd1' });
    expect(result.status.kind).toBe('draft-saved');
    expect(result.confirmedRevision).toBe(0);
  });
  it('current apply confirmation records saved revision', () => {
    const result = editorPersistenceReducer(changed(), { type: 'FILE_SAVE_SUCCEEDED', file, localRevision: 1, version: 'v2', backupId: 'b1' });
    expect(result).toMatchObject({ confirmedRevision: 1, version: 'v2' });
    expect(result.status.kind).toBe('saved');
  });
  it('failure and conflict preserve local source', () => {
    const dirty = changed();
    const failed = editorPersistenceReducer(dirty, { type: 'FILE_SAVE_FAILED', file, localRevision: 1, error: { kind: 'network-error' } });
    const conflict = editorPersistenceReducer(dirty, { type: 'CONFLICT_DETECTED', file, localRevision: 1, expectedVersion: 'v1', actualVersion: 'v2' });
    expect(failed.source).toBe('B');
    expect(conflict.source).toBe('B');
    expect(conflict.status.kind).toBe('conflict');
  });
  it('ignores responses for another file or a future revision', () => {
    const dirty = changed();
    expect(editorPersistenceReducer(dirty, { type: 'FILE_SAVE_SUCCEEDED', file: other, localRevision: 1, version: 'x', backupId: 'b' })).toBe(dirty);
    expect(editorPersistenceReducer(dirty, { type: 'FILE_SAVE_SUCCEEDED', file, localRevision: 9, version: 'x', backupId: 'b' })).toBe(dirty);
  });
  it('an old success updates base version but cannot clear a newer edit', () => {
    const newer = editorPersistenceReducer(changed(), { type: 'SOURCE_CHANGED', file, source: 'C', sourceHash: 'h3', localRevision: 2 });
    const result = editorPersistenceReducer(newer, { type: 'FILE_SAVE_SUCCEEDED', file, localRevision: 1, version: 'v2', backupId: 'b' });
    expect(result).toMatchObject({ source: 'C', localRevision: 2, confirmedRevision: 1, version: 'v2' });
    expect(result.status.kind).toBe('ready-dirty');
  });
  it('a new edit invalidates a saved state', () => {
    const saved = editorPersistenceReducer(changed(), { type: 'FILE_SAVE_SUCCEEDED', file, localRevision: 1, version: 'v2', backupId: 'b' });
    expect(editorPersistenceReducer(saved, { type: 'SOURCE_CHANGED', file, source: 'C', sourceHash: 'h3', localRevision: 2 }).status.kind).toBe('ready-dirty');
  });
});
