import React from 'react';
import { Link } from 'wouter';
import { useGlossaryStore } from '@/lib/stores/GlossaryStore';
import { db } from '@/data/content';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

interface RefLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export const RefLink: React.FC<RefLinkProps> = ({ targetId, children }) => {
  const { lang, t, getLocalizedPath } = useI18n();
  const { openTerm, activeTerms } = useGlossaryStore();
  const isRead = useProgressStore(state => state.isRead(targetId));

  const entity =
    db.getTheorem(targetId, lang) ||
    db.getDefinition(targetId, lang) ||
    db.getMathematicianById(targetId, lang) ||
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
        href={getLocalizedPath(`/construccion/${targetId}`)}
        className="page-accent-link--pending border-b border-dashed transition-all duration-150 px-[2px] rounded-none cursor-pointer"
        title={t('construction', 'pendingTitle', { id: targetId })}
      >
        {children}
      </Link>
    );
  }

  const titleText = (entity as { title?: string, name?: string }).title || (entity as { title?: string, name?: string }).name || targetId;

  return (
    <span
      onClick={() => openTerm(targetId)}
      data-target-id={targetId}
      title={titleText}
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
