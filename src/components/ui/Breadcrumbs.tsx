import React from 'react';
import { Link } from 'wouter';

export interface Crumb {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
  className?: string;
  homeLabel?: string;
  homeHref?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  crumbs,
  className = '',
  homeLabel = 'Biblioteca',
  homeHref = '/',
  showHome = true,
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm font-sans tracking-widest uppercase text-carbon/40 ${className}`}>
      {showHome && (
        <Link href={homeHref}>
          <a className="hover:text-carbon transition-colors">{homeLabel}</a>
        </Link>
      )}
      {crumbs.map((crumb) => (
        <span key={crumb.name + (crumb.href || '')} className="flex items-center gap-2">
          <span>/</span>
          {crumb.href ? (
            <Link href={crumb.href}>
              <a className="hover:text-carbon transition-colors">{crumb.name}</a>
            </Link>
          ) : (
            <span className="text-carbon/80 font-bold">{crumb.name}</span>
          )}
        </span>
      ))}
    </div>
  );
};
