import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl sm:text-3xl leading-tight font-serif text-center italic text-carbon/90 mb-10 ${className}`}>
      {children}
    </h2>
  );
};
