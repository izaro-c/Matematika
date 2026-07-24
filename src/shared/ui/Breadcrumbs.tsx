import React from 'react';
import { Link } from 'wouter';
import { UI } from '@/shared/design';

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
      className={`flex items-center gap-1.5 min-w-0 ${hiddenMobile ? 'hidden md:flex' : ''}`}
    >
      <span className={UI.breadcrumbsSep} aria-hidden="true">/</span>
      {crumb.href ? (
        <Link
          href={crumb.href}
          className={`${UI.breadcrumbsLink} truncate ${isLast ? 'max-w-[160px] lg:max-w-[240px]' : 'max-w-[120px] lg:max-w-[200px]'}`}
          title={crumb.name}
        >
          {crumb.name}
        </Link>
      ) : (
        <span
          className={`${UI.breadcrumbsCurrent} truncate ${isLast ? '' : 'max-w-[120px] lg:max-w-[200px]'}`}
          title={crumb.name}
        >
          {crumb.name}
        </span>
      )}
    </span>
  );

  return (
    <nav aria-label="Breadcrumb" className={`${UI.breadcrumbs} ${className}`}>
      {showHome && (
        <Link href={homeHref} className={`${UI.breadcrumbsLink} shrink-0`}>
          {homeLabel}
        </Link>
      )}

      {overflow && (
        <span className="flex items-center gap-1.5 md:hidden shrink-0">
          <span className={UI.breadcrumbsSep} aria-hidden="true">/</span>
          <span className={UI.breadcrumbsEllipsis} aria-hidden="true">···</span>
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
