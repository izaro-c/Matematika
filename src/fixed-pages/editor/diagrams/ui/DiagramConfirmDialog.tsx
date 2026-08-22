import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { DiagramButton } from './primitives';

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

const variantStyles: Record<
  DiagramConfirmVariant,
  {
    headerBg: string;
    titleColor: string;
    iconBg: string;
    iconColor: string;
    buttonVariant: 'danger' | 'warning' | 'primary' | 'success';
    icon: React.ReactNode;
  }
> = {
  danger: {
    headerBg: 'bg-granada/10 border-granada/20',
    titleColor: 'text-granada',
    iconBg: 'bg-granada/15',
    iconColor: 'text-granada',
    buttonVariant: 'danger',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  warning: {
    headerBg: 'bg-ocre/10 border-ocre/20',
    titleColor: 'text-ocre',
    iconBg: 'bg-ocre/15',
    iconColor: 'text-ocre',
    buttonVariant: 'warning',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    headerBg: 'bg-pavo/10 border-pavo/20',
    titleColor: 'text-pavo',
    iconBg: 'bg-pavo/15',
    iconColor: 'text-pavo',
    buttonVariant: 'primary',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    headerBg: 'bg-canela/10 border-canela/20',
    titleColor: 'text-canela',
    iconBg: 'bg-canela/15',
    iconColor: 'text-canela',
    buttonVariant: 'success',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

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
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLElement>(isOpen, onCancel, cancelRef);

  if (!isOpen || typeof document === 'undefined') return null;

  const style = variantStyles[variant] ?? variantStyles.danger;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-carbon/50 backdrop-blur-xs p-4" role="presentation">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagram-confirm-title"
        aria-describedby="diagram-confirm-description"
        className="w-full max-w-md rounded-2xl border border-carbon/15 bg-lienzo shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-carbon"
      >
        <header className={`flex items-center space-x-3 border-b border-carbon/10 p-4 ${style.headerBg}`}>
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.iconColor}`}>
            {style.icon}
          </div>
          <h2 id="diagram-confirm-title" className={`font-serif text-base font-bold leading-snug ${style.titleColor}`}>
            {title}
          </h2>
        </header>
        <div className="p-5">
          <p id="diagram-confirm-description" className="text-xs leading-relaxed text-carbon/80">
            {message}
          </p>
        </div>
        <footer className="flex flex-wrap justify-end gap-2.5 border-t border-carbon/10 bg-carbon/5 p-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl border border-carbon/20 text-xs font-bold text-carbon/80 hover:bg-carbon/10 hover:text-carbon transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-canela"
          >
            {cancelLabel}
          </button>
          <DiagramButton type="button" variant={style.buttonVariant} onClick={onConfirm}>
            {confirmLabel}
          </DiagramButton>
        </footer>
      </section>
    </div>,
    document.body
  );
};

export default DiagramConfirmDialog;
