import React from 'react';
import { Link } from 'wouter';
import { useGlossaryStore } from '@/controller/store/GlossaryStore';
import { db } from '@/database/dao/content';
import { useProgressStore } from '@/controller/store/UserProgressStore';

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
      <Link href={`/construccion/${targetId}`}>
        <a
          className="font-bold text-pizarra/70 border-b border-dashed border-pizarra/40 hover:border-pizarra hover:text-pizarra transition-all duration-150 px-[2px] rounded-none cursor-pointer"
          title={`"${targetId}" — página en construcción`}
        >
          {children}
        </a>
      </Link>
    );
  }

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
