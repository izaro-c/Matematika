import React, { useState } from 'react';
import { IconChevronDown, IconChevronRight } from '../V2Icons';

export const DEFAULT_ACCORDION_STATE: Record<string, boolean> = {
  identity: true,
  geometry: true,
  content: true,
  marks_congruence: true,
  style: true,
  positioning: true,
  visibility_selection: true,
  constraints: true,
};

export function useV2InspectorAccordion(initial = DEFAULT_ACCORDION_STATE) {
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
    onClick={() => onToggle(sec)}
    className="flex w-full items-center justify-between py-1.5 px-2 bg-carbon/5 hover:bg-carbon/10 rounded-lg font-bold text-xs text-carbon transition-all cursor-pointer mt-2"
  >
    <span>{title}</span>
    <span className="text-carbon/40">
      {isOpen ? <IconChevronDown className="w-3 h-3" /> : <IconChevronRight className="w-3 h-3" />}
    </span>
  </button>
);

interface AccordionSectionProps {
  sec: string;
  title: string;
  isOpen: boolean;
  onToggle: (sec: string) => void;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ sec, title, isOpen, onToggle, children }) => (
  <>
    <AccordionHeader sec={sec} title={title} isOpen={isOpen} onToggle={onToggle} />
    {isOpen && children}
  </>
);
