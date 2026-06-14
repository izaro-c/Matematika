import React, { useState } from 'react';

export const ContradictionVisualizer = () => {
  const [path, setPath] = useState<'none' | 'direct' | 'absurd'>('none');
  const [step, setStep] = useState(0);

  const choosePath = (p: 'direct' | 'absurd') => {
    setPath(p);
    setStep(0);
  };

  const advanceAbsurd = () => {
    if (step < 3) setStep(step + 1);
  };

  const reset = () => {
    setPath('none');
    setStep(0);
  };

  return (
    <div className="w-full h-full min-h-[550px] flex flex-col items-center justify-center p-8 bg-transparent relative font-serif">
      <div className="text-center w-full max-w-2xl relative z-10">
        <h3 className="text-3xl text-pizarra mb-12 italic border-b border-carbon/20 pb-4 inline-block px-8">
          La Reducción al Absurdo
        </h3>

        {/* Zona de Elección */}
        <div className={`transition-all duration-500 overflow-hidden ${path === 'none' ? 'h-40 opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
          <p className="mb-6 text-carbon/80">Para demostrar que <strong className="text-carbon">P es cierto</strong>, ¿qué camino tomarás?</p>
          <div className="flex justify-center gap-6">
            <button onClick={() => choosePath('direct')} className="px-6 py-4 bg-lienzo border-2 border-carbon/20 text-carbon hover:border-carbon/50 transition-colors font-bold uppercase text-sm tracking-wider">
              Intentar Camino Directo
            </button>
            <button onClick={() => choosePath('absurd')} className="px-6 py-4 bg-terracota text-lienzo font-bold hover:bg-terracota/90 transition-colors shadow-md uppercase text-sm tracking-wider">
              Asumir ¬P (Absurdo)
            </button>
          </div>
        </div>

        {/* Camino Directo (Fallido) */}
        <div className={`transition-all duration-500 overflow-hidden ${path === 'direct' ? 'h-48 opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
          <div className="p-8 border-2 border-carbon/20 border-dashed bg-lienzo text-center">
            <div className="text-4xl mb-4">🧱</div>
            <p className="text-carbon italic font-serif text-lg">El camino directo es matemáticamente incalculable en este caso.</p>
            <p className="text-carbon/60 text-sm mt-2">No hay teoremas previos que nos lleven directamente a la respuesta.</p>
            <button onClick={reset} className="mt-6 text-terracota underline text-sm uppercase tracking-widest">
              Retroceder
            </button>
          </div>
        </div>

        {/* Camino Absurdo */}
        <div className={`transition-all duration-500 overflow-hidden ${path === 'absurd' ? 'h-96 opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
          
          <div className={`relative h-64 border-2 flex flex-col items-center justify-center p-8 transition-colors duration-500
            ${step === 2 ? 'border-terracota bg-terracota/5 animate-[pulse_0.5s_ease-in-out_infinite]' : 'border-carbon/10 bg-lienzo'}`}>
            
            {/* Step 0: Asumir Mentira */}
            <div className={`absolute transition-all duration-700 ease-out flex flex-col items-center
              ${step === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
              <div className="w-16 h-16 bg-carbon text-lienzo flex items-center justify-center rounded-sm text-2xl font-bold mb-4 shadow-lg">¬P</div>
              <p className="text-xl text-carbon font-bold">"Supongamos que P es Falso"</p>
              <p className="text-sm text-carbon/60 italic mt-2">Construimos una realidad paralela.</p>
            </div>

            {/* Step 1: Lógica Impecable */}
            <div className={`absolute transition-all duration-700 ease-out flex flex-col items-center
              ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 border-2 border-carbon/20 flex items-center justify-center text-carbon/40">A</div>
                <span className="flex items-center text-carbon/20">&rarr;</span>
                <div className="w-12 h-12 border-2 border-carbon/20 flex items-center justify-center text-carbon/40">B</div>
                <span className="flex items-center text-carbon/20">&rarr;</span>
                <div className="w-12 h-12 border-2 border-carbon/20 flex items-center justify-center text-carbon/40">C</div>
              </div>
              <p className="text-xl text-carbon font-bold">Desarrollo Lógico Legal</p>
              <p className="text-sm text-carbon/60 italic mt-2">Aplicamos reglas matemáticas perfectas a nuestra mentira.</p>
            </div>

            {/* Step 2: EXPLOSIÓN (Contradicción) */}
            <div className={`absolute transition-all duration-500 ease-out flex flex-col items-center
              ${step === 2 ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 scale-50 pointer-events-none'}`}>
              <div className="text-7xl font-black text-terracota mb-4 tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                1 = 0
              </div>
              <p className="text-2xl text-terracota font-bold uppercase tracking-widest">¡Contradicción!</p>
              <p className="text-sm text-terracota/80 italic mt-2 font-bold">Esta realidad colapsa. El universo matemático no lo permite.</p>
            </div>

            {/* Step 3: Conclusión Triunfal */}
            <div className={`absolute transition-all duration-1000 ease-out flex flex-col items-center
              ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="w-20 h-20 bg-salvia text-lienzo border-2 border-salvia flex items-center justify-center text-4xl shadow-xl rounded-sm mb-4">
                P
              </div>
              <p className="text-xl text-carbon font-bold">Por eliminación: P es Cierto.</p>
              <p className="text-sm text-salvia italic mt-2 font-bold">Si ¬P destruye el universo, ¬P es imposible.</p>
            </div>

          </div>

          {/* Controles del Absurdo */}
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={advanceAbsurd}
              disabled={step === 3}
              className={`px-8 py-3 font-bold uppercase tracking-widest text-sm transition-all shadow-sm
                ${step === 3 ? 'hidden' : 
                  step === 2 ? 'bg-terracota text-lienzo hover:bg-terracota/90 shadow-terracota/30' : 
                  'bg-carbon text-lienzo hover:bg-carbon/90 hover:-translate-y-1'}`}
            >
              {step === 0 ? "Aplicar Lógica" : step === 1 ? "Ver Consecuencias" : "Concluir Verdad"}
            </button>
            
            {(step === 3) && (
              <button 
                onClick={reset}
                className="px-4 py-3 text-carbon/60 hover:text-carbon transition-colors uppercase text-xs tracking-wider underline"
              >
                Volver a Empezar
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
