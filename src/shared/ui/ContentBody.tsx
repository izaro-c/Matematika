import React, { Suspense } from 'react';

interface ContentBodyProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact' | 'interactive';
  className?: string;
}

export const ContentBody: React.FC<ContentBodyProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const base = 'prose prose-pizarra max-w-none prose-editorial';
  const variants: Record<string, string> = {
    default: 'prose-lg',
    compact: 'prose-base',
    interactive: 'prose-base [&_h2]:mt-10 [&_h2]:mb-3',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded" />}>
        {children}
      </Suspense>
    </div>
  );
};
