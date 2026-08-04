import React, { useState } from 'react';
import { IconChevronDown, IconChevronRight } from '../toolbar/WorkbenchIcons';

export interface InspectorExpandableBlockProps {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const InspectorExpandableBlock: React.FC<InspectorExpandableBlockProps> = ({
  title,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  className = '',
}) => {
  const controlled = openProp !== undefined && onOpenChange !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const expanded = controlled ? openProp : uncontrolledOpen;
  const setExpanded = (next: boolean) => {
    if (controlled) onOpenChange(next);
    else setUncontrolledOpen(next);
  };

  return (
    <div className={`rounded-2xl border border-carbon/15 bg-lienzo p-4 shadow-2xs transition-all hover:border-carbon/25 ${className}`.trim()}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between font-serif text-xs font-bold uppercase tracking-wider text-carbon/80 py-0.5 cursor-pointer select-none"
      >
        <span>{title}</span>
        <span className="text-carbon/40 hover:text-carbon transition-colors p-0.5 rounded-lg hover:bg-carbon/5">
          {expanded ? <IconChevronDown className="w-4 h-4" /> : <IconChevronRight className="w-4 h-4" />}
        </span>
      </button>
      {expanded ? (
        <div className="space-y-3 pt-3 border-t border-carbon/10 mt-2">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default InspectorExpandableBlock;
