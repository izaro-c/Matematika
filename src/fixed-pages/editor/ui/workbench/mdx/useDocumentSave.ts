import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n';
import { translateEditorText } from '@/fixed-pages/editor/types/editorMessage';
import { saveBlockedByValidation } from '@/fixed-pages/editor/session/validationMessages';
import type { SaveAttemptResult } from '@/fixed-pages/editor/session/useEditorCore';
import { buildMdxSaveCapability, warningSaveConfirmCopy } from '@/fixed-pages/editor/save/saveCapability';
import { editorApiUnavailableInProduction, editorWriteAccessGranted } from '@/fixed-pages/editor/save/editorApiBase';

interface Options {
  currentFile: string | null;
  hasLocalChanges: boolean;
  saving: boolean;
  baseVersion: unknown;
  isReadOnly: boolean;
  validation: { errorCount: number; warningCount: number };
  pendingFileNavigation: unknown;
  cancelPendingNavigation: () => void;
  saveCurrentFile: () => Promise<SaveAttemptResult>;
}

/** Guardado del documento: capacidad, confirmación de avisos, error de guardado y atajos (Ctrl+S, Esc). */
export function useDocumentSave({
  currentFile,
  hasLocalChanges,
  saving,
  baseVersion,
  isReadOnly,
  validation,
  pendingFileNavigation,
  cancelPendingNavigation,
  saveCurrentFile,
}: Options) {
  const { t } = useI18n();
  const [saveErrorModalOpen, setSaveErrorModalOpen] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [warningSaveOpen, setWarningSaveOpen] = useState(false);

  const writeAvailable = !editorApiUnavailableInProduction() && editorWriteAccessGranted();
  const saveCapability = useMemo(
    () =>
      buildMdxSaveCapability({
        isDirty: hasLocalChanges,
        saving,
        errorCount: validation.errorCount,
        warningCount: validation.warningCount,
        hasFile: Boolean(currentFile),
        hasVersion: Boolean(baseVersion),
        writeAvailable,
        isReadOnly,
      }),
    [
      baseVersion,
      currentFile,
      hasLocalChanges,
      isReadOnly,
      saving,
      validation.errorCount,
      validation.warningCount,
      writeAvailable,
    ],
  );

  const performSaveDocument = useCallback(async () => {
    if (!hasLocalChanges) return false;
    if (validation.errorCount > 0) {
      setSaveErrorMessage(translateEditorText(t, saveBlockedByValidation(validation.errorCount)));
      setSaveErrorModalOpen(true);
      return false;
    }
    const result = await saveCurrentFile();
    if (!result.ok) {
      setSaveErrorMessage(translateEditorText(t, result.reason));
      setSaveErrorModalOpen(true);
      return false;
    }
    return true;
  }, [hasLocalChanges, saveCurrentFile, t, validation.errorCount]);

  const warningSaveCopy = warningSaveConfirmCopy(saveCapability.warningCount);

  const handleSaveDocument = useCallback(() => {
    if (!saveCapability.allowed) return;
    if (saveCapability.warningCount > 0) {
      setWarningSaveOpen(true);
      return;
    }
    void performSaveDocument();
  }, [performSaveDocument, saveCapability.allowed, saveCapability.warningCount]);

  const confirmWarningSave = useCallback(() => {
    setWarningSaveOpen(false);
    void performSaveDocument();
  }, [performSaveDocument]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && pendingFileNavigation) {
        event.preventDefault();
        cancelPendingNavigation();
        return;
      }

      const isModifier = event.ctrlKey || event.metaKey;
      if (isModifier && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (currentFile) {
          void handleSaveDocument();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingFileNavigation, cancelPendingNavigation, currentFile, handleSaveDocument]);

  return {
    saveCapability,
    handleSaveDocument,
    confirmWarningSave,
    warningSaveCopy,
    warningSaveOpen,
    setWarningSaveOpen,
    saveErrorModalOpen,
    setSaveErrorModalOpen,
    saveErrorMessage,
  };
}
