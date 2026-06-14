import React from 'react';
import { useGlossaryStore } from '../store/GlossaryStore';

interface TermProps {
  id: string;
  children: React.ReactNode;
}

export const Term: React.FC<TermProps> = ({ id, children }) => {
  const openTerm = useGlossaryStore((state) => state.openTerm);

  return (
    <span 
      onClick={() => openTerm(id)}
      className="cursor-pointer border-b border-terracota/30 text-terracota hover:bg-terracota/10 hover:border-terracota transition-all font-medium relative group"
      title="Ver definición"
    >
      {children}
      {/* Indicador de que es interactivo */}
      <span className="absolute -top-1 -right-2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
    </span>
  );
};
