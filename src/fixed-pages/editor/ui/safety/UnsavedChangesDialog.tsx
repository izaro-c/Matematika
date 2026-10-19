import React, { useRef } from 'react';
import { useI18n } from '@/i18n';
import type { SafetyPresentation } from '@/fixed-pages/editor/review/safetyPresentation';
import { Button, Modal } from '@/fixed-pages/editor/ui/primitives';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  targetLabel: string;
  presentation: SafetyPresentation;
  onCancel: () => void;
  onSave: () => void;
  onSaveDraft: () => void;
  onDiscardAndContinue: () => void;
  canSave: boolean;
  canSaveDraft: boolean;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  targetLabel,
  presentation,
  onCancel,
  onSave,
  onSaveDraft,
  onDiscardAndContinue,
  canSave,
  canSaveDraft,
}) => {
  const { t } = useI18n();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      title={t('editor.save.unsavedChanges')}
      size="md"
      initialFocusRef={cancelRef}
      footer={
        <>
          <Button variant="danger" className="mr-auto" onClick={onDiscardAndContinue}>{t('editor.common.discard')}</Button>
          <Button ref={cancelRef} onClick={onCancel}>{t('editor.save.stay')}</Button>
          <Button onClick={onSaveDraft} disabled={!canSaveDraft}>{t('editor.save.saveDraft')}</Button>
          <Button variant="primary" onClick={onSave} disabled={!canSave}>{t('editor.common.save')}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <p>La acción hacia {targetLabel} descartaría cambios que todavía no están aplicados al archivo real.</p>
        <p>{presentation.description}</p>
        <p className="font-semibold">{presentation.title}</p>
        {presentation.recommendedAction && (
          <p className="italic">Acción recomendada: {presentation.recommendedAction.label}.</p>
        )}
      </div>
    </Modal>
  );
};

export default UnsavedChangesDialog;
