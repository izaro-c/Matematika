import React, { useState } from 'react';
import { IconChevronDown, IconChevronRight } from '../toolbar/WorkbenchIcons';

export const DEFAULT_ACCORDION_STATE: Record<string, boolean> = {
  identity: true,
  geometry: true,
  content: true,
  marks_congruence: true,
  style: true,
  positioning: true,
  visibility_selection: true,
  constraints: true,
  linked: true,
  targets: true,
  connections: true,
  semantic: true,
  aids: true,
  derived: true,
  appearance: true,
  readings: true,
  labels: true,
  rules: true,
  behavior: true,
};

export function useInspectorAccordion(initial = DEFAULT_ACCORDION_STATE) {
  const [openAccordion, setOpenAccordion] = useState<Record<string, boolean>>(initial);
  const toggleAccordion = (sec: string) => {
    setOpenAccordion(prev => ({ ...prev, [sec]: !prev[sec] }));
  };
  return { openAccordion, toggleAccordion };
}

interface AccordionHeaderProps {
  sec: string;
  title: string;
  isOpen: boolean;
  onToggle: (sec: string) => void;
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({ sec, title, isOpen, onToggle }) => (
  <button
    type="button"
    aria-expanded={isOpen}
    onClick={() => onToggle(sec)}
    className="flex w-full items-center justify-between font-serif text-xs font-bold uppercase tracking-wider text-carbon/70 py-1 cursor-pointer select-none"
  >
    <span>{title}</span>
    <span className="text-carbon/40 hover:text-carbon transition-colors">
      {isOpen ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
    </span>
  </button>
);

interface AccordionSectionProps {
  sec: string;
  title: string;
  isOpen: boolean;
  onToggle: (sec: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ sec, title, isOpen, onToggle, children, className = '' }) => (
  <div className={`rounded-xl border border-carbon/10 bg-lienzo/40 p-3 shadow-2xs transition-all ${className}`.trim()}>
    <AccordionHeader sec={sec} title={title} isOpen={isOpen} onToggle={onToggle} />
    {isOpen && (
      <div className="space-y-3 pt-2.5 border-t border-carbon/10 mt-1">
        {children}
      </div>
    )}
  </div>
);
