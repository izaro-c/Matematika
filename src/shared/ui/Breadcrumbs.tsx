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
  const overflow = crumbs.length + (showHome ? 1 : 0) > 3;
  const collapseAt = crumbs.length - 2;

  const renderCrumb = (crumb: Crumb, isLast: boolean, hiddenMobile: boolean) => (
    <span
      key={crumb.name + (crumb.href || '')}
      className={`flex items-center gap-2 min-w-0 ${hiddenMobile ? 'hidden md:flex' : ''}`}
    >
      <span className="shrink-0">/</span>
      {crumb.href ? (
        <Link
          href={crumb.href}
          className={`hover:text-carbon transition-colors truncate ${isLast ? 'max-w-[160px] lg:max-w-[240px]' : 'max-w-[120px] lg:max-w-[200px]'}`}
          title={crumb.name}
        >
          {crumb.name}
        </Link>
      ) : (
        <span className={`text-carbon/80 font-bold truncate ${isLast ? '' : 'max-w-[120px] lg:max-w-[200px]'}`} title={crumb.name}>
          {crumb.name}
        </span>
      )}
    </span>
  );

  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-y-2 text-xs font-sans tracking-widest uppercase text-carbon/40 ${className}`}>
      {showHome && (
        <Link href={homeHref} className="hover:text-carbon transition-colors shrink-0">
          {homeLabel}
        </Link>
      )}

      {overflow && (
        <span className="flex items-center gap-2 md:hidden shrink-0">
          <span className="ml-2">/</span>
          <span className="text-carbon/20 tracking-widest select-none">···</span>
        </span>
      )}

      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        const hiddenMobile = overflow && i < collapseAt;
        return renderCrumb(crumb, isLast, hiddenMobile);
      })}
    </nav>
  );
};
