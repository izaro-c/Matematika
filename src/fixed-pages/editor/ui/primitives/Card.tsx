import React from 'react';
import { cx } from './classNames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Empty states and drop areas: a dashed rule instead of a solid one. */
  dashed?: boolean;
}

/** A boxed item on plain paper: one thin rule, no shadow. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ dashed = false, className, ...props }, ref) {
  return <div ref={ref} className={cx('ed-card', dashed && 'ed-card--dashed', className)} {...props} />;
});

export type CalloutTone = 'info' | 'warning' | 'error' | 'success';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CalloutTone;
}

/** A note set off by a coloured rule on the left; `error` announces itself (role="alert"). */
export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  { tone = 'info', className, role, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={role ?? (tone === 'error' ? 'alert' : undefined)}
      className={cx('ed-callout', `ed-callout--${tone}`, className)}
      {...props}
    />
  );
});
