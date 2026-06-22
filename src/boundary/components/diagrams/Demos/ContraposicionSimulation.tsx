import { useState } from 'react';

type View = 'direct' | 'contra';

export const ContraposicionSimulation = () => {
  const [view, setView] = useState<View>('direct');
  const d = view === 'direct';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif">
      {/* Diagrama */}
      <div className="relative" style={{ width: 380, height: 300 }}>
        {/* Universo */}
        <div className="absolute rounded-sm border border-dashed border-pizarra/10"
          style={{ left: 8, top: 8, right: 8, bottom: 8 }} />

        {/* Q — contenedor exterior */}
        <div
          className="absolute rounded-sm border-2 transition-all duration-700 flex items-start"
          style={{
            left: 40, top: 30, width: 300, height: 240,
            borderColor: 'var(--theme-salvia)',
            backgroundColor: d ? 'rgba(162,194,162,0.13)' : 'rgba(162,194,162,0.04)',
          }}
        >
          <span className="text-xl font-bold mt-3 ml-4 transition-all duration-500"
            style={{ color: 'var(--theme-salvia)', opacity: d ? 1 : 0.3 }}>
            Q
          </span>

          {/* P — rectángulo interior */}
          <div
            className="absolute rounded-sm border-2 transition-all duration-700 flex items-start"
            style={{
              left: 42, top: 44, width: 140, height: 130,
              borderColor: 'var(--theme-terracota)',
              backgroundColor: d ? 'rgba(200,100,70,0.18)' : 'rgba(200,100,70,0.05)',
            }}
          >
            <span className="text-xl font-bold mt-3 ml-4 transition-all duration-500"
              style={{ color: 'var(--theme-terracota)', opacity: d ? 1 : 0.3 }}>
              P
            </span>
          </div>

          {/* Flecha P → Q en modo directo: sale de P hacia la derecha, apuntando al borde de Q */}
          <div className="absolute transition-all duration-500"
            style={{
              left: 200, top: '50%',
              transform: 'translateY(-50%)',
              opacity: d ? 0.85 : 0,
              pointerEvents: 'none',
            }}>
            <svg width="60" height="24" viewBox="0 0 60 24">
              <line x1="4" y1="12" x2="48" y2="12" stroke="var(--theme-terracota)" strokeWidth="2.5" />
              <polygon points="48,12 38,5 38,19" fill="var(--theme-terracota)" />
            </svg>
          </div>
        </div>

        {/* Vista contrarrecíproca */}
        {/* ¬Q — fuera de Q, arriba-izquierda */}
        <div className="absolute transition-all duration-500"
          style={{ left: 18, top: 2, opacity: d ? 0 : 1 }}>
          <span className="text-lg font-bold text-salvia">¬Q</span>
        </div>

        {/* ¬P — dentro de Q, fuera de P */}
        <div className="absolute transition-all duration-500"
          style={{ left: 268, top: 200, opacity: d ? 0 : 1 }}>
          <span className="text-lg font-bold text-salvia">¬P</span>
        </div>

        {/* Flecha ¬Q → ¬P: clara, gruesa, visible */}
        <svg className="absolute inset-0 transition-all duration-500 pointer-events-none"
          style={{ opacity: d ? 0 : 0.75 }}
          width="380" height="300" viewBox="0 0 380 300">
          <defs>
            <marker id="arrowSalvia" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--theme-salvia)" />
            </marker>
          </defs>
          <path
            d="M 34 14 Q 40 50, 130 120 Q 200 175, 275 208"
            fill="none" stroke="var(--theme-salvia)" strokeWidth="2.5"
            markerEnd="url(#arrowSalvia)"
          />
        </svg>
      </div>

      {/* Texto interpretativo */}
      <p className={`text-sm mt-2 transition-all duration-400 font-bold ${d ? 'text-terracota' : 'text-salvia'}`}>
        {d ? 'P ⇒ Q' : '¬Q ⇒ ¬P'}
      </p>
      <p className={`text-xs mt-0.5 transition-all duration-400 ${d ? 'text-terracota/60' : 'text-salvia/60'}`}>
        {d ? 'Todo lo que está en P, está en Q' : 'Todo lo que está fuera de Q, está fuera de P'}
      </p>

      {/* Botón */}
      <button
        onClick={() => setView(v => v === 'direct' ? 'contra' : 'direct')}
        className={`mt-4 px-6 py-2.5 text-sm rounded-sm font-serif transition-all duration-500
          ${d ? 'bg-salvia text-lienzo hover:bg-salvia/85' : 'bg-terracota text-lienzo hover:bg-terracota/85'}`}
      >
        {d ? 'Ver contrarrecíproco' : 'Ver directo'}
      </button>
    </div>
  );
};
