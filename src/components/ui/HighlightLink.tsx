import React from 'react';
import { useLessonStore } from '../../store/LessonStore';

interface HighlightLinkProps {
  target: string;
  children: React.ReactNode;
}

export const HighlightLink: React.FC<HighlightLinkProps> = ({ target, children }) => {
  const { setActiveStep } = useLessonStore();

  return (
    <span 
      onClick={() => setActiveStep(target)}
      onMouseEnter={() => setActiveStep(target)}
      onMouseLeave={() => setActiveStep(null)}
      className="cursor-pointer border-b-2 border-salvia bg-salvia/20 hover:bg-salvia/40 transition-colors rounded-sm px-[4px] py-[2px] font-bold text-carbon shadow-sm"
      title="Resaltar en el simulador"
    >
      {children}
    </span>
  );
};
