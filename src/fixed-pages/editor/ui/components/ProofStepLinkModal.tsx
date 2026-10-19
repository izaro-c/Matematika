import React, { useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Field, Modal } from '@/fixed-pages/editor/ui/primitives';

interface ProofStepLinkModalProps {
  isOpen: boolean;
  initialStep?: number;
  maxSteps?: number;
  onClose: () => void;
  onConfirm: (step: number) => void;
  onRemove?: () => void;
}

export const ProofStepLinkModal: React.FC<ProofStepLinkModalProps> = ({
  isOpen,
  initialStep = 1,
  maxSteps = 10,
  onClose,
  onConfirm,
  onRemove,
}) => {
  const { t } = useI18n();
  const [stepValue, setStepValue] = useState<string>(String(initialStep));
  const stepInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(stepValue.trim(), 10);
    const valid = isNaN(num) || num < 1 ? 1 : num;
    onConfirm(valid);
    onClose();
  };

  const handleSelectStep = (num: number) => {
    onConfirm(num);
    onClose();
  };

  const stepOptions = Array.from({ length: Math.max(maxSteps, 5) }, (_, i) => i + 1);

  const formId = 'proof-step-link-form';

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t('editor.stepLink.title')}
      initialFocusRef={stepInputRef}
      footer={
        <>
          {onRemove && (
            <Button variant="danger" className="mr-auto" onClick={() => {
              onRemove();
              onClose();
            }}>
              {t('editor.stepLink.removeLink')}
            </Button>
          )}
          <Button onClick={onClose}>{t('editor.common.cancel')}</Button>
          <Button variant="primary" type="submit" form={formId}>{t('editor.stepLink.apply')}</Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <Field label={t('editor.stepLink.numberLabel')}>
          <input
            ref={stepInputRef}
            type="number"
            min="1"
            value={stepValue}
            onChange={e => setStepValue(e.target.value)}
            placeholder="1"
          />
        </Field>

        {stepOptions.length > 0 && (
          <div>
            <p className="ed-field__label">{t('editor.stepLink.available')}</p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
              {stepOptions.map(num => (
                <Button
                  key={num}
                  size="sm"
                  aria-pressed={Number(stepValue) === num}
                  onClick={() => handleSelectStep(num)}
                >
                  {t('editor.stepLink.stepN', { num })}
                </Button>
              ))}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
