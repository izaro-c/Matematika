import React from 'react';
import { cx } from './classNames';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'quiet';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Printed label: one rule, small caps and a ☞ manicule on the primary action.
 * A toggle passes `aria-pressed`; the pressed primary turns the manicule (☜).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', fullWidth = false, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'ed-button',
        variant !== 'secondary' && `ed-button--${variant}`,
        size === 'sm' && 'ed-button--sm',
        fullWidth && 'ed-button--full',
        className,
      )}
      {...props}
    />
  );
});
