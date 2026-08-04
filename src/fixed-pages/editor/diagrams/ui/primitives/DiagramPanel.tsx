import React from 'react';
import { IconChevronDown, IconChevronRight } from '../toolbar/WorkbenchIcons';

export interface DiagramPanelProps {
  title: string;
  badge?: string;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const panelClassName = 'rounded-xl border border-carbon/10 bg-lienzo/40 p-3 shadow-2xs transition-all';
const headerClassName = 'flex w-full items-center justify-between font-serif text-xs font-bold uppercase tracking-wider text-carbon/70 py-1 cursor-pointer select-none';
const bodyClassName = 'space-y-3 pt-2.5 border-t border-carbon/10 mt-1';

function PanelHeader({
  title,
  badge,
  isOpen = true,
  collapsible = false,
}: Pick<DiagramPanelProps, 'title' | 'badge'> & { isOpen?: boolean; collapsible?: boolean }) {
  return (
    <>
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {badge && (
          <span className="rounded-full bg-salvia/10 border border-salvia/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-salvia">
            {badge}
          </span>
        )}
      </span>
      {collapsible && (
        <span className="text-carbon/40 hover:text-carbon transition-colors">
          {isOpen ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
        </span>
      )}
    </>
  );
}

export const DiagramPanel: React.FC<DiagramPanelProps> = ({
  title,
  badge,
  collapsible = false,
  open,
  defaultOpen,
  onOpenChange,
  children,
  className = '',
}) => {
  if (collapsible) {
    const isControlled = open !== undefined && onOpenChange !== undefined;
    const isOpen = isControlled ? open : undefined;

    return (
      <details
        className={`${panelClassName} ${className}`.trim()}
        {...(isControlled ? { open } : { defaultOpen: defaultOpen ?? open ?? true })}
        onToggle={event => {
          if (isControlled) {
            event.preventDefault();
          } else if (onOpenChange) {
            onOpenChange(event.currentTarget.open);
          }
        }}
      >
        <summary
          className={headerClassName}
          onClick={isControlled && onOpenChange ? event => {
            event.preventDefault();
            onOpenChange(!open);
          } : undefined}
        >
          <PanelHeader title={title} badge={badge} isOpen={isOpen} collapsible />
        </summary>
        <div className={bodyClassName}>{children}</div>
      </details>
    );
  }

  return (
    <section className={`${panelClassName} ${className}`.trim()}>
      <header className={headerClassName}>
        <PanelHeader title={title} badge={badge} />
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
};

export default DiagramPanel;
