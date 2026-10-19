import React, { useId } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/i18n';
import { useModalFocus } from '../page/useModalFocus';
import { cx } from './classNames';
import { IconButton } from './IconButton';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  /** Actions, primary last: they line up on the right. */
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** False while an action must finish: Escape, the backdrop and ✕ do nothing. */
  dismissible?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

/** Dialog on plain paper with a single rule; focus is trapped and restored on close. */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'sm',
  dismissible = true,
  initialFocusRef,
  className,
}) => {
  const { t } = useI18n();
  const titleId = useId();
  const dialogRef = useModalFocus<HTMLDivElement>(open, onClose, initialFocusRef, !dismissible);

  if (!open) return null;

  return createPortal(
    <div
      className="ed-modal-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (dismissible && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('ed-modal', size !== 'sm' && `ed-modal--${size}`, className)}
      >
        <header className="ed-modal__header">
          <h2 id={titleId} className="ed-modal__title">{title}</h2>
          {dismissible && (
            <IconButton label={t('editor.common.close')} onClick={onClose}>
              <span aria-hidden="true">✕</span>
            </IconButton>
          )}
        </header>
        <div className="ed-modal__body">{children}</div>
        {footer && <footer className="ed-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
};
