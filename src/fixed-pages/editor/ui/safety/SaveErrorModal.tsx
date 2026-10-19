import React from 'react';
import { useI18n } from '@/i18n';
import { Button, Modal } from '@/fixed-pages/editor/ui/primitives';
import type { EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';

interface SaveErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: EditorValidationIssue[];
  saveMessage?: string | null;
  onJumpToIssue?: (issue: EditorValidationIssue) => void;
  onOpenAvisos?: () => void;
}

export const SaveErrorModal: React.FC<SaveErrorModalProps> = ({
  isOpen,
  onClose,
  issues,
  saveMessage,
  onJumpToIssue,
  onOpenAvisos,
}) => {
  const { t } = useI18n();

  // Callers should pass blocking issues only; keep a filter as belt-and-suspenders.
  const errors = issues.filter(i => i.severity === 'error');
  const firstIssue = errors[0];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t('editor.save.cannotSaveTitle')}
      size="md"
      footer={
        <>
          {onOpenAvisos && (
            <Button variant="quiet" onClick={() => {
              onClose();
              onOpenAvisos();
            }}>
              {t('editor.save.viewWarnings')}
            </Button>
          )}
          {firstIssue && onJumpToIssue && (
            <Button variant="danger" onClick={() => {
              onClose();
              onJumpToIssue(firstIssue);
            }}>
              {t('editor.save.goToError')}
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>{t('editor.common.understood')}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <p>
          {saveMessage
            || (errors.length > 0
              ? `Se han detectado ${errors.length} error(es) de validación que impiden guardar los cambios.`
              : 'El guardado falló. Los avisos no bloquean; revisa permisos, token o el panel de avisos.')}
        </p>

        {errors.length > 0 && (
          <ul className="max-h-60 space-y-2 overflow-y-auto border-t border-[color:var(--ed-rule-faint)] pt-2">
            {errors.map(issueItem => (
              <li key={issueItem.id} className="flex items-start justify-between gap-2 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-granada">
                    Error <span className="font-mono text-xs font-normal text-carbon/55">{issueItem.area}</span>
                  </p>
                  <p>{issueItem.message}</p>
                </div>
                {onJumpToIssue && (
                  <Button
                    size="sm"
                    className="shrink-0"
                    title="Ir al elemento en el editor"
                    onClick={() => {
                      onClose();
                      onJumpToIssue(issueItem);
                    }}
                  >
                    Ir al error →
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};
