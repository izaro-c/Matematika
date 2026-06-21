import React from 'react';
import { Link } from 'wouter';

interface TagListProps {
  tags: string[];
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({ tags, className = '' }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <Link key={tag} href={`/rama/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
          <a
            className="ac-pill ac-pill-accent"
            style={{ ['--pill-accent' as string]: 'var(--theme-pizarra)', textDecoration: 'none' }}
          >
            <span className="ac-pill-ornament" aria-hidden>◇</span>
            {tag}
          </a>
        </Link>
      ))}
    </div>
  );
};
