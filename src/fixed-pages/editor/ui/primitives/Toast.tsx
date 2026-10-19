import React, { useEffect, useRef } from 'react';
import { useI18n } from '@/i18n';
import { cx } from './classNames';
import { IconButton } from './IconButton';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  tone?: ToastTone;
  title?: React.ReactNode;
  children: React.ReactNode;
  onDismiss?: () => void;
  /** Milliseconds before `onDismiss` runs on its own; errors should stay until dismissed. */
  duration?: number;
  className?: string;
}

/** Printed note: the tone only colours the rule and the title, never a dot or a fill. */
export const Toast: React.FC<ToastProps> = ({ tone = 'info', title, children, onDismiss, duration, className }) => {
  const { t } = useI18n();
  const dismissRef = useRef(onDismiss);
  useEffect(() => { dismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    if (!duration) return undefined;
    const timer = window.setTimeout(() => dismissRef.current?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('ed-toast', tone !== 'info' && `ed-toast--${tone}`, className)}
    >
      <div className="ed-toast__content">
        {title && <strong className="ed-toast__title">{title}</strong>}
        {children}
      </div>
      {onDismiss && (
        <IconButton label={t('editor.common.close')} size="sm" onClick={onDismiss}>
          <span aria-hidden="true">✕</span>
        </IconButton>
      )}
    </div>
  );
};

/** Bottom-right stack where toasts appear; each toast announces itself. */
export const ToastRegion: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cx('ed-toast-region', className)}>{children}</div>
);
