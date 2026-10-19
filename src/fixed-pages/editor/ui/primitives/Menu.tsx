import React from 'react';
import { cx } from './classNames';
import { rovingTargetIndex } from './rovingFocus';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The popover is positioned by the caller (`absolute left-0 top-full`…). */
  children: React.ReactNode;
}

/** Dropdown list: paper, one rule and a soft shadow. Arrow keys, Home and End move between items. */
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu({ className, children, onKeyDown, ...props }, ref) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = current < 0
      ? (event.key === 'ArrowUp' || event.key === 'End' ? items.length - 1 : 0)
      : rovingTargetIndex(event, current, items.length);
    if (next === null || event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    items[next]?.focus();
  };
  return (
    <div ref={ref} role="menu" className={cx('ed-menu', className)} onKeyDown={handleKeyDown} {...props}>
      {children}
    </div>
  );
});

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'neutral' | 'danger';
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { tone = 'neutral', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      className={cx('ed-menu__item', tone === 'danger' && 'ed-menu__item--danger', className)}
      {...props}
    />
  );
});
