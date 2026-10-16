import { describe, expect, it } from 'vitest';
import { failureMessage, persistenceMessage } from '@/fixed-pages/editor/session/useEditorCore';
import { saveBlockedByValidation } from '@/fixed-pages/editor/session/validationMessages';
import { persistenceStatusLabel, type EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import { editorMessage, EditorMessageError, translateEditorText } from '@/fixed-pages/editor/types/editorMessage';

describe('failureMessage', () => {
  it('prefers the message carried by an EditorMessageError', () => {
    const error = new EditorMessageError(editorMessage('errors.pageTemplateInvalid'));
    expect(failureMessage(error, 'errors.pageCreateFailed')).toEqual({ code: 'errors.pageTemplateInvalid' });
  });

  it('maps persistence errors to their own code', () => {
    const error = { detail: { kind: 'content-conflict', expectedVersion: 'a', actualVersion: 'b' } };
    expect(failureMessage(error, 'errors.pageCreateFailed')).toEqual({ code: 'errors.contentConflict' });
  });

  it('falls back to the generic code with the error detail', () => {
    expect(failureMessage(new Error('boom'), 'errors.diagramCreateFailed'))
      .toEqual({ code: 'errors.diagramCreateFailed', params: { detail: 'boom' } });
    expect(failureMessage('texto', 'errors.changeRejected'))
      .toEqual({ code: 'errors.changeRejected', params: { detail: 'texto' } });
  });
});

describe('persistenceMessage', () => {
  it('covers every error kind with a code', () => {
    expect(persistenceMessage({ kind: 'network-error' })).toEqual({ code: 'errors.networkError' });
    expect(persistenceMessage({ kind: 'aborted' } as never)).toEqual({ code: 'errors.operationCancelled' });
    expect(persistenceMessage({ kind: 'validation-error', message: 'x' })).toEqual({ code: 'errors.persistenceError' });
  });
});

describe('saveBlockedByValidation', () => {
  it('chooses the singular or plural code', () => {
    expect(saveBlockedByValidation(1)).toEqual({ code: 'errors.saveBlockedByValidationOne' });
    expect(saveBlockedByValidation(3)).toEqual({ code: 'errors.saveBlockedByValidationOther', params: { count: 3 } });
  });
});

describe('persistenceStatusLabel', () => {
  const file = { path: 'content/a.mdx' };
  const statuses: EditorPersistenceStatus[] = [
    { kind: 'idle' },
    { kind: 'loading', file },
    { kind: 'ready-clean', file, version: 'v', confirmedRevision: 0 },
    { kind: 'ready-dirty', file, version: 'v', localRevision: 1 },
    { kind: 'validating', file, localRevision: 1 },
    { kind: 'blocked', file, localRevision: 1, reason: editorMessage('errors.invalidSourceReason') },
    { kind: 'saving-draft', file, localRevision: 1 },
    { kind: 'draft-saved', file, localRevision: 1, draftId: 'd' },
    { kind: 'saving-file', file, localRevision: 1 },
    { kind: 'saved', file, version: 'v', confirmedRevision: 1, backupId: 'b' },
    { kind: 'save-error', file, localRevision: 1, error: { kind: 'network-error' } },
    { kind: 'conflict', file, localRevision: 1, expectedVersion: 'a', actualVersion: 'b' },
    { kind: 'cancelled', file, localRevision: 1 },
    { kind: 'unsupported', file, reason: 'x' },
  ] as EditorPersistenceStatus[];

  it('returns a status code for every kind', () => {
    const codes = statuses.map(status => persistenceStatusLabel(status).code);
    expect(new Set(codes).size).toBe(statuses.length);
    expect(codes.every(code => code.startsWith('status.'))).toBe(true);
  });

  it('is translatable', () => {
    const t = (key: string) => key;
    expect(translateEditorText(t, persistenceStatusLabel({ kind: 'idle' }))).toBe('editor.status.idle');
  });
});
