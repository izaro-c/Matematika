import { useState } from 'react';

/**
 * DirectProofVisualizer — Ejemplo Concreto
 *
 * En lugar de letras abstractas P/Q, muestra el método directo
 * aplicado a una demostración real paso a paso:
 * "Si n es par, entonces n² es par"
 */

const STEPS = [
  {
    icon: 'H',
    label: 'Hipótesis',
    color: '#2a6a2a',
    bg: '#f0faf0',
    border: '#a3d9a3',
    title: 'Asumimos que n es par',
    formula: 'n = 2k, \\quad k \\in \\mathbb{Z}',
    note: 'Definición de número par: múltiplo de 2.',
  },
  {
    icon: '①',
    label: 'Deducción',
    color: '#2b5a9a',
    bg: '#f0f4ff',
    border: '#90aaf0',
    title: 'Elevamos al cuadrado',
    formula: 'n^2 = (2k)^2 = 4k^2',
    note: 'Axioma del álgebra: $(ab)^2 = a^2 b^2$',
  },
  {
    icon: '②',
    label: 'Reescribir',
    color: '#2b5a9a',
    bg: '#f0f4ff',
    border: '#90aaf0',
    title: 'Factorizamos',
    formula: '4k^2 = 2 \\cdot (2k^2)',
    note: 'Propiedad distributiva.',
  },
  {
    icon: 'Q',
    label: 'Conclusión',
    color: '#A42A04',
    bg: '#fff4f0',
    border: '#f4a08a',
    title: 'n² es par',
    formula: 'n^2 = 2m, \\; m = 2k^2 \\in \\mathbb{Z}',
    note: 'Definición de número par: n² es múltiplo de 2. ∎',
  },
];

export const DirectProofVisualizer = () => {
  const [revealed, setRevealed] = useState(0); // cuántos pasos están visibles

  const next = () => setRevealed(r => Math.min(r + 1, STEPS.length));
  const reset = () => setRevealed(0);

  return (
    <div className="w-full h-full flex flex-col justify-center p-6 font-serif gap-4">
      {/* Enunciado */}
      <div className="text-center pb-4 border-b border-carbon/15">
        <div className="text-xs uppercase tracking-widest text-carbon/40 mb-1">Demostrar que:</div>
        <div className="text-lg italic text-carbon">
          "Si <strong>n</strong> es par, entonces <strong>n²</strong> es par"
        </div>
      </div>

      {/* Cadena de pasos */}
      <div className="flex flex-col gap-2 min-h-[280px]">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 transition-all duration-500"
            style={{
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: i < revealed ? 'auto' : 'none',
            }}
          >
            {/* Icono */}
            <div
              className="w-9 h-9 rounded-sm flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color }}
            >
              {s.icon}
            </div>

            {/* Contenido */}
            <div
              className="flex-1 rounded px-3 py-2 text-sm"
              style={{ backgroundColor: s.bg, borderLeft: `3px solid ${s.border}` }}
            >
              <div className="font-bold text-xs uppercase tracking-wide mb-0.5" style={{ color: s.color }}>
                {s.label} — {s.title}
              </div>
              <div className="font-mono text-sm" style={{ color: s.color }}>
                {s.formula.replace(/\\/g, '').replace(/\{/g, '').replace(/\}/g, '')}
              </div>
              <div className="text-[10px] text-carbon/50 italic mt-1">{s.note}</div>
            </div>

            {/* Conector (excepto el último) */}
            {i < STEPS.length - 1 && i < revealed - 1 && (
              <div className="absolute -mt-1 ml-4 pl-[18px] text-carbon/30 text-xs">↓</div>
            )}
          </div>
        ))}

        {/* Conector entre pasos */}
        {revealed > 0 && revealed < STEPS.length && (
          <div className="flex items-center gap-2 pl-11 text-carbon/30 text-xs italic">
            ↓ siguiente deducción...
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-3 pt-2 border-t border-carbon/10">
        <button
          onClick={next}
          disabled={revealed >= STEPS.length}
          className={`px-5 py-2 border text-xs uppercase tracking-wider font-bold transition-all
            ${revealed >= STEPS.length
              ? 'border-carbon/20 text-carbon/30 cursor-not-allowed'
              : 'border-carbon text-carbon hover:bg-carbon hover:text-lienzo'}`}
        >
          {revealed === 0 ? 'Comenzar' : revealed >= STEPS.length ? '∎ Demostrado' : 'Siguiente deducción'}
        </button>
        {revealed > 0 && (
          <button
            onClick={reset}
            className="px-4 py-2 text-xs text-terracota border border-terracota/30 hover:bg-terracota/10 transition-colors uppercase tracking-wider"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
};
