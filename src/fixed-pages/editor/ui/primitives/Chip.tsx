import React from 'react';
import { cx } from './classNames';

export type ChipState = 'default' | 'active' | 'missing';

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** `active` is the one already chosen: it is plain text, not a button. */
  state?: ChipState;
  children: React.ReactNode;
}

/** Short code in an index (`ES · EU · EN`): the chosen one carries the manicule, a missing one is dashed. */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { state = 'default', className, type = 'button', children, title, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const classes = cx('ed-chip', state === 'active' && 'ed-chip--active', state === 'missing' && 'ed-chip--missing', className);
  if (state === 'active') {
    return <span className={classes} title={title} aria-label={ariaLabel}>{children}</span>;
  }
  return (
    <button ref={ref} type={type} className={classes} title={title} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
});
