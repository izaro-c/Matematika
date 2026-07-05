import React, { useState } from 'react';

interface ApoyoProps {
  /** Texto del botón o pestaña de ayuda */
  titulo?: string;
  /** El contenido didáctico de apoyo o enlace a repasar */
  children: React.ReactNode;
}

/**
 * Componente Apoyo: Provee soporte contextual sutil (links a conceptos, pistas, tablas de referencia)
 * al pie de un paso o pregunta sin interrumpir visualmente el flujo principal de resolución.
 * Se presenta como una nota al margen editorial Arts & Crafts plegada por defecto.
 */
export const Apoyo: React.FC<ApoyoProps> = ({ 
  titulo = "¿Necesitas ayuda con las operaciones?", 
  children 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 pt-3 border-t border-dashed border-carbon/10 font-serif text-xs">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-carbon/50 hover:text-carbon/80 transition-colors cursor-pointer select-none font-sans uppercase tracking-widest text-[9px] font-bold"
      >
        <span>{open ? '▼' : '▶'}</span>
        <span>{titulo}</span>
      </button>

      {open && (
        <div className="mt-3 pl-4 border-l-2 border-carbon/15 text-carbon/70 leading-relaxed animate-fade-in [&_p]:mb-2 [&_p:last-child]:mb-0">
          <span className="page-accent-text mr-2 font-serif text-sm select-none">❧</span>
          {children}
        </div>
      )}
    </div>
  );
};
