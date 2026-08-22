import React from 'react';

interface ContentBodyProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact' | 'interactive';
  className?: string;
}

/**
 * Cuerpo MDX. Sin Suspense propio: el lazy del contenido burbujea al de ruta
 * (PageLoadingScreen). El diagrama tiene su propio Suspense + DiagramSkeleton.
 */
export const ContentBody: React.FC<ContentBodyProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const base = 'prose prose-mora max-w-none prose-editorial editorial-reading';
  const variants: Record<string, string> = {
    default: 'prose-lg',
    compact: 'prose-base',
    interactive: 'prose-base [&_h2]:mt-10 [&_h2]:mb-3',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
