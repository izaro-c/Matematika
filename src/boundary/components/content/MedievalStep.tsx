import React, { useEffect, useRef } from 'react';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';

interface MedievalStepProps {
  number: number;
  title: string;
  /** Si se provee, activa el estado global "highlight" con este valor cuando el bloque es visible en pantalla */
  target?: string;
  children?: React.ReactNode;
}

/**
 * MedievalStep
 *
 * Bloque de paso numerado con estética Arts & Crafts. Cuando `target` es
 * definido, usa IntersectionObserver para actualizar el estado global de
 * "highlight" de forma automática según la visibilidad del bloque en pantalla
 * (sin necesidad de hover).
 */
export const MedievalStep: React.FC<MedievalStepProps> = ({ number, title, target, children }) => {
  const setVariable = useMathStore((state) => state.setVariable);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver: activa el highlight cuando el bloque entra en la zona
  // central de la pantalla (rootMargin recorta el viewport un 30% arriba y abajo,
  // dejando solo la banda central del 40%). Esto funciona en ambas direcciones.
  useEffect(() => {
    if (!target || !containerRef.current) return;

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVariable('step', target);
          setVariable('highlight', null);
        }
      },
      {
        rootMargin: '-30% 0px -30% 0px', // Banda central del 40%
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [target, setVariable]);

  return (
    <div ref={containerRef} className="mt-10 mb-6 w-full">
      {/* Cabecera: número + título */}
      <div className="flex items-center gap-4 mb-4">
        {/* Caja del número — reducida de w-28 a w-16 */}
        <div
          className="relative w-16 h-16 min-w-[4rem] flex items-center justify-center border border-carbon overflow-hidden rounded-sm bg-[#FDFBF7] shrink-0"
        >
          {/* Fondo Arts & Crafts */}
          <div
            className="absolute inset-0 opacity-70 mix-blend-multiply"
            style={{
              backgroundImage: 'url(/images/bg-arts-crafts-2.png)',
              backgroundSize: '200%',
              backgroundPosition: 'center',
            }}
          />
          {/* Marco interior */}
          <div className="absolute inset-1 border border-carbon/20 pointer-events-none" />
          {/* Número — reducido de text-6xl a text-4xl */}
          <span
            className="font-serif italic font-bold text-4xl z-10 text-terracota"
            style={{
              fontFamily: 'Georgia, "Playfair Display", serif',
              textShadow: '1px 1px 0px #FDFBF7, -1px -1px 0px #FDFBF7, 1px -1px 0px #FDFBF7, -1px 1px 0px #FDFBF7'
            }}
          >
            {number}
          </span>
        </div>

        {/* Título — reducido de text-4xl a text-2xl */}
        <h3 className="text-2xl font-serif m-0 border-b pb-1 flex-1 italic text-carbon border-carbon/20">
          {title}
        </h3>
      </div>

      {/* Contenido del paso */}
      {children && (
        <div className="pl-20">
          {children}
        </div>
      )}
    </div>
  );
};
