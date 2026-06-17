import React from 'react';
import { useGlossaryStore } from '../../store/GlossaryStore';
import { db } from '../../store/content';
import { useProgressStore } from '../../store/UserProgressStore';

interface ConceptLinkProps {
  /** El slug o ID del contenido que queremos enlazar (ej. "teorema-pitagoras") */
  targetId: string;
  /** El texto que será clickeable */
  children: React.ReactNode;
}

/**
 * Enlace Semántico (ConceptLink)
 * 
 * Es el componente principal para referenciar otros conceptos en los artículos MDX.
 * Al hacer click, en lugar de navegar a una nueva URL, abre el `MarginaliaPanel`
 * con la información del `targetId` para no romper el flujo de lectura actual.
 */
export const ConceptLink: React.FC<ConceptLinkProps> = ({ targetId, children }) => {
  const { openTerm, activeTerm } = useGlossaryStore();
  const isRead = useProgressStore(state => state.isRead(targetId));

  const theorem = db.getTheorem(targetId);
  const definition = db.getDefinition(targetId);
  const bio = db.getMathematicianById(targetId);
  const lesson = db.lessons.get(targetId);
  const example = db.examples.get(targetId);
  const exercise = db.exercises.get(targetId);
  const useCase = db.usecases.get(targetId);
  const axiom = db.axioms.get(targetId);
  const model = db.models.get(targetId);
  const demo = db.demos.get(targetId);
  
  const entity = theorem || definition || bio || lesson || example || exercise || useCase || axiom || model || demo;

  // Link roto — el targetId no existe en el ContentStore
  if (!entity) {
    return (
      <span
        className="text-granada font-bold border-b-2 border-granada border-dashed cursor-help"
        title={`Link roto: "${targetId}" no existe en el ContentStore`}
      >
        {children}
      </span>
    );
  }

  // Activo: este es el nodo que el MarginaliaPanel está mostrando ahora mismo
  const isActive = activeTerm === targetId;

  return (
    <span
      onClick={() => openTerm(targetId)}
      title={`Ver: ${(entity as any).title || (entity as any).name}`}
      className={[
        'font-bold border-b-2 cursor-pointer transition-all duration-150 px-[2px] rounded-none',
        isActive
          // Estado activo: fondo sólido terracota, texto crema — muy visible
          ? 'bg-terracota text-lienzo border-terracota'
          // Estado normal: subrayado tenue, hover suave
          : 'text-terracota border-terracota/40 hover:border-terracota hover:bg-terracota/10',
      ].join(' ')}
    >
      {children}
      {isRead && <span className="ml-[2px] text-[#2a6a2a] opacity-80" style={{ fontSize: '0.85em' }}>✓</span>}
    </span>
  );
};
