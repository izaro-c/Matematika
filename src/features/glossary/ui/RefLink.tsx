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
    db.methods.get(targetId) ||
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
        className="page-accent-link font-bold border-b border-dashed transition-all duration-150 px-[2px] rounded-none cursor-pointer"
        title={`"${targetId}" — página en construcción`}
      >
        {children}
      </Link>
    );
  }

  return (
    <span
      onClick={() => openTerm(targetId)}
      data-target-id={targetId}
      title={`Ver: ${(entity as { title?: string, name?: string }).title || (entity as { title?: string, name?: string }).name}`}
      className={[
        'page-accent-link font-bold border-b-2 cursor-pointer transition-all duration-150 px-[2px] rounded-none',
        isActive
          ? 'is-active'
          : '',
      ].join(' ')}
    >
      {children}
      {isRead && <span className="ml-[2px] text-salvia opacity-80" style={{ fontSize: '0.85em' }}>✓</span>}
    </span>
  );
};
