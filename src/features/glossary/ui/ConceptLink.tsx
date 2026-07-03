import React from 'react';
import { Link } from 'wouter';
import { useGlossaryStore, dictionary } from '@/features/glossary/GlossaryStore';
import { db } from '@/entities/content';
import { useProgressStore } from '@/features/progress/UserProgressStore';

interface ConceptLinkProps {
  targetId: string | string[];
  isDependency?: boolean;
  children: React.ReactNode;
}

const isIdValid = (id: string): boolean => !!(  
  dictionary[id] || db.getTheorem(id) || db.getDefinition(id) || db.getMathematicianById(id) ||
  db.lessons.get(id) || db.examples.get(id) || db.exercises.get(id) ||
  db.usecases.get(id) || db.axioms.get(id) || db.getAxiomaticSystem(id) ||
  db.models.get(id) || db.demos.get(id)
);

export const ConceptLink: React.FC<ConceptLinkProps> = ({ targetId, children }) => {
  const { openTerm, activeTerms } = useGlossaryStore();
  const targetIds = Array.isArray(targetId) ? targetId : [targetId];
  
  const isRead = useProgressStore(state => targetIds.every(id => state.isRead(id)));
  
  const validIds   = targetIds.filter(isIdValid);
  const allValid   = validIds.length === targetIds.length;
  const isActive   = activeTerms ? targetIds.some(id => activeTerms.includes(id)) : false;

  // Even construction links expose valid sibling IDs for the connection graph
  const dataAttr = validIds.length > 0 ? validIds.join(',') : undefined;

  if (!allValid) {
    const firstInvalid = targetIds.find(id => !isIdValid(id)) || targetIds[0];

    return (
      <Link
        href={`/construccion/${firstInvalid}`}
        data-target-id={dataAttr}
        className="font-bold text-terracota/70 underline decoration-dashed decoration-terracota/40 decoration-2 underline-offset-4 hover:decoration-terracota hover:text-terracota transition-all duration-150 rounded-none cursor-pointer"
        title={`"${firstInvalid}" — página en construcción`}
      >
        {children}
      </Link>
    );
  }

  return (
    <span
      onClick={() => openTerm(targetIds)}
      data-target-id={targetIds.join(',')}
      title={`Ver contenido relacionado`}
      className={[
        'font-bold cursor-pointer transition-all duration-150 rounded-none',
        isActive
          ? 'bg-terracota text-lienzo underline decoration-terracota decoration-2 underline-offset-4'
          : 'text-terracota underline decoration-terracota/40 decoration-2 underline-offset-4 hover:decoration-terracota hover:bg-terracota/10',
      ].join(' ')}
    >
      {children}
      {isRead && <span className="ml-[2px] text-salvia opacity-80" style={{ fontSize: '0.85em' }}>✓</span>}
    </span>
  );
};
