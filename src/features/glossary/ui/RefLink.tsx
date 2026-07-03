import React from 'react';
import { Link } from 'wouter';
import { useGlossaryStore } from '@/features/glossary/GlossaryStore';
import { db } from '@/entities/content';
import { useProgressStore } from '@/features/progress/UserProgressStore';

interface RefLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export const RefLink: React.FC<RefLinkProps> = ({ targetId, children }) => {
  const { openTerm, activeTerms } = useGlossaryStore();
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

  const isActive = activeTerms ? activeTerms.includes(targetId) : false;

  if (!entity) {
    return (
      <Link
        href={`/construccion/${targetId}`}
        className="font-bold text-pizarra/70 border-b border-dashed border-pizarra/40 hover:border-pizarra hover:text-pizarra transition-all duration-150 px-[2px] rounded-none cursor-pointer"
        title={`"${targetId}" — página en construcción`}
      >
        {children}
      </Link>
    );
  }

  return (
    <span
      onClick={() => openTerm(targetId)}
      title={`Ver: ${(entity as { title?: string, name?: string }).title || (entity as { title?: string, name?: string }).name}`}
      className={[
        'font-bold border-b-2 cursor-pointer transition-all duration-150 px-[2px] rounded-none',
        isActive
          ? 'bg-pizarra text-lienzo border-pizarra'
          : 'text-pizarra border-pizarra/40 hover:border-pizarra hover:bg-pizarra/10',
      ].join(' ')}
    >
      {children}
      {isRead && <span className="ml-[2px] text-salvia opacity-80" style={{ fontSize: '0.85em' }}>✓</span>}
    </span>
  );
};
