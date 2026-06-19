import React from 'react';
import { useGlossaryStore } from '../../store/GlossaryStore';
import { db } from '../../store/content';
import { useProgressStore } from '../../store/UserProgressStore';

interface RefLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export const RefLink: React.FC<RefLinkProps> = ({ targetId, children }) => {
  const { openTerm, activeTerm } = useGlossaryStore();
  const isRead = useProgressStore(state => state.isRead(targetId));

  const entity =
    db.getTheorem(targetId) ||
    db.getDefinition(targetId) ||
    db.getMathematicianById(targetId) ||
    db.lessons.get(targetId) ||
    db.examples.get(targetId) ||
    db.exercises.get(targetId) ||
    db.usecases.get(targetId) ||
    db.axioms.get(targetId) ||
    db.getAxiomaticSystem(targetId) ||
    db.models.get(targetId) ||
    db.demos.get(targetId);

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

  const isActive = activeTerm === targetId;

  return (
    <span
      onClick={() => openTerm(targetId)}
      title={`Ver: ${(entity as any).title || (entity as any).name}`}
      className={[
        'font-bold border-b-2 cursor-pointer transition-all duration-150 px-[2px] rounded-none',
        isActive
          ? 'bg-pizarra text-lienzo border-pizarra'
          : 'text-pizarra border-pizarra/40 hover:border-pizarra hover:bg-pizarra/10',
      ].join(' ')}
    >
      {children}
      {isRead && <span className="ml-[2px] text-[#2a6a2a] opacity-80" style={{ fontSize: '0.85em' }}>✓</span>}
    </span>
  );
};
