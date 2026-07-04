import React from 'react';
import { useGlossaryStore } from '@/features/glossary/GlossaryStore';

/**
 * Propiedades de Concept
 */
interface ConceptProps {
  /** Enlace o ID del término del glosario a abrir */
  link: string;
  children: React.ReactNode;
}

/**
 * Enlace simple para abrir un término básico en el glosario global.
 * Funciona de manera similar a Term y ConceptLink pero con un estilo visual
 * de subrayado punteado/dashed muy sutil.
 */
export const Concept: React.FC<ConceptProps> = ({ link, children }) => {
  const { openTerm } = useGlossaryStore();

  return (
    <span 
      onClick={() => openTerm(link)}
      className="page-accent-link cursor-pointer border-b border-dashed transition-colors px-[2px] rounded-sm font-semibold"
      title="Ver definición en el glosario"
    >
      {children}
    </span>
  );
};
