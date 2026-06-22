import { useState, useCallback, useRef } from 'react';

const N = 48;
const DOMINO_W = 10;
const DOMINO_H = 76;
const REACH = 81;        // alcance horizontal de la ficha caída a 85°
const GAP_FAR = 114;     // centros separados: alcance < hueco → no toca
const GAP_NEAR = 40;     // centros juntos: alcance > hueco → empuja

export const InduccionSimulation = () => {
  const [blasted, setBlasted] = useState(false);
  const [induced, setInduced] = useState(false);
  const [fallen, setFallen] = useState(new Set<number>());
  const [gap, setGap] = useState(GAP_FAR);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => timers.current.forEach(clearTimeout);

  const tip = (i: number, d = 0) => {
    const t = setTimeout(() => setFallen(prev => new Set([...prev, i])), d);
    timers.current.push(t);
  };

  const doBase = useCallback(() => {
    clearAll();
    if (!blasted) {
      setBlasted(true);
      setFallen(new Set([0]));
      if (induced) {
        tip(1, 200);
        for (let i = 2; i < N; i++) tip(i, 200 + (i - 1) * 160);
        return;
      }
    }
    setGap(GAP_FAR);
    setBlasted(true);
    setInduced(false);
    setFallen(new Set([0]));
  }, [blasted, induced]);

  const doInduction = useCallback(() => {
    clearAll();
    setInduced(true);
    setGap(GAP_NEAR);
    if (blasted) {
      tip(1, 650);
      for (let i = 2; i < N; i++) tip(i, 650 + (i - 1) * 160);
    }
  }, [blasted]);

  const reset = useCallback(() => {
    clearAll();
    setBlasted(false);
    setInduced(false);
    setFallen(new Set());
    setGap(GAP_FAR);
  }, []);

  const chainDone = fallen.size >= N;
  const onlyInduced = induced && !blasted;
  const onlyBlasted = blasted && !induced;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      {/* Franja de dominós — P(1) anclado a la izquierda */}
      <div className="relative w-full overflow-hidden" style={{ height: 130 }}>
        <div
          className="absolute top-1/2 flex items-end transition-all duration-[650ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
          style={{
            transform: 'translateY(-50%)',
            left: 32,
            gap: `${gap - DOMINO_W}px`,
          }}
        >
          {Array.from({ length: N }, (_, i) => {
            const f = fallen.has(i);
            const isBase = i === 0;
            const color = f
              ? isBase ? 'var(--theme-terracota)' : 'var(--theme-salvia)'
              : 'var(--theme-carbon)';
            // Opacidad: primeros bien visibles, últimos se desvanecen progresivamente
            const vis = i < 4 ? 1
              : i < 12 ? Math.max(0.15, 1 - (i - 4) * 0.06)
              : Math.max(0.04, 0.15 - (i - 12) * 0.005);
            const delay = f && !isBase && i > 1 ? `${(i - 1) * 0.16}s` : '0s';

            return (
              <div key={i} className="flex flex-col items-center shrink-0" style={{ width: DOMINO_W }}>
                <span
                  className="text-[9px] mb-1 transition-colors duration-500"
                  style={{ color, opacity: vis * 0.7 }}
                >
                  {i === 0 ? 'P(1)' : i === 1 ? 'P(2)' : i === 2 ? 'P(3)' : i < 8 ? `P(${i + 1})` : '·'}
                </span>
                <div className="relative" style={{ width: DOMINO_W, height: DOMINO_H }}>
                  <div
                    className="absolute inset-0 rounded-[2px] border transition-all duration-500 origin-bottom-right"
                    style={{
                      width: DOMINO_W,
                      height: DOMINO_H,
                      backgroundColor: color,
                      borderColor: color,
                      opacity: f ? 0.9 * vis : 0.55 * vis,
                      transform: f ? 'rotate(85deg)' : 'rotate(0deg)',
                      transitionTimingFunction: f && i > 0 ? 'cubic-bezier(0.34,1.56,0.64,1)' : 'ease',
                      transitionDelay: delay,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Indicador de continuación infinita a la derecha */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xl text-pizarra/15 font-serif select-none">⋯</div>
      </div>

      {/* Mensaje */}
      <div className="text-center h-12 flex flex-col items-center justify-center gap-0.5">
        {!blasted && !induced && (
          <p className="text-sm text-pizarra/35 italic">Pulsa cualquier botón para explorar</p>
        )}
        {onlyBlasted && (
          <>
            <p className="text-sm"><span className="text-terracota font-bold">✓ P(1) cierto.</span> <span className="text-pizarra/35">Pero los demás no caen solos.</span></p>
            <p className="text-[10px] text-granada/45">Demasiado separados: una ficha caída no alcanza a la siguiente</p>
          </>
        )}
        {onlyInduced && (
          <>
            <p className="text-sm"><span className="text-salvia font-bold">P(k) ⇒ P(k+1) establecido.</span> <span className="text-pizarra/35">Pero nadie ha caído aún.</span></p>
            <p className="text-[10px] text-granada/45">Falta el caso base: el primer dominó sigue de pie</p>
          </>
        )}
        {blasted && induced && !chainDone && (
          <p className="text-sm text-salvia font-bold">P(k) ⇒ P(k+1): la cadena se propaga</p>
        )}
        {chainDone && (
          <p className="text-base text-carbon font-bold">∴ ∀n, P(n) es cierto</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3 mt-2 pb-2">
        <button
          onClick={doBase}
          className="px-5 py-2 text-sm rounded-sm font-serif transition-all
            bg-terracota text-lienzo hover:bg-terracota/85"
        >
          ① Caso base
        </button>
        <button
          onClick={doInduction}
          className="px-5 py-2 text-sm rounded-sm font-serif transition-all
            bg-salvia text-lienzo hover:bg-salvia/85"
        >
          ② Paso de inducción
        </button>
        {(blasted || induced) && (
          <button
            onClick={reset}
            className="px-3 py-2 text-sm rounded-sm font-serif border border-pizarra/12 text-pizarra/50 hover:text-pizarra hover:bg-pizarra/5 transition-all"
          >
            ⟳
          </button>
        )}
      </div>
    </div>
  );
};
