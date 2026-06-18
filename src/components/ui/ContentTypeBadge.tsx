import React from 'react';

interface ContentTypeBadgeProps {
  label: string;
  className?: string;
}

export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ label, className = '' }) => {
  return (
    <span className={`text-[10px] font-sans uppercase tracking-widest text-carbon/35 border border-carbon/15 px-2 py-1 rounded ${className}`}>
      {label}
    </span>
  );
};
