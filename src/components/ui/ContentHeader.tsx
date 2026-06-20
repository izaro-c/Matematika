import React from 'react';
import { Link } from 'wouter';
import { Breadcrumbs } from './Breadcrumbs';
import type { Crumb } from './Breadcrumbs';
import { ContentTypeBadge } from './ContentTypeBadge';
import { ModelBadgeList } from './ModelBadge';
import { TagList } from './TagList';
import { db } from '../../store/content';

interface ContentHeaderProps {
  type: string;
  typeLabel?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  authors?: string[];
  tags?: string[];
  color?: string;
  nodeId?: string;
  rightSlot?: React.ReactNode;
  badgesSlot?: React.ReactNode;
  backLink?: { href: string; label: string };
  children?: React.ReactNode;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  type,
  typeLabel,
  title,
  description,
  breadcrumbs = [],
  authors = [],
  tags = [],
  color,
  nodeId,
  rightSlot,
  badgesSlot,
  backLink,
  children,
}) => {
  const accentToken = color ?? 'var(--theme-carbon)';

  return (
    <div className="mb-16 border-b border-carbon/10 pb-12">
      {backLink && (
        <div className="mb-8">
          <Link href={backLink.href}>
            <a
              className="ac-pill"
              style={{ textDecoration: 'none' }}
            >
              <span className="ac-pill-ornament" aria-hidden>←</span>
              <span className="ac-pill-serif">{backLink.label}</span>
            </a>
          </Link>
        </div>
      )}

      {breadcrumbs.length > 0 && (
        <div className="mb-10">
          <Breadcrumbs crumbs={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
        <ContentTypeBadge type={type} label={typeLabel} />
        <div className="flex flex-wrap items-center gap-3">
          {badgesSlot}
          {nodeId && <ModelBadgeList nodeId={nodeId} />}
        </div>
      </div>

      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        style={{ fontVariant: 'small-caps', color: accentToken }}
      >
        {title}
      </h1>

      {description && (
        <p className="text-lg md:text-xl text-carbon/70 italic border-l-4 border-carbon/20 pl-6 leading-relaxed">
          {description}
        </p>
      )}

      {authors.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {authors.map(authorId => {
            const author = db.getMathematicianById(authorId);
            if (!author) return null;
            return (
              <Link key={authorId} href={`/bio/${author.slug}`}>
                <a
                  className="ac-pill ac-pill-accent"
                  style={{ ['--pill-accent' as string]: 'var(--theme-ocre)', textDecoration: 'none' }}
                >
                  <span className="ac-pill-ornament" aria-hidden>❦</span>
                  <span className="ac-pill-serif">{author.name}</span>
                </a>
              </Link>
            );
          })}
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-6">
          <TagList tags={tags} />
        </div>
      )}

      {rightSlot && (
        <div className="mt-6">{rightSlot}</div>
      )}

      {children}
    </div>
  );
};
