import { useState, useCallback } from 'react';

type Phase = 'idle' | 'step1' | 'step2' | 'step3' | 'crash' | 'done';

export const ContradictionSimulation = () => {
  const [phase, setPhase] = useState<Phase>('idle');

  const advance = useCallback(() => {
    setPhase(p => {
      if (p === 'idle') return 'step1';
      if (p === 'step1') return 'step2';
      if (p === 'step2') return 'step3';
      if (p === 'step3') return 'crash';
      return 'done';
    });
  }, []);

  const conclude = () => setPhase('done');
  const reset = () => setPhase('idle');

  const step = phase === 'idle' ? 0 : phase === 'step1' ? 1 : phase === 'step2' ? 2 : phase === 'step3' ? 3 : phase === 'crash' ? 4 : 5;

  // Posiciones de las dos columnas: izquierda (P, verdad) y derecha (¬Q, supuesto)
  // Avanzan hacia el centro con cada paso
  const leftBlocks = [
    { label: 'P', sub: 'Lo que sabemos', x: 10 },
    { label: '→ R₁', sub: 'Se deduce de P', x: 25 },
    { label: '→ R₂', sub: 'Implicación adicional', x: 40 },
  ];
  const rightBlocks = [
    { label: '¬Q', sub: 'Supuesto', x: 90 },
    { label: '→ ¬R₁', sub: 'Se deduce de ¬Q', x: 75 },
    { label: '→ ¬R₂', sub: 'Implicación adicional', x: 60 },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif overflow-hidden">
      {/* Título */}
      <div className="text-center mb-1">
        <span className="ac-eyebrow ac-eyebrow--sm text-carbon/50">Reducción al absurdo</span>
      </div>

      {/* Área del diagrama */}
      <div className="relative w-full" style={{ height: 260 }}>
        {/* --- BLOQUES IZQUIERDA (P → deducciones) --- */}
        {leftBlocks.map((b, i) => {
          const visible = step > i;
          return (
            <div
              key={`L${i}`}
              className="absolute top-1/2 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
              style={{
                left: `${b.x}%`,
                transform: `translate(-50%, ${visible ? '-80px' : '50px'})`,
                opacity: visible ? 1 : 0,
                zIndex: visible ? 10 : 0,
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className={`
                  px-3 py-1.5 rounded-sm border text-xs font-bold whitespace-nowrap
                  ${visible ? 'border-terracota/40 bg-terracota/8 text-terracota' : ''}
                `}>
                  {b.label}
                </div>
                {visible && (
                  <span className="text-[9px] text-pizarra/30 max-w-[80px] text-center leading-tight">{b.sub}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* --- BLOQUES DERECHA (¬Q → deducciones) --- */}
        {rightBlocks.map((b, i) => {
          const visible = step > i;
          return (
            <div
              key={`R${i}`}
              className="absolute top-1/2 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
              style={{
                left: `${b.x}%`,
                transform: `translate(-50%, ${visible ? '-80px' : '50px'})`,
                opacity: visible ? 1 : 0,
                zIndex: visible ? 10 : 0,
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className={`
                  px-3 py-1.5 rounded-sm border text-xs font-bold whitespace-nowrap
                  ${visible ? 'border-salvia/40 bg-salvia/8 text-salvia' : ''}
                `}>
                  {b.label}
                </div>
                {visible && (
                  <span className="text-[9px] text-pizarra/30 max-w-[80px] text-center leading-tight">{b.sub}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* --- LÍNEA CENTRAL (eje de colisión) --- */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
          style={{
            width: step >= 3 ? 12 : 2,
            height: step >= 3 ? 12 : 80,
            borderRadius: step >= 3 ? '50%' : '1px',
            backgroundColor: step >= 4 ? 'var(--theme-granada)' : step >= 3 ? 'var(--theme-pizarra)' : 'transparent',
            opacity: step >= 2 ? 0.3 : 0,
            transform: step >= 4 ? 'translate(-50%, -50%) scale(8)' : 'translate(-50%, -50%) scale(1)',
            transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />

        {/* --- COLISIÓN --- */}
        {phase === 'crash' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20 animate-fade-in">
            {/* Anillo de impacto */}
            <div
              className="absolute rounded-full border-2 border-granada animate-ping"
              style={{ width: 120, height: 120, animationDuration: '2s' }}
            />
            <div
              className="absolute rounded-full border border-granada/30"
              style={{ width: 160, height: 160 }}
            />
            {/* Texto */}
            <div className="px-4 py-2 rounded-sm border-2 border-granada bg-granada/15 text-granada text-sm font-bold z-10"
              style={{ animation: 'crashPulse 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
              ⊥ CONTRADICCIÓN
            </div>
            <span className="text-[10px] text-granada/60 z-10">R₂ y ¬R₂ no pueden coexistir</span>
          </div>
        )}

        {/* --- CONCLUSIÓN --- */}
        {phase === 'done' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20 animate-fade-in">
            <div className="px-5 py-2 rounded-sm bg-carbon/5 border border-carbon/20 text-carbon text-base font-bold">
              ∴ P ⇒ Q
            </div>
            <span className="text-[10px] text-pizarra/40">El supuesto ¬Q era insostenible</span>
          </div>
        )}
      </div>

      {/* Mensaje */}
      <div className="text-center h-8 flex items-center justify-center">
        {phase === 'idle' && (
          <p className="text-sm text-pizarra/30 italic">Avanza para ver cómo el absurdo emerge</p>
        )}
        {phase === 'step1' && (
          <p className="text-sm"><span className="text-terracota">P</span> <span className="text-pizarra/30">y</span> <span className="text-salvia">¬Q</span> <span className="text-pizarra/30">: dos afirmaciones opuestas en escena</span></p>
        )}
        {phase === 'step2' && (
          <p className="text-sm text-pizarra/40">Cada una produce sus consecuencias lógicas…</p>
        )}
        {phase === 'step3' && (
          <p className="text-sm text-pizarra/40">…que se acercan peligrosamente</p>
        )}
        {phase === 'crash' && (
          <p className="text-sm text-granada font-bold">¡Imposible! Las consecuencias se contradicen.</p>
        )}
        {phase === 'done' && (
          <p className="text-sm text-carbon">La negación del supuesto es la conclusión buscada.</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3 pt-2 pb-2">
        <button
          onClick={advance}
          disabled={phase === 'crash'}
          className="px-5 py-2 text-sm rounded-sm font-serif transition-all
            bg-pizarra text-lienzo hover:bg-pizarra/85
            disabled:opacity-25 disabled:cursor-default"
        >
          {phase === 'idle' ? '① Plantear supuesto' :
           phase === 'step1' ? '② Deducir (P)' :
           phase === 'step2' ? '③ Deducir (¬Q)' :
           phase === 'step3' ? '④ Forzar colisión' : '…'}
        </button>
        {phase === 'crash' && (
          <button
            onClick={conclude}
            className="px-5 py-2 text-sm rounded-sm font-serif transition-all bg-carbon text-lienzo hover:bg-carbon/85"
          >
            Concluir P ⇒ Q
          </button>
        )}
        {phase === 'done' && (
          <button onClick={reset} className="px-3 py-2 text-sm rounded-sm font-serif border border-pizarra/12 text-pizarra/50 hover:text-pizarra hover:bg-pizarra/5 transition-all">
            ⟳
          </button>
        )}
      </div>

      <style>{`
        @keyframes crashPulse {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
