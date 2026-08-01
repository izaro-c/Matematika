import { useState } from 'react';

const CASES = [
  { id: 'pp', label: 'a ≥ 0, b ≥ 0', color: 'var(--theme-terracota)', x: 1, y: 1 },
  { id: 'pn', label: 'a ≥ 0, b < 0', color: 'var(--theme-salvia)', x: 2, y: 1 },
  { id: 'np', label: 'a < 0, b ≥ 0', color: 'var(--theme-pizarra)', x: 1, y: 2 },
  { id: 'nn', label: 'a < 0, b < 0', color: 'var(--theme-pavo)', x: 2, y: 2 },
];

export const ExhaustivoSimulation = () => {
  const [proven, setProven] = useState(new Set<string>());
  const allDone = proven.size === 4;

  const prove = (id: string) => setProven(p => new Set([...p, id]));
  const reset = () => setProven(new Set());

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      {/* Título */}
      <p className="ac-eyebrow ac-eyebrow--sm text-carbon/45 mb-4">Partición exhaustiva</p>

      {/* Grid 2×2 con ejes */}
      <div className="relative" style={{ width: 300, height: 280 }}>
        {/* Ejes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: 240, height: 240 }}>
            {/* Eje horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-carbon/20" />
            {/* Eje vertical */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-carbon/20" />

            {/* Etiquetas ejes */}
            <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-carbon/40 font-bold">b</span>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 text-xs text-carbon/40 font-bold">a</span>

            {/* Casos */}
            {CASES.map(c => {
              const done = proven.has(c.id);
              return (
                <div key={c.id}
                  onClick={() => !done && prove(c.id)}
                  className={`
                    absolute w-[110px] h-[110px] rounded-sm border-2 flex flex-col items-center justify-center gap-1
                    transition-all duration-500 cursor-pointer
                    ${done
                      ? 'scale-100'
                      : 'scale-95 hover:scale-100 hover:border-carbon/40'}
                  `}
                  style={{
                    left: c.x === 1 ? 4 : 126,
                    top: c.y === 1 ? 4 : 126,
                    borderColor: done ? c.color : 'var(--theme-carbon)',
                    backgroundColor: done ? `${c.color}15` : 'transparent',
                    opacity: done ? 1 : 0.35,
                  }}
                >
                  {/* Signos */}
                  <span className="text-lg font-bold"
                    style={{ color: done ? c.color : 'var(--theme-carbon)' }}>
                    {c.id === 'pp' ? '(+,+)' : c.id === 'pn' ? '(+,−)' : c.id === 'np' ? '(−,+)' : '(−,−)'}
                  </span>
                  {/* Label */}
                  <span className="text-[9px] text-center leading-tight px-2"
                    style={{ color: done ? c.color : 'var(--theme-carbon)', opacity: 0.7 }}>
                    {c.label}
                  </span>
                  {/* Check */}
                  {done && (
                    <span className="text-sm font-bold animate-fade-in" style={{ color: c.color }}>✓ Probado</span>
                  )}
                  {!done && (
                    <span className="text-[9px] text-pizarra/25">Clic para probar</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicador de completitud */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {CASES.map(c => (
            <div key={c.id}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${proven.has(c.id) ? 'scale-100' : 'scale-75'}`}
              style={{ backgroundColor: proven.has(c.id) ? c.color : 'var(--theme-carbon)', opacity: proven.has(c.id) ? 1 : 0.15 }}
            />
          ))}
        </div>
      </div>

      {/* Mensaje */}
      <div className="h-8 flex items-center justify-center mt-2">
        {proven.size === 0 && (
          <p className="text-sm text-pizarra/35 italic">Prueba cada caso por separado</p>
        )}
        {proven.size > 0 && !allDone && (
          <p className="text-sm text-pizarra/50">{proven.size} de 4 casos probados</p>
        )}
        {allDone && (
          <p className="text-sm text-carbon font-bold">✓ Todos los casos probados. La afirmación es cierta.</p>
        )}
      </div>

      {/* Botón */}
      {allDone && (
        <button onClick={reset} className="mt-1 px-4 py-2 text-sm rounded-sm font-serif border border-pizarra/12 text-pizarra/50 hover:text-pizarra hover:bg-pizarra/5 transition-all">
          ⟳ Reiniciar
        </button>
      )}

      <p className="text-[10px] text-pizarra/25 text-center max-w-[260px] leading-relaxed mt-2">
        Si los casos cubren todas las posibilidades y cada uno se prueba, la afirmación queda demostrada.
      </p>
    </div>
  );
};
