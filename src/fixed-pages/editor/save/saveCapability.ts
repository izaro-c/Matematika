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
  summary?: string;
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
    return { ...base, allowed: false, reason: 'saving', summary: 'Guardando cambios…' };
  }
  if (input.isReadOnly) {
    return { ...base, allowed: false, reason: 'read-only', summary: 'Documento de solo lectura' };
  }
  if (!input.hasFile || !input.hasVersion) {
    return { ...base, allowed: false, reason: 'unavailable', summary: 'Guardado no disponible' };
  }
  if (!input.writeAvailable) {
    return { ...base, allowed: false, reason: 'unavailable', summary: 'API o token de edición no disponibles' };
  }
  if (errorCount > 0) {
    return {
      ...base,
      allowed: false,
      reason: 'validation-error',
      summary: errorCount === 1 ? '1 error' : `${errorCount} errores`,
    };
  }
  if (!isDirty) {
    return { ...base, allowed: false, reason: 'clean', summary: 'Documento al día' };
  }
  return { ...base, allowed: true };
}

/** Map diagram save gate + diagnostic counts into the shared header contract. */
export function buildEditorSaveCapabilityFromDiagram(input: {
  allowed: boolean;
  reason?: EditorSaveBlockReason;
  summary?: string;
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
    return { ...base, allowed: false, reason: 'saving', summary: 'Guardando cambios…' };
  }
  if (input.sandboxMode) {
    return { ...base, allowed: false, reason: 'unavailable', summary: 'Sandbox: no escribe al corpus' };
  }
  if (!input.allowed) {
    return {
      ...base,
      allowed: false,
      reason: input.reason,
      summary: input.summary ?? 'Guardado no disponible',
    };
  }
  if (!isDirty && !input.allowCleanApply) {
    return { ...base, allowed: false, reason: 'clean', summary: 'Diagrama al día' };
  }
  return { ...base, allowed: true, reason: input.reason, summary: input.summary };
}

export type SaveButtonChrome = {
  label: string;
  variant: 'pavo' | 'secondary' | 'saving' | 'saved';
  title: string;
  disabled: boolean;
};

export function saveChromeFromCapability(
  capability: EditorSaveCapability,
  options?: { entityLabel?: 'Documento' | 'Diagrama' },
): SaveButtonChrome {
  const entity = options?.entityLabel ?? 'Documento';
  if (capability.reason === 'saving') {
    return { label: 'Guardando…', variant: 'saving', title: 'Guardando cambios…', disabled: true };
  }
  if (!capability.allowed) {
    if (capability.reason === 'clean') {
      return { label: 'Guardado', variant: 'saved', title: `${entity} al día`, disabled: true };
    }
    return {
      label: 'Guardar',
      variant: 'secondary',
      title: capability.summary ?? 'Guardado no disponible',
      disabled: true,
    };
  }
  const warningHint = capability.warningCount > 0
    ? ` (${capability.warningCount} aviso${capability.warningCount === 1 ? '' : 's'}; pedir confirmación)`
    : '';
  return {
    label: 'Guardar',
    variant: 'pavo',
    title: `Guardar cambios${warningHint}`,
    disabled: false,
  };
}

export function warningSaveConfirmCopy(
  warningCount: number,
  entityLabel: 'documento' | 'diagrama' = 'documento',
): { title: string; message: string } {
  const n = warningCount;
  return {
    title: n === 1 ? 'Hay 1 aviso pendiente' : `Hay ${n} avisos pendientes`,
    message:
      n === 1
        ? `El ${entityLabel} tiene 1 aviso que no bloquea el guardado. ¿Quieres guardarlo de todos modos?`
        : `El ${entityLabel} tiene ${n} avisos que no bloquean el guardado. ¿Quieres guardarlo de todos modos?`,
  };
}
