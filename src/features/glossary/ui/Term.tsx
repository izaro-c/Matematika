
import { useGlossaryStore } from '@/features/glossary/GlossaryStore';

/**
 * Propiedades del Término
 */
interface TermProps {
  /** ID del término a buscar en el glosario */
  id: string;
  children: React.ReactNode;
}

/**
 * Alternativa a GlossaryLink o ConceptLink, orientada puramente a abrir el panel
 * del glosario con un estilo visual en terracota sólido, indicando con una "✦" 
 * que es un elemento interactivo al hacer hover.
 */
export const Term: React.FC<TermProps> = ({ id, children }) => {
  const openTerm = useGlossaryStore((state) => state.openTerm);

  return (
    <span 
      onClick={() => openTerm(id)}
      className="page-accent-link cursor-pointer border-b transition-all font-medium relative group"
      title="Ver definición"
    >
      {children}
      {/* Indicador de que es interactivo */}
      <span className="absolute -top-1 -right-2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
    </span>
  );
};
