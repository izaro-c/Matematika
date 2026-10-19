import React from 'react';
import { cx } from './classNames';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Accessible name, also shown as the tooltip: an icon alone says nothing. */
  label: string;
  tone?: 'neutral' | 'danger';
  size?: 'sm' | 'md';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tone = 'neutral', size = 'md', className, type = 'button', title, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={title ?? label}
      className={cx(
        'ed-icon-button',
        tone === 'danger' && 'ed-icon-button--danger',
        size === 'sm' && 'ed-icon-button--sm',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
