import React, { useState } from 'react';
import { cx } from './classNames';

export interface PanelHeaderProps {
  title: React.ReactNode;
  /** Short aside after the title (a count, «opcional»), in italic old-style numerals. */
  meta?: React.ReactNode;
  /** Controls on the right, such as IconButtons. */
  actions?: React.ReactNode;
  /** Heading level inside the page outline. */
  level?: 2 | 3 | 4;
  className?: string;
}

/** Rubric in small caps; no eyebrow and no subtitle under it. */
export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, meta, actions, level = 3, className }) => {
  const Heading = `h${level}` as const;
  return (
    <div className={cx('ed-panel-header', className)}>
      <Heading className="ed-panel-header__title">
        {title}
        {meta && <span className="ed-panel-header__meta">{meta}</span>}
      </Heading>
      {actions && (
        // Inside a <summary>, clicking an action must not fold the panel.
        <span className="ed-panel-header__actions" onClick={event => event.preventDefault()}>
          {actions}
        </span>
      )}
    </div>
  );
};

export interface PanelProps extends Omit<PanelHeaderProps, 'className'> {
  title: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  /** Controlled open state; pass it with `onOpenChange`. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Section of a side panel on plain paper; consecutive panels are separated by
 * a single thin rule. Collapsible panels use <details>.
 */
export const Panel: React.FC<PanelProps> = ({
  title,
  meta,
  actions,
  level,
  children,
  collapsible = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
}) => {
  // React has no `defaultOpen` for <details>: keep the uncontrolled state here.
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? open ?? true);
  const header = <PanelHeader title={title} meta={meta} actions={actions} level={level} />;

  if (!collapsible) {
    return (
      <section className={cx('ed-panel', className)}>
        {header}
        <div className="ed-panel__body">{children}</div>
      </section>
    );
  }

  const isControlled = open !== undefined && onOpenChange !== undefined;
  return (
    <details
      className={cx('ed-panel', className)}
      open={isControlled ? open : uncontrolledOpen}
      onToggle={event => {
        if (isControlled) return;
        setUncontrolledOpen(event.currentTarget.open);
        onOpenChange?.(event.currentTarget.open);
      }}
    >
      <summary
        className="ed-panel__summary"
        onClick={isControlled ? event => {
          event.preventDefault();
          onOpenChange(!open);
        } : undefined}
      >
        {header}
      </summary>
      <div className="ed-panel__body">{children}</div>
    </details>
  );
};
