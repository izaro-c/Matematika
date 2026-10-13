import { useState } from 'react';
import { useDiagramLang } from '@/diagrams/public';

const CASES = [
  { id: 'pp', label: 'a ≥ 0, b ≥ 0', color: 'var(--theme-terracota)', x: 1, y: 1 },
  { id: 'pn', label: 'a ≥ 0, b < 0', color: 'var(--theme-canela)', x: 2, y: 1 },
  { id: 'np', label: 'a < 0, b ≥ 0', color: 'var(--theme-mora)', x: 1, y: 2 },
  { id: 'nn', label: 'a < 0, b < 0', color: 'var(--theme-pavo)', x: 2, y: 2 },
];

const TEXT = {
  es: {
    title: 'Partición exhaustiva',
    proven: '✓ Probado',
    clickToProve: 'Clic para probar',
    start: 'Prueba cada caso por separado',
    progress: (n: number) => `${n} de 4 casos probados`,
    done: '✓ Todos los casos probados. La afirmación es cierta.',
    reset: '⟳ Reiniciar',
    footer: 'Si los casos cubren todas las posibilidades y cada uno se prueba, la afirmación queda demostrada.',
  },
  eu: {
    title: 'Banaketa osoa',
    proven: '✓ Frogatuta',
    clickToProve: 'Egin klik frogatzeko',
    start: 'Frogatu kasu bakoitza bere aldetik',
    progress: (n: number) => `4 kasutatik ${n} frogatuta`,
    done: '✓ Kasu guztiak frogatuta. Baieztapena egia da.',
    reset: '⟳ Berrabiarazi',
    footer: 'Kasuek aukera guztiak estaltzen badituzte eta bakoitza frogatzen bada, baieztapena frogatuta geratzen da.',
  },
  en: {
    title: 'Exhaustive partition',
    proven: '✓ Proven',
    clickToProve: 'Click to prove',
    start: 'Prove each case separately',
    progress: (n: number) => `${n} of 4 cases proven`,
    done: '✓ All cases proven. The statement is true.',
    reset: '⟳ Reset',
    footer: 'If the cases cover every possibility and each one is proven, the statement is proven.',
  },
};

export const ExhaustivoSimulation = () => {
  const [proven, setProven] = useState(new Set<string>());
  const lang = useDiagramLang();
  const t = TEXT[lang as keyof typeof TEXT] ?? TEXT.es;
  const allDone = proven.size === 4;

  const prove = (id: string) => setProven(p => new Set([...p, id]));
  const reset = () => setProven(new Set());

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      {/* Título */}
      <p className="ac-eyebrow ac-eyebrow--sm text-carbon/45 mb-4">{t.title}</p>

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
                    <span className="text-sm font-bold animate-fade-in" style={{ color: c.color }}>{t.proven}</span>
                  )}
                  {!done && (
                    <span className="text-[9px] text-mora/25">{t.clickToProve}</span>
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
          <p className="text-sm text-mora/35 italic">{t.start}</p>
        )}
        {proven.size > 0 && !allDone && (
          <p className="text-sm text-mora/50">{t.progress(proven.size)}</p>
        )}
        {allDone && (
          <p className="text-sm text-carbon font-bold">{t.done}</p>
        )}
      </div>

      {/* Botón */}
      {allDone && (
        <button onClick={reset} className="mt-1 px-4 py-2 text-sm rounded-sm font-serif border border-mora/12 text-mora/50 hover:text-mora hover:bg-mora/5 transition-all">
          {t.reset}
        </button>
      )}

      <p className="text-[10px] text-mora/25 text-center max-w-[260px] leading-relaxed mt-2">
        {t.footer}
      </p>
    </div>
  );
};
