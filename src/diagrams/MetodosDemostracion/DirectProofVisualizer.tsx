import React, { useState } from 'react';

export const DirectProofVisualizer = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-transparent relative font-serif">
      <div className="text-center relative z-10 w-full max-w-2xl">
        <h3 className="text-3xl text-pizarra mb-12 italic border-b border-carbon/20 pb-4 inline-block px-8">
          El Silogismo en Acción
        </h3>

        {/* Contenedor Principal */}
        <div className="relative flex flex-col items-center justify-center h-64 w-full border-2 border-carbon/10 bg-lienzo p-8 shadow-sm">
          
          <div className="flex items-center justify-between w-full h-full relative">
            
            {/* Nodo 1: Premisa P */}
            <div className={`transition-all duration-500 flex flex-col items-center z-10 
              ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="w-20 h-20 bg-salvia text-lienzo border-2 border-carbon flex items-center justify-center text-4xl shadow-md rounded-sm">
                P
              </div>
              <span className="mt-4 text-carbon font-bold uppercase tracking-widest text-sm">Premisa</span>
            </div>

            {/* Cable 1 */}
            <div className="flex-1 h-1 bg-carbon/10 mx-2 relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-full bg-salvia transition-all duration-1000 ease-out 
                ${step >= 1 ? 'w-full' : 'w-0'}`} />
            </div>

            {/* Nodo 2: Deducción A */}
            <div className={`transition-all duration-700 flex flex-col items-center z-10 
              ${step >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-4'}`}>
              <div className="w-16 h-16 bg-lienzo text-salvia border-2 border-salvia flex items-center justify-center text-2xl shadow-sm rounded-full">
                A
              </div>
              <span className="mt-2 text-carbon/60 italic text-xs">Axioma</span>
            </div>

            {/* Cable 2 */}
            <div className="flex-1 h-1 bg-carbon/10 mx-2 relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-full bg-salvia transition-all duration-1000 ease-out 
                ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>

            {/* Nodo 3: Deducción B */}
            <div className={`transition-all duration-700 flex flex-col items-center z-10 
              ${step >= 2 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}>
              <div className="w-16 h-16 bg-lienzo text-salvia border-2 border-salvia flex items-center justify-center text-2xl shadow-sm rotate-45">
                <span className="-rotate-45">B</span>
              </div>
              <span className="mt-2 text-carbon/60 italic text-xs">Lema</span>
            </div>

            {/* Cable 3 */}
            <div className="flex-1 h-1 bg-carbon/10 mx-2 relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-full bg-terracota transition-all duration-1000 ease-out 
                ${step >= 3 ? 'w-full' : 'w-0'}`} />
            </div>

            {/* Nodo 4: Conclusión Q */}
            <div className={`transition-all duration-1000 flex flex-col items-center z-10 
              ${step >= 3 ? 'opacity-100 scale-100 shadow-xl' : 'opacity-0 scale-75'}`}>
              <div className={`w-20 h-20 text-lienzo border-2 border-carbon flex items-center justify-center text-4xl rounded-sm transition-colors duration-500 
                ${step >= 3 ? 'bg-terracota' : 'bg-carbon/20'}`}>
                Q
              </div>
              <span className="mt-4 text-carbon font-bold uppercase tracking-widest text-sm">Conclusión</span>
            </div>

          </div>

          {/* Flecha General decorativa de fondo */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
            <svg viewBox="0 0 100 20" className="w-3/4 h-32 fill-carbon">
              <polygon points="0,5 90,5 90,0 100,10 90,20 90,15 0,15" />
            </svg>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={nextStep}
            disabled={step === 3}
            className={`px-6 py-3 border-2 border-carbon font-bold tracking-widest uppercase text-sm transition-all shadow-sm
              ${step === 3 ? 'opacity-30 cursor-not-allowed bg-transparent' : 'bg-carbon text-lienzo hover:bg-carbon/90 hover:-translate-y-1 hover:shadow-md'}`}
          >
            {step === 0 ? "Deducir Paso 1" : step === 1 ? "Deducir Paso 2" : step === 2 ? "Concluir" : "Demostrado ✓"}
          </button>
          
          {step > 0 && (
            <button 
              onClick={reset}
              className="px-4 py-3 text-terracota border border-terracota/30 hover:bg-terracota/10 transition-colors uppercase text-xs tracking-wider"
            >
              Reiniciar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
