import React, { useState } from 'react';

export const BayesDiagnosticoSimulation: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Población, 1: Enfermos, 2: Tests, 3: Foco

  const TOTAL = 1000;
  const SICK = 1; // 0.1%
  const HEALTHY = TOTAL - SICK;
  const FALSE_POSITIVES = Math.round(HEALTHY * 0.01); // 1% error = 10

  // Array para renderizar puntitos. 
  // 0 = Enfermo real, 1..10 = Falso positivo, 11..999 = Sano verdadero negativo
  const people = Array.from({ length: TOTAL }, (_, i) => {
    if (i < SICK) return 'sick';
    if (i >= SICK && i < SICK + FALSE_POSITIVES) return 'false_positive';
    return 'healthy';
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-carbon font-sans">
      <h3 className="font-serif text-xl font-bold mb-2 text-center">Simulador de Falsos Positivos</h3>
      <p className="text-sm opacity-70 mb-6 text-center max-w-md">
        Analicemos 1,000 personas con un test del 99% de precisión para una enfermedad que afecta al 0.1% de la población.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button 
          onClick={() => setStep(0)} 
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${step === 0 ? 'bg-carbon text-lienzo' : 'bg-carbon/10 hover:bg-carbon/20'}`}
        >
          1. Población
        </button>
        <button 
          onClick={() => setStep(1)} 
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${step === 1 ? 'bg-[#c49b4f] text-white' : 'bg-[#c49b4f]/10 text-[#c49b4f] hover:bg-[#c49b4f]/20'}`}
        >
          2. Casos Reales
        </button>
        <button 
          onClick={() => setStep(2)} 
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${step === 2 ? 'bg-[#C86446] text-white' : 'bg-[#C86446]/10 text-[#C86446] hover:bg-[#C86446]/20'}`}
        >
          3. Aplicar Test
        </button>
        <button 
          onClick={() => setStep(3)} 
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${step === 3 ? 'bg-[#2a6a2a] text-white' : 'bg-[#2a6a2a]/10 text-[#2a6a2a] hover:bg-[#2a6a2a]/20'}`}
        >
          4. Ver Positivos
        </button>
      </div>

      <div className="w-full max-w-sm flex flex-wrap gap-[2px] justify-center content-start mb-6 p-4 bg-carbon/5 rounded-lg border border-carbon/10">
        {people.map((type, idx) => {
          let color = '#d4d4d4'; // default gray (healthy/unknown)
          let opacity = 1;

          if (step === 1) {
            color = type === 'sick' ? '#c49b4f' : '#e5e5e5';
          } else if (step >= 2) {
            if (type === 'sick') color = '#C86446'; // True positive (red)
            else if (type === 'false_positive') color = '#C86446'; // False positive (red test)
            else color = '#2a6a2a'; // True negative (green)
          }

          if (step === 3) {
            if (color !== '#C86446') opacity = 0.1; // Dim non-positives
          }

          return (
            <div 
              key={idx} 
              className="w-2 h-2 rounded-full transition-all duration-500" 
              style={{ backgroundColor: color, opacity }}
            />
          );
        })}
      </div>

      <div className="h-24 w-full max-w-sm text-center">
        {step === 0 && <p className="text-sm">1,000 personas en la población general.</p>}
        {step === 1 && <p className="text-sm"><strong className="text-[#c49b4f]">Prevalencia del 0.1%</strong>: Solo 1 persona de las 1,000 tiene realmente la enfermedad.</p>}
        {step === 2 && <p className="text-sm">El test tiene <strong>99% de precisión</strong>. Detecta al enfermo (<span className="text-[#C86446] font-bold">rojo</span>), pero también falla en el 1% de los sanos (<span className="text-[#C86446] font-bold">10 falsos positivos</span>).</p>}
        {step === 3 && (
          <div className="bg-[#2a6a2a]/10 border border-[#2a6a2a]/30 p-3 rounded">
            <p className="text-sm font-bold text-[#2a6a2a]">Si das positivo (eres un punto rojo), ¿qué probabilidad hay de estar enfermo?</p>
            <p className="text-xl mt-1 font-serif">1 / 11 = <strong className="text-[#C86446]">9.09%</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};
