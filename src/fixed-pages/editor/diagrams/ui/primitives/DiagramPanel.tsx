import React from 'react';

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

const panelClassName = 'group border border-pavo/25 bg-pavo/5 overflow-hidden';
const headerClassName = 'flex w-full items-center justify-between min-h-11 cursor-pointer list-none bg-carbon/5 hover:bg-carbon/10 transition-colors duration-200 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-carbon/80 [&::-webkit-details-marker]:hidden select-none';
const staticHeaderClassName = 'flex w-full items-center justify-between min-h-11 px-3 py-2.5 bg-carbon/5 text-[10px] font-bold uppercase tracking-wider text-carbon/80 border-b border-carbon/20 select-none';
const bodyClassName = 'space-y-3 p-3';

function PanelHeader({
  title,
  badge,
  showCaret = false,
}: Pick<DiagramPanelProps, 'title' | 'badge'> & { showCaret?: boolean }) {
  return (
    <>
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {badge && (
          <span className="rounded-full bg-pavo/15 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-widest text-pavo">
            {badge}
          </span>
        )}
      </span>
      {showCaret && (
        <span className="text-[9px] text-carbon/40 transition-transform duration-200 group-open:-scale-y-100">
          ▼
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
    return (
      <details
        className={`${panelClassName} ${className}`.trim()}
        {...(isControlled ? { open } : { defaultOpen: defaultOpen ?? open })}
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
          <PanelHeader title={title} badge={badge} showCaret />
        </summary>
        <div className={bodyClassName}>{children}</div>
      </details>
    );
  }

  return (
    <section className={`${panelClassName} ${className}`.trim()}>
      <header className={staticHeaderClassName}>
        <PanelHeader title={title} badge={badge} />
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
};

export default DiagramPanel;
