import React from 'react';

export const WorkshopSurface: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    data-testid="v2-workshop-surface"
    className={`relative flex h-full w-full items-center justify-center bg-carbon/[0.03] ${className ?? ''}`}
    style={{
      backgroundImage: `
        linear-gradient(to right, color-mix(in srgb, var(--color-carbon) 6%, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in srgb, var(--color-carbon) 6%, transparent) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    }}
  >
    {children}
  </div>
);
