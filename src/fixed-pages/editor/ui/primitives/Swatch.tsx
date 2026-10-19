import React from 'react';
import { cx } from './classNames';

export interface SwatchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Colour name: it is the accessible name and the tooltip. */
  label: string;
  selected?: boolean;
}

/** Round colour chip; the chosen one gets a double ring. The fill comes from `className` or `style`. */
export const Swatch = React.forwardRef<HTMLButtonElement, SwatchProps>(function Swatch(
  { label, selected = false, className, type = 'button', title, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={selected}
      title={title ?? label}
      className={cx('ed-swatch', className)}
      {...props}
    />
  );
});
