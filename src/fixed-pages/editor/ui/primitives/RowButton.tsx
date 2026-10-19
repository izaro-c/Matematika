import React from 'react';
import { cx } from './classNames';

export type RowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A line in a list or an index entry: the whole row is the button.
 * `aria-current` marks the open entry; `aria-expanded` a collapsible heading.
 */
export const RowButton = React.forwardRef<HTMLButtonElement, RowButtonProps>(function RowButton(
  { className, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={cx('ed-row', className)} {...props} />;
});
