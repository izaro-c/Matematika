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

const panelClassName = 'rounded border border-pavo/25 bg-pavo/5';
const headerClassName = 'min-h-11 cursor-pointer list-none px-2 py-2 text-xs font-bold text-pavo [&::-webkit-details-marker]:hidden';
const staticHeaderClassName = 'min-h-11 px-2 py-2 text-xs font-bold text-pavo';
const bodyClassName = 'space-y-2 border-t border-pavo/15 p-2';

function PanelHeader({
  title,
  badge,
  showCaret = false,
}: Pick<DiagramPanelProps, 'title' | 'badge'> & { showCaret?: boolean }) {
  return (
    <>
      {title}
      {badge ? (
        <span className="float-right text-[9px] font-normal text-carbon/45">
          {badge}
          {showCaret ? ' ▾' : ''}
        </span>
      ) : null}
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
