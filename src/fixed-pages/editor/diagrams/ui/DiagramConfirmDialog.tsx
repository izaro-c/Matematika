import React from 'react';
import { Button, Modal } from '@/fixed-pages/editor/ui/primitives';

export type DiagramConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

export interface DiagramConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DiagramConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DiagramConfirmDialog: React.FC<DiagramConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default DiagramConfirmDialog;
