import React from 'react';
import { Link } from 'wouter';

interface ConceptLinkProps {
  to: string;
  children: React.ReactNode;
  title?: string;
}

export const ConceptLink: React.FC<ConceptLinkProps> = ({ to, children, title }) => {
  return (
    <Link href={to.startsWith('/') ? to : `/${to}`}>
      <a 
        title={title || "Ir a la lección"} 
        className="text-salvia font-semibold border-b border-dashed border-salvia/40 hover:border-salvia hover:bg-salvia/10 px-1 rounded-sm transition-all duration-200 cursor-pointer"
      >
        {children}
      </a>
    </Link>
  );
};
