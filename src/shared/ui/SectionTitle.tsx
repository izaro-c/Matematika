import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl font-bold mb-8 border-b border-carbon/10 pb-4 ${className}`} style={{ fontVariant: 'small-caps' }}>
      {children}
    </h2>
  );
};
