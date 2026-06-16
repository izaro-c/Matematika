import React, { useState } from 'react';

interface GlossaryLinkProps {
  term: string;
  description?: string;
  children: React.ReactNode;
}

export const GlossaryLink: React.FC<GlossaryLinkProps> = ({ term, description, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="font-bold text-carbon border-b border-carbon/40 border-dotted cursor-help px-[2px] transition-colors hover:bg-terracota/10 hover:text-terracota hover:border-terracota/40 rounded-sm">
        {children}
      </span>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-lienzo border border-carbon/20 text-carbon rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-5 pointer-events-none transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="font-serif text-lg font-bold mb-3 border-b border-carbon/10 pb-2 text-terracota" style={{ fontVariant: 'small-caps' }}>{term}</div>
          <div className="leading-relaxed opacity-80 text-sm font-serif">
            {description || "Término fundamental."}
          </div>
          {/* Pequeño diamante de conexión */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-lienzo border-b border-r border-carbon/20 rotate-45 -translate-y-1/2"></div>
        </div>
      )}
    </span>
  );
};
