import React from 'react';

export const V2WorkshopSurface: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    data-testid="v2-workshop-surface"
    className={`relative flex h-full w-full items-center justify-center bg-carbon/[0.03] ${className ?? ''}`}
    style={{
      backgroundImage: `
        linear-gradient(to right, rgb(var(--color-carbon) / 0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(var(--color-carbon) / 0.06) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    }}
  >
    {children}
  </div>
);
