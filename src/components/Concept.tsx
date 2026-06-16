import React from 'react';
import { useGlossaryStore } from '../store/GlossaryStore';

interface ConceptProps {
  link: string;
  children: React.ReactNode;
}

export const Concept: React.FC<ConceptProps> = ({ link, children }) => {
  const { openTerm } = useGlossaryStore();

  return (
    <span 
      onClick={() => openTerm(link)}
      className="cursor-pointer border-b border-dashed border-terracota/60 hover:bg-terracota/10 hover:border-terracota transition-colors px-[2px] rounded-sm text-carbon font-semibold"
      title="Ver definición en el glosario"
    >
      {children}
    </span>
  );
};
