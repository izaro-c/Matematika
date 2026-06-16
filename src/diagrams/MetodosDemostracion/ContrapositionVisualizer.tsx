import { useState } from 'react';

/**
 * ContrapositionVisualizer
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const ContrapositionVisualizer = () => {
  const [isContrapositive, setIsContrapositive] = useState(false);

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-transparent relative font-serif">
      <div className="text-center w-full max-w-2xl relative z-10">
        <h3 className="text-3xl text-pizarra mb-12 italic border-b border-carbon/20 pb-4 inline-block px-8">
          El Espejo Lógico
        </h3>

        <div className="relative h-64 w-full bg-lienzo border-2 border-carbon/10 shadow-sm p-8 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Tarjeta P -> Q (Directa) */}
          <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center
            ${isContrapositive ? 'translate-y-24 opacity-20 scale-90 blur-[2px]' : 'translate-y-0 opacity-100 scale-100 blur-0'}`}>
            <div className="flex items-center gap-6 text-2xl font-bold">
              <div className="flex flex-col items-center">
                <span className="w-16 h-16 bg-salvia text-lienzo flex items-center justify-center rounded-sm shadow-md mb-2">P</span>
                <span className="text-xs font-normal text-carbon">Llueve</span>
              </div>
              <span className="text-salvia/80 text-4xl">&rarr;</span>
              <div className="flex flex-col items-center">
                <span className="w-16 h-16 border-2 border-salvia text-salvia flex items-center justify-center rounded-sm shadow-sm bg-lienzo mb-2">Q</span>
                <span className="text-xs font-normal text-carbon">Suelo Mojado</span>
              </div>
            </div>
            <p className="mt-6 text-carbon/80 italic font-serif">"Si llueve, entonces el suelo se moja"</p>
          </div>

          {/* Símbolo de Equivalencia (Estático en el centro) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className={`w-12 h-12 bg-lienzo rounded-full flex items-center justify-center shadow-md border border-carbon/10 text-xl font-bold transition-transform duration-700
              ${isContrapositive ? 'rotate-180 text-terracota' : 'rotate-0 text-salvia'}`}>
              &equiv;
            </div>
          </div>

          {/* Tarjeta ¬Q -> ¬P (Contrapositiva) */}
          <div className={`absolute transition-all duration-700 ease-in-out w-full px-8 flex flex-col items-center
            ${isContrapositive ? 'translate-y-0 opacity-100 scale-100 blur-0' : '-translate-y-24 opacity-20 scale-90 blur-[2px]'}`}>
            <div className="flex items-center gap-6 text-2xl font-bold">
              <div className="flex flex-col items-center">
                <span className="w-16 h-16 bg-terracota text-lienzo flex items-center justify-center rounded-sm shadow-md mb-2">¬Q</span>
                <span className="text-xs font-normal text-carbon">Suelo Seco</span>
              </div>
              <span className="text-terracota/80 text-4xl">&rarr;</span>
              <div className="flex flex-col items-center">
                <span className="w-16 h-16 border-2 border-terracota text-terracota flex items-center justify-center rounded-sm shadow-sm bg-lienzo mb-2">¬P</span>
                <span className="text-xs font-normal text-carbon">No Llueve</span>
              </div>
            </div>
            <p className="mt-6 text-terracota/90 italic font-serif">"Si el suelo NO está mojado, entonces NO ha llovido"</p>
          </div>

        </div>

        {/* Controles */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setIsContrapositive(!isContrapositive)}
            className="group relative px-8 py-4 bg-carbon text-lienzo font-bold tracking-widest uppercase text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-lienzo/20 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
            Invertir Lógica (Toggle)
          </button>
        </div>

      </div>
    </div>
  );
};
