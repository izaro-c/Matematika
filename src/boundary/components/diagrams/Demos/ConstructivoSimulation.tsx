import { useState } from 'react';

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export const ConstructivoSimulation = () => {
  const [step, setStep] = useState<Step>(0);

  const s = (n: Step) => step >= n;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      {/* Diagrama — construcción geométrica simplificada con SVG */}
      <div className="relative" style={{ width: 320, height: 300 }}>
        <svg width="320" height="300" viewBox="0 0 320 300">
          {/* Puntos A y B */}
          {/* A */}
          <circle cx="60" cy="180" r={s(0) ? 6 : 0}
            fill="var(--theme-terracota)" stroke="var(--theme-terracota)" strokeWidth="2"
            style={{ transition: 'r 0.5s' }} />
          {s(0) && <text x="60" y="205" textAnchor="middle" fontSize="16" fontWeight="bold" fill="var(--theme-terracota)" fontFamily="serif">A</text>}

          {/* B */}
          <circle cx="260" cy="120" r={s(0) ? 6 : 0}
            fill="var(--theme-terracota)" stroke="var(--theme-terracota)" strokeWidth="2"
            style={{ transition: 'r 0.5s' }} />
          {s(0) && <text x="260" y="145" textAnchor="middle" fontSize="16" fontWeight="bold" fill="var(--theme-terracota)" fontFamily="serif">B</text>}

          {/* Segmento AB (base) */}
          {s(0) && (
            <line x1="60" y1="180" x2="260" y2="120"
              stroke="var(--theme-carbon)" strokeWidth="2" opacity="0.6" />
          )}

          {/* Paso 1: círculo centro A */}
          {s(1) && (
            <circle cx="60" cy="180" r="100" fill="none"
              stroke="var(--theme-salvia)" strokeWidth="2" strokeDasharray="6,4" opacity="0.7">
              <animate attributeName="r" from="0" to="100" dur="0.6s" fill="freeze" />
            </circle>
          )}

          {/* Paso 2: círculo centro B */}
          {s(2) && (
            <circle cx="260" cy="120" r="100" fill="none"
              stroke="var(--theme-pizarra)" strokeWidth="2" strokeDasharray="6,4" opacity="0.7">
              <animate attributeName="r" from="0" to="100" dur="0.6s" fill="freeze" />
            </circle>
          )}

          {/* Paso 3: puntos C (arriba) y D (abajo) — intersecciones */}
          {s(3) && (
            <>
              <circle cx="160" cy="60" r="5" fill="var(--theme-salvia)" stroke="var(--theme-salvia)" strokeWidth="2">
                <animate attributeName="r" from="0" to="5" dur="0.4s" fill="freeze" />
              </circle>
              <text x="170" y="55" fontSize="14" fontWeight="bold" fill="var(--theme-salvia)" fontFamily="serif">C</text>
              <circle cx="160" cy="240" r="5" fill="var(--theme-pizarra)" stroke="var(--theme-pizarra)" strokeWidth="2">
                <animate attributeName="r" from="0" to="5" dur="0.4s" fill="freeze" />
              </circle>
              <text x="170" y="250" fontSize="14" fontWeight="bold" fill="var(--theme-pizarra)" fontFamily="serif">D</text>
            </>
          )}

          {/* Paso 4: recta CD */}
          {s(4) && (
            <line x1="160" y1="40" x2="160" y2="265"
              stroke="var(--theme-carbon)" strokeWidth="2" strokeDasharray="8,4" opacity="0.8">
              <animate attributeName="opacity" from="0" to="0.8" dur="0.5s" fill="freeze" />
            </line>
          )}

          {/* Paso 5: punto medio M */}
          {s(5) && (
            <>
              <circle cx="160" cy="150" r="7" fill="var(--theme-terracota)" stroke="var(--theme-terracota)" strokeWidth="2.5">
                <animate attributeName="r" from="0" to="7" dur="0.5s" fill="freeze" />
              </circle>
              <text x="175" y="148" fontSize="15" fontWeight="bold" fill="var(--theme-terracota)" fontFamily="serif">M</text>
              {/* Marcas AM ≅ MB */}
              <line x1="108" y1="167" x2="108" y2="175" stroke="var(--theme-pizarra)" strokeWidth="1.5" opacity="0.6" />
              <line x1="112" y1="167" x2="112" y2="175" stroke="var(--theme-pizarra)" strokeWidth="1.5" opacity="0.6" />
              <line x1="208" y1="133" x2="208" y2="141" stroke="var(--theme-pizarra)" strokeWidth="1.5" opacity="0.6" />
              <line x1="212" y1="133" x2="212" y2="141" stroke="var(--theme-pizarra)" strokeWidth="1.5" opacity="0.6" />
            </>
          )}
        </svg>

        {/* Etiquetas de paso */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-6 pt-2">
          <span className={`text-[10px] transition-all duration-500 ${s(1) ? 'text-salvia/70' : 'text-transparent'}`}>① Circ. A</span>
          <span className={`text-[10px] transition-all duration-500 ${s(2) ? 'text-pizarra/70' : 'text-transparent'}`}>② Circ. B</span>
          <span className={`text-[10px] transition-all duration-500 ${s(3) ? 'text-salvia/70' : 'text-transparent'}`}>③ ∩ C, D</span>
          <span className={`text-[10px] transition-all duration-500 ${s(4) ? 'text-carbon/60' : 'text-transparent'}`}>④ Recta CD</span>
          <span className={`text-[10px] transition-all duration-500 ${s(5) ? 'text-terracota/70' : 'text-transparent'}`}>⑤ M</span>
        </div>
      </div>

      {/* Mensaje */}
      <div className="h-7 flex items-center justify-center">
        {step === 0 && <p className="text-sm text-pizarra/35 italic">Dados dos puntos, construimos</p>}
        {step === 1 && <p className="text-sm text-salvia/60">Circunferencia con centro en A</p>}
        {step === 2 && <p className="text-sm text-pizarra/60">Circunferencia con centro en B</p>}
        {step === 3 && <p className="text-sm text-pizarra/50">Las circunferencias se cortan en C y D</p>}
        {step === 4 && <p className="text-sm text-pizarra/50">La recta CD es la mediatriz de AB</p>}
        {step === 5 && <p className="text-sm text-terracota font-bold">✓ M es el punto medio de AB</p>}
      </div>

      {/* Botón */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => setStep(s => Math.min(s + 1, 5) as Step)}
          disabled={step >= 5}
          className="px-5 py-2 text-sm rounded-sm font-serif transition-all
            bg-pizarra text-lienzo hover:bg-pizarra/85
            disabled:opacity-25 disabled:cursor-default"
        >
          {['Construir', 'Circunferencia A', 'Circunferencia B', 'Intersecar', 'Trazar mediatriz', '✓ Punto medio'][step]}
        </button>
        {step >= 5 && (
          <button onClick={() => setStep(0)} className="px-3 py-2 text-sm rounded-sm font-serif border border-pizarra/12 text-pizarra/50 hover:text-pizarra hover:bg-pizarra/5 transition-all">
            ⟳
          </button>
        )}
      </div>
    </div>
  );
};
