import { describe, expect, it } from 'vitest';
import {
  buildEditorSafetyPresentation,
} from '../../../../src/fixed-pages/editor/review/safetyPresentation';
import type { EditorText } from '../../../../src/fixed-pages/editor/types/editorMessage';
import type { EditorValidationResult } from '../../../../src/fixed-pages/editor/session/editorTypes';
import type { EditorPersistenceStatus } from '../../../../src/fixed-pages/editor/save/editorPersistenceState';

const translateText = (text: EditorText) => (typeof text === 'string' ? text : `t:${text.code}`);

const valid: EditorValidationResult = {
  issues: [],
  canSave: true,
  errorCount: 0,
  warningCount: 0,
};

function presentation(status: EditorPersistenceStatus, validation = valid) {
  return buildEditorSafetyPresentation({
    currentFile: 'content/mdx/definitions/test.mdx',
    compatibility: 'fully-editable',
    compatibilityReasons: [],
    persistenceStatus: status,
    validation,
    editorMode: 'code',
    isDiagramFile: false,
    translateText,
  });
}

describe('safe editor presentation', () => {
  it('distinguishes a draft from a real file save', () => {
    const draft = presentation({
      kind: 'draft-saved',
      file: { path: 'content/mdx/definitions/test.mdx' },
      localRevision: 2,
      draftId: 'draft-1',
    });

    expect(draft.title).toBe('Borrador guardado');
    expect(draft.description).toContain('archivo real aún no está aplicado');
    expect(draft.allowedActions.map(action => action.id)).toContain('apply-file');
  });

  it('blocks applying a dirty document when validation fails', () => {
    const unsafe = presentation({
      kind: 'ready-dirty',
      file: { path: 'content/mdx/definitions/test.mdx' },
      version: 'sha256:base',
      localRevision: 3,
    }, {
      issues: [{ id: 'mdx-error', area: 'body', severity: 'error', message: 'MDX inválido' }],
      canSave: false,
      errorCount: 1,
      warningCount: 0,
    });

    expect(unsafe.level).toBe('blocked');
    expect(unsafe.blockedActions.map(action => action.id)).toContain('apply-file');
    expect(unsafe.reasons[0]?.description).toBe('MDX inválido');
  });

  it('explains unsupported visual compatibility without destructive projection', () => {
    const unsafe = buildEditorSafetyPresentation({
      currentFile: 'content/mdx/definitions/test.mdx',
      compatibility: 'unsupported',
      compatibilityReasons: ['Expresión MDX no soportada en línea 4.'],
      persistenceStatus: {
        kind: 'ready-clean',
        file: { path: 'content/mdx/definitions/test.mdx' },
        version: 'sha256:base',
        confirmedRevision: 0,
      },
      validation: valid,
      editorMode: 'code',
      isDiagramFile: false,
      translateText,
    });

    expect(unsafe.level).toBe('error');
    expect(unsafe.blockedActions.map(action => action.id)).toContain('edit-visual');
    expect(unsafe.reasons[0]?.description).toContain('línea 4');
  });

  it('translates engine messages used as blocked and unsupported reasons', () => {
    const file = { path: 'content/mdx/definitions/test.mdx' };
    const blocked = presentation({ kind: 'blocked', file, localRevision: 1, reason: { code: 'errors.invalidSourceReason' } });
    expect(blocked.reasons.find(reason => reason.id === 'blocked-save')?.description).toBe('t:errors.invalidSourceReason');
    expect(blocked.description).toContain('t:errors.invalidSourceReason');
    const unsupported = presentation({ kind: 'unsupported', file, reason: { code: 'errors.invalidMetadataReason' } });
    expect(unsupported.reasons.find(reason => reason.id === 'unsupported-file')?.description).toBe('t:errors.invalidMetadataReason');
  });
});
