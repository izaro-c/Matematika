import React from 'react';
import { Link } from 'wouter';
import { db } from '../../store/content';
import { ModelBadgeList } from './ModelBadge';

interface ContentHeaderProps {
  typeLabel: string;
  typeColor?: string;
  title: string;
  description?: string;
  authorIds?: string[];
  nodeId?: string;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  typeLabel,
  typeColor,
  title,
  description,
  authorIds,
  nodeId,
}) => {
  return (
    <div className="mb-16 border-b border-carbon/10 pb-12">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
        <span className={`text-sm uppercase tracking-widest font-sans font-bold text-${typeColor || 'carbon'}/80`}>
          {typeLabel}
        </span>
        {nodeId && <ModelBadgeList nodeId={nodeId} />}
      </div>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontVariant: 'small-caps' }}>
        {title}
      </h1>
      {description && (
        <p className="text-xl text-carbon/70 italic border-l-4 border-carbon/20 pl-6 leading-relaxed">
          {description}
        </p>
      )}

      {authorIds && authorIds.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {authorIds.map(authorId => {
            const author = db.getMathematicianById(authorId);
            return author ? (
              <Link key={authorId} href={`/bio/${author.slug}`}>
                <a className="inline-flex items-center gap-3 px-4 py-2 border border-carbon/10 bg-carbon/5 hover:bg-carbon hover:text-lienzo transition-colors rounded-full">
                  <span className="font-sans text-xs uppercase tracking-widest font-bold">Autor:</span>
                  <span className="font-bold" style={{ fontVariant: 'small-caps' }}>{author.name}</span>
                </a>
              </Link>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};
