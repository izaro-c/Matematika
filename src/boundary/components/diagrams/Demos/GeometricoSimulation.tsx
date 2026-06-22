import { useState } from 'react';

type Step = 0 | 1 | 2 | 3;

export const GeometricoSimulation = () => {
  const [step, setStep] = useState<Step>(0);
  const s = (n: Step) => step >= n;

  // El triangulo SOBRANTE de la izquierda (fuera del rectangulo)
  // se desliza a la DERECHA para rellenar el hueco del rectangulo.
  // SlideX: 0 en posicion original (x=40-80), +220 para llegar a x=260-300
  const slideX = s(2) ? 220 : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      <p className="text-carbon/45 text-[10px] tracking-widest uppercase mb-3">
        Demostracion por transformacion
      </p>

      <div className="relative" style={{ width: 350, height: 250 }}>
        <svg width="350" height="250" viewBox="0 0 350 250">
          <line x1="20" y1="180" x2="340" y2="180"
            stroke="var(--theme-carbon)" strokeWidth="0.7" opacity="0.06" />

          {/* Rectangulo subyacente */}
          <polygon points="80,180 300,180 300,70 80,70"
            fill="rgba(200,100,70,0.06)"
            stroke="var(--theme-carbon)" strokeWidth="2"
            strokeDasharray={s(2) && !s(3) ? "0" : "8,4"}
            opacity={s(2) ? (s(3) ? 1 : 0.55) : 0.06}
            style={{ transition: 'opacity 0.8s' }} />

          {/* Paralelogramo */}
          {s(0) && (
            <polygon points="40,180 260,180 300,70 80,70"
              fill="none" stroke="var(--theme-carbon)" strokeWidth="2.5"
              opacity={s(2) ? 0.08 : 0.8}
              style={{ transition: 'opacity 0.8s' }} />
          )}

          {/* Vertices */}
          {s(0) && <>
            <circle cx="40" cy="180" r="5" fill="var(--theme-terracota)" />
            <text x="24" y="204" fontSize="15" fontWeight="bold" fill="var(--theme-terracota)" fontFamily="serif">A</text>
            <circle cx="260" cy="180" r="5" fill="var(--theme-terracota)" />
            <text x="268" y="204" fontSize="15" fontWeight="bold" fill="var(--theme-terracota)" fontFamily="serif">B</text>
            <circle cx="80" cy="70" r="5" fill="var(--theme-salvia)" />
            <text x="60" y="56" fontSize="15" fontWeight="bold" fill="var(--theme-salvia)" fontFamily="serif">D</text>
            <circle cx="300" cy="70" r="5" fill="var(--theme-salvia)" />
            <text x="308" y="56" fontSize="15" fontWeight="bold" fill="var(--theme-salvia)" fontFamily="serif">C</text>
          </>}

          {/* Alturas */}
          {s(1) && (
            <>
              <line x1="80" y1="70" x2="80" y2="180" stroke="var(--theme-pizarra)" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
              <line x1="300" y1="70" x2="300" y2="180" stroke="var(--theme-pizarra)" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
              <circle cx="80" cy="180" r="3" fill="var(--theme-pizarra)" opacity="0.4" />
              <circle cx="300" cy="180" r="3" fill="var(--theme-pizarra)" opacity="0.4" />
              {/* Hueco derecho fijo (donde debe encajar el triangulo) */}
              <polygon points="260,180 300,70 300,180"
                fill="rgba(162,194,162,0.08)" stroke="var(--theme-salvia)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
              <text x="190" y="140" textAnchor="middle" fontSize="16"
                fill="var(--theme-carbon)" fontFamily="serif" opacity={s(2) ? 0.08 : 0.4}>≅</text>
            </>
          )}

          {/* Triangulo izquierdo — se desliza a la DERECHA para rellenar el hueco */}
          {(s(1) || s(2)) && !s(3) && (
            <g style={{
              transform: `translate(${slideX}px, 0)`,
              transition: 'transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
            }}>
              <polygon points="40,180 80,70 80,180"
                fill={s(2) ? "rgba(200,100,70,0.25)" : "rgba(200,100,70,0.18)"}
                stroke="var(--theme-terracota)"
                strokeWidth={s(2) ? "2" : "1.5"} />
            </g>
          )}

          {/* Rectangulo final */}
          {s(3) && (
            <polygon points="80,180 300,180 300,70 80,70"
              fill="rgba(200,100,70,0.1)" stroke="var(--theme-carbon)" strokeWidth="2.5" />
          )}
        </svg>
      </div>

      <div className="h-10 flex flex-col items-center justify-center gap-0.5">
        {step === 0 && <p className="text-sm text-pizarra/35 italic">Partimos de un paralelogramo</p>}
        {step === 1 && <p className="text-xs"><span className="text-pizarra/50">El paralelogramo desborda el rectangulo por la izquierda</span>{' '}<span className="font-bold" style={{color:'var(--theme-terracota)'}}>y le falta por la derecha</span></p>}
        {step === 2 && <p className="text-xs"><span className="font-bold" style={{color:'var(--theme-terracota)'}}>Deslizamos</span>{' '}<span className="text-pizarra/40">el sobrante izquierdo al hueco derecho. Al ser congruentes, encaja.</span></p>}
        {step === 3 && <p className="text-sm font-bold text-carbon">El area del paralelogramo es base x altura.</p>}
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={() => setStep(s => Math.min(s + 1, 3) as Step)} disabled={step >= 3}
          className="px-5 py-2 text-sm rounded-sm font-serif transition-all bg-pizarra text-lienzo hover:bg-pizarra/85 disabled:opacity-25 disabled:cursor-default">
          {['Empezar', 'Alturas', 'Deslizar', 'Concluir'][step]}
        </button>
        {step >= 3 && <button onClick={() => setStep(0)}
          className="px-3 py-2 text-sm rounded-sm font-serif border border-pizarra/12 text-pizarra/50 hover:text-pizarra hover:bg-pizarra/5 transition-all">⟳</button>}
      </div>

      <p className="text-[10px] text-pizarra/25 text-center max-w-[280px] leading-relaxed mt-2">
        El paralelogramo desborda el rectangulo por un lado y le falta por el otro. Al trasladar el sobrante, encaja.
      </p>
    </div>
  );
};
