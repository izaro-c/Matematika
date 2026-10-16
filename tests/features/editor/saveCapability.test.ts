import { describe, expect, it } from 'vitest';
import {
  buildEditorSaveCapabilityFromDiagram,
  buildMdxSaveCapability,
  saveChromeFromCapability,
  warningSaveConfirmCopy,
} from '@/fixed-pages/editor/save/saveCapability';

describe('buildMdxSaveCapability', () => {
  const ready = {
    isDirty: true,
    saving: false,
    errorCount: 0,
    warningCount: 0,
    hasFile: true,
    hasVersion: true,
    writeAvailable: true,
  };

  it('allows dirty save without errors', () => {
    expect(buildMdxSaveCapability(ready)).toMatchObject({ allowed: true, isDirty: true });
  });

  it('blocks on validation errors even when dirty', () => {
    const cap = buildMdxSaveCapability({ ...ready, errorCount: 2, warningCount: 3 });
    expect(cap).toMatchObject({
      allowed: false,
      reason: 'validation-error',
      summary: { code: 'save.errorCountOther', params: { count: 2 } },
      warningCount: 3,
    });
    expect(saveChromeFromCapability(cap).disabled).toBe(true);
  });

  it('blocks clean documents', () => {
    const cap = buildMdxSaveCapability({ ...ready, isDirty: false });
    expect(cap.reason).toBe('clean');
    expect(saveChromeFromCapability(cap)).toMatchObject({ label: { code: 'save.saved' }, disabled: true });
  });

  it('keeps warnings allowed and chrome enabled', () => {
    const cap = buildMdxSaveCapability({ ...ready, warningCount: 2 });
    expect(cap.allowed).toBe(true);
    expect(saveChromeFromCapability(cap).disabled).toBe(false);
    expect(warningSaveConfirmCopy(2).title).toEqual({ code: 'save.pendingWarningsOther', params: { count: 2 } });
    expect(warningSaveConfirmCopy(1, 'diagram').message.code).toBe('save.diagramWarningsConfirmOne');
  });
});

describe('buildEditorSaveCapabilityFromDiagram', () => {
  it('maps clean dirty=false to the saved chrome', () => {
    const cap = buildEditorSaveCapabilityFromDiagram({
      allowed: true,
      errorCount: 0,
      warningCount: 0,
      isDirty: false,
      saving: false,
    });
    expect(cap.reason).toBe('clean');
    expect(saveChromeFromCapability(cap, { entity: 'diagram' })).toMatchObject({
      label: { code: 'save.saved' },
      title: { code: 'save.diagramUpToDate' },
    });
  });

  it('preserves diagram block reason when not allowed', () => {
    const cap = buildEditorSaveCapabilityFromDiagram({
      allowed: false,
      reason: 'diverged',
      summary: 'Modelo y código divergen',
      errorCount: 0,
      warningCount: 1,
      isDirty: true,
      saving: false,
    });
    expect(cap).toMatchObject({ allowed: false, reason: 'diverged', warningCount: 1 });
  });

  it('allows clean apply when requested', () => {
    const cap = buildEditorSaveCapabilityFromDiagram({
      allowed: true,
      errorCount: 0,
      warningCount: 1,
      isDirty: false,
      saving: false,
      allowCleanApply: true,
    });
    expect(cap.allowed).toBe(true);
    expect(cap.warningCount).toBe(1);
  });
});
