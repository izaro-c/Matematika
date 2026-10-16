import { editorMessage, translateEditorText, type EditorMessage, type EditorText, type EditorTranslate } from '@/fixed-pages/editor/types/editorMessage';

export type EditorSaveBlockReason =
  | 'validation-error'
  | 'clean'
  | 'unavailable'
  | 'saving'
  | 'read-only'
  | 'invalid-source'
  | 'diverged'
  | 'conflict'
  | 'stale-revision'
  | 'missing-authority';

export interface EditorSaveCapability {
  allowed: boolean;
  reason?: EditorSaveBlockReason;
  summary?: EditorText;
  errorCount: number;
  warningCount: number;
  isDirty: boolean;
}

export interface MdxSaveCapabilityInput {
  isDirty: boolean;
  saving: boolean;
  errorCount: number;
  warningCount: number;
  hasFile: boolean;
  hasVersion: boolean;
  writeAvailable: boolean;
  isReadOnly?: boolean;
}

export function buildMdxSaveCapability(input: MdxSaveCapabilityInput): EditorSaveCapability {
  const { errorCount, warningCount, isDirty, saving } = input;
  const base = { errorCount, warningCount, isDirty };
  if (saving) {
    return { ...base, allowed: false, reason: 'saving', summary: editorMessage('save.savingChanges') };
  }
  if (input.isReadOnly) {
    return { ...base, allowed: false, reason: 'read-only', summary: editorMessage('save.readOnlyDocument') };
  }
  if (!input.hasFile || !input.hasVersion) {
    return { ...base, allowed: false, reason: 'unavailable', summary: editorMessage('save.unavailable') };
  }
  if (!input.writeAvailable) {
    return { ...base, allowed: false, reason: 'unavailable', summary: editorMessage('save.writeUnavailable') };
  }
  if (errorCount > 0) {
    return {
      ...base,
      allowed: false,
      reason: 'validation-error',
      summary: editorMessage(errorCount === 1 ? 'save.errorCountOne' : 'save.errorCountOther', { count: errorCount }),
    };
  }
  if (!isDirty) {
    return { ...base, allowed: false, reason: 'clean', summary: editorMessage('save.documentUpToDate') };
  }
  return { ...base, allowed: true };
}

/** Map diagram save gate + diagnostic counts into the shared header contract. */
export function buildEditorSaveCapabilityFromDiagram(input: {
  allowed: boolean;
  reason?: EditorSaveBlockReason;
  summary?: EditorText;
  errorCount: number;
  warningCount: number;
  isDirty: boolean;
  saving: boolean;
  sandboxMode?: boolean;
  allowCleanApply?: boolean;
}): EditorSaveCapability {
  const { errorCount, warningCount, isDirty, saving } = input;
  const base = { errorCount, warningCount, isDirty };
  if (saving) {
    return { ...base, allowed: false, reason: 'saving', summary: editorMessage('save.savingChanges') };
  }
  if (input.sandboxMode) {
    return { ...base, allowed: false, reason: 'unavailable', summary: editorMessage('save.sandboxNoWrite') };
  }
  if (!input.allowed) {
    return {
      ...base,
      allowed: false,
      reason: input.reason,
      summary: input.summary ?? editorMessage('save.unavailable'),
    };
  }
  if (!isDirty && !input.allowCleanApply) {
    return { ...base, allowed: false, reason: 'clean', summary: editorMessage('save.diagramUpToDate') };
  }
  return { ...base, allowed: true, reason: input.reason, summary: input.summary };
}

export type SaveButtonChrome = {
  label: EditorMessage;
  variant: 'pavo' | 'secondary' | 'saving' | 'saved';
  title: EditorText;
  disabled: boolean;
};

export type SaveEntity = 'document' | 'diagram';

export function saveChromeFromCapability(
  capability: EditorSaveCapability,
  options?: { entity?: SaveEntity },
): SaveButtonChrome {
  const entity = options?.entity ?? 'document';
  if (capability.reason === 'saving') {
    return { label: editorMessage('save.saving'), variant: 'saving', title: editorMessage('save.savingChanges'), disabled: true };
  }
  if (!capability.allowed) {
    if (capability.reason === 'clean') {
      return {
        label: editorMessage('save.saved'),
        variant: 'saved',
        title: editorMessage(entity === 'diagram' ? 'save.diagramUpToDate' : 'save.documentUpToDate'),
        disabled: true,
      };
    }
    return {
      label: editorMessage('common.save'),
      variant: 'secondary',
      title: capability.summary ?? editorMessage('save.unavailable'),
      disabled: true,
    };
  }
  const { warningCount } = capability;
  return {
    label: editorMessage('common.save'),
    variant: 'pavo',
    title: warningCount > 0
      ? editorMessage(warningCount === 1 ? 'save.saveChangesWarningOne' : 'save.saveChangesWarningOther', { count: warningCount })
      : editorMessage('save.saveChanges'),
    disabled: false,
  };
}

/** Chrome listo para la cabecera: etiqueta y título traducidos. */
export function translateSaveChrome(t: EditorTranslate, chrome: SaveButtonChrome) {
  return { ...chrome, label: translateEditorText(t, chrome.label), title: translateEditorText(t, chrome.title) };
}

export function warningSaveConfirmCopy(
  warningCount: number,
  entity: SaveEntity = 'document',
): { title: EditorMessage; message: EditorMessage } {
  const one = warningCount === 1;
  const params = { count: warningCount };
  const message = entity === 'diagram'
    ? (one ? 'save.diagramWarningsConfirmOne' : 'save.diagramWarningsConfirmOther')
    : (one ? 'save.documentWarningsConfirmOne' : 'save.documentWarningsConfirmOther');
  return {
    title: editorMessage(one ? 'save.pendingWarningsOne' : 'save.pendingWarningsOther', params),
    message: editorMessage(message, params),
  };
}
