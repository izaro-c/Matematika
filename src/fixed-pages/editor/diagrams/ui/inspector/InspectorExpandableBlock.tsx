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
    <div className={`space-y-2 ${className}`.trim()}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between border-t border-carbon/10 py-1 text-xs font-bold text-carbon cursor-pointer"
      >
        <span>{title}</span>
        <span className="text-carbon/40">
          {expanded ? <IconChevronDown className="w-3 h-3" /> : <IconChevronRight className="w-3 h-3" />}
        </span>
      </button>
      {expanded ? <div className="space-y-2">{children}</div> : null}
    </div>
  );
};

export default InspectorExpandableBlock;
