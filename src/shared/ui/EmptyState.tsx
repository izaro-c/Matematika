import React from 'react';
import { Link } from 'wouter';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: string;
  actionLabel?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '◇',
  actionLabel,
  actionHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border border-carbon/10 bg-carbon/[0.02] text-center">
      <span className="text-3xl mb-4 text-carbon/20">{icon}</span>
      {title && (
        <h3 className="text-lg font-bold text-carbon/50 mb-2">{title}</h3>
      )}
      <p className="text-carbon/40 italic font-serif max-w-md">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <a className="mt-6 text-sm font-sans tracking-widest uppercase text-terracota hover:text-carbon transition-colors">
            {actionLabel}
          </a>
        </Link>
      )}
    </div>
  );
};
