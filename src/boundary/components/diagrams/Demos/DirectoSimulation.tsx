import { useState } from 'react';

const STEPS = ['P ⇒ P₁', 'P₁ ⇒ P₂', 'P₂ ⇒ Q'];
const LABELS = ['Por hipótesis', 'Por teorema', 'Conclusión'];

export const DirectoSimulation = () => {
  const [step, setStep] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      {/* Diagrama */}
      <div className="relative flex items-center gap-0" style={{ height: 180 }}>
        {/* P — punto de partida */}
        <div className={`
          flex flex-col items-center gap-1 transition-all duration-500
          ${step === 0 ? 'scale-110' : 'scale-100'}
        `}>
          <div className="px-5 py-3 rounded-sm border-2 border-terracota bg-terracota/10">
            <span className="text-xl font-bold text-terracota">P</span>
          </div>
          <span className="text-[10px] text-terracota/50">Hipótesis</span>
        </div>

        {/* Bloques intermedios + flechas */}
        {STEPS.map((_, i) => (
          <div key={i} className="flex items-center">
            {/* Flecha */}
            <div className="relative flex items-center justify-center" style={{ width: 56 }}>
              <svg width="56" height="2">
                <line x1="4" y1="1" x2="52" y2="1"
                  stroke="var(--theme-pizarra)" strokeWidth="1.5"
                  opacity={step > i ? 0.5 : 0.1} />
                {step > i && (
                  <polygon points="52,1 46,-4 46,6" fill="var(--theme-pizarra)" opacity="0.5" />
                )}
              </svg>
            </div>

            {/* Bloque */}
            <div className={`
              flex flex-col items-center gap-1 transition-all duration-500
              ${step > i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
            `}>
              <div className="px-4 py-2.5 rounded-sm border border-carbon/30 bg-carbon/5">
                <span className="text-sm font-bold text-carbon/70">{STEPS[i]}</span>
              </div>
              <span className="text-[9px] text-pizarra/40">{LABELS[i]}</span>
            </div>
          </div>
        ))}

        {/* Q — destino */}
        <div className="flex items-center">
          <div className="relative flex items-center justify-center" style={{ width: 56 }}>
            <svg width="56" height="2">
              <line x1="4" y1="1" x2="52" y2="1"
                stroke="var(--theme-salvia)" strokeWidth="2"
                opacity={step >= 3 ? 0.7 : 0.1} />
              {step >= 3 && (
                <polygon points="52,1 46,-4 46,6" fill="var(--theme-salvia)" opacity="0.7" />
              )}
            </svg>
          </div>
          <div className={`
            flex flex-col items-center gap-1 transition-all duration-700
            ${step >= 3 ? 'scale-110' : 'scale-100'}
          `}>
            <div className={`
              px-5 py-3 rounded-sm border-2 transition-all duration-500
              ${step >= 3
                ? 'border-salvia bg-salvia/10'
                : 'border-carbon/15 bg-transparent'}
            `}>
              <span className={`text-xl font-bold transition-colors duration-500 ${step >= 3 ? 'text-salvia' : 'text-carbon/20'}`}>
                Q
              </span>
            </div>
            <span className={`text-[10px] transition-colors duration-500 ${step >= 3 ? 'text-salvia/50' : 'text-pizarra/15'}`}>
              Tesis
            </span>
          </div>
        </div>
      </div>

      {/* Mensaje */}
      <div className="h-8 flex items-center justify-center mt-2">
        {step === 0 && <p className="text-sm text-pizarra/35 italic">Construye la cadena de implicaciones</p>}
        {step === 1 && <p className="text-sm text-pizarra/50">Primera deducción a partir de P</p>}
        {step === 2 && <p className="text-sm text-pizarra/50">Segunda deducción</p>}
        {step === 3 && <p className="text-sm text-salvia font-bold">✓ P ⇒ Q demostrado</p>}
      </div>

      {/* Botón */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => setStep(s => Math.min(s + 1, 3))}
          disabled={step >= 3}
          className="px-5 py-2 text-sm rounded-sm font-serif transition-all
            bg-pizarra text-lienzo hover:bg-pizarra/85
            disabled:opacity-25 disabled:cursor-default"
        >
          {step === 0 ? '① Deducir P₁' : step === 1 ? '② Deducir P₂' : step === 2 ? '③ Concluir Q' : 'Completado'}
        </button>
        {step >= 3 && (
          <button
            onClick={() => setStep(0)}
            className="px-3 py-2 text-sm rounded-sm font-serif border border-pizarra/12 text-pizarra/50 hover:text-pizarra hover:bg-pizarra/5 transition-all"
          >
            ⟳
          </button>
        )}
      </div>
    </div>
  );
};
