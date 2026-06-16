import { useState } from 'react';

export const InductionVisualizer = () => {
  const [baseCase, setBaseCase] = useState(false);
  const [induction, setInduction] = useState(false);

  const reset = () => {
    setBaseCase(false);
    setInduction(false);
  };

  const dominos = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-transparent relative font-serif">
      <div className="text-center w-full max-w-2xl relative z-10 flex flex-col justify-center h-full">
        <h3 className="text-2xl md:text-3xl text-pizarra mb-6 italic border-b border-carbon/20 pb-2 inline-block px-8 shrink-0">
          El Dominó Infinito
        </h3>

        {/* CONTENEDOR DE DOMINOS MÁS COMPACTO VERTICALMENTE */}
        <div className="relative h-48 md:h-56 w-full bg-lienzo border-2 border-carbon/10 shadow-sm p-4 md:p-8 flex flex-col justify-end overflow-hidden rounded-xl shrink-0">
          
          {/* Suelo */}
          <div className="absolute bottom-8 left-0 w-full h-[1px] bg-carbon/20" />

          {/* Fichas de Dominó */}
          <div className="flex justify-center items-end mb-8 relative w-full h-32">
            {dominos.map((num, i) => {
              // Lógica de caída:
              const isFalling = (baseCase && !induction && i === 0) || (baseCase && induction);
              
              // Ajustes de física para que la ilusión funcione (fichas pequeñas, h-16 = 64px)
              // Caída de 60 grados: alcance ~55px.
              // Gap de Inducción (ml-4 = 16px) -> Se tocan y tiran.
              // Gap sin Inducción (ml-16 = 64px) -> Caen al vacío y no se tocan.
              const gap = induction ? 'ml-4' : 'ml-16';
              const delay = induction ? `${i * 150}ms` : '0ms';

              return (
                <div 
                  key={num} 
                  className={`relative flex flex-col items-center transition-all duration-700 ease-in-out ${i !== 0 ? gap : ''}`}
                  style={{ zIndex: 10 - i }}
                >
                  <div 
                    className={`w-4 h-16 border-2 rounded-sm origin-bottom-right transition-transform duration-300 ease-in
                      ${isFalling ? 'rotate-[60deg] translate-x-1' : 'rotate-0 translate-x-0'}
                      ${i === 0 ? 'border-terracota bg-terracota/10' : 'border-salvia bg-salvia/10'}
                      ${isFalling ? (i === 0 ? 'bg-terracota' : 'bg-salvia') : ''}
                    `}
                    style={{ transitionDelay: delay }}
                  >
                    {/* Detalles de la ficha */}
                    <div className="w-full h-[1px] bg-current opacity-30 absolute top-1/2" />
                    <div className="w-1 h-1 rounded-full bg-current opacity-50 absolute top-1/4 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className={`absolute -bottom-6 font-bold text-xs transition-opacity duration-500
                    ${i === 0 ? 'text-terracota' : 'text-salvia'}
                    ${isFalling ? 'opacity-100' : 'opacity-40'}
                  `}>
                    n={num}
                  </span>
                </div>
              );
            })}
            
            {/* Infinito */}
            <div className={`ml-8 mb-2 text-2xl md:text-3xl text-salvia transition-opacity duration-1000 ${baseCase && induction ? 'opacity-100 delay-[1000ms]' : 'opacity-0'}`}>
              &infin;
            </div>
          </div>
        </div>

        {/* Panel de Explicación Dinámica */}
        <div className="mt-4 md:mt-6 h-12 flex items-center justify-center shrink-0">
          {!baseCase && !induction && (
            <p className="text-carbon/60 italic text-sm md:text-base">Demuestra los dos pilares para desencadenar el infinito.</p>
          )}
          {baseCase && !induction && (
            <p className="text-terracota font-bold text-sm md:text-base">¡Caso Base demostrado! La ficha 1 cae al vacío y no alcanza a la siguiente.</p>
          )}
          {!baseCase && induction && (
            <p className="text-salvia font-bold text-sm md:text-base">¡Paso Inductivo! Fichas pegadas. (Falta empujón inicial).</p>
          )}
          {baseCase && induction && (
            <p className="text-carbon font-bold text-lg uppercase tracking-widest">Queda Demostrado para todo N</p>
          )}
        </div>

        {/* Controles */}
        <div className="mt-4 flex flex-col md:flex-row justify-center gap-4 shrink-0">
          <button 
            onClick={() => setBaseCase(true)}
            disabled={baseCase}
            className={`px-4 py-3 font-bold uppercase text-xs tracking-wider transition-all border-2
              ${baseCase ? 'bg-terracota/10 border-terracota text-terracota opacity-50 cursor-not-allowed' : 'bg-lienzo border-terracota text-terracota hover:bg-terracota hover:text-lienzo shadow-sm'}`}
          >
            Paso 1: Demostrar Caso Base (n=1)
          </button>

          <button 
            onClick={() => setInduction(true)}
            disabled={induction}
            className={`px-4 py-3 font-bold uppercase text-xs tracking-wider transition-all border-2
              ${induction ? 'bg-salvia/10 border-salvia text-salvia opacity-50 cursor-not-allowed' : 'bg-lienzo border-salvia text-salvia hover:bg-salvia hover:text-lienzo shadow-sm'}`}
          >
            Paso 2: Demostrar Paso Inductivo
          </button>

          {(baseCase || induction) && (
            <button 
              onClick={reset}
              className="px-4 py-3 text-carbon/40 hover:text-carbon transition-colors uppercase text-xs tracking-wider underline"
            >
              Reiniciar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
