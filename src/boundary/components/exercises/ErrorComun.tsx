/**
 * ErrorComun.tsx — Bloque de Error Común
 *
 * Muestra el error conceptual más frecuente que cometen los estudiantes
 * al abordar este tipo de problema. Se activa/despliega con un clic.
 * Aparece coloreado en terracota para indicar "atención / advertencia".
 *
 * Uso en MDX (dentro de ejercicios y teoremas):
 * <ErrorComun titulo="Confundir rango con determinante">
 *   Un determinante nulo no significa rango cero. El rango es el tamaño
 *   del mayor menor no nulo, que puede ser 1 o más aunque |A| = 0.
 * </ErrorComun>
 */
import React, { useState } from 'react';

interface ErrorComunProps {
  titulo: string;
  children: React.ReactNode;
}

/**
 * Muestra el error conceptual más frecuente que cometen los estudiantes
 * al abordar este tipo de problema. Se activa/despliega con un clic.
 * Aparece coloreado en terracota para indicar "atención / advertencia".
 */
export const ErrorComun: React.FC<ErrorComunProps> = ({ titulo, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`my-8 font-serif elegant-panel transition-all duration-300 cursor-pointer select-none bg-terracota/5 border-terracota/30`}
      style={{ '--hover-accent': 'var(--theme-terracota)' } as React.CSSProperties}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Icono */}
        <span className="text-terracota font-bold text-base shrink-0" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
        {/* Etiqueta */}
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-terracota/70 shrink-0">
          Error frecuente:
        </span>
        {/* Título */}
        <span className="text-sm font-semibold text-carbon leading-tight">
          {titulo}
        </span>
      </div>

      {/* Contenido desplegable */}
      {open && (
        <div
          className="px-5 pb-5 pt-1 text-sm text-carbon/80 leading-relaxed border-t border-terracota/10"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
};
