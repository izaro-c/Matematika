import { describe, expect, it } from 'vitest';
import { buildDiagramAuthorityPresentation, buildEditorSafetyPresentation } from '../../../../src/features/editor/ux/safetyPresentation';
import type { EditorValidationResult } from '../../../../src/features/editor/core/editorTypes';
import type { EditorPersistenceStatus } from '../../../../src/features/editor/state/editorPersistenceState';

const valid: EditorValidationResult = {
  issues: [],
  canSave: true,
  errorCount: 0,
  warningCount: 0,
};

function presentation(status: EditorPersistenceStatus, validation = valid) {
  return buildEditorSafetyPresentation({
    currentFile: 'database/content/definitions/test.mdx',
    compatibility: 'fully-editable',
    compatibilityReasons: [],
    persistenceStatus: status,
    validation,
    editorMode: 'code',
    isDiagramFile: false,
  });
}

describe('safe editor presentation', () => {
  it('distinguishes a draft from a real file save', () => {
    const draft = presentation({
      kind: 'draft-saved',
      file: { path: 'database/content/definitions/test.mdx' },
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
      file: { path: 'database/content/definitions/test.mdx' },
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
      currentFile: 'database/content/definitions/test.mdx',
      compatibility: 'unsupported',
      compatibilityReasons: ['Expresión MDX no soportada en línea 4.'],
      persistenceStatus: {
        kind: 'ready-clean',
        file: { path: 'database/content/definitions/test.mdx' },
        version: 'sha256:base',
        confirmedRevision: 0,
      },
      validation: valid,
      editorMode: 'code',
      isDiagramFile: false,
    });

    expect(unsafe.level).toBe('error');
    expect(unsafe.blockedActions.map(action => action.id)).toContain('edit-visual');
    expect(unsafe.reasons[0]?.description).toContain('línea 4');
  });

  it('marks diagram divergence as blocking and explains authority ambiguity', () => {
    const diagram = buildDiagramAuthorityPresentation('diverged', true);

    expect(diagram.level).toBe('blocked');
    expect(diagram.blockedActions.map(action => action.id)).toContain('apply-file');
    expect(diagram.description).toContain('elegir una autoridad');
  });
});
